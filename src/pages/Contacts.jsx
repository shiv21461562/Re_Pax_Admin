import { useState, useEffect } from "react";

function Contacts() {
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      phone: "9876543210",
      message: "Interested in sponsorship opportunities.",
    },
    {
      id: 2,
      name: "Amit Kumar",
      email: "amit@gmail.com",
      phone: "9876541230",
      message: "Need delegate registration details.",
    },
    {
      id: 3,
      name: "Priya Patel",
      email: "priya@gmail.com",
      phone: "9876543211",
      message: "Want to become a speaker at the event.",
    },
    {
      id: 4,
      name: "Vikram Singh",
      email: "vikram@gmail.com",
      phone: "9876543212",
      message: "Looking for partnership opportunities.",
    },
    {
      id: 5,
      name: "Neha Gupta",
      email: "neha@gmail.com",
      phone: "9876543213",
      message: "Interested in exhibition booth.",
    },
    {
      id: 6,
      name: "Rajesh Kumar",
      email: "rajesh@gmail.com",
      phone: "9876543214",
      message: "Need media partnership details.",
    },
    {
      id: 7,
      name: "Pooja Singh",
      email: "pooja@gmail.com",
      phone: "9876543215",
      message: "Want to volunteer at the event.",
    },
    {
      id: 8,
      name: "Ankit Verma",
      email: "ankit@gmail.com",
      phone: "9876543216",
      message: "Looking for startup showcase opportunity.",
    },
    {
      id: 9,
      name: "Meera Reddy",
      email: "meera@gmail.com",
      phone: "9876543217",
      message: "Interested in becoming a community partner.",
    },
    {
      id: 10,
      name: "Suresh Nair",
      email: "suresh@gmail.com",
      phone: "9876543218",
      message: "Need information about ticket pricing.",
    },
    {
      id: 11,
      name: "Kavya Menon",
      email: "kavya@gmail.com",
      phone: "9876543219",
      message: "Want to propose a workshop session.",
    },
    {
      id: 12,
      name: "Arjun Singh",
      email: "arjun@gmail.com",
      phone: "9876543220",
      message: "Looking for accommodation details.",
    },
  ]);

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

  const deleteContact = (id) => {
    setContacts(contacts.filter((item) => item.id !== id));
    setShowDeleteModal(false);
    setDeleteTarget(null);
    showToast("Contact deleted successfully!", "success");
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleDelete = (id, name) => {
    setDeleteTarget({ id, name });
    setShowDeleteModal(true);
  };

  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setShowViewModal(true);
  };

  // Filter contacts based on search
  const filteredContacts = contacts.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.includes(searchTerm) ||
      item.message.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredContacts.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Go to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Calculate stats
  const totalQueries = contacts.length;
  const pending = contacts.length > 0 ? Math.ceil(contacts.length * 0.6) : 0;
  const resolved = contacts.length - pending;

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
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
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
                    onClick={() => deleteContact(deleteTarget.id)}
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
              placeholder="Search contact..."
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
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-5 text-sm font-semibold text-slate-600">
                  Name
                </th>
                <th className="text-left p-5 text-sm font-semibold text-slate-600">
                  Email
                </th>
                <th className="text-left p-5 text-sm font-semibold text-slate-600">
                  Phone
                </th>
                <th className="text-left p-5 text-sm font-semibold text-slate-600">
                  Message
                </th>
                <th className="text-left p-5 text-sm font-semibold text-slate-600">
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
                    <td className="p-5 font-semibold text-slate-800">
                      {item.name}
                    </td>
                    <td className="p-5 text-sm text-slate-600">{item.email}</td>
                    <td className="p-5 text-slate-600">{item.phone}</td>
                    <td className="p-5 max-w-xs">
                      <p className="truncate text-slate-600">{item.message}</p>
                    </td>
                    <td className="p-5 flex gap-3">
                      <button
                        onClick={() => handleViewContact(item)}
                        className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition font-medium text-sm shadow-sm hover:shadow-md"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.name)}
                        className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white transition font-medium text-sm shadow-sm hover:shadow-md"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-10 text-slate-500">
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
                  },
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

      {/* View Modal */}
      {showViewModal && selectedContact && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-xl">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-slate-800">
                Contact Details
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-500">
                  Name
                </label>
                <p className="text-lg font-semibold text-slate-800 mt-1">
                  {selectedContact.name}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-500">
                  Email
                </label>
                <p className="text-lg text-slate-800 mt-1">
                  {selectedContact.email}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-500">
                  Phone
                </label>
                <p className="text-lg text-slate-800 mt-1">
                  {selectedContact.phone}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-500">
                  Message
                </label>
                <div className="bg-gray-50 p-4 rounded-xl mt-1 border border-gray-100">
                  <p className="text-slate-800">{selectedContact.message}</p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedContact(null);
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl transition font-medium shadow-sm hover:shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animation */}
      <style jsx>{`
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
