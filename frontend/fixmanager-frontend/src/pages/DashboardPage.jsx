import { useEffect, useState } from 'react';
import { getClients, getDevis, getFactures, getInterventions } from '../services/api';
import StatCard from '../components/StatCard';

/**
 * Page d'accueil du tableau de bord.
 * Elle charge les donnees backend, affiche les KPI et affiche un apercu des clients.
 */
export default function DashboardPage({ onNavigate }) {
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState({ monthlyRevenue: 0, unpaidBalance: 0, activeInterventions: 0, pendingQuotes: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Charge les clients au montage du composant.
  useEffect(() => {
    async function loadClients() {
      try {
        const [clientsData, interventionsData, facturesData, devisData] = await Promise.all([
          getClients(),
          getInterventions(),
          getFactures(),
          getDevis(),
        ]);
        const now = new Date();
        const monthlyRevenue = facturesData.flatMap((facture) => facture.paiements || [])
          .filter((paiement) => {
            const date = new Date(paiement.datePaiement);
            return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
          })
          .reduce((total, paiement) => total + Number(paiement.montant || 0), 0);
        const unpaidBalance = facturesData
          .filter((facture) => facture.statut !== 'PAYEE' && facture.statut !== 'ANNULEE')
          .reduce((total, facture) => {
            const paid = (facture.paiements || []).reduce((sum, paiement) => sum + Number(paiement.montant || 0), 0);
            return total + Math.max(0, Number(facture.total || 0) - paid);
          }, 0);
        setClients(clientsData);
        setStats({
          monthlyRevenue,
          unpaidBalance,
          activeInterventions: interventionsData.filter((intervention) => intervention.statut === 'NOUVELLE' || intervention.statut === 'EN_COURS').length,
          pendingQuotes: devisData.filter((devis) => devis.statut === 'BROUILLON' || devis.statut === 'ENVOYE').length,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadClients();
  }, []);

  return (
    <main className="flex-1 bg-[#f4f4f3] p-4 md:p-8 lg:p-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#d53c54]">
              Dashboard
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-800 md:text-4xl">
              Bienvenue sur FixManager
            </h1>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('Demandes')}
            className="rounded-xl bg-[#1f2b34] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#2b3b45]"
          >
            Nouvelle demande
          </button>
        </header>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Encaissements du mois" value={`${stats.monthlyRevenue.toLocaleString('fr-FR')} FCFA`} accent="rose" />
          <StatCard label="Solde des factures impayées" value={`${stats.unpaidBalance.toLocaleString('fr-FR')} FCFA`} accent="sand" />
          <StatCard label="Interventions en cours" value={stats.activeInterventions} accent="mint" />
          <StatCard label="Devis en attente" value={stats.pendingQuotes} accent="slate" />
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800">Clients récents</h2>
          </div>

          {loading ? (
            <p className="text-slate-500">Chargement...</p>
          ) : error ? (
            <p className="font-medium text-red-600">{error}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="pb-3 pr-4 font-medium">Nom</th>
                    <th className="pb-3 pr-4 font-medium">Prénom</th>
                    <th className="pb-3 pr-4 font-medium">Téléphone</th>
                    <th className="pb-3 font-medium">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.slice(0, 5).map((client) => (
                    <tr key={client.idClient} className="border-b border-slate-100 last:border-none">
                      <td className="py-3 pr-4 text-slate-700">{client.nom}</td>
                      <td className="py-3 pr-4 text-slate-700">{client.prenom}</td>
                      <td className="py-3 pr-4 text-slate-700">{client.telephone}</td>
                      <td className="py-3 text-slate-700">{client.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
