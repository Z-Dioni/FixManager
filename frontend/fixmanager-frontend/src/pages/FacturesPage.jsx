import { startTransition, useEffect, useState } from "react";
import FactureModal from "../components/FactureModal";
import FacturePreview from "../components/FacturePreview";
import PaiementModal from "../components/PaiementModal";
import Pagination from "../components/Pagination";
import SearchInput from "../components/SearchInput";
import StatusBadge from "../components/StatusBadge";
import { useToast } from "../components/toastContext";
import { createPaiement, getFactures, getInterventions, getUtilisateurs, saveFacture } from "../services/api";
const createEmptyForm = () => ({
  interventionId: "",
  designation: "",
  quantite: "1",
  prixUnitaire: "0",
});
const createEmptyPaymentForm = () => ({ montant: "", modePaiement: "", utilisateurId: "" });
const getTotalPaid = (facture) => (facture.paiements || []).reduce((total, paiement) => total + Number(paiement.montant || 0), 0);
const getRemainingBalance = (facture) => Math.max(0, Number(facture.total || 0) - getTotalPaid(facture));

export default function FacturesPage() {
  const [factures, setFactures] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(createEmptyForm);
  const [editingFacture, setEditingFacture] = useState(null);
  const [selectedFacture, setSelectedFacture] = useState(null);
  const [payingFacture, setPayingFacture] = useState(null);
  const [paymentFormData, setPaymentFormData] = useState(createEmptyPaymentForm);
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("TOUS");
  const { notify } = useToast();
  const pageSize = 10;
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredFactures = factures.filter((facture) => {
    const matchesSearch = [facture.reference, facture.intervention?.reference, facture.statut]
      .some((value) => value?.toLowerCase().includes(normalizedSearch));
    return matchesSearch && (statusFilter === "TOUS" || facture.statut === statusFilter);
  });
  const totalPages = Math.ceil(filteredFactures.length / pageSize);
  const currentPage = Math.min(page, Math.max(totalPages, 1));
  const paginatedFactures = filteredFactures.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const fetchData = async () => {
    try {
      startTransition(() => setLoading(true));
      const [facturesData, interventionsData, utilisateursData] = await Promise.all([
        getFactures(),
        getInterventions(),
        getUtilisateurs(),
      ]);
      const facturesInterventions = new Set(
        facturesData.map((facture) => facture.intervention?.idIntervention),
      );
      startTransition(() => {
        setFactures(facturesData);
        setUtilisateurs(utilisateursData);
        setInterventions(
          interventionsData.filter(
            (intervention) =>
              intervention.statut === "TERMINEE" &&
              !facturesInterventions.has(intervention.idIntervention),
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
  const handlePaymentChange = (event) => {
    const { name, value } = event.target;
    setPaymentFormData((current) => ({ ...current, [name]: value }));
  };
  const handlePaymentSubmit = async (event) => {
    event.preventDefault();
    if (!payingFacture) return;
    const montant = Number(paymentFormData.montant);
    if (montant <= 0 || montant > getRemainingBalance(payingFacture)) {
      notify("Le montant doit être positif et ne pas dépasser le solde restant.", "error");
      return;
    }
    setSubmittingPayment(true);
    try {
      await createPaiement({
        montant,
        modePaiement: paymentFormData.modePaiement,
        facture: { idFacture: payingFacture.idFacture },
        utilisateur: { idUtilisateur: Number(paymentFormData.utilisateurId) },
      });
      setPayingFacture(null);
      setPaymentFormData(createEmptyPaymentForm());
      notify("Paiement enregistré.");
      await fetchData();
    } catch (err) {
      notify(err.message || "Impossible d'enregistrer le paiement.", "error");
    } finally {
      setSubmittingPayment(false);
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await saveFacture(editingFacture?.idFacture, {
        intervention: { idIntervention: Number(formData.interventionId) },
        lignes: [
          {
            designation: formData.designation,
            quantite: Number(formData.quantite),
            prixUnitaire: Number(formData.prixUnitaire),
          },
        ],
      });
      setFormData(createEmptyForm());
      setEditingFacture(null);
      setIsModalOpen(false);
      notify(editingFacture ? "Facture modifiée." : "Facture créée.");
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
              Comptabilité
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-800">
              Factures
            </h1>
          </div>
          <div className="flex flex-col items-start gap-2 md:items-end">
            <button
              type="button"
              onClick={() => {
                setFormData(createEmptyForm());
                setEditingFacture(null);
                setIsModalOpen(true);
              }}
              disabled={interventions.length === 0}
              className="rounded-xl bg-[#d53c54] px-4 py-2.5 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              + Créer
            </button>
            {!loading && !error && interventions.length === 0 && <p className="text-sm text-slate-500">Aucune intervention terminée disponible pour facturation.</p>}
          </div>
        </header>
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-slate-800">
              Liste des factures
            </h2>
            <div className="flex flex-col gap-2 sm:flex-row">
              <SearchInput value={searchTerm} onChange={(value) => { setSearchTerm(value); setPage(1); }} placeholder="Rechercher une facture..." label="Rechercher une facture" />
              <select aria-label="Filtrer les factures par statut" value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                <option value="TOUS">Tous les statuts</option><option value="A_PAYER">À payer</option><option value="PARTIELLEMENT_PAYEE">Partiellement payée</option><option value="PAYEE">Payée</option><option value="ANNULEE">Annulée</option>
              </select>
              <button type="button" onClick={fetchData} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">Rafraîchir</button>
            </div>
          </div>
          {loading ? (
            <p className="text-slate-500">Chargement des factures...</p>
          ) : error ? (
            <p className="font-medium text-red-600">{error}</p>
          ) : factures.length === 0 ? (
            <p className="text-slate-500">
              Aucune facture n'est enregistrée pour le moment.
            </p>
          ) : filteredFactures.length === 0 ? (
            <p className="text-slate-500">Aucune facture ne correspond aux filtres.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="pb-3 pr-4 font-medium">Référence</th>
                    <th className="pb-3 pr-4 font-medium">Intervention</th>
                    <th className="pb-3 pr-4 font-medium">Total</th>
                    <th className="pb-3 pr-4 font-medium">Réglé</th>
                    <th className="pb-3 pr-4 font-medium">Solde</th>
                    <th className="pb-3 pr-4 font-medium">Statut</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedFactures.map((facture) => (
                    <tr
                      key={facture.idFacture}
                      className="border-b border-slate-100 last:border-none"
                    >
                      <td className="py-3 pr-4 text-slate-700">
                        {facture.reference}
                      </td>
                      <td className="py-3 pr-4 text-slate-700">
                        {facture.intervention?.reference}
                      </td>
                      <td className="py-3 pr-4 text-slate-700">
                        {Number(facture.total || 0).toLocaleString("fr-FR")}{" "}
                        FCFA
                      </td>
                      <td className="py-3 pr-4 text-slate-700">
                        {getTotalPaid(facture).toLocaleString("fr-FR")} FCFA
                      </td>
                      <td className="py-3 pr-4 text-slate-700">
                        {getRemainingBalance(facture).toLocaleString("fr-FR")} FCFA
                      </td>
                      <td className="py-3 pr-4 text-slate-700">
                        <StatusBadge status={facture.statut} />
                      </td>
                      <td className="flex gap-2 py-3">
                        <button
                          type="button"
                          onClick={() => setSelectedFacture(facture)}
                          className="rounded-lg bg-[#1f2b34] px-3 py-1.5 text-sm font-medium text-white"
                        >
                          Voir
                        </button>
                        {(facture.statut === "A_PAYER" || facture.statut === "PARTIELLEMENT_PAYEE") && (
                          <button
                            type="button"
                            onClick={() => {
                              setPaymentFormData(createEmptyPaymentForm());
                              setPayingFacture(facture);
                            }}
                            className="rounded-lg border border-emerald-200 px-3 py-1.5 text-sm font-medium text-emerald-700"
                          >
                            Enregistrer un paiement
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            const ligne = facture.lignes?.[0] || {};
                            setEditingFacture(facture);
                            setFormData({
                              interventionId: String(
                                facture.intervention?.idIntervention || "",
                              ),
                              designation: ligne.designation || "",
                              quantite: String(ligne.quantite || 1),
                              prixUnitaire: String(ligne.prixUnitaire || 0),
                            });
                            setIsModalOpen(true);
                          }}
                          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700"
                        >
                          Modifier
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
      <FactureModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingFacture(null);
        }}
        formData={formData}
        interventions={
          interventions.length
            ? interventions
            : editingFacture
              ? [editingFacture.intervention]
              : []
        }
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitting={submitting}
        editing={Boolean(editingFacture)}
      />
      <FacturePreview
        facture={selectedFacture}
        onClose={() => setSelectedFacture(null)}
      />
      <PaiementModal
        isOpen={Boolean(payingFacture)}
        onClose={() => setPayingFacture(null)}
        facture={payingFacture}
        utilisateurs={utilisateurs}
        formData={paymentFormData}
        onChange={handlePaymentChange}
        onSubmit={handlePaymentSubmit}
        submitting={submittingPayment}
      />
    </main>
  );
}
