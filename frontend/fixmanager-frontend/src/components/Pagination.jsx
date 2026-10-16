export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <nav className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4" aria-label="Pagination">
      <p className="text-sm text-slate-500">Page {page} sur {totalPages}</p>
      <div className="flex gap-2">
        <button type="button" onClick={() => onPageChange(page - 1)} disabled={page === 1} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">Précédent</button>
        <button type="button" onClick={() => onPageChange(page + 1)} disabled={page === totalPages} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">Suivant</button>
      </div>
    </nav>
  );
}
