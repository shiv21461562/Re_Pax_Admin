import { useState, useEffect } from "react";
import { getBrochureLeads, deleteContact } from "../services/EnquiriesApi";
import { FiSearch, FiTrash2 } from "react-icons/fi";

function BrochureDownloads() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [progress, setProgress] = useState(0);
  const [downloads, setDownloads] = useState([]);

  const fetchBrochureLeads = async () => {
    try {
      const response = await getBrochureLeads();
      if (response.success) {
        setDownloads(response.data);
      }
    } catch (error) {
      console.error("Error fetching brochure leads:", error);
      showToast("Failed to load brochure downloads", "error");
    }
  };

  useEffect(() => {
    fetchBrochureLeads();
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 30);

      const timeout = setTimeout(() => {
        setToast(null);
        setProgress(0);
      }, 3000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [toast]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleDelete = (id, name) => {
    setDeleteTarget({ id, name });
    setShowDeleteModal(true);
  };

  const handleDeleteDownload = async (id) => {
    try {
      const response = await deleteContact(id);
      
      if (response.success) {
        setDownloads((prev) => prev.filter((item) => item.id !== id));
        showToast("Download record deleted successfully!", "success");
      }
    } catch (error) {
      console.error("Error deleting brochure lead:", error);
      showToast("Failed to delete record", "error");
    }
    
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredDownloads = downloads.filter(
    (item) =>
      item.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      item.email?.toLowerCase().includes(search.toLowerCase()) ||
      item.phone?.toLowerCase().includes(search.toLowerCase()) ||
      item.subject?.toLowerCase().includes(search.toLowerCase()) ||
      item.message?.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDownloads.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredDownloads.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Calculate stats
  const totalDownloads = downloads.length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-white rounded-2xl shadow-2xl p-4 min-w-[320px] max-w-md relative overflow-hidden">
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  toast.type === "success" ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {toast.type === "success" ? "✅" : "❌"}
              </div>
              <div className="flex-1">
                <p
                  className={`font-semibold ${
                    toast.type === "success" ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {toast.type === "success" ? "Success!" : "Error!"}
                </p>
                <p className="text-slate-600 text-sm">{toast.message}</p>
              </div>
              <button
                onClick={() => {
                  setToast(null);
                  setProgress(0);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
              <div
                className={`h-full transition-all duration-100 ${
                  toast.type === "success" ? "bg-green-500" : "bg-red-500"
                }`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 min-w-[320px] max-w-md">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-800">
                  Delete Record?
                </h3>
                <p className="text-slate-600 text-sm mt-1">
                  Are you sure you want to delete{" "}
                  <strong className="text-slate-800">
                    {deleteTarget.name}
                  </strong>
                  's download record?
                </p>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleDeleteDownload(deleteTarget.id)}
                    className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl transition font-medium text-sm"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeleteTarget(null);
                    }}
                    className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded-xl transition font-medium text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Brochure Downloads
          </h1>
          <p className="mt-1 text-slate-500">
            Track all brochure download records
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Downloads
              </p>
              <h3 className="mt-2 text-4xl font-bold text-slate-900">
                {totalDownloads}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {/* Top Filters */}
        <div className="flex flex-col gap-4 border-b p-6 lg:flex-row">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search downloads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 py-3 pl-12 pr-4 outline-none focus:border-orange-500"
            />
          </div>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded-2xl border border-slate-200 px-5 py-3 outline-none focus:border-orange-500"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-8 py-5 text-left text-sm font-semibold uppercase text-slate-700">
                  User
                </th>
                <th className="px-8 py-5 text-left text-sm font-semibold uppercase text-slate-700">
                  Phone
                </th>
                <th className="px-8 py-5 text-left text-sm font-semibold uppercase text-slate-700">
                  Subject
                </th>
                <th className="px-8 py-5 text-left text-sm font-semibold uppercase text-slate-700">
                  Message
                </th>
                <th className="px-8 py-5 text-left text-sm font-semibold uppercase text-slate-700">
                  Date
                </th>
                <th className="px-8 py-5 text-center text-sm font-semibold uppercase text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-slate-100 hover:bg-slate-50 transition"
                  >
                    <td className="px-8 py-6">
                      <div>
                        <h4 className="font-semibold text-slate-900">
                          {item.full_name || "-"}
                        </h4>
                        <p className="text-sm text-slate-500">{item.email || "-"}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-slate-600">
                      {item.phone || "-"}
                    </td>
                    <td className="px-8 py-6">
                      <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                        {item.subject || "Brochure Download"}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-slate-600 text-sm">
                        {item.message || "-"}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-slate-600">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleDelete(item.id, item.full_name)}
                          className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white transition font-medium text-sm shadow-sm hover:shadow-md flex items-center gap-2"
                        >
                          <FiTrash2 className="text-sm" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-slate-500">
                    {search
                      ? "No downloads found matching your search"
                      : "No downloads yet"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {filteredDownloads.length > 0 && (
          <div className="flex flex-col items-center justify-between gap-4 border-t p-5 lg:flex-row">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {indexOfFirstItem + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-700">
                {Math.min(indexOfLastItem, filteredDownloads.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {filteredDownloads.length}
              </span>{" "}
              entries
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  currentPage === 1
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
              >
                ← Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                      currentPage === number
                        ? "bg-orange-500 text-white"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    {number}
                  </button>
                )
              )}
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  currentPage === totalPages
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
        .animate-scale-in {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}

export default BrochureDownloads;