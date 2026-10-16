import { startTransition, useEffect, useState } from "react";
import DevisModal from "../components/DevisModal";
import DevisPreview from "../components/DevisPreview";
import Pagination from "../components/Pagination";
import SearchInput from "../components/SearchInput";
import StatusBadge from "../components/StatusBadge";
import { useToast } from "../components/toastContext";
import {
  createDevis,
  getDemandes,
  getDevis,
  updateDevisStatus,
} from "../services/api";
const getDateValidity = () => {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString().slice(0, 10);
};
const createEmptyForm = () => ({
  demandeId: "",
  designation: "",
  quantite: "1",
  prixUnitaire: "0",
  dateValidite: getDateValidity(),
});

export default function DevisPage() {
  const [devis, setDevis] = useState([]);
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(createEmptyForm);
  const [selectedDevis, setSelectedDevis] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("TOUS");
  const { notify } = useToast();
  const pageSize = 10;
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredDevis = devis.filter((item) => {
    const matchesSearch = [item.reference, item.demande?.reference, item.statut]
      .some((value) => value?.toLowerCase().includes(normalizedSearch));
    return matchesSearch && (statusFilter === "TOUS" || item.statut === statusFilter);
  });
  const totalPages = Math.ceil(filteredDevis.length / pageSize);
  const currentPage = Math.min(page, Math.max(totalPages, 1));
  const paginatedDevis = filteredDevis.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const fetchData = async () => {
    try {
      startTransition(() => setLoading(true));
      const [devisData, demandesData] = await Promise.all([
        getDevis(),
        getDemandes(),
      ]);
      const demandesAvecDevis = new Set(
        devisData.map((devisItem) => devisItem.demande?.idDemande),
      );
      startTransition(() => {
        setDevis(devisData);
        setDemandes(
          demandesData.filter(
            (demande) => !demandesAvecDevis.has(demande.idDemande),
          ),
        );
        setError("");
      });
    } catch (err) {
      startTransition(() => setError(err.message || "Erreur lors du chargement"));
    } finally {
      startTransition(() => setLoading(false));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };
  const updateStatus = async (id, statut) => {
    setUpdatingStatus(true);
    try {
      await updateDevisStatus(id, statut);
      notify("Statut du devis mis à jour.");
      setSelectedDevis((current) => (current ? { ...current, statut } : current));
      await fetchData();
    } catch (err) {
      notify(err.message || "Impossible de mettre à jour le statut.", "error");
    } finally {
      setUpdatingStatus(false);
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await createDevis({
        dateValidite: formData.dateValidite,
        demande: { idDemande: Number(formData.demandeId) },
        lignes: [
          {
            designation: formData.designation,
            quantite: Number(formData.quantite),
            prixUnitaire: Number(formData.prixUnitaire),
          },
        ],
      });
      setFormData(createEmptyForm());
      setIsModalOpen(false);
      notify("Devis créé.");
      await fetchData();
    } catch (err) {
      notify(err.message || "Une erreur est survenue.", "error");
      setError(err.message || "Une erreur est survenue");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex-1 bg-[#f4f4f3] p-4 md:p-8 lg:p-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#d53c54]">
              Commercial
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-800">
              Devis
            </h1>
          </div>
          <button
            type="button"
            onClick={() => {
              setFormData(createEmptyForm());
              setIsModalOpen(true);
            }}
            disabled={demandes.length === 0}
            className="rounded-xl bg-[#d53c54] px-4 py-2.5 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            + Créer
          </button>
        </header>
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-slate-800">
              Liste des devis
            </h2>
            <div className="flex flex-col gap-2 sm:flex-row">
              <SearchInput value={searchTerm} onChange={(value) => { setSearchTerm(value); setPage(1); }} placeholder="Rechercher un devis..." label="Rechercher un devis" />
              <select aria-label="Filtrer les devis par statut" value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                <option value="TOUS">Tous les statuts</option><option value="BROUILLON">Brouillon</option><option value="ENVOYE">Envoyé</option><option value="ACCEPTE">Accepté</option><option value="REFUSE">Refusé</option>
              </select>
              <button type="button" onClick={fetchData} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">Rafraîchir</button>
            </div>
          </div>
          {loading ? (
            <p className="text-slate-500">Chargement des devis...</p>
          ) : error ? (
            <p className="font-medium text-red-600">{error}</p>
          ) : devis.length === 0 ? (
            <p className="text-slate-500">
              Aucun devis n'est enregistré pour le moment.
            </p>
          ) : filteredDevis.length === 0 ? (
            <p className="text-slate-500">Aucun devis ne correspond aux filtres.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="pb-3 pr-4 font-medium">Référence</th>
                    <th className="pb-3 pr-4 font-medium">Demande</th>
                    <th className="pb-3 pr-4 font-medium">Total</th>
                    <th className="pb-3 pr-4 font-medium">Validité</th>
                    <th className="pb-3 pr-4 font-medium">Statut</th>
                    <th className="pb-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedDevis.map((devisItem) => (
                    <tr
                      key={devisItem.idDevis}
                      className="border-b border-slate-100 last:border-none"
                    >
                      <td className="py-3 pr-4 text-slate-700">
                        {devisItem.reference}
                      </td>
                      <td className="py-3 pr-4 text-slate-700">
                        {devisItem.demande?.reference}
                      </td>
                      <td className="py-3 pr-4 text-slate-700">
                        {Number(devisItem.total || 0).toLocaleString("fr-FR")}{" "}
                        FCFA
                      </td>
                      <td className="py-3 pr-4 text-slate-700">
                        {devisItem.dateValidite}
                      </td>
                      <td className="py-3 pr-4 text-slate-700">
                        <StatusBadge status={devisItem.statut} />
                      </td>
                      <td className="py-3">
                        <button
                          type="button"
                          onClick={() => setSelectedDevis(devisItem)}
                          className="rounded-lg bg-[#1f2b34] px-3 py-2 text-sm font-medium text-white"
                        >
                          Voir le devis
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </section>
      </div>
      <DevisModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        demandes={demandes}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
      <DevisPreview
        devis={selectedDevis}
        onClose={() => setSelectedDevis(null)}
        onStatusChange={updateStatus}
        statusUpdating={updatingStatus}
      />
    </main>
  );
}
