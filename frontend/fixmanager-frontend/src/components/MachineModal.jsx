export default function MachineModal({ isOpen, onClose, formData, clients, onChange, onSubmit, submitting, editing }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d53c54]">Machine</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-800">{editing ? 'Modifier la machine' : 'Ajouter une machine'}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full bg-slate-100 px-3 py-1 text-lg text-slate-600" aria-label="Fermer la modal">
            ×
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ['marqueModele', 'Marque / Modèle', 'Dell Latitude 5420'],
            ].map(([name, label, placeholder]) => (
              <label key={name} className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
                <input
                  type="text"
                  name={name}
                  value={formData[name]}
                  onChange={onChange}
                  required
                  placeholder={placeholder}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none focus:border-[#d53c54] focus:bg-white"
                />
              </label>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">État</span>
              <select name="etat" value={formData.etat} onChange={onChange} required className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none focus:border-[#d53c54] focus:bg-white">
                <option value="">Sélectionner un état</option>
                <option value="ACTIVE">Active</option>
                <option value="EN_PANNE">En panne</option>
                <option value="MAINTENANCE">En maintenance</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Client</span>
              <select name="clientId" value={formData.clientId} onChange={onChange} required className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none focus:border-[#d53c54] focus:bg-white">
                <option value="">Sélectionner un client</option>
                {clients.map((client) => (
                  <option key={client.idClient} value={client.idClient}>{client.prenom} {client.nom}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-medium text-slate-700">Annuler</button>
            <button type="submit" disabled={submitting || clients.length === 0} className="rounded-xl bg-[#d53c54] px-4 py-2.5 font-medium text-white disabled:cursor-not-allowed disabled:opacity-70">
              {submitting ? 'Enregistrement...' : editing ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}