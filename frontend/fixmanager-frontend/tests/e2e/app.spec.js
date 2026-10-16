import { expect, test } from '@playwright/test';

const credentials = {
  email: process.env.E2E_ADMIN_EMAIL,
  password: process.env.E2E_ADMIN_PASSWORD,
};

async function login(page) {
  await page.goto('/');
  const loginButton = page.getByRole('button', { name: 'Se connecter' });
  const dashboardHeading = page.getByRole('heading', { name: 'Bienvenue sur FixManager' });
  await expect(loginButton.or(dashboardHeading)).toBeVisible();

  if (await loginButton.isVisible()) {
    if (!credentials.email || !credentials.password) {
      throw new Error('Définis E2E_ADMIN_EMAIL et E2E_ADMIN_PASSWORD dans les variables d’environnement pour les tests avec authentification.');
    }
    await page.getByLabel('Email').fill(credentials.email);
    await page.getByLabel('Mot de passe').fill(credentials.password);
    const loginResponse = page.waitForResponse(
      (response) => response.url().endsWith('/api/auth/login') && response.request().method() === 'POST',
    );
    await loginButton.click();
    await expect((await loginResponse).status()).toBe(200);
  }
  await expect(dashboardHeading).toBeVisible({ timeout: 10000 });
}

test('connexion et navigation vers le Dashboard', async ({ page }) => {
  await login(page);
  await expect(page.getByRole('button', { name: 'Clients', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Demandes', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Interventions', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Factures', exact: true })).toBeVisible();
});

test('recherche client et déconnexion', async ({ page }) => {
  await login(page);
  await page.getByRole('button', { name: 'Clients' }).click();
  await expect(page.getByRole('heading', { name: 'Clients', exact: true })).toBeVisible();

  const search = page.getByRole('searchbox', { name: 'Rechercher un client' });
  await search.fill('Mallé');
  await expect(page.getByText('Mallé', { exact: true })).toBeVisible();
  await expect(page.getByText('Koné', { exact: true })).not.toBeVisible();

  await page.getByRole('button', { name: 'Se déconnecter' }).click();
  await expect(page.getByRole('button', { name: 'Se connecter' })).toBeVisible();
});

test('navigation clavier dans la confirmation de suppression', async ({ page }) => {
  await page.route('**/api/**', async (route) => {
    const { pathname } = new URL(route.request().url());
    if (pathname.endsWith('/api/auth/me')) {
      await route.fulfill({ status: 200, json: {} });
    } else if (pathname.endsWith('/api/clients')) {
      await route.fulfill({
        status: 200,
        json: [{ idClient: 1, prenom: 'Awa', nom: 'Diallo', email: 'awa@example.test', telephone: '70000000', adresse: 'Dakar' }],
      });
    } else {
      await route.fulfill({ status: 200, json: [] });
    }
  });

  await page.goto('/');
  await page.getByRole('button', { name: 'Clients', exact: true }).click();
  const deleteButton = page.getByRole('row').filter({ hasText: 'awa@example.test' }).getByRole('button', { name: 'Supprimer' });
  await deleteButton.click();

  const dialog = page.getByRole('dialog');
  const cancelButton = dialog.getByRole('button', { name: 'Annuler' });
  const confirmButton = dialog.getByRole('button', { name: 'Supprimer' });
  await expect(cancelButton).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(confirmButton).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(cancelButton).toBeFocused();
  await page.keyboard.press('Escape');

  await expect(dialog).toHaveCount(0);
  await expect(deleteButton).toBeFocused();
});

test('navigation principale utilisable sur mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route('**/api/**', async (route) => {
    const { pathname } = new URL(route.request().url());
    if (pathname.endsWith('/api/auth/me')) {
      await route.fulfill({ status: 200, json: {} });
    } else if (pathname.endsWith('/api/clients')) {
      await route.fulfill({ status: 200, json: [] });
    } else {
      await route.fulfill({ status: 200, json: [] });
    }
  });

  await page.goto('/');
  const navigation = page.getByRole('navigation');
  await expect(navigation.getByRole('button', { name: 'Factures', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Clients', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Clients', exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('navigation URL survit au rafraîchissement et au retour navigateur', async ({ page }) => {
  await page.route('**/api/**', async (route) => {
    const { pathname } = new URL(route.request().url());
    await route.fulfill({ status: 200, json: pathname.endsWith('/api/auth/me') ? {} : [] });
  });

  await page.goto('/machines');
  await expect(page.getByRole('heading', { name: 'Machines', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Machines', exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Clients', exact: true }).click();
  await expect(page).toHaveURL(/\/clients$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/machines$/);
  await expect(page.getByRole('heading', { name: 'Machines', exact: true })).toBeVisible();
});

test('explique les créations désactivées sans données disponibles', async ({ page }) => {
  await page.route('**/api/**', async (route) => {
    const { pathname } = new URL(route.request().url());
    await route.fulfill({ status: 200, json: pathname.endsWith('/api/auth/me') ? {} : [] });
  });

  await page.goto('/');
  await page.getByRole('button', { name: 'Interventions', exact: true }).click();
  await expect(page.getByText('Aucune demande enregistrée pour le moment.')).toBeVisible();

  await page.getByRole('button', { name: 'Factures', exact: true }).click();
  await expect(page.getByText('Aucune intervention terminée disponible pour facturation.')).toBeVisible();
});

test('recherche et filtre les utilisateurs', async ({ page }) => {
  await page.route('**/api/**', async (route) => {
    const { pathname } = new URL(route.request().url());
    if (pathname.endsWith('/api/auth/me')) {
      await route.fulfill({ status: 200, json: {} });
    } else if (pathname.endsWith('/api/utilisateurs')) {
      await route.fulfill({
        status: 200,
        json: [
          { idUtilisateur: 1, prenom: 'Awa', nom: 'Diallo', email: 'awa@example.test', telephone: '70000001', actif: true },
          { idUtilisateur: 2, prenom: 'Moussa', nom: 'Fall', email: 'moussa@example.test', telephone: '70000002', actif: false },
        ],
      });
    } else {
      await route.fulfill({ status: 200, json: [] });
    }
  });

  await page.goto('/');
  await page.getByRole('button', { name: 'Utilisateurs', exact: true }).click();
  await page.getByRole('searchbox', { name: 'Rechercher un utilisateur' }).fill('Moussa');
  await expect(page.getByRole('row').filter({ hasText: 'moussa@example.test' })).toBeVisible();
  await page.getByLabel('Filtrer par statut utilisateur').selectOption('ACTIF');
  await expect(page.getByText('Aucun utilisateur ne correspond aux filtres.')).toBeVisible();
});

test('affiche les états lisibles et bloque la suppression d’un client lié', async ({ page }) => {
  await page.route('**/api/**', async (route) => {
    const { pathname } = new URL(route.request().url());
    if (pathname.endsWith('/api/auth/me')) {
      await route.fulfill({ status: 200, json: {} });
    } else if (pathname.endsWith('/api/clients')) {
      await route.fulfill({ status: 200, json: [{ idClient: 1, prenom: 'Awa', nom: 'Diallo', email: 'awa@example.test', telephone: '70000000', adresse: 'Dakar' }] });
    } else if (pathname.endsWith('/api/machines')) {
      await route.fulfill({ status: 200, json: [{ idMachine: 4, reference: 'MACH-0004', marque: 'Dell', modele: 'Latitude', etat: 'EN_PANNE', client: { idClient: 1, prenom: 'Awa', nom: 'Diallo' } }] });
    } else if (pathname.endsWith('/api/demandes')) {
      await route.fulfill({ status: 200, json: [{ idDemande: 5, reference: 'DEM-0005', description: 'Écran fissuré', machine: { idMachine: 4, client: { idClient: 1 } } }] });
    } else {
      await route.fulfill({ status: 200, json: [] });
    }
  });

  await page.goto('/');
  await page.getByRole('button', { name: 'Machines', exact: true }).click();
  const machineRow = page.getByRole('row').filter({ hasText: 'MACH-0004' });
  await expect(machineRow.getByText('En panne')).toBeVisible();
  await expect(machineRow).toContainText('Écran fissuré');

  await page.getByRole('button', { name: 'Clients', exact: true }).click();
  const clientRow = page.getByRole('row').filter({ hasText: 'awa@example.test' });
  await expect(clientRow.getByRole('button', { name: 'Supprimer' })).toBeDisabled();
  await expect(clientRow).toContainText('machines ou des factures liées');
});

test('création et suppression confirmée d’un client', async ({ page }) => {
  await login(page);
  await page.getByRole('button', { name: 'Clients', exact: true }).click();

  const email = `e2e-${Date.now()}@fixmanager.local`;
  await page.getByRole('button', { name: '+ Ajouter', exact: true }).click();
  await page.getByRole('textbox', { name: 'Prénom', exact: true }).fill('Test');
  await page.getByRole('textbox', { name: 'Nom', exact: true }).fill('E2E');
  await page.getByRole('textbox', { name: 'Téléphone', exact: true }).fill('70000000');
  await page.getByRole('textbox', { name: 'Email', exact: true }).fill(email);
  await page.getByRole('textbox', { name: 'Adresse', exact: true }).fill('Adresse de test E2E');
  await page.getByRole('button', { name: 'Ajouter', exact: true }).click();

  const row = page.getByRole('row').filter({ hasText: email });
  await expect(row).toBeVisible();
  await row.getByRole('button', { name: 'Supprimer' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText('Supprimer ce client');
  await dialog.getByRole('button', { name: 'Supprimer', exact: true }).click();
  await expect(row).not.toBeVisible();
});

test('création et suppression confirmée d’une machine', async ({ page }) => {
  await login(page);
  await page.getByRole('button', { name: 'Machines', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Machines', exact: true })).toBeVisible();

  const model = `E2E Machine ${Date.now()}`;
  await page.getByRole('button', { name: '+ Ajouter', exact: true }).click();
  await page.getByRole('textbox', { name: 'Marque / Modèle', exact: true }).fill(model);
  await page.getByRole('combobox', { name: 'État', exact: true }).selectOption('ACTIVE');
  await page.getByRole('combobox', { name: 'Client', exact: true }).selectOption({ index: 1 });
  await page.getByRole('button', { name: 'Ajouter', exact: true }).click();

  const row = page.getByRole('row').filter({ hasText: model });
  await expect(row).toBeVisible();
  await row.getByRole('button', { name: 'Supprimer' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText('Supprimer cette machine');
  await dialog.getByRole('button', { name: 'Supprimer', exact: true }).click();
  await expect(row).not.toBeVisible();
});

test('création et suppression confirmée d’une demande', async ({ page }) => {
  await login(page);

  const model = `E2E Demande Machine ${Date.now()}`;
  await page.getByRole('button', { name: 'Machines', exact: true }).click();
  await page.getByRole('button', { name: '+ Ajouter', exact: true }).click();
  await page.getByRole('textbox', { name: 'Marque / Modèle', exact: true }).fill(model);
  await page.getByRole('combobox', { name: 'État', exact: true }).selectOption('ACTIVE');
  await page.getByRole('combobox', { name: 'Client', exact: true }).selectOption({ index: 1 });
  await page.getByRole('button', { name: 'Ajouter', exact: true }).click();
  await expect(page.getByRole('row').filter({ hasText: model })).toBeVisible();

  await page.getByRole('button', { name: 'Demandes', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Demandes', exact: true })).toBeVisible();

  const description = `Demande E2E ${Date.now()}`;
  await page.getByRole('button', { name: '+ Ajouter', exact: true }).click();
  await page.getByRole('combobox', { name: 'Machine', exact: true }).selectOption({ index: 1 });
  await page.getByRole('combobox', { name: 'Saisi par', exact: true }).selectOption({ index: 1 });
  await page.getByRole('textbox', { name: 'Détail de la demande', exact: true }).fill(description);
  await page.getByRole('button', { name: 'Ajouter', exact: true }).click();

  const row = page.getByRole('row').filter({ hasText: description });
  await expect(row).toBeVisible();
  await row.getByRole('button', { name: 'Supprimer' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText('Supprimer cette demande');
  await dialog.getByRole('button', { name: 'Supprimer', exact: true }).click();
  await expect(row).not.toBeVisible();

  await page.getByRole('button', { name: 'Machines', exact: true }).click();
  const machineRow = page.getByRole('row').filter({ hasText: model });
  await machineRow.getByRole('button', { name: 'Supprimer' }).click();
  const machineDialog = page.getByRole('dialog');
  await machineDialog.getByRole('button', { name: 'Supprimer', exact: true }).click();
  await expect(machineRow).not.toBeVisible();
});

test('enregistrement d’un paiement depuis une facture', async ({ page }) => {
  let factureStatut = 'A_PAYER';
  const paiementsEnregistres = [];

  await page.route('**/api/**', async (route) => {
    const request = route.request();
    const { pathname } = new URL(request.url());

    if (pathname.endsWith('/api/auth/me')) {
      await route.fulfill({ status: 200, json: {} });
    } else if (pathname.endsWith('/api/factures') && request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        json: [{
          idFacture: 3,
          reference: 'FAC-TEST-003',
          total: 12000,
          statut: factureStatut,
          paiements: paiementsEnregistres,
          intervention: { idIntervention: 8, reference: 'INT-TEST-008' },
          lignes: [],
        }],
      });
    } else if (pathname.endsWith('/api/utilisateurs')) {
      await route.fulfill({
        status: 200,
        json: [{ idUtilisateur: 2, prenom: 'Awa', nom: 'Diallo' }],
      });
    } else if (pathname.endsWith('/api/paiements') && request.method() === 'POST') {
      const paiementEnvoye = request.postDataJSON();
      paiementsEnregistres.push({
        ...paiementEnvoye,
        idPaiement: paiementsEnregistres.length + 11,
        datePaiement: '2026-10-16T12:00:00',
        utilisateur: { idUtilisateur: 2, prenom: 'Awa', nom: 'Diallo' },
      });
      factureStatut = paiementsEnregistres.reduce((total, paiement) => total + paiement.montant, 0) === 12000
        ? 'PAYEE'
        : 'PARTIELLEMENT_PAYEE';
      await route.fulfill({ status: 200, json: { idPaiement: 11 } });
    } else {
      await route.fulfill({ status: 200, json: [] });
    }
  });

  await page.goto('/');
  await page.getByRole('button', { name: 'Factures', exact: true }).click();
  await page.getByRole('button', { name: 'Enregistrer un paiement' }).click();
  await page.getByLabel('Montant (FCFA)').fill('5000');
  await page.getByLabel('Mode de paiement').selectOption('MOBILE_MONEY');
  await page.getByLabel('Enregistré par').selectOption('2');
  await page.getByRole('button', { name: 'Enregistrer', exact: true }).click();

  const factureRow = page.getByRole('row').filter({ hasText: 'FAC-TEST-003' });
  await expect(factureRow.getByText('Partiellement payée', { exact: true })).toBeVisible();
  await factureRow.getByRole('button', { name: 'Enregistrer un paiement' }).click();
  const montantInput = page.getByLabel('Montant (FCFA)');
  await expect(montantInput).toHaveAttribute('max', '7000');
  await montantInput.fill('7000');
  await page.getByLabel('Mode de paiement').selectOption('MOBILE_MONEY');
  await page.getByLabel('Enregistré par').selectOption('2');
  await page.getByRole('button', { name: 'Enregistrer', exact: true }).click();

  await expect(factureRow.getByText('Payée', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Enregistrer un paiement' })).toHaveCount(0);
  expect(paiementsEnregistres.map(({ montant, modePaiement, facture, utilisateur }) => ({
    montant,
    modePaiement,
    facture,
    utilisateur: { idUtilisateur: utilisateur.idUtilisateur },
  }))).toEqual([
    {
      montant: 5000,
      modePaiement: 'MOBILE_MONEY',
      facture: { idFacture: 3 },
      utilisateur: { idUtilisateur: 2 },
    },
    {
      montant: 7000,
      modePaiement: 'MOBILE_MONEY',
      facture: { idFacture: 3 },
      utilisateur: { idUtilisateur: 2 },
    },
  ]);

  await factureRow.getByRole('button', { name: 'Voir', exact: true }).click();
  const invoicePreview = page.locator('.devis-paper');
  await expect(invoicePreview).toContainText('Historique des paiements');
  await expect(invoicePreview).toContainText('5 000 FCFA');
  await expect(invoicePreview).toContainText('7 000 FCFA');
  await expect(invoicePreview).toContainText('Solde restant');
});

test('cycle de statut d’un devis', async ({ page }) => {
  let devisStatut = 'BROUILLON';
  const statutsEnvoyes = [];

  await page.route('**/api/**', async (route) => {
    const request = route.request();
    const { pathname } = new URL(request.url());

    if (pathname.endsWith('/api/auth/me')) {
      await route.fulfill({ status: 200, json: {} });
    } else if (pathname.endsWith('/api/devis') && request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        json: [{
          idDevis: 6,
          reference: 'DEV-TEST-006',
          dateDevis: '2026-10-16T10:00:00',
          dateValidite: '2026-11-15',
          total: 12000,
          statut: devisStatut,
          demande: {
            idDemande: 9,
            reference: 'DEM-TEST-009',
            machine: { reference: 'MAC-TEST-009', marque: 'Test', modele: 'Pro' },
          },
          lignes: [{ idLigneDevis: 1, designation: 'Diagnostic', quantite: 1, prixUnitaire: 12000, total: 12000 }],
        }],
      });
    } else if (pathname.endsWith('/api/devis/6/statut') && request.method() === 'PATCH') {
      devisStatut = request.postDataJSON().statut;
      statutsEnvoyes.push(devisStatut);
      await route.fulfill({ status: 200, json: {} });
    } else {
      await route.fulfill({ status: 200, json: [] });
    }
  });

  await page.goto('/');
  await page.getByRole('button', { name: 'Devis', exact: true }).click();
  await page.getByRole('button', { name: 'Voir le devis' }).click();
  const devisPreview = page.locator('.devis-paper');
  await expect(devisPreview.getByText('Brouillon', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Client accepte' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Marquer envoyé' }).click();

  await expect(devisPreview.getByText('Envoyé', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Marquer envoyé' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Client accepte' }).click();

  await expect(devisPreview.getByText('Accepté', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Client refuse' })).toHaveCount(0);
  expect(statutsEnvoyes).toEqual(['ENVOYE', 'ACCEPTE']);
});

test('conserve la demande liée lors de la modification d’une intervention', async ({ page }) => {
  await page.route('**/api/**', async (route) => {
    const { pathname } = new URL(route.request().url());

    if (pathname.endsWith('/api/auth/me')) {
      await route.fulfill({ status: 200, json: {} });
    } else if (pathname.endsWith('/api/interventions')) {
      await route.fulfill({
        status: 200,
        json: [{
          idIntervention: 1,
          reference: 'INT-TEST-001',
          statut: 'EN_COURS',
          demande: { idDemande: 1, reference: 'DEM-TEST-001', description: 'Demande déjà liée' },
        }],
      });
    } else if (pathname.endsWith('/api/demandes')) {
      await route.fulfill({
        status: 200,
        json: [
          { idDemande: 1, reference: 'DEM-TEST-001', description: 'Demande déjà liée' },
          { idDemande: 2, reference: 'DEM-TEST-002', description: 'Demande encore libre' },
        ],
      });
    } else {
      await route.fulfill({ status: 200, json: [] });
    }
  });

  await page.goto('/');
  await page.getByRole('button', { name: 'Interventions', exact: true }).click();
  const interventionRow = page.getByRole('row').filter({ hasText: 'INT-TEST-001' });
  await interventionRow.getByRole('button', { name: 'Modifier' }).click();

  const demandeSelect = page.getByRole('combobox', { name: 'Demande concernée' });
  await expect(demandeSelect.locator('option').filter({ hasText: 'DEM-TEST-001' })).toHaveCount(1);
  await expect(demandeSelect).toHaveValue('1');
});