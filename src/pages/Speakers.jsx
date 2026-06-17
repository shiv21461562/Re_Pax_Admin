import { useState, useEffect } from "react";

function Speakers() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [speakers, setSpeakers] = useState([
    {
      id: 1,
      name: "John Smith",
      company: "Tesla Energy",
      designation: "Director",
    },
    {
      id: 2,
      name: "Sarah Wilson",
      company: "Adani Green",
      designation: "CEO",
    },
    {
      id: 3,
      name: "Michael Brown",
      company: "SpaceX",
      designation: "CTO",
    },
    {
      id: 4,
      name: "Emma Davis",
      company: "Google Cloud",
      designation: "VP of Engineering",
    },
    {
      id: 5,
      name: "Dr. Priya Mehta",
      company: "Microsoft",
      designation: "AI Research Lead",
    },
    {
      id: 6,
      name: "Vikram Shah",
      company: "Amazon",
      designation: "Cloud Architect",
    },
    {
      id: 7,
      name: "Ananya Reddy",
      company: "Apple",
      designation: "Product Manager",
    },
    {
      id: 8,
      name: "Rajesh Kumar",
      company: "Meta",
      designation: "Engineering Director",
    },
  ]);

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

  const handleAddSpeaker = (newSpeaker) => {
    setSpeakers([
      ...speakers,
      {
        id: Date.now(),
        ...newSpeaker,
      },
    ]);
    setIsModalOpen(false);
    showToast("Speaker added successfully!", "success");
  };

  const handleDeleteSpeaker = (id) => {
    setSpeakers(speakers.filter((speaker) => speaker.id !== id));
    setShowDeleteModal(false);
    setDeleteTarget(null);
    showToast("Speaker deleted successfully!", "success");
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleEditSpeaker = (speaker) => {
    setEditingSpeaker(speaker);
    setIsModalOpen(true);
  };

  const handleUpdateSpeaker = (updatedSpeaker) => {
    setSpeakers(
      speakers.map((speaker) =>
        speaker.id === editingSpeaker.id
          ? { ...speaker, ...updatedSpeaker }
          : speaker,
      ),
    );
    setEditingSpeaker(null);
    setIsModalOpen(false);
    showToast("Speaker updated successfully!", "success");
  };

  const handleDelete = (id, name) => {
    setDeleteTarget({ id, name });
    setShowDeleteModal(true);
  };

  const filteredSpeakers = speakers.filter(
    (speaker) =>
      speaker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      speaker.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      speaker.designation.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSpeakers.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredSpeakers.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Calculate stats
  const totalSpeakers = speakers.length;
  const keynoteSpeakers = 35; // Static as per original
  const industryExperts = 115; // Static as per original

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
                  Delete Speaker?
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
                    onClick={() => handleDeleteSpeaker(deleteTarget.id)}
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
          <h1 className="text-4xl font-bold text-slate-800">Speakers</h1>
          <p className="text-slate-500 mt-1">Manage all event speakers</p>
        </div>

        <button
          onClick={() => {
            setEditingSpeaker(null);
            setIsModalOpen(true);
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl shadow-sm"
        >
          + Add Speaker
        </button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-500 text-sm">Total Speakers</p>
              <h2 className="text-4xl font-bold mt-1">{totalSpeakers}</h2>
            </div>
            <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-2xl">
              🎤
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-500 text-sm">Keynote Speakers</p>
              <h2 className="text-4xl font-bold text-blue-600 mt-1">
                {keynoteSpeakers}
              </h2>
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl">
              🎯
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-500 text-sm">Industry Experts</p>
              <h2 className="text-4xl font-bold text-green-600 mt-1">
                {industryExperts}
              </h2>
            </div>
            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-2xl">
              💡
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search speaker..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-5 py-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-base"
            />
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-4 py-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-base"
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
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-5 text-sm font-semibold text-slate-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left p-5 text-sm font-semibold text-slate-600 uppercase tracking-wider">
                  Company
                </th>
                <th className="text-left p-5 text-sm font-semibold text-slate-600 uppercase tracking-wider">
                  Designation
                </th>
                <th className="text-left p-5 text-sm font-semibold text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((speaker) => (
                  <tr
                    key={speaker.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="p-5 font-semibold text-slate-800 text-base">
                      {speaker.name}
                    </td>
                    <td className="p-5 text-slate-600 text-base">
                      {speaker.company}
                    </td>
                    <td className="p-5 text-slate-600 text-base">
                      {speaker.designation}
                    </td>
                    <td className="p-5 flex gap-2">
                      <button
                        onClick={() => handleEditSpeaker(speaker)}
                        className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(speaker.id, speaker.name)}
                        className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white transition text-sm font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center p-10 text-slate-500 text-base"
                  >
                    {searchTerm
                      ? "No speakers found matching your search"
                      : "No speakers added yet"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredSpeakers.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {indexOfFirstItem + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-700">
                {Math.min(indexOfLastItem, filteredSpeakers.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {filteredSpeakers.length}
              </span>{" "}
              entries
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-xl transition text-sm font-medium ${
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
                          className={`w-10 h-10 rounded-xl transition text-sm font-medium ${
                            currentPage === number
                              ? "bg-orange-500 text-white"
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
                          className="w-10 h-10 flex items-center justify-center text-slate-400 text-sm"
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
                className={`px-4 py-2 rounded-xl transition text-sm font-medium ${
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-xl">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-slate-800">
                {editingSpeaker ? "Edit Speaker" : "Add Speaker"}
              </h2>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const speakerData = {
                  name: formData.get("name"),
                  company: formData.get("company"),
                  designation: formData.get("designation"),
                };

                if (editingSpeaker) {
                  handleUpdateSpeaker(speakerData);
                } else {
                  handleAddSpeaker(speakerData);
                }
              }}
            >
              <div className="p-6 space-y-4">
                <input
                  name="name"
                  defaultValue={editingSpeaker?.name || ""}
                  placeholder="Speaker Name"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 text-base"
                  required
                />

                <input
                  name="company"
                  defaultValue={editingSpeaker?.company || ""}
                  placeholder="Company"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 text-base"
                  required
                />

                <input
                  name="designation"
                  defaultValue={editingSpeaker?.designation || ""}
                  placeholder="Designation"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 text-base"
                  required
                />
              </div>

              <div className="p-6 border-t flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl transition font-medium text-base"
                >
                  {editingSpeaker ? "Update Speaker" : "Add Speaker"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditingSpeaker(null);
                    setIsModalOpen(false);
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-slate-700 py-3 rounded-xl transition font-medium text-base"
                >
                  Cancel
                </button>
              </div>
            </form>
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

export default Speakers;