// Composant modal utilise pour creer un client.
// Il centralise le formulaire de saisie et l'envoi vers l'API backend.
export default function ClientModal({ isOpen, onClose, formData, onChange, onSubmit, submitting, editing }) {
  // Si le modal n'est pas ouvert, on ne rend rien pour eviter un bloc inutile dans le DOM.
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d53c54]">
              Client
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-800">{editing ? 'Modifier le client' : 'Ajouter un client'}</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-100 px-3 py-1 text-lg text-slate-600 transition hover:bg-slate-200"
            aria-label="Fermer la modal"
          >
            ×
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Prénom</span>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={onChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none transition focus:border-[#d53c54] focus:bg-white"
                placeholder="Jean"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Nom</span>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={onChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none transition focus:border-[#d53c54] focus:bg-white"
                placeholder="Dupont"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Téléphone</span>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={onChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none transition focus:border-[#d53c54] focus:bg-white"
                placeholder="0601020304"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none transition focus:border-[#d53c54] focus:bg-white"
                placeholder="jean.dupont@email.com"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Adresse</span>
            <textarea
              name="adresse"
              value={formData.adresse}
              onChange={onChange}
              rows="3"
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none transition focus:border-[#d53c54] focus:bg-white"
              placeholder="12 rue de la République, Paris"
            />
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-[#d53c54] px-4 py-2.5 font-medium text-white transition hover:bg-[#b53248] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? 'Enregistrement...' : editing ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
