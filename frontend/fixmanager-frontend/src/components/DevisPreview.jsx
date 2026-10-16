import StatusBadge from './StatusBadge';

const formatCfa = (value) => `${Number(value || 0).toLocaleString('fr-FR')} FCFA`;

const formatDate = (value) => (value ? new Date(value).toLocaleDateString('fr-FR') : '-');

export default function DevisPreview({ devis, onClose, onStatusChange, statusUpdating = false }) {
  if (!devis) return null;

  const client = devis.demande?.machine?.client;
  const machine = devis.demande?.machine;

  return (
    <div className="devis-overlay fixed inset-0 z-50 overflow-y-auto bg-[#17232b]/70 p-4 backdrop-blur-sm print:static print:overflow-visible print:bg-white print:p-0">
      <article className="devis-paper mx-auto my-6 flex min-h-[297mm] w-full max-w-[210mm] flex-col bg-white px-[18mm] py-[16mm] text-[#202a30] shadow-2xl print:m-0 print:min-h-0 print:max-w-none print:shadow-none">
        <header className="flex items-start justify-between border-b-2 border-[#d53c54] pb-7">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center bg-[#1f2b34] text-xl font-bold text-white">F</div>
              <div><p className="text-xl font-bold tracking-tight text-[#1f2b34]">FixManager</p><p className="text-[10px] uppercase tracking-[0.2em] text-[#d53c54]">Maintenance & réparation</p></div>
            </div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Proposition commerciale</p>
            <h2 className="mt-2 text-4xl font-bold tracking-tight text-[#1f2b34]">DEVIS</h2>
            <div className="mt-3"><StatusBadge status={devis.statut} /></div>
          </div>
          <div className="text-right text-sm">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Référence</p>
            <p className="mt-1 text-2xl font-bold text-[#d53c54]">{devis.reference}</p>
            <p className="mt-4 text-slate-500">Date d'émission</p>
            <p className="font-semibold">{formatDate(devis.dateDevis)}</p>
          </div>
        </header>

        <section className="mt-8 grid grid-cols-2 gap-5">
          <div className="border border-slate-200 p-5"><p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#d53c54]">Émis par</p><p className="font-bold text-[#1f2b34]">FixManager</p><p className="mt-1 text-sm text-slate-500">Service de maintenance informatique</p><p className="mt-3 text-sm text-slate-600">Réparation, diagnostic et suivi technique</p></div>
          <div className="border border-slate-200 p-5"><p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#d53c54]">Client</p><p className="font-bold text-[#1f2b34]">{client?.prenom} {client?.nom}</p><p className="mt-1 text-sm text-slate-600">{client?.email || 'Email non renseigné'}</p><p className="text-sm text-slate-600">{client?.telephone || 'Téléphone non renseigné'}</p><p className="mt-2 text-sm text-slate-500">{client?.adresse || 'Adresse non renseignée'}</p></div>
        </section>

        <section className="mt-7 border border-slate-200">
          <div className="grid grid-cols-2 border-b border-slate-200 bg-[#f5f7f7] px-5 py-3 text-xs"><p><span className="font-bold text-[#1f2b34]">Demande :</span> {devis.demande?.reference}</p><p className="text-right"><span className="font-bold text-[#1f2b34]">Validité :</span> jusqu'au {formatDate(devis.dateValidite)}</p></div>
          <div className="px-5 py-4 text-sm"><p className="font-bold text-[#1f2b34]">Machine concernée</p><p className="mt-1 text-slate-600">{machine?.reference || '-'} · {machine?.marque || ''} {machine?.modele || ''}</p></div>
        </section>

        <section className="mt-8 flex-1">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#1f2b34]">Détail des prestations</h3>
          <table className="w-full border-collapse text-sm"><thead><tr className="border-y-2 border-[#1f2b34] bg-[#1f2b34] text-left text-white"><th className="px-4 py-3 font-semibold">Désignation</th><th className="w-20 px-4 py-3 text-right font-semibold">Qté</th><th className="w-36 px-4 py-3 text-right font-semibold">Prix unitaire</th><th className="w-36 px-4 py-3 text-right font-semibold">Montant</th></tr></thead><tbody>{devis.lignes?.map((ligne) => <tr key={ligne.idLigneDevis} className="border-b border-slate-200"><td className="px-4 py-4 font-medium">{ligne.designation}</td><td className="px-4 py-4 text-right">{ligne.quantite}</td><td className="px-4 py-4 text-right">{formatCfa(ligne.prixUnitaire)}</td><td className="px-4 py-4 text-right font-semibold">{formatCfa(ligne.total)}</td></tr>)}</tbody></table>
        </section>

        <section className="mt-8 flex justify-end"><div className="w-80 border-t-2 border-[#1f2b34] pt-4"><div className="flex items-center justify-between text-lg font-bold text-[#1f2b34]"><span>Total TTC</span><span className="text-[#d53c54]">{formatCfa(devis.total)}</span></div><p className="mt-2 text-right text-xs text-slate-500">Montant exprimé en francs CFA</p></div></section>

        <footer className="mt-auto border-t border-slate-200 pt-7 text-xs text-slate-500"><p className="font-semibold text-[#1f2b34]">Conditions de validation</p><p className="mt-2 max-w-xl leading-5">Les travaux de réparation ou le remplacement de pièces débuteront après acceptation du présent devis par le client. Ce devis est valable jusqu'à la date indiquée ci-dessus.</p><div className="mt-10 grid grid-cols-2 gap-16 text-center text-slate-400"><div className="border-t border-slate-300 pt-2">Signature FixManager</div><div className="border-t border-slate-300 pt-2">Signature du client, précédée de la mention « Bon pour accord »</div></div></footer>

        <div className="devis-actions mt-8 flex flex-wrap justify-end gap-3 print:hidden"><button type="button" onClick={() => window.print()} className="rounded-lg bg-[#1f2b34] px-4 py-2.5 text-sm font-semibold text-white">Imprimer / PDF</button><button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700">Fermer</button></div>
        {devis.statut === 'BROUILLON' && (
          <div className="devis-actions mt-3 flex justify-end border-t border-slate-200 pt-4 print:hidden">
            <button type="button" disabled={statusUpdating} onClick={() => onStatusChange(devis.idDevis, 'ENVOYE')} className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-60">
              {statusUpdating ? 'Mise à jour...' : 'Marquer envoyé'}
            </button>
          </div>
        )}
        {devis.statut === 'ENVOYE' && (
          <div className="devis-actions mt-3 flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-4 print:hidden">
            <button type="button" disabled={statusUpdating} onClick={() => onStatusChange(devis.idDevis, 'ACCEPTE')} className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">Client accepte</button>
            <button type="button" disabled={statusUpdating} onClick={() => onStatusChange(devis.idDevis, 'REFUSE')} className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">Client refuse</button>
          </div>
        )}
      </article>
    </div>
  );
}
