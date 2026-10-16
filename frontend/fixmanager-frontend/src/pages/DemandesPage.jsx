import { startTransition, useEffect, useState } from 'react';
import ConfirmDialog from '../components/ConfirmDialog';
import DemandeModal from '../components/DemandeModal';
import Pagination from '../components/Pagination';
import SearchInput from '../components/SearchInput';
import StatusBadge from '../components/StatusBadge';
import { useToast } from '../components/toastContext';
import { deleteDemande, getDemandes, getMachines, getUtilisateurs, saveDemande } from '../services/api';

const getCurrentDateTime = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 16);
};

const createEmptyForm = () => ({ machineId: '', utilisateurId: '', description: '', dateSouhaitee: getCurrentDateTime() });

export default function DemandesPage() {
  const [allDemandes, setAllDemandes] = useState([]);
  const [machines, setMachines] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(createEmptyForm);
  const [editingDemande, setEditingDemande] = useState(null);
  const [deletingDemande, setDeletingDemande] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const { notify } = useToast();
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const matchingDemandes = allDemandes.filter((demande) => [demande.reference, demande.description, demande.statut, demande.machine?.reference, demande.utilisateur?.nom, demande.utilisateur?.prenom].some((value) => value?.toLowerCase().includes(normalizedSearch)));
  const pageSize = 10;
  const totalPages = Math.ceil(matchingDemandes.length / pageSize);
  const demandes = matchingDemandes.slice((page - 1) * pageSize, page * pageSize);

  const fetchData = async () => {
    try {
      startTransition(() => setLoading(true));
      const [demandesData, machines, utilisateurs] = await Promise.all([getDemandes(), getMachines(), getUtilisateurs()]);
      startTransition(() => {
        setAllDemandes(demandesData);
        setMachines(machines);
        setUtilisateurs(utilisateurs);
        setError('');
      });
    } catch (err) {
      startTransition(() => setError(err.message || 'Erreur lors du chargement'));
    } finally {
      startTransition(() => setLoading(false));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await saveDemande(editingDemande?.idDemande, {
          description: formData.description,
          dateSouhaitee: formData.dateSouhaitee,
          machine: { idMachine: Number(formData.machineId) },
          utilisateur: { idUtilisateur: Number(formData.utilisateurId) },
      });
      setFormData(createEmptyForm());
      setEditingDemande(null);
      setIsModalOpen(false);
      notify(editingDemande ? 'Demande modifiée.' : 'Demande ajoutée.');
      await fetchData();
    } catch (err) {
      notify(err.message || 'Une erreur est survenue.', 'error');
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingDemande) return;
    setDeleting(true);
    try {
      await deleteDemande(deletingDemande.idDemande);
      notify('Demande supprimée.');
      setDeletingDemande(null);
      await fetchData();
    } catch (err) {
      notify(err.message || 'Impossible de supprimer la demande.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="flex-1 bg-[#f4f4f3] p-4 md:p-8 lg:p-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#d53c54]">Suivi</p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-800">Demandes</h1>
          </div>
          <button type="button" onClick={() => { setFormData(createEmptyForm()); setIsModalOpen(true); }} className="rounded-xl bg-[#d53c54] px-4 py-2.5 font-medium text-white">+ Ajouter</button>
        </header>
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-slate-800">Liste des demandes</h2>
            <div className="flex flex-col gap-2 sm:flex-row">
              <SearchInput value={searchTerm} onChange={(value) => { setSearchTerm(value); setPage(1); }} placeholder="Rechercher une demande..." label="Rechercher une demande" />
              <button type="button" onClick={fetchData} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">Rafraîchir</button>
            </div>
          </div>
          {loading ? <p className="text-slate-500">Chargement des demandes...</p> : error ? <p className="font-medium text-red-600">{error}</p> : demandes.length === 0 ? <p className="text-slate-500">Aucune demande ne correspond à votre recherche.</p> : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-200 text-slate-500"><tr><th className="pb-3 pr-4 font-medium">Référence</th><th className="pb-3 pr-4 font-medium">Description</th><th className="pb-3 pr-4 font-medium">Machine</th><th className="pb-3 pr-4 font-medium">Client</th><th className="pb-3 pr-4 font-medium">Saisi par</th><th className="pb-3 pr-4 font-medium">Statut</th><th className="pb-3 font-medium">Action</th></tr></thead>
                <tbody>{demandes.map((demande) => <tr key={demande.idDemande} className="border-b border-slate-100 last:border-none"><td className="py-3 pr-4 text-slate-700">{demande.reference}</td><td className="max-w-xs py-3 pr-4 text-slate-700">{demande.description}</td><td className="py-3 pr-4 text-slate-700">{demande.machine?.reference}</td><td className="py-3 pr-4 text-slate-700">{demande.machine?.client?.prenom} {demande.machine?.client?.nom}</td><td className="py-3 pr-4 text-slate-700">{demande.utilisateur?.prenom} {demande.utilisateur?.nom}</td><td className="py-3 pr-4"><StatusBadge status={demande.statut} /></td><td className="py-3"><div className="flex gap-2"><button type="button" onClick={() => { setEditingDemande(demande); setFormData({ machineId: String(demande.machine?.idMachine || ''), utilisateurId: String(demande.utilisateur?.idUtilisateur || ''), description: demande.description || '', dateSouhaitee: demande.dateSouhaitee?.slice(0, 16) || getCurrentDateTime() }); setIsModalOpen(true); }} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700">Modifier</button><button type="button" onClick={() => setDeletingDemande(demande)} className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600">Supprimer</button></div></td></tr>)}</tbody>
              </table>
              <Pagination page={Math.min(page, Math.max(totalPages, 1))} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </section>
      </div>
      <DemandeModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingDemande(null); }} formData={formData} machines={machines} utilisateurs={utilisateurs} onChange={handleChange} onSubmit={handleSubmit} submitting={submitting} editing={Boolean(editingDemande)} />
      <ConfirmDialog isOpen={Boolean(deletingDemande)} title="Supprimer cette demande ?" message={deletingDemande ? `Cette action supprimera ${deletingDemande.reference}.` : ''} onCancel={() => setDeletingDemande(null)} onConfirm={confirmDelete} submitting={deleting} />
    </main>
  );
}