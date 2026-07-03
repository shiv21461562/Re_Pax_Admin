import { useState, useEffect } from "react";
import { getContacts, deleteContact } from "../services/EnquiriesApi";

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState(null);
  const [progress, setProgress] = useState(0);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

const fetchContacts = async () => {
  try {
    const response = await getContacts();

    console.log("Response:", response);

    if (response.success) {
      console.log("Data:", response.data);
      setContacts(response.data);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
  useEffect(() => {
    fetchContacts();
  }, []);

  // Auto-dismiss toast after 3 seconds with progress bar
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

  const handleDeleteContact = async (id) => {
    try {
      const response = await deleteContact(id);
      if (response.success) {
        setContacts((prev) => prev.filter((item) => item.id !== id));
        showToast("Contact deleted successfully!", "success");
      }
    } catch (error) {
      console.error(error);
      showToast("Failed to delete contact", "error");
    }
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setShowViewModal(true);
  };

  // Filter contacts based on search
  const filteredContacts = contacts.filter(
    (item) =>
      (item.full_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.phone || "").includes(searchTerm) ||
      (item.company_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.city || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.message || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredContacts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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
                  Delete Contact?
                </h3>
                <p className="text-slate-600 text-sm mt-1">
                  Are you sure you want to delete{" "}
                  <strong className="text-slate-800">
                    {deleteTarget.name}
                  </strong>
                  ?
                </p>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleDeleteContact(deleteTarget.id)}
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">Contact Queries</h1>
          <p className="text-slate-500 mt-1">
            Manage website contact form submissions
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-5 py-4 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-4 py-4 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-5 text-sm font-semibold text-slate-600 whitespace-nowrap">
                  Name
                </th>
                <th className="text-left p-5 text-sm font-semibold text-slate-600 whitespace-nowrap">
                  Company
                </th>
                <th className="text-left p-5 text-sm font-semibold text-slate-600 whitespace-nowrap">
                  Designation
                </th>
                <th className="text-left p-5 text-sm font-semibold text-slate-600 whitespace-nowrap">
                  Email
                </th>
                <th className="text-left p-5 text-sm font-semibold text-slate-600 whitespace-nowrap">
                  Phone
                </th>
                <th className="text-left p-5 text-sm font-semibold text-slate-600 whitespace-nowrap">
                  Location
                </th>
                <th className="text-left p-5 text-sm font-semibold text-slate-600 whitespace-nowrap">
                  Purpose
                </th>
                <th className="text-left p-5 text-sm font-semibold text-slate-600 whitespace-nowrap">
                  Message
                </th>
                <th className="text-left p-5 text-sm font-semibold text-slate-600 whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="p-5 font-semibold text-slate-800 whitespace-nowrap">
                      {item.full_name || "-"}
                    </td>
                    <td className="p-5 text-sm text-slate-600 whitespace-nowrap">
                      {item.company_name || "-"}
                    </td>
                    <td className="p-5 text-sm text-slate-600 whitespace-nowrap">
                      {item.designation || "-"}
                    </td>
                    <td className="p-5 text-sm text-slate-600">
                      {item.email || "-"}
                    </td>
                    <td className="p-5 text-sm text-slate-600 whitespace-nowrap">
                      {item.phone || "-"}
                    </td>
                    <td className="p-5 text-sm text-slate-600 whitespace-nowrap">
                      {item.city && item.country ? `${item.city}, ${item.country}` : item.city || item.country || "-"}
                    </td>
                    <td className="p-5 text-sm text-slate-600 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.purpose === "Sponsorship" ? "bg-purple-100 text-purple-700" :
                        item.purpose === "Partnership" ? "bg-blue-100 text-blue-700" :
                        item.purpose === "General" ? "bg-gray-100 text-gray-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {item.purpose || "General"}
                      </span>
                    </td>
                    <td className="p-5 max-w-[200px]">
                      <button
                        onClick={() => handleViewContact(item)}
                        className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition font-medium text-sm shadow-sm hover:shadow-md"
                      >
                        View
                      </button>
                    </td>
                    <td className="p-5 whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(item.id, item.full_name)}
                        className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white transition font-medium text-sm shadow-sm hover:shadow-md"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center p-10 text-slate-500">
                    {searchTerm
                      ? "No contacts found matching your search"
                      : "No contacts added yet"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredContacts.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {indexOfFirstItem + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-700">
                {Math.min(indexOfLastItem, filteredContacts.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {filteredContacts.length}
              </span>{" "}
              entries
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-xl transition font-medium text-sm ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 hover:bg-gray-200 text-slate-700"
                }`}
              >
                ← Previous
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (number) => {
                    if (
                      number === 1 ||
                      number === totalPages ||
                      Math.abs(number - currentPage) <= 1
                    ) {
                      return (
                        <button
                          key={number}
                          onClick={() => paginate(number)}
                          className={`w-10 h-10 rounded-xl transition font-medium text-sm ${
                            currentPage === number
                              ? "bg-blue-500 text-white shadow-md"
                              : "bg-gray-100 hover:bg-gray-200 text-slate-700"
                          }`}
                        >
                          {number}
                        </button>
                      );
                    } else if (number === 2 || number === totalPages - 1) {
                      return (
                        <span
                          key={number}
                          className="w-10 h-10 flex items-center justify-center text-slate-400"
                        >
                          …
                        </span>
                      );
                    }
                    return null;
                  }
                )}
              </div>

              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-xl transition font-medium text-sm ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 hover:bg-gray-200 text-slate-700"
                }`}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

{/* View Message Modal */}
{showViewModal && selectedContact && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
    <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">

      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-[#255B7D] to-[#1d4d69] px-8 py-5">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Contact Message
          </h2>
          <p className="mt-1 text-sm text-white/80">
            Message received from website enquiry form
          </p>
        </div>

        <button
          onClick={() => {
            setShowViewModal(false);
            setSelectedContact(null);
          }}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20"
        >
          ×
        </button>
      </div>

      {/* Body */}
      <div className="bg-slate-100 p-8">

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">
            Message
          </h3>

          <div className="rounded-xl bg-slate-50 p-5 border border-slate-200">
            <p className="whitespace-pre-wrap leading-8 text-slate-700">
              {selectedContact.message || "No message available."}
            </p>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="border-t bg-white px-8 py-5">
        <button
          onClick={() => {
            setShowViewModal(false);
            setSelectedContact(null);
          }}
          className="w-full rounded-xl bg-[#255B7D] py-3 font-semibold text-white transition hover:bg-[#1d4d69]"
        >
          Close
        </button>
      </div>

    </div>
  </div>
)}

      {/* CSS Animation */}
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

  .animate-slide-in {
    animation: slideIn 0.3s ease-out;
  }
`}</style>
    </div>
  );
}

export default Contacts;