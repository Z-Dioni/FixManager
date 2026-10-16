import { startTransition, useEffect, useState } from 'react';
import ConfirmDialog from '../components/ConfirmDialog';
import InterventionModal from '../components/InterventionModal';
import Pagination from '../components/Pagination';
import SearchInput from '../components/SearchInput';
import StatusBadge from '../components/StatusBadge';
import { useToast } from '../components/toastContext';
import { deleteIntervention, getDemandes, getInterventions, saveIntervention } from '../services/api';
const createEmptyForm = () => ({ demandeId: '', diagnostic: '', causePanne: '', travailEffectue: '', statut: 'NOUVELLE' });

export default function InterventionsPage() {
  const [allInterventions, setAllInterventions] = useState([]);
  const [demandes, setDemandes] = useState([]);
  const [hasAnyDemandes, setHasAnyDemandes] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(createEmptyForm);
  const [editingIntervention, setEditingIntervention] = useState(null);
  const [deletingIntervention, setDeletingIntervention] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const { notify } = useToast();
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const matchingInterventions = allInterventions.filter((intervention) => [intervention.reference, intervention.diagnostic, intervention.travailEffectue, intervention.statut, intervention.demande?.reference].some((value) => value?.toLowerCase().includes(normalizedSearch)));
  const pageSize = 10;
  const totalPages = Math.ceil(matchingInterventions.length / pageSize);
  const interventions = matchingInterventions.slice((page - 1) * pageSize, page * pageSize);

  const fetchData = async () => {
    try {
      startTransition(() => setLoading(true));
      const [interventionsData, demandesData] = await Promise.all([getInterventions(), getDemandes()]);
      const demandesTraitees = new Set(interventionsData.map((intervention) => intervention.demande?.idDemande));
      startTransition(() => {
        setAllInterventions(interventionsData);
        setHasAnyDemandes(demandesData.length > 0);
        setDemandes(demandesData.filter((demande) => !demandesTraitees.has(demande.idDemande)));
        setError('');
      });
    } catch (err) {
      startTransition(() => setError(err.message || 'Erreur lors du chargement'));
    } finally {
      startTransition(() => setLoading(false));
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await saveIntervention(editingIntervention?.idIntervention, { diagnostic: formData.diagnostic, causePanne: formData.causePanne, travailEffectue: formData.travailEffectue, statut: formData.statut, demande: { idDemande: Number(formData.demandeId) } });
      setFormData(createEmptyForm());
      setEditingIntervention(null);
      setIsModalOpen(false);
      notify(editingIntervention ? 'Intervention modifiée.' : 'Intervention créée.');
      await fetchData();
    } catch (err) {
      notify(err.message || 'Une erreur est survenue.', 'error');
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingIntervention) return;
    setDeleting(true);
    try {
      await deleteIntervention(deletingIntervention.idIntervention);
      notify('Intervention supprimée.');
      setDeletingIntervention(null);
      await fetchData();
    } catch (err) {
      notify(err.message || 'Impossible de supprimer l’intervention.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="flex-1 bg-[#f4f4f3] p-4 md:p-8 lg:p-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#d53c54]">Maintenance</p><h1 className="text-3xl font-bold tracking-tight text-slate-800">Interventions</h1></div>
          <div className="flex flex-col items-start gap-2 md:items-end">
            <button type="button" onClick={() => { setFormData(createEmptyForm()); setIsModalOpen(true); }} disabled={demandes.length === 0} className="rounded-xl bg-[#d53c54] px-4 py-2.5 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60">+ Créer</button>
            {!loading && !error && demandes.length === 0 && <p className="text-sm text-slate-500">{hasAnyDemandes ? 'Aucune demande disponible : toutes ont déjà une intervention.' : 'Aucune demande enregistrée pour le moment.'}</p>}
          </div>
        </header>
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><h2 className="text-xl font-semibold text-slate-800">Suivi des interventions</h2><div className="flex flex-col gap-2 sm:flex-row"><SearchInput value={searchTerm} onChange={(value) => { setSearchTerm(value); setPage(1); }} placeholder="Rechercher une intervention..." label="Rechercher une intervention" /><button type="button" onClick={fetchData} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">Rafraîchir</button></div></div>
          {loading ? <p className="text-slate-500">Chargement des interventions...</p> : error ? <p className="font-medium text-red-600">{error}</p> : interventions.length === 0 ? <p className="text-slate-500">Aucune intervention ne correspond à votre recherche.</p> : (
            <div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="border-b border-slate-200 text-slate-500"><tr><th className="pb-3 pr-4 font-medium">Référence</th><th className="pb-3 pr-4 font-medium">Demande</th><th className="pb-3 pr-4 font-medium">Diagnostic</th><th className="pb-3 pr-4 font-medium">Travail effectué</th><th className="pb-3 pr-4 font-medium">Statut</th><th className="pb-3 font-medium">Action</th></tr></thead><tbody>{interventions.map((intervention) => <tr key={intervention.idIntervention} className="border-b border-slate-100 last:border-none"><td className="py-3 pr-4 text-slate-700">{intervention.reference}</td><td className="py-3 pr-4 text-slate-700">{intervention.demande?.reference}</td><td className="max-w-xs py-3 pr-4 text-slate-700">{intervention.diagnostic || 'Non renseigné'}</td><td className="max-w-xs py-3 pr-4 text-slate-700">{intervention.travailEffectue || 'Non renseigné'}</td><td className="py-3 pr-4"><StatusBadge status={intervention.statut} /></td><td className="py-3"><div className="flex gap-2"><button type="button" onClick={() => { setEditingIntervention(intervention); setFormData({ demandeId: String(intervention.demande?.idDemande || ''), diagnostic: intervention.diagnostic || '', causePanne: intervention.causePanne || '', travailEffectue: intervention.travailEffectue || '', statut: intervention.statut || 'NOUVELLE' }); setIsModalOpen(true); }} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700">Modifier</button><button type="button" onClick={() => setDeletingIntervention(intervention)} className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600">Supprimer</button></div></td></tr>)}</tbody></table></div>
          )}
        <Pagination page={Math.min(page, Math.max(totalPages, 1))} totalPages={totalPages} onPageChange={setPage} />
        </section>
      </div>
      <InterventionModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingIntervention(null); }} formData={formData} demandes={editingIntervention ? [...demandes, editingIntervention.demande].filter(Boolean) : demandes} onChange={handleChange} onSubmit={handleSubmit} submitting={submitting} editing={Boolean(editingIntervention)} />
      <ConfirmDialog isOpen={Boolean(deletingIntervention)} title="Supprimer cette intervention ?" message={deletingIntervention ? `Cette action supprimera ${deletingIntervention.reference}.` : ''} onCancel={() => setDeletingIntervention(null)} onConfirm={confirmDelete} submitting={deleting} />
    </main>
  );
}