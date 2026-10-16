/**
 * Composant de carte statistique utilise pour afficher des indicateurs rapides.
 * Il sert a synthetiser les chiffres d'un tableau de bord de gestion.
 */
export default function StatCard({ label, value, accent = 'rose' }) {
  // Palette de couleurs associee a chaque type de statistique.
  const palette = {
    rose: 'border-l-[#d53c54] bg-[#d53c54]/5',
    slate: 'border-l-[#3d5361] bg-[#3d5361]/5',
    mint: 'border-l-[#c3d8d2] bg-[#c3d8d2]/20',
    sand: 'border-l-[#e7e3dc] bg-[#e7e3dc]/60',
  };

  return (
    <div className={`rounded-2xl border border-slate-200 border-l-4 bg-white p-5 shadow-sm ${palette[accent]}`}>
      <div className="text-sm font-medium text-slate-500">{label}</div>
      <div className="mt-3 text-3xl font-bold text-slate-800">{value}</div>
    </div>
  );
}
