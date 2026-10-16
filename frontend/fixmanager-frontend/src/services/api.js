// Base URL de l'API Spring Boot.
// Le frontend Vite s'execute sur le port 5173, tandis que le backend s'executera sur 8080.
const API_BASE_URL = '';

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}/api/${path}`, {
    ...options,
    credentials: 'same-origin',
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    if ((response.status === 401 || response.status === 403) && !path.startsWith('auth/')) {
      window.dispatchEvent(new CustomEvent('fixmanager:session-expired'));
    }
    let message = `Erreur API (${response.status})`;
    try {
      const body = await response.json();
      message = body.message || message;
    } catch {
      // La réponse peut être vide, notamment pour les erreurs réseau du proxy.
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function getCollection(resource) {
  return apiRequest(resource);
}

async function saveResource(resource, id, data) {
  return apiRequest(`${resource}${id ? `/${id}` : ''}`, {
    method: id ? 'PUT' : 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Récupère la liste de tous les clients disponibles dans l'API.
 * Cette fonction est utilisee par le dashboard pour afficher les donnees de base.
 */
export async function getClients() {
  return getCollection('clients');
}

export const getMachines = () => getCollection('machines');
export const getDemandes = () => getCollection('demandes');
export const getUtilisateurs = () => getCollection('utilisateurs');
export const getInterventions = () => getCollection('interventions');
export const getDevis = () => getCollection('devis');
export const getFactures = () => getCollection('factures');
export const saveClient = (id, data) => saveResource('clients', id, data);
export const deleteClient = (id) => apiRequest(`clients/${id}`, { method: 'DELETE' });
export const deleteMachine = (id) => apiRequest(`machines/${id}`, { method: 'DELETE' });
export const deleteDemande = (id) => apiRequest(`demandes/${id}`, { method: 'DELETE' });
export const deleteIntervention = (id) => apiRequest(`interventions/${id}`, { method: 'DELETE' });
export const deleteDevis = (id) => apiRequest(`devis/${id}`, { method: 'DELETE' });
export const deleteFacture = (id) => apiRequest(`factures/${id}`, { method: 'DELETE' });
export const saveMachine = (id, data) => saveResource('machines', id, data);
export const saveDemande = (id, data) => saveResource('demandes', id, data);
export const saveIntervention = (id, data) => saveResource('interventions', id, data);
export const saveUtilisateur = (id, data) => saveResource('utilisateurs', id, data);
export const deleteUtilisateur = (id) => apiRequest(`utilisateurs/${id}`, { method: 'DELETE' });
export const createDevis = (data) => saveResource('devis', null, data);
export const createPaiement = (data) => saveResource('paiements', null, data);
export const updateDevisStatus = (id, statut) => apiRequest(`devis/${id}/statut`, {
  method: 'PATCH',
  body: JSON.stringify({ statut }),
});
export const saveFacture = (id, data) => saveResource('factures', id, data);

/**
 * Récupère un client precise selon son identifiant.
 * Cette fonction pourra etre utilisee plus tard dans une fiche detaillee ou une page edition.
 */
export async function getClientById(id) {
  return apiRequest(`clients/${id}`);
}
