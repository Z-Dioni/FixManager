export default function DemandeModal({ isOpen, onClose, formData, machines, utilisateurs, onChange, onSubmit, submitting, editing }) {
  if (!isOpen) {
    return null;
  }

  const selectedMachine = machines.find((machine) => String(machine.idMachine) === formData.machineId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d53c54]">Demande</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-800">{editing ? 'Modifier la demande' : 'Ajouter une demande'}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full bg-slate-100 px-3 py-1 text-lg text-slate-600" aria-label="Fermer la modal">×</button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Machine</span>
              <select name="machineId" value={formData.machineId} onChange={onChange} required className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none focus:border-[#d53c54] focus:bg-white">
                <option value="">Sélectionner une machine</option>
                {machines.map((machine) => <option key={machine.idMachine} value={machine.idMachine}>{machine.reference} - {machine.marque}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Saisi par</span>
              <select name="utilisateurId" value={formData.utilisateurId} onChange={onChange} required className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none focus:border-[#d53c54] focus:bg-white">
                <option value="">Sélectionner un utilisateur</option>
                {utilisateurs.map((utilisateur) => <option key={utilisateur.idUtilisateur} value={utilisateur.idUtilisateur}>{utilisateur.prenom} {utilisateur.nom}</option>)}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Détail de la demande</span>
            <textarea name="description" value={formData.description} onChange={onChange} required rows="4" placeholder="Ex. Diagnostic, réparation ou remplacement du composant..." className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none focus:border-[#d53c54] focus:bg-white" />
            {selectedMachine?.problemeSignale && <p className="mt-2 text-xs text-slate-500">Problème déjà signalé sur la machine : {selectedMachine.problemeSignale}</p>}
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Date souhaitée</span>
            <input type="datetime-local" name="dateSouhaitee" value={formData.dateSouhaitee} onChange={onChange} required className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none focus:border-[#d53c54] focus:bg-white" />
            <p className="mt-2 text-xs text-slate-500">Préremplie avec la date actuelle. Modifiez-la uniquement si nécessaire.</p>
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-medium text-slate-700">Annuler</button>
            <button type="submit" disabled={submitting || machines.length === 0 || utilisateurs.length === 0} className="rounded-xl bg-[#d53c54] px-4 py-2.5 font-medium text-white disabled:cursor-not-allowed disabled:opacity-70">{submitting ? 'Enregistrement...' : editing ? 'Modifier' : 'Ajouter'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}