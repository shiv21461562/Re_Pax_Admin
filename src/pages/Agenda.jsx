import { useState, useEffect } from "react";

import {
  getAgendas,
  createAgenda,
  updateAgenda,
  deleteAgenda,
} from "../services/AgendaApi";

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

  const [agenda, setAgenda] = useState([]);

  const fetchAgendas = async () => {
    try {
      const response = await getAgendas();

      if (response.success) {
        setAgenda(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

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

const handleAddSession = async (newSession) => {
  try {
    const response = await createAgenda(newSession);

    if (response.success) {
      await fetchAgendas();

      setIsModalOpen(false);

      showToast("Session added successfully!", "success");
    }
  } catch (error) {
    console.log(error);
    showToast("Failed to add session", "error");
  }
};
const handleDeleteSession = async (id) => {
  try {
    const response = await deleteAgenda(id);

    if (response.success) {
      await fetchAgendas();

      setShowDeleteModal(false);
      setDeleteTarget(null);

      showToast("Session deleted successfully!", "success");
    }
  } catch (error) {
    console.log(error);

    showToast("Failed to delete session", "error");
  }
};

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleEditSession = (session) => {
    setEditingSession(session);
    setIsModalOpen(true);
  };

const handleUpdateSession = async (updatedSession) => {
  try {
    const response = await updateAgenda(
      editingSession.id,
      updatedSession
    );

    if (response.success) {
      await fetchAgendas();

      setEditingSession(null);
      setIsModalOpen(false);

      showToast("Session updated successfully!", "success");
    }
  } catch (error) {
    console.log(error);
    showToast("Failed to update session", "error");
  }
};

  const handleDelete = (id, title) => {
    setDeleteTarget({ id, title });
    setShowDeleteModal(true);
  };

  const filteredAgenda = agenda.filter(
    (item) =>
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.speaker_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchTerm.toLowerCase()),
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

  useEffect(() => {
    fetchAgendas();
  }, []);

  const totalSessions = agenda.length;
  const day1Sessions = 0;
  const day2Sessions = 0;

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
          Add Session
        </button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-5">
        {/* Total Sessions */}
        <div className="bg-white py-5 rounded-3xl border border-orange-200 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex flex-col items-center justify-center text-center">
            <p className="text-slate-500 text-sm font-medium">Total Sessions</p>

            <h2 className="text-4xl font-bold text-slate-900 mt-2">
              {totalSessions}
            </h2>
          </div>
        </div>

        {/* Day 1 Sessions */}
        <div className="bg-white py-5 rounded-3xl border border-blue-200 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex flex-col items-center justify-center text-center">
            <p className="text-slate-500 text-sm font-medium">Day 1 Sessions</p>

            <h2 className="text-4xl font-bold text-blue-600 mt-2">
              {day1Sessions}
            </h2>
          </div>
        </div>

        {/* Day 2 Sessions */}
        <div className="bg-white py-5 rounded-3xl border border-green-200 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex flex-col items-center justify-center text-center">
            <p className="text-slate-500 text-sm font-medium">Day 2 Sessions</p>

            <h2 className="text-4xl font-bold text-green-600 mt-2">
              {day2Sessions}
            </h2>
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
                  Session Type
                </th>

                <th className="text-left p-5 text-sm font-semibold text-slate-600">
                  Location
                </th>

                <th className="text-left p-5 text-sm font-semibold text-slate-600">
                  Description
                </th>

                <th className="text-left p-5 text-sm font-semibold text-slate-600">
                  Status
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

                    <td className="p-5">{item.speaker_name}</td>

                    <td className="p-5">
                      <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-sm">
                        {item.session_type}
                      </span>
                    </td>

                    <td className="p-5">{item.location}</td>

                    <td className="p-5 max-w-xs">
                      <div className="line-clamp-2">{item.description}</div>
                    </td>

                    <td className="p-5">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          item.status === 1
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {item.status === 1 ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="p-5">
                      <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm whitespace-nowrap inline-block">
                        {item.time}
                      </span>
                    </td>

                    <td className="p-5">
                      <div className="flex gap-3">
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
                      </div>
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

      {/* Edit  Modal */}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px] p-4">
          <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="px-8 py-6 border-b bg-gradient-to-r from-slate-50 to-white">
              <h2 className="text-3xl font-bold text-slate-800">
                {editingSession ? "Edit Session" : "Add Session"}
              </h2>

              <p className="text-slate-500 mt-2">
                Manage agenda session information
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();

                const formData = new FormData(e.target);

                const sessionData = {
                  title: formData.get("title"),
                  speaker_name: formData.get("speaker_name"),
                  session_type: formData.get("session_type"),
                  location: formData.get("location"),
                  description: formData.get("description"),
                  time: formData.get("time"),
                  status: Number(formData.get("status")),
                };

                if (editingSession) {
                  handleUpdateSession(sessionData);
                } else {
                  handleAddSession(sessionData);
                }
              }}
            >
              {/* Body */}
              <div className="p-8">
                <div className="grid grid-cols-3 gap-5">
                  {/* Session Title */}
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Session Title
                    </label>

                    <input
                      name="title"
                      defaultValue={editingSession?.title || ""}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  {/* Speaker */}
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Speaker Name
                    </label>

                    <input
                      name="speaker_name"
                      defaultValue={editingSession?.speaker_name || ""}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  {/* Session Type */}
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Session Type
                    </label>

                    <input
                      name="session_type"
                      defaultValue={editingSession?.session_type || ""}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Location
                    </label>

                    <input
                      name="location"
                      defaultValue={editingSession?.location || ""}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Time
                    </label>

                    <input
                      name="time"
                      defaultValue={editingSession?.time || ""}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Status
                    </label>

                    <select
                      name="status"
                      defaultValue={editingSession?.status ?? 1}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div className="col-span-3">
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Description
                    </label>

                    <textarea
                      name="description"
                      defaultValue={editingSession?.description || ""}
                      rows={4}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 py-5 border-t bg-slate-50 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingSession(null);
                    setIsModalOpen(false);
                  }}
                  className="px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-slate-700 font-medium transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium transition"
                >
                  {editingSession ? "Update Session" : "Add Session"}
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
