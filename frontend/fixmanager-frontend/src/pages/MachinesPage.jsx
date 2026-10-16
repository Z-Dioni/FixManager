import { startTransition, useEffect, useState } from 'react';
import ConfirmDialog from '../components/ConfirmDialog';
import MachineModal from '../components/MachineModal';
import Pagination from '../components/Pagination';
import SearchInput from '../components/SearchInput';
import StatusBadge from '../components/StatusBadge';
import { useToast } from '../components/toastContext';
import { deleteMachine, getClients, getDemandes, getMachines, saveMachine } from '../services/api';
const emptyForm = { marqueModele: '', etat: '', clientId: '' };

export default function MachinesPage() {
  const [machines, setMachines] = useState([]);
  const [clients, setClients] = useState([]);
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editingMachine, setEditingMachine] = useState(null);
  const [deletingMachine, setDeletingMachine] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const { notify } = useToast();
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const matchingMachines = machines.filter((machine) => [machine.reference, machine.marque, machine.modele, machine.etat, machine.problemeSignale, machine.client?.nom, machine.client?.prenom].some((value) => value?.toLowerCase().includes(normalizedSearch)));
  const pageSize = 10;
  const totalPages = Math.ceil(matchingMachines.length / pageSize);
  const filteredMachines = matchingMachines.slice((page - 1) * pageSize, page * pageSize);

  const fetchData = async () => {
    try {
      startTransition(() => setLoading(true));
      const [machines, clients, demandes] = await Promise.all([getMachines(), getClients(), getDemandes()]);
      startTransition(() => {
        setMachines(machines);
        setClients(clients);
        setDemandes(demandes);
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
      await saveMachine(editingMachine?.idMachine, {
          marque: formData.marqueModele,
          modele: '',
          etat: formData.etat,
          problemeSignale: editingMachine?.problemeSignale || '',
          client: { idClient: Number(formData.clientId) },
      });
      setFormData(emptyForm);
      setEditingMachine(null);
      setIsModalOpen(false);
      notify(editingMachine ? 'Machine modifiée.' : 'Machine ajoutée.');
      await fetchData();
    } catch (err) {
      notify(err.message || 'Une erreur est survenue.', 'error');
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingMachine) return;
    setDeleting(true);
    try {
      await deleteMachine(deletingMachine.idMachine);
      notify('Machine supprimée.');
      setDeletingMachine(null);
      await fetchData();
    } catch (err) {
      notify(err.message || 'Impossible de supprimer la machine.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="flex-1 bg-[#f4f4f3] p-4 md:p-8 lg:p-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#d53c54]">Gestion</p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-800">Machines</h1>
          </div>
          <button type="button" onClick={() => setIsModalOpen(true)} className="rounded-xl bg-[#d53c54] px-4 py-2.5 font-medium text-white">+ Ajouter</button>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800">Liste des machines</h2>
            <div className="flex flex-col gap-2 sm:flex-row"><SearchInput value={searchTerm} onChange={(value) => { setSearchTerm(value); setPage(1); }} placeholder="Rechercher une machine..." label="Rechercher une machine" /><button type="button" onClick={fetchData} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">Rafraîchir</button></div>
          </div>
          {loading ? <p className="text-slate-500">Chargement des machines...</p> : error ? <p className="font-medium text-red-600">{error}</p> : machines.length === 0 ? <p className="text-slate-500">Aucune machine n'est enregistrée pour le moment.</p> : filteredMachines.length === 0 ? <p className="text-slate-500">Aucune machine ne correspond à votre recherche.</p> : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-200 text-slate-500"><tr><th className="pb-3 pr-4 font-medium">Référence</th><th className="pb-3 pr-4 font-medium">Marque / Modèle</th><th className="pb-3 pr-4 font-medium">État</th><th className="pb-3 pr-4 font-medium">Demandes associées</th><th className="pb-3 pr-4 font-medium">Client</th><th className="pb-3 font-medium">Action</th></tr></thead>
                  <tbody>{filteredMachines.map((machine) => { const machineDemandes = demandes.filter((demande) => demande.machine?.idMachine === machine.idMachine); return <tr key={machine.idMachine} className="border-b border-slate-100 last:border-none"><td className="py-3 pr-4 text-slate-700">{machine.reference}</td><td className="py-3 pr-4 text-slate-700">{machine.marque} {machine.modele}</td><td className="py-3 pr-4"><StatusBadge status={machine.etat} /></td><td className="max-w-xs py-3 pr-4 text-slate-700">{machineDemandes.length ? machineDemandes.map((demande) => <p key={demande.idDemande}>{demande.reference}: {demande.description}</p>) : machine.etat === 'EN_PANNE' ? 'Aucune demande associée' : 'Aucune demande'}</td><td className="py-3 pr-4 text-slate-700">{machine.client?.prenom} {machine.client?.nom}</td><td className="py-3"><div className="flex gap-2"><button type="button" onClick={() => { setEditingMachine(machine); setFormData({ marqueModele: machine.marque || '', etat: machine.etat || '', clientId: String(machine.client?.idClient || '') }); setIsModalOpen(true); }} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700">Modifier</button><button type="button" onClick={() => setDeletingMachine(machine)} className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600">Supprimer</button></div></td></tr>; })}</tbody>
              </table>
              <Pagination page={Math.min(page, Math.max(totalPages, 1))} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </section>
      </div>
      <MachineModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingMachine(null); }} formData={formData} clients={clients} onChange={handleChange} onSubmit={handleSubmit} submitting={submitting} editing={Boolean(editingMachine)} />
      <ConfirmDialog isOpen={Boolean(deletingMachine)} title="Supprimer cette machine ?" message={deletingMachine ? `Cette action supprimera ${deletingMachine.reference}.` : ''} onCancel={() => setDeletingMachine(null)} onConfirm={confirmDelete} submitting={deleting} />
    </main>
  );
}