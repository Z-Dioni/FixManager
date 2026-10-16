const statusStyles = {
  NOUVELLE: 'bg-sky-50 text-sky-700 ring-sky-200',
  BROUILLON: 'bg-slate-100 text-slate-700 ring-slate-200',
  ENVOYE: 'bg-cyan-50 text-cyan-700 ring-cyan-200',
  ACTIVE: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  EN_PANNE: 'bg-red-50 text-red-700 ring-red-200',
  MAINTENANCE: 'bg-amber-50 text-amber-700 ring-amber-200',
  EN_COURS: 'bg-amber-50 text-amber-700 ring-amber-200',
  TERMINEE: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  TRAITEE: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  ACCEPTE: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  REFUSE: 'bg-red-50 text-red-700 ring-red-200',
  ANNULEE: 'bg-red-50 text-red-700 ring-red-200',
  A_PAYER: 'bg-amber-50 text-amber-700 ring-amber-200',
  PARTIELLEMENT_PAYEE: 'bg-orange-50 text-orange-700 ring-orange-200',
  PAYEE: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
};

const statusLabels = {
  NOUVELLE: 'Nouvelle',
  BROUILLON: 'Brouillon',
  ENVOYE: 'Envoyé',
  ACTIVE: 'Active',
  EN_PANNE: 'En panne',
  MAINTENANCE: 'En maintenance',
  EN_COURS: 'En cours',
  TERMINEE: 'Terminée',
  TRAITEE: 'Traitée',
  ACCEPTE: 'Accepté',
  REFUSE: 'Refusé',
  ANNULEE: 'Annulée',
  A_PAYER: 'À payer',
  PARTIELLEMENT_PAYEE: 'Partiellement payée',
  PAYEE: 'Payée',
};

export default function StatusBadge({ status }) {
  if (!status) return <span className="text-slate-400">Non renseigné</span>;

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[status] || 'bg-slate-100 text-slate-700 ring-slate-200'}`}>
      {statusLabels[status] || status.replaceAll('_', ' ')}
    </span>
  );
}
