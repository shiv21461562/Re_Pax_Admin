import { useState, useEffect, useRef } from "react";
import {
  FiSearch,
  FiTrash2,
  FiLoader,
  FiAlertTriangle,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiUser,
  FiBriefcase,
  FiMail,
  FiPhone,
  FiMapPin,
  FiGlobe,
  FiFileText,
  FiTag,
  FiCalendar,
} from "react-icons/fi";
import {
  getRegistrations,
  deleteRegistration,
} from "../services/RegistrationApi";

import { FiDownload } from "react-icons/fi";
import { exportRegistrationExcel } from "../utils/exportExcel";

const ROWS_PER_PAGE = 8;

const Registration = () => {
  const [search, setSearch] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmItem, setConfirmItem] = useState(null);
  const [deleteProgress, setDeleteProgress] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const progressTimer = useRef(null);

  useEffect(() => {
    fetchRegistrations();
    return () => clearInterval(progressTimer.current);
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getRegistrations();
      if (response.success) {
        setRegistrations(response.data || []);
      } else {
        setError(response.message || "Failed to fetch registrations");
        setRegistrations([]);
      }
    } catch (err) {
      console.error("Error fetching registrations:", err);
      setError(err.message || "An error occurred while fetching data");
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  };

  const askDelete = (item) => setConfirmItem(item);
  const cancelDelete = () => setConfirmItem(null);

  const confirmDelete = async () => {
    if (!confirmItem) return;
    const item = confirmItem;
    setConfirmItem(null);
    setDeletingId(item.id);
    setDeleteProgress(1);

    clearInterval(progressTimer.current);
    progressTimer.current = setInterval(() => {
      setDeleteProgress((prev) => {
        if (prev === null) return null;
        if (prev >= 90) return prev;
        return prev + Math.floor(Math.random() * 8) + 3;
      });
    }, 120);

    try {
      await deleteRegistration(item.id);
      clearInterval(progressTimer.current);
      setDeleteProgress(100);
      await fetchRegistrations();
    } catch (err) {
      console.error("Error deleting registration:", err);
      clearInterval(progressTimer.current);
      setDeleteProgress(null);
      setDeletingId(null);
      alert("Failed to delete registration. Please try again.");
      return;
    }

    setTimeout(() => {
      setDeleteProgress(null);
      setDeletingId(null);
    }, 500);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const filteredData = registrations.filter(
    (item) =>
      item.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      item.email?.toLowerCase().includes(search.toLowerCase()) ||
      item.company_name?.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / ROWS_PER_PAGE),
  );
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * ROWS_PER_PAGE;
  const pageData = filteredData.slice(startIdx, startIdx + ROWS_PER_PAGE);

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setCurrentPage(p);
  };

  const getCategoryText = (index) => {
    const categories = [
      "Delegate",
      "Speaker",
      "Visitor",
      "Sponsor",
      "Delegate",
      "Delegate",
    ];
    return categories[index % categories.length];
  };

  const getCategoryBadge = (index) => {
    const map = {
      Delegate: "bg-indigo-100 text-indigo-700",
      Speaker: "bg-purple-100 text-purple-700",
      Visitor: "bg-blue-100 text-blue-700",
      Sponsor: "bg-pink-100 text-pink-700",
    };
    return map[getCategoryText(index)] || "bg-gray-100 text-gray-700";
  };

  // Mobile Card Component
  const RegistrationCard = ({ item, index }) => {
    const globalIndex = startIdx + index;
    const isDeleting = deletingId === item.id;

    return (
      <div
        className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-3 ${
          isDeleting ? "opacity-50" : ""
        }`}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-400">
              #{globalIndex + 1}
            </span>
            <h3 className="font-semibold text-gray-800 text-sm">
              {item.full_name || "N/A"}
            </h3>
          </div>
          <button
            onClick={() => askDelete(item)}
            disabled={deleteProgress !== null}
            className="bg-red-50 p-2 rounded-xl hover:bg-red-100 transition disabled:opacity-40"
          >
            <FiTrash2 className="text-red-600 text-sm" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <FiBriefcase className="text-gray-400" />
            <span className="text-gray-600 truncate">
              {item.company_name || "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FiUser className="text-gray-400" />
            <span className="text-gray-600 truncate">
              {item.designation || "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FiMail className="text-gray-400" />
            <span className="text-gray-600 truncate">
              {item.email || "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FiPhone className="text-gray-400" />
            <span className="text-gray-600">{item.phone || "N/A"}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiMapPin className="text-gray-400" />
            <span className="text-gray-600">{item.city || "N/A"}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiGlobe className="text-gray-400" />
            <span className="text-gray-600">{item.country || "N/A"}</span>
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <FiFileText className="text-gray-400" />
            <span className="text-gray-600 font-mono text-xs">
              {item.gst_number || "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FiTag className="text-gray-400" />
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryBadge(
                globalIndex,
              )}`}
            >
              {getCategoryText(globalIndex)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FiCalendar className="text-gray-400" />
            <span className="text-gray-600">{formatDate(item.created_at)}</span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="animate-spin text-orange-600 text-4xl mx-auto mb-4" />
          <p className="text-gray-600">Loading registrations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-8 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
          <FiAlertTriangle className="text-red-500 text-4xl mx-auto mb-4" />
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={fetchRegistrations}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-xl transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 bg-gray-100 min-h-screen relative">
      {/* Confirmation Popup */}
      {confirmItem && (
        <div className="fixed top-4 right-4 z-50 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 animate-[fadeIn_0.15s_ease-out]">
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="bg-red-100 p-2 rounded-full">
                <FiAlertTriangle className="text-red-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-sm">
                  Delete registration?
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {confirmItem.full_name || "This entry"} will be removed.
                </p>
              </div>
              <button
                onClick={cancelDelete}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX />
              </button>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={cancelDelete}
                className="flex-1 text-sm py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 text-sm py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress Popup */}
      {deleteProgress !== null && (
        <div className="fixed top-4 right-4 z-50 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4">
          <p className="text-sm font-semibold text-gray-800 mb-1">
            Deleting registration…
          </p>
          <p className="text-xs text-gray-400 mb-3">Please wait a moment.</p>
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-150"
              style={{ width: `${Math.min(deleteProgress, 100)}%` }}
            />
          </div>
          <div className="mt-1 text-right text-xs font-mono text-gray-400">
            {Math.min(deleteProgress, 100)}%
          </div>
        </div>
      )}

      {/* Header with Circle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div className="flex items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
            Registration Management
          </h1>
        </div>
        <button
          onClick={() => exportRegistrationExcel(registrations)}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg shadow-md transition duration-200"
        >
          <FiDownload size={18} />
          Export Excel
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-white rounded-3xl shadow-lg border border-gray-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-orange-600 text-white text-sm font-semibold">
              <tr>
                <th className="px-4 py-3.5 border-r border-orange-400/40">#</th>
                <th className="px-4 py-3.5 border-r border-orange-400/40">
                  Full Name
                </th>
                <th className="px-4 py-3.5 border-r border-orange-400/40">
                  Company
                </th>
                <th className="px-4 py-3.5 border-r border-orange-400/40">
                  Designation
                </th>
                <th className="px-4 py-3.5 border-r border-orange-400/40">
                  Email
                </th>
                <th className="px-4 py-3.5 border-r border-orange-400/40">
                  Phone
                </th>
                <th className="px-4 py-3.5 border-r border-orange-400/40">
                  City
                </th>
                <th className="px-4 py-3.5 border-r border-orange-400/40">
                  Country
                </th>
                <th className="px-4 py-3.5 border-r border-orange-400/40">
                  GST
                </th>
                <th className="px-4 py-3.5 border-r border-orange-400/40">
                  Category
                </th>
                <th className="px-4 py-3.5 border-r border-orange-400/40">
                  Date
                </th>
                <th className="px-4 py-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan="12" className="text-center py-12 text-gray-400">
                    {search
                      ? "No matching registrations found"
                      : "No registrations available"}
                  </td>
                </tr>
              ) : (
                pageData.map((item, idx) => {
                  const globalIndex = startIdx + idx;
                  const isDeleting = deletingId === item.id;
                  return (
                    <tr
                      key={item.id || globalIndex}
                      className={`hover:bg-gray-50/70 transition ${
                        isDeleting ? "opacity-40" : ""
                      }`}
                    >
                      <td className="px-4 py-3.5 text-xs text-gray-500">
                        {globalIndex + 1}
                      </td>
                      <td className="px-4 py-3.5 font-medium text-gray-800 text-sm">
                        <span className="block max-w-[120px] truncate">
                          {item.full_name || "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-700 text-sm">
                        <span className="block max-w-[120px] truncate">
                          {item.company_name || "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-700 text-sm">
                        <span className="block max-w-[100px] truncate">
                          {item.designation || "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-600 text-sm">
                        <span className="block max-w-[150px] truncate">
                          {item.email || "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-700 text-sm">
                        {item.phone || "N/A"}
                      </td>
                      <td className="px-4 py-3.5 text-gray-700 text-sm">
                        {item.city || "N/A"}
                      </td>
                      <td className="px-4 py-3.5 text-gray-700 text-sm">
                        {item.country || "N/A"}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-xs text-gray-500">
                        {item.gst_number || "N/A"}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryBadge(
                            globalIndex,
                          )}`}
                        >
                          {getCategoryText(globalIndex)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-gray-500">
                        {formatDate(item.created_at)}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <button
                          onClick={() => askDelete(item)}
                          disabled={deleteProgress !== null}
                          className="bg-red-50 p-2 rounded-xl hover:bg-red-100 transition disabled:opacity-40"
                        >
                          <FiTrash2 className="text-red-600" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden">
        {pageData.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-400">
              {search
                ? "No matching registrations found"
                : "No registrations available"}
            </p>
          </div>
        ) : (
          pageData.map((item, idx) => (
            <RegistrationCard key={item.id || idx} item={item} index={idx} />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="mt-5 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
          Showing{" "}
          {filteredData.length > 0
            ? `${startIdx + 1} to ${Math.min(
                startIdx + ROWS_PER_PAGE,
                filteredData.length,
              )}`
            : "0"}{" "}
          of {filteredData.length} entries
          <span className="text-gray-400 block sm:inline sm:ml-2">
            · Total: {registrations.length} registrations
          </span>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1 flex-wrap justify-center">
            <button
              onClick={() => goToPage(safePage - 1)}
              disabled={safePage === 1}
              className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <FiChevronLeft />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 || p === totalPages || Math.abs(p - safePage) <= 1,
              )
              .reduce((acc, p, i, arr) => {
                if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span
                    key={`dots-${i}`}
                    className="px-2 text-gray-400 text-sm"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    className={`min-w-[2.25rem] px-2 py-1.5 rounded-xl text-sm font-medium transition border ${
                      p === safePage
                        ? "bg-orange-600 text-white border-orange-600"
                        : "border-gray-200 text-gray-600 hover:bg-white"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}

            <button
              onClick={() => goToPage(safePage + 1)}
              disabled={safePage === totalPages}
              className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <FiChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Registration;
