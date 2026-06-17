import { useState, useEffect } from "react";

function Agenda() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [agenda, setAgenda] = useState([
    {
      id: 1,
      title: "Solar Energy Summit",
      speaker: "John Smith",
      date: "12 Jan 2026",
      time: "10:00 AM",
    },
    {
      id: 2,
      title: "Green Hydrogen Future",
      speaker: "Sarah Wilson",
      date: "12 Jan 2026",
      time: "02:00 PM",
    },
    {
      id: 3,
      title: "EV Revolution",
      speaker: "Michael Brown",
      date: "13 Jan 2026",
      time: "11:00 AM",
    },
    {
      id: 4,
      title: "Sustainable Cities",
      speaker: "Emma Davis",
      date: "13 Jan 2026",
      time: "03:00 PM",
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

  const handleAddSession = (newSession) => {
    setAgenda([
      ...agenda,
      {
        id: Date.now(),
        ...newSession,
      },
    ]);
    setIsModalOpen(false);
    showToast("Session added successfully!", "success");
  };

  const handleDeleteSession = (id) => {
    setAgenda(agenda.filter((item) => item.id !== id));
    setShowDeleteModal(false);
    setDeleteTarget(null);
    showToast("Session deleted successfully!", "success");
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleEditSession = (session) => {
    setEditingSession(session);
    setIsModalOpen(true);
  };

  const handleUpdateSession = (updatedSession) => {
    setAgenda(
      agenda.map((session) =>
        session.id === editingSession.id
          ? { ...session, ...updatedSession }
          : session,
      ),
    );
    setEditingSession(null);
    setIsModalOpen(false);
    showToast("Session updated successfully!", "success");
  };

  const handleDelete = (id, title) => {
    setDeleteTarget({ id, title });
    setShowDeleteModal(true);
  };

  const filteredAgenda = agenda.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.speaker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.date.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAgenda.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAgenda.length / itemsPerPage);

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
  const totalSessions = agenda.length;
  const day1Sessions = agenda.filter((item) =>
    item.date.includes("12 Jan"),
  ).length;
  const day2Sessions = agenda.filter((item) =>
    item.date.includes("13 Jan"),
  ).length;

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
                  Delete Session?
                </h3>
                <p className="text-slate-600 text-sm mt-1">
                  Are you sure you want to delete{" "}
                  <strong className="text-slate-800">
                    {deleteTarget.title}
                  </strong>
                  ?
                </p>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleDeleteSession(deleteTarget.id)}
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
          <h1 className="text-4xl font-bold text-slate-800">Agenda</h1>
          <p className="text-slate-500 mt-1">
            Manage event sessions & schedules
          </p>
        </div>

        <button
          onClick={() => {
            setEditingSession(null);
            setIsModalOpen(true);
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl shadow-sm"
        >
          + Add Session
        </button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-500">Total Sessions</p>
              <h2 className="text-4xl font-bold mt-2">{totalSessions}</h2>
            </div>
            <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-2xl">
              📅
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-500">Day 1 Sessions</p>
              <h2 className="text-4xl font-bold text-blue-600 mt-2">
                {day1Sessions}
              </h2>
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl">
              📆
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-500">Day 2 Sessions</p>
              <h2 className="text-4xl font-bold text-green-600 mt-2">
                {day2Sessions}
              </h2>
            </div>
            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-2xl">
              📆
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search session..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-5 py-4 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-4 py-4 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                <th className="text-left p-5 text-sm font-semibold text-slate-600">
                  Session
                </th>
                <th className="text-left p-5 text-sm font-semibold text-slate-600">
                  Speaker
                </th>
                <th className="text-left p-5 text-sm font-semibold text-slate-600">
                  Date
                </th>
                <th className="text-left p-5 text-sm font-semibold text-slate-600">
                  Time
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
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="p-5 font-semibold">{item.title}</td>
                    <td className="p-5">{item.speaker}</td>
                    <td className="p-5">{item.date}</td>
                    <td className="p-5">
                      <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                        {item.time}
                      </span>
                    </td>
                    <td className="p-5 flex gap-3">
                      <button
                        onClick={() => handleEditSession(item)}
                        className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.title)}
                        className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white transition font-medium"
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
                      ? "No sessions found matching your search"
                      : "No sessions added yet"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredAgenda.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {indexOfFirstItem + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-700">
                {Math.min(indexOfLastItem, filteredAgenda.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {filteredAgenda.length}
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
                              ? "bg-orange-500 text-white shadow-md"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-xl">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold">
                {editingSession ? "Edit Session" : "Add Session"}
              </h2>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const sessionData = {
                  title: formData.get("title"),
                  speaker: formData.get("speaker"),
                  date: formData.get("date"),
                  time: formData.get("time"),
                };

                if (editingSession) {
                  handleUpdateSession(sessionData);
                } else {
                  handleAddSession(sessionData);
                }
              }}
            >
              <div className="p-6 space-y-4">
                <input
                  name="title"
                  defaultValue={editingSession?.title || ""}
                  placeholder="Session Title"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />

                <input
                  name="speaker"
                  defaultValue={editingSession?.speaker || ""}
                  placeholder="Speaker Name"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />

                <input
                  name="date"
                  type="date"
                  defaultValue={
                    editingSession?.date
                      ? new Date(editingSession.date)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />

                <input
                  name="time"
                  type="time"
                  defaultValue={editingSession?.time || ""}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div className="p-6 border-t flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl transition font-medium"
                >
                  {editingSession ? "Update Session" : "Add Session"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditingSession(null);
                    setIsModalOpen(false);
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-slate-700 py-3 rounded-xl transition font-medium"
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

export default Agenda;
