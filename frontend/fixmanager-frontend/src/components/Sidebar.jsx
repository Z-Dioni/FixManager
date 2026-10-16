// Liste des sections principales du menu lateral.
// Cela permet de garder une navigation simple et facilement extensible pour les pages du projet.
const menuItems = [
  'Dashboard',
  'Clients',
  'Machines',
  'Utilisateurs',
  'Demandes',
  'Interventions',
  'Devis',
  'Factures',
];

/**
 * Sidebar principale de l'application.
 * Elle donne la structure de navigation de base pour les modules de gestion.
 */
export default function Sidebar({ activePage, setActivePage, onLogout }) {
  return (
    <aside className="w-full bg-[#1f2b34] p-5 text-white lg:w-65 lg:p-6">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d53c54] text-lg font-bold">
          F
        </div>
        <div>
          <div className="text-xl font-bold tracking-tight">FixManager</div>
        </div>
      </div>

      <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:space-y-2 lg:overflow-visible lg:pb-0">
        {menuItems.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setActivePage(item)}
            aria-current={activePage === item ? 'page' : undefined}
            className={`flex w-auto shrink-0 items-center whitespace-nowrap rounded-xl px-4 py-3 text-left text-sm font-medium transition lg:w-full ${
              activePage === item
                ? 'bg-[#d53c54] text-white shadow-lg shadow-[#d53c54]/30'
                : 'bg-transparent text-slate-300 hover:bg-[#2a3944] hover:text-white'
            }`}
          >
            {item}
          </button>
        ))}
      </nav>
      <button type="button" onClick={onLogout} className="mt-8 w-full rounded-xl border border-slate-600 px-4 py-3 text-left text-sm font-medium text-slate-300 transition hover:bg-[#2a3944] hover:text-white">
        Se déconnecter
      </button>
    </aside>
  );
}
