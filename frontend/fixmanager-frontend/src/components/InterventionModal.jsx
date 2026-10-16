export default function InterventionModal({ isOpen, onClose, formData, demandes, onChange, onSubmit, submitting, editing }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d53c54]">Intervention</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-800">{editing ? 'Modifier l’intervention' : 'Créer une intervention'}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full bg-slate-100 px-3 py-1 text-lg text-slate-600" aria-label="Fermer la modal">×</button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Demande concernée</span>
            <select name="demandeId" value={formData.demandeId} onChange={onChange} required className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none focus:border-[#d53c54] focus:bg-white">
              <option value="">Sélectionner une demande</option>
              {demandes.map((demande) => <option key={demande.idDemande} value={demande.idDemande}>{demande.reference} - {demande.description}</option>)}
            </select>
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">Diagnostic</span><textarea name="diagnostic" value={formData.diagnostic} onChange={onChange} rows="3" placeholder="Résultat du diagnostic..." className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none focus:border-[#d53c54] focus:bg-white" /></label>
            <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">Cause de la panne</span><textarea name="causePanne" value={formData.causePanne} onChange={onChange} rows="3" placeholder="Origine du problème..." className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none focus:border-[#d53c54] focus:bg-white" /></label>
          </div>

          <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">Travail effectué</span><textarea name="travailEffectue" value={formData.travailEffectue} onChange={onChange} rows="3" placeholder="Actions réalisées sur la machine..." className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none focus:border-[#d53c54] focus:bg-white" /></label>

          <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">Statut</span><select name="statut" value={formData.statut} onChange={onChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none focus:border-[#d53c54] focus:bg-white"><option value="NOUVELLE">Nouvelle</option><option value="EN_COURS">En cours</option><option value="TERMINEE">Terminée</option><option value="ANNULEE">Annulée</option></select></label>

          <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={onClose} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-medium text-slate-700">Annuler</button><button type="submit" disabled={submitting || demandes.length === 0} className="rounded-xl bg-[#d53c54] px-4 py-2.5 font-medium text-white disabled:cursor-not-allowed disabled:opacity-70">{submitting ? 'Enregistrement...' : editing ? 'Modifier' : 'Créer'}</button></div>
        </form>
      </div>
    </div>
  );
}