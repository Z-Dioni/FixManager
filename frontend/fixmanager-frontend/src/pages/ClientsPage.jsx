import { startTransition, useEffect, useState } from 'react';
import ClientModal from '../components/ClientModal';
import ConfirmDialog from '../components/ConfirmDialog';
import Pagination from '../components/Pagination';
import { useToast } from '../components/toastContext';
import { deleteClient, getClients, getFactures, getMachines, saveClient } from '../services/api';

/**
 * Page Clients.
 * Elle permet d'afficher la liste des clients existants et d'en ajouter de nouveaux.
 * Cette page est la premiere vraie fonctionnalite CRUD connectee au backend.
 */
export default function ClientsPage() {
  // Liste de clients recuperee dans la base.
  const [clients, setClients] = useState([]);
  const [clientsWithDependencies, setClientsWithDependencies] = useState(() => new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [deletingClient, setDeletingClient] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const { notify } = useToast();

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredClients = clients.filter((client) => [
    client.nom,
    client.prenom,
    client.email,
    client.telephone,
    client.adresse,
  ].some((value) => value?.toLowerCase().includes(normalizedSearch)));
  const pageSize = 10;
  const totalPages = Math.ceil(filteredClients.length / pageSize);
  const paginatedClients = filteredClients.slice((page - 1) * pageSize, page * pageSize);

  // Formulaire de creation d'un nouveau client.
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    adresse: '',
  });

  /**
   * Charge la liste des clients depuis l'API backend.
   * Le useEffect garantit que cette requete est lancee au montage du composant.
   */
  const fetchClients = async () => {
    try {
      startTransition(() => setLoading(true));
      const [data, machines, factures] = await Promise.all([getClients(), getMachines(), getFactures()]);
      const clientIdsWithDependencies = new Set();
      machines.forEach((machine) => {
        if (machine.client?.idClient != null) clientIdsWithDependencies.add(machine.client.idClient);
      });
      factures.forEach((facture) => {
        const clientId = facture.intervention?.demande?.machine?.client?.idClient;
        if (clientId != null) clientIdsWithDependencies.add(clientId);
      });
      startTransition(() => {
        setClients(data);
        setClientsWithDependencies(clientIdsWithDependencies);
        setError('');
      });
    } catch (err) {
      startTransition(() => setError(err.message || 'Erreur lors du chargement'));
    } finally {
      startTransition(() => setLoading(false));
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  /**
   * Met a jour le formulaire quand l'utilisateur saisit des donnees.
   */
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  /**
   * Envoie le formulaire vers le backend pour creer un client.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await saveClient(editingClient?.idClient, formData);

      // Une fois la creation reussie, on rafraichit la liste et on remet le formulaire a zero.
      setFormData({ nom: '', prenom: '', telephone: '', email: '', adresse: '' });
      setEditingClient(null);
      setIsModalOpen(false);
      notify(editingClient ? 'Client modifié.' : 'Client ajouté.');
      await fetchClients();
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (client) => {
    setDeletingClient(client);
  };

  const confirmDelete = async () => {
    if (!deletingClient) return;
    setDeleting(true);
    try {
      await deleteClient(deletingClient.idClient);
      notify('Client supprimé.');
      setDeletingClient(null);
      await fetchClients();
    } catch (err) {
      notify(err.message || 'Impossible de supprimer le client.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="flex-1 bg-[#f4f4f3] p-4 md:p-8 lg:p-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#d53c54]">
              Gestion
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-800">Clients</h1>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="rounded-xl bg-[#d53c54] px-4 py-2.5 font-medium text-white shadow-md shadow-[#d53c54]/20 transition hover:bg-[#b53248]"
          >
            + Ajouter
          </button>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800">Liste des clients</h2>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => { setSearchTerm(event.target.value); setPage(1); }}
                placeholder="Rechercher un client..."
                aria-label="Rechercher un client"
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-[#d53c54] focus:bg-white"
              />
              <button
                type="button"
                onClick={fetchClients}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Rafraîchir
              </button>
            </div>
          </div>

          {loading ? (
            <p className="text-slate-500">Chargement des clients...</p>
          ) : error ? (
            <p className="font-medium text-red-600">{error}</p>
          ) : clients.length === 0 ? (
            <p className="text-slate-500">Aucun client n'est enregistré pour le moment.</p>
          ) : filteredClients.length === 0 ? (
            <p className="text-slate-500">Aucun client ne correspond à votre recherche.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="pb-3 pr-4 font-medium">ID</th>
                    <th className="pb-3 pr-4 font-medium">Nom</th>
                    <th className="pb-3 pr-4 font-medium">Prénom</th>
                    <th className="pb-3 pr-4 font-medium">Téléphone</th>
                    <th className="pb-3 pr-4 font-medium">Email</th>
                    <th className="pb-3 pr-4 font-medium">Adresse</th>
                    <th className="pb-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedClients.map((client) => (
                    <tr key={client.idClient} className="border-b border-slate-100 last:border-none">
                      <td className="py-3 pr-4 text-slate-700">{client.idClient}</td>
                      <td className="py-3 pr-4 text-slate-700">{client.nom}</td>
                      <td className="py-3 pr-4 text-slate-700">{client.prenom}</td>
                      <td className="py-3 pr-4 text-slate-700">{client.telephone}</td>
                      <td className="py-3 pr-4 text-slate-700">{client.email}</td>
                      <td className="py-3 pr-4 text-slate-700">{client.adresse}</td>
                      <td className="py-3"><div className="flex flex-col items-start gap-2"><div className="flex gap-2"><button type="button" onClick={() => { setEditingClient(client); setFormData(client); setIsModalOpen(true); }} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700">Modifier</button><button type="button" onClick={() => handleDelete(client)} disabled={clientsWithDependencies.has(client.idClient)} title={clientsWithDependencies.has(client.idClient) ? 'Supprimez d’abord les machines et factures liées.' : undefined} className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 disabled:cursor-not-allowed disabled:opacity-40">Supprimer</button></div>{clientsWithDependencies.has(client.idClient) && <span className="max-w-52 text-xs text-slate-500">Suppression indisponible : ce client possède des machines ou des factures liées.</span>}</div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination page={Math.min(page, Math.max(totalPages, 1))} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </section>
      </div>

      <ClientModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingClient(null); }}
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitting={submitting}
        editing={Boolean(editingClient)}
      />
      <ConfirmDialog
        isOpen={Boolean(deletingClient)}
        title="Supprimer ce client ?"
        message={deletingClient ? `Cette action supprimera ${deletingClient.prenom} ${deletingClient.nom}. Elle ne peut pas etre annulee.` : ''}
        onCancel={() => setDeletingClient(null)}
        onConfirm={confirmDelete}
        submitting={deleting}
      />
    </main>
  );
}
