import { startTransition, useEffect, useState } from 'react';
import ConfirmDialog from '../components/ConfirmDialog';
import SearchInput from '../components/SearchInput';
import UtilisateurModal from '../components/UtilisateurModal';
import { useToast } from '../components/toastContext';
import { deleteUtilisateur, getUtilisateurs, saveUtilisateur } from '../services/api';
const emptyForm = { prenom: '', nom: '', telephone: '', email: '', password: '', actif: true };

export default function UtilisateursPage() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editingUtilisateur, setEditingUtilisateur] = useState(null);
  const [deletingUtilisateur, setDeletingUtilisateur] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('TOUS');
  const { notify } = useToast();
  const filteredUtilisateurs = utilisateurs.filter((utilisateur) => {
    const query = searchTerm.trim().toLowerCase();
    const matchesSearch = [utilisateur.prenom, utilisateur.nom, utilisateur.email, utilisateur.telephone]
      .some((value) => value?.toLowerCase().includes(query));
    return matchesSearch && (statusFilter === 'TOUS' || (statusFilter === 'ACTIF' ? utilisateur.actif : !utilisateur.actif));
  });

  const fetchUtilisateurs = async () => {
    try {
      startTransition(() => setLoading(true));
      const utilisateursData = await getUtilisateurs();
      startTransition(() => {
        setUtilisateurs(utilisateursData);
        setError('');
      });
    } catch (err) {
      startTransition(() => setError(err.message || 'Erreur lors du chargement'));
    } finally {
      startTransition(() => setLoading(false));
    }
  };

  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await saveUtilisateur(editingUtilisateur?.idUtilisateur, formData);
      setFormData(emptyForm);
      setEditingUtilisateur(null);
      setIsModalOpen(false);
      notify(editingUtilisateur ? 'Utilisateur modifié.' : 'Utilisateur ajouté.');
      await fetchUtilisateurs();
    } catch (err) {
      notify(err.message || 'Une erreur est survenue.', 'error');
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingUtilisateur) return;
    setDeleting(true);
    try {
      await deleteUtilisateur(deletingUtilisateur.idUtilisateur);
      notify('Utilisateur supprimé.');
      setDeletingUtilisateur(null);
      await fetchUtilisateurs();
    } catch (err) {
      notify(err.message || 'Impossible de supprimer l’utilisateur.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="flex-1 bg-[#f4f4f3] p-4 md:p-8 lg:p-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#d53c54]">Administration</p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-800">Utilisateurs</h1>
          </div>
          <button type="button" onClick={() => setIsModalOpen(true)} className="rounded-xl bg-[#d53c54] px-4 py-2.5 font-medium text-white">+ Ajouter</button>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800">Liste des utilisateurs</h2>
            <div className="flex flex-col gap-2 sm:flex-row">
              <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Rechercher un utilisateur..." label="Rechercher un utilisateur" />
              <select aria-label="Filtrer par statut utilisateur" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                <option value="TOUS">Tous les statuts</option><option value="ACTIF">Actifs</option><option value="INACTIF">Inactifs</option>
              </select>
              <button type="button" onClick={fetchUtilisateurs} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">Rafraîchir</button>
            </div>
          </div>
          {loading ? <p className="text-slate-500">Chargement des utilisateurs...</p> : error ? <p className="font-medium text-red-600">{error}</p> : utilisateurs.length === 0 ? <p className="text-slate-500">Aucun utilisateur n'est enregistré pour le moment.</p> : filteredUtilisateurs.length === 0 ? <p className="text-slate-500">Aucun utilisateur ne correspond aux filtres.</p> : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-200 text-slate-500"><tr><th className="pb-3 pr-4 font-medium">Prénom</th><th className="pb-3 pr-4 font-medium">Nom</th><th className="pb-3 pr-4 font-medium">Téléphone</th><th className="pb-3 pr-4 font-medium">Email</th><th className="pb-3 pr-4 font-medium">Statut</th><th className="pb-3 font-medium">Action</th></tr></thead>
                <tbody>{filteredUtilisateurs.map((utilisateur) => <tr key={utilisateur.idUtilisateur} className="border-b border-slate-100 last:border-none"><td className="py-3 pr-4 text-slate-700">{utilisateur.prenom}</td><td className="py-3 pr-4 text-slate-700">{utilisateur.nom}</td><td className="py-3 pr-4 text-slate-700">{utilisateur.telephone}</td><td className="py-3 pr-4 text-slate-700">{utilisateur.email}</td><td className="py-3 pr-4 text-slate-700">{utilisateur.actif ? 'Actif' : 'Inactif'}</td><td className="py-3"><div className="flex gap-2"><button type="button" onClick={() => { setEditingUtilisateur(utilisateur); setFormData({ ...utilisateur, password: '' }); setIsModalOpen(true); }} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700">Modifier</button><button type="button" onClick={() => setDeletingUtilisateur(utilisateur)} className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600">Supprimer</button></div></td></tr>)}</tbody>
              </table>
            </div>
          )}
        </section>
      </div>
      <UtilisateurModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingUtilisateur(null); }} formData={formData} onChange={handleChange} onSubmit={handleSubmit} submitting={submitting} editing={Boolean(editingUtilisateur)} />
      <ConfirmDialog isOpen={Boolean(deletingUtilisateur)} title="Supprimer cet utilisateur ?" message={deletingUtilisateur ? `Cette action supprimera ${deletingUtilisateur.prenom} ${deletingUtilisateur.nom}.` : ''} onCancel={() => setDeletingUtilisateur(null)} onConfirm={confirmDelete} submitting={deleting} />
    </main>
  );
}