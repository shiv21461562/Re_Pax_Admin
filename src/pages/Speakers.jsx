import { useState, useEffect } from "react";

import {
  getSpeakers,
  createSpeaker,
  updateSpeaker,
  deleteSpeaker,
} from "../services/SpeakerApi";

function Speakers() {
  /* -----MODAL STATES --------*/

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  /*--------------TOAST NOTIFICATION ------------- */

  const [toast, setToast] = useState(null);
  const [progress, setProgress] = useState(0);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [imagePreview, setImagePreview] = useState(null);

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

  /*-------------AddSpeaker---------------*/
  const handleAddSpeaker = async (speakerData) => {
    try {
      await createSpeaker(speakerData);

      await fetchSpeakers();

      setIsModalOpen(false);

      showToast("Speaker added successfully!", "success");
    } catch (error) {
      console.log(error);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleEditSpeaker = (speaker) => {
    setEditingSpeaker(speaker);
    setIsModalOpen(true);
  };


  /*------------  UPDATE  SPEAKER------------*/
  const handleUpdateSpeaker = async (updatedSpeaker) => {
    try {
      const res = await updateSpeaker(editingSpeaker.id, updatedSpeaker);

      console.log("UPDATE RES =>", res);

      await fetchSpeakers();

      setEditingSpeaker(null);
      setIsModalOpen(false);

      showToast("Speaker updated successfully!", "success");
    } catch (error) {
      console.log("UPDATE ERROR =>", error.response?.data || error);

      showToast("Failed to update speaker!", "error");
    }
  };

 /*------------  Delete  SPEAKER------------*/

  const handleDeleteSpeaker = async (id) => {
    try {
      await deleteSpeaker(id);

      await fetchSpeakers();

      setShowDeleteModal(false);
      setDeleteTarget(null);

      showToast("Speaker deleted successfully!", "success");
    } catch (error) {
      console.log(error);
    }
  };

  /*-------------fetchSpeakers-----------*/
  const fetchSpeakers = async () => {
    try {
      const res = await getSpeakers();

      console.log("API DATA =>", res);

      setSpeakers(res.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
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

  useEffect(() => {
    fetchSpeakers();
  }, []);

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
            setImagePreview(null);
            setIsModalOpen(true);
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl shadow-sm"
        >
          Add Speaker
        </button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-5">
        {/* Total Speakers */}
        <div className="bg-white py-5 rounded-3xl shadow-sm">
          <div className="flex flex-col items-center justify-center text-center">
            <p className="text-slate-500 text-sm font-medium">Total Speakers</p>

            <h2 className="text-4xl font-bold text-slate-900 mt-2">
              {totalSpeakers}
            </h2>
          </div>
        </div>

        {/* Keynote Speakers */}
        <div className="bg-white py-5 rounded-3xl shadow-sm">
          <div className="flex flex-col items-center justify-center text-center">
            <p className="text-slate-500 text-sm font-medium">
              Keynote Speakers
            </p>

            <h2 className="text-4xl font-bold text-blue-600 mt-2">
              {keynoteSpeakers}
            </h2>
          </div>
        </div>

        {/* Industry Experts */}
        <div className="bg-white py-5 rounded-3xl shadow-sm">
          <div className="flex flex-col items-center justify-center text-center">
            <p className="text-slate-500 text-sm font-medium">
              Industry Experts
            </p>

            <h2 className="text-4xl font-bold text-green-600 mt-2">
              {industryExperts}
            </h2>
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
                <th className="text-left p-5 text-sm font-semibold text-slate-600 uppercase">
                  Bio
                </th>

                <th className="text-left p-5 text-sm font-semibold text-slate-600 uppercase">
                  Image
                </th>

                <th className="text-left p-5 text-sm font-semibold text-slate-600 uppercase">
                  Social Links
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
                    <td className="p-5 text-slate-600 text-base max-w-xs">
                      {speaker.bio}
                    </td>

                    <td className="p-5">
                      <img
                        src={speaker.image}
                        alt={speaker.name}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                    </td>

                    <td className="p-5">
                      <div className="flex flex-col gap-1 text-sm">
                        <a
                          href={speaker.linkedin_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600"
                        >
                          LinkedIn
                        </a>

                        <a
                          href={speaker.twitter_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sky-500"
                        >
                          Twitter
                        </a>

                        <a
                          href={speaker.website_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-green-600"
                        >
                          Website
                        </a>
                      </div>
                    </td>
                    <td className="p-5 flex gap-2">
                      <button
                        onClick={() => handleEditSpeaker(speaker)}
                        className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setDeleteTarget(speaker);
                          setShowDeleteModal(true);
                        }}
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
                    colSpan="7"
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
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-xl">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-slate-800">
                {editingSpeaker ? "Edit Speaker" : "Add Speaker"}
              </h2>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();

                const formData = new FormData(e.target);

                if (editingSpeaker) {
                  handleUpdateSpeaker(formData);
                } else {
                  handleAddSpeaker(formData);
                }
              }}
            >
              {/* edit modal */}

              <div className="p-6 space-y-6">
                {/* Top Section */}
                <div className="grid grid-cols-12 gap-6 items-start">
                  {/* Image Section */}
                  <div className="col-span-12 md:col-span-3">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col items-center">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-36 h-36 rounded-2xl object-cover shadow-md border-4 border-white"
                        />
                      ) : editingSpeaker?.image ? (
                        <img
                          src={editingSpeaker.image}
                          alt="Speaker"
                          className="w-36 h-36 rounded-2xl object-cover shadow-md border-4 border-white"
                        />
                      ) : (
                        <div className="w-36 h-36 rounded-2xl bg-slate-200 flex items-center justify-center">
                          No Image
                        </div>
                      )}

                      <label
                        htmlFor="speakerImage"
                        className="mt-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl cursor-pointer text-sm font-medium transition"
                      >
                        {editingSpeaker ? "Change Photo" : "Add Photo"}
                      </label>

                      <input
                        id="speakerImage"
                        type="file"
                        name="image"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];

                          if (file) {
                            setImagePreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Right Side Fields */}
                  <div className="col-span-12 md:col-span-9">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-semibold text-slate-700">
                          Name
                        </label>
                        <input
                          name="name"
                          defaultValue={editingSpeaker?.name || ""}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-orange-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-semibold text-slate-700">
                          Company
                        </label>
                        <input
                          name="company"
                          defaultValue={editingSpeaker?.company || ""}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-orange-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-semibold text-slate-700">
                          Designation
                        </label>
                        <input
                          name="designation"
                          defaultValue={editingSpeaker?.designation || ""}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-orange-500 outline-none"
                        />
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="mt-5">
                      <label className="block mb-2 text-sm font-semibold text-slate-700">
                        Bio
                      </label>

                      <textarea
                        rows="4"
                        name="bio"
                        defaultValue={editingSpeaker?.bio || ""}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-slate-700">
                      LinkedIn
                    </label>

                    <input
                      name="linkedin_url"
                      defaultValue={editingSpeaker?.linkedin_url || ""}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-slate-700">
                      Twitter / X
                    </label>

                    <input
                      name="twitter_url"
                      defaultValue={editingSpeaker?.twitter_url || ""}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-slate-700">
                      Website
                    </label>

                    <input
                      name="website_url"
                      defaultValue={editingSpeaker?.website_url || ""}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>
                </div>
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
                    setImagePreview(null);
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
