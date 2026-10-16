export default function PaiementModal({ isOpen, onClose, facture, utilisateurs, formData, onChange, onSubmit, submitting }) {
  if (!isOpen || !facture) return null;
  const totalPaye = (facture.paiements || []).reduce((total, paiement) => total + Number(paiement.montant || 0), 0);
  const soldeRestant = Math.max(0, Number(facture.total || 0) - totalPaye);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d53c54]">Encaissement</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-800">Enregistrer un paiement</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full bg-slate-100 px-3 py-1 text-lg text-slate-600" aria-label="Fermer la modal">×</button>
        </div>
        <div className="mb-5 space-y-1 text-sm text-slate-600"><p>Facture {facture.reference} · Total {Number(facture.total || 0).toLocaleString('fr-FR')} FCFA</p><p>Déjà réglé {totalPaye.toLocaleString('fr-FR')} FCFA · <strong className="text-slate-800">Solde restant {soldeRestant.toLocaleString('fr-FR')} FCFA</strong></p></div>
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">Montant (FCFA)</span><input type="number" name="montant" value={formData.montant} onChange={onChange} min="1" max={soldeRestant} step="1" required className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none focus:border-[#d53c54] focus:bg-white" /></label>
          <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">Mode de paiement</span><select name="modePaiement" value={formData.modePaiement} onChange={onChange} required className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none focus:border-[#d53c54] focus:bg-white"><option value="">Sélectionner un mode</option><option value="ESPECES">Espèces</option><option value="MOBILE_MONEY">Mobile Money</option><option value="VIREMENT">Virement</option><option value="CHEQUE">Chèque</option></select></label>
          <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">Enregistré par</span><select name="utilisateurId" value={formData.utilisateurId} onChange={onChange} required className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none focus:border-[#d53c54] focus:bg-white"><option value="">Sélectionner un utilisateur</option>{utilisateurs.map((utilisateur) => <option key={utilisateur.idUtilisateur} value={utilisateur.idUtilisateur}>{utilisateur.prenom} {utilisateur.nom}</option>)}</select></label>
          <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={onClose} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-medium text-slate-700">Annuler</button><button type="submit" disabled={submitting || utilisateurs.length === 0} className="rounded-xl bg-[#d53c54] px-4 py-2.5 font-medium text-white disabled:cursor-not-allowed disabled:opacity-70">{submitting ? 'Enregistrement...' : 'Enregistrer'}</button></div>
        </form>
      </div>
    </div>
  );
}
