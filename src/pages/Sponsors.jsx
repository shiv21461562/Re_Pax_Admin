import { useState, useEffect } from "react";

import {
  getSponsors,
  createSponsor,
  updateSponsor,
  deleteSponsor,
  getSponsorCategories,
} from "../services/SponsorApi";

function Sponsors() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [categories, setCategories] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [sponsors, setSponsors] = useState([]);

  const [selectedLogo, setSelectedLogo] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const fetchSponsors = async () => {
    try {
      const response = await getSponsors();
      setSponsors(response.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  // fetch sponsor category
  const fetchCategories = async () => {
    try {
      const response = await getSponsorCategories();

      setCategories(response.data || []);
    } catch (error) {}
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

  const handleAddSponsor = async (formData) => {
    try {
      const response = await createSponsor(formData);

      console.log("CREATE RESPONSE =>", response);

      await fetchSponsors();

      setSelectedLogo(null);
      setPreviewImage("");
      setIsModalOpen(false);

      showToast("Sponsor added successfully!", "success");
    } catch (error) {
      console.error("CREATE ERROR =>", error);

      showToast("Failed to add sponsor", "error");
    }
  };

  const handleDeleteSponsor = async (id) => {
    try {
      const response = await deleteSponsor(id);

      console.log("DELETE RESPONSE =>", response);

      await fetchSponsors();

      setShowDeleteModal(false);
      setDeleteTarget(null);

      showToast("Sponsor deleted successfully!", "success");
    } catch (error) {
      console.error("DELETE ERROR =>", error);

      showToast("Failed to delete sponsor", "error");
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleEditSponsor = (sponsor) => {
    setEditingSponsor(sponsor);
    setPreviewImage(sponsor.logo);
    setSelectedLogo(null);
    setIsModalOpen(true);
  };

  const handleUpdateSponsor = async (formData) => {
    try {
      const response = await updateSponsor(editingSponsor.id, formData);

      console.log("UPDATE RESPONSE =>", response);

      await fetchSponsors();

      setEditingSponsor(null);
      setSelectedLogo(null);
      setPreviewImage("");
      setIsModalOpen(false);

      showToast("Sponsor updated successfully!", "success");
    } catch (error) {
      console.error("UPDATE ERROR =>", error);

      showToast("Failed to update sponsor", "error");
    }
  };

  const handleDelete = (id, company) => {
    setDeleteTarget({ id, company });
    setShowDeleteModal(true);
  };

  const filteredSponsors = sponsors.filter(
    (sponsor) =>
      sponsor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sponsor.website?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSponsors.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredSponsors.length / itemsPerPage);

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
    fetchSponsors();
    fetchCategories();
  }, []);

  // Calculate stats
  const totalSponsors = sponsors.length;

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
                  Delete Sponsor?
                </h3>
                <p className="text-slate-600 text-sm mt-1">
                  Are you sure you want to delete{" "}
                  <strong className="text-slate-800">
                    {deleteTarget.company}
                  </strong>
                  ?
                </p>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleDeleteSponsor(deleteTarget.id)}
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
          <h1 className="text-4xl font-bold text-slate-800">Sponsors</h1>
          <p className="text-slate-500 mt-1">Manage all event sponsors</p>
        </div>

        <button
          onClick={() => {
            setEditingSponsor(null);
            setIsModalOpen(true);
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl shadow-sm"
        >
          + Add Sponsor
        </button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-5">
        {/* Total Sponsors */}
        <div className="bg-white py-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex flex-col items-center justify-center text-center">
            <p className="text-slate-500 text-sm font-medium">Total Sponsors</p>

            <h2 className="text-4xl font-bold text-slate-900 mt-2">
              {totalSponsors}
            </h2>
          </div>
        </div>

        {/* Gold Sponsors */}
        <div className="bg-white py-5 rounded-3xl border border-yellow-200 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex flex-col items-center justify-center text-center">
            <p className="text-slate-500 text-sm font-medium">Gold Sponsors</p>

            <h2 className="text-4xl font-bold text-yellow-500 mt-2">0</h2>
          </div>
        </div>

        {/* Partners */}
        <div className="bg-white py-5 rounded-3xl border border-green-200 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex flex-col items-center justify-center text-center">
            <p className="text-slate-500 text-sm font-medium">Partners</p>

            <h2 className="text-4xl font-bold text-green-600 mt-2">0</h2>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search sponsor..."
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
                  Logo
                </th>
                <th className="text-left p-5 text-sm font-semibold text-slate-600 uppercase tracking-wider">
                  Company
                </th>
                <th className="text-left p-5 text-sm font-semibold text-slate-600 uppercase tracking-wider">
                  Website
                </th>

                <th className="text-left p-5 text-sm font-semibold text-slate-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="text-left p-5 text-sm font-semibold text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((sponsor) => (
                  <tr
                    key={sponsor.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="p-5 w-40">
                      <div className="flex justify-center">
                        <img
                          src={sponsor.logo}
                          alt={sponsor.name}
                          className="w-16 h-16 object-contain bg-white rounded-xl border border-slate-200 p-2"
                        />
                      </div>
                    </td>
                    <td className="p-5 font-semibold text-slate-800 text-base">
                      {sponsor.name}
                    </td>
                    <td className="p-5">
                      <a
                        href={sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Visit Website
                      </a>
                    </td>

                    <td className="p-5">
                      {categories.find(
                        (cat) => cat.id === Number(sponsor.category_id),
                      )?.category_name || "-"}
                    </td>
                    <td className="p-5 flex gap-2">
                      <button
                        onClick={() => handleEditSponsor(sponsor)}
                        className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(sponsor.id, sponsor.name)}
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
                      ? "No sponsors found matching your search"
                      : "No sponsors added yet"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredSponsors.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {indexOfFirstItem + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-700">
                {Math.min(indexOfLastItem, filteredSponsors.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {filteredSponsors.length}
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
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[4px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    {editingSponsor ? "Edit Sponsor" : "Add New Sponsor"}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    {editingSponsor
                      ? "Update sponsor details"
                      : "Fill in the details to add a new sponsor"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingSponsor(null);
                    setSelectedLogo(null);
                    setPreviewImage("");
                    setIsModalOpen(false);
                  }}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition"
                >
                  <svg
                    className="w-6 h-6 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData();
                formData.append("name", e.target.name.value);
                formData.append("category_id", e.target.category_id.value);
                formData.append("website", e.target.website.value);
                if (selectedLogo) {
                  formData.append("logo", selectedLogo);
                }
                if (editingSponsor) {
                  handleUpdateSponsor(formData);
                } else {
                  handleAddSponsor(formData);
                }
              }}
            >
              <div className="p-6">
                {/* Logo Upload - Full Width */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-3 flex items-center justify-center overflow-hidden group hover:border-orange-300 transition">
                      {previewImage || editingSponsor?.logo ? (
                        <img
                          src={previewImage || editingSponsor?.logo}
                          alt="Sponsor Logo"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="text-center">
                          <svg
                            className="w-10 h-10 text-slate-300 mx-auto"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <p className="text-xs text-slate-400 mt-1">
                            Upload Logo
                          </p>
                        </div>
                      )}
                    </div>
                    <label className="absolute -bottom-2 -right-2 cursor-pointer bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full shadow-lg transition">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setSelectedLogo(file);
                            setPreviewImage(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-slate-400 mt-3">
                    Click the + button to upload logo
                  </p>
                </div>

                {/* 2 Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Sponsor Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Sponsor Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-3.5 text-slate-400">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                      <input
                        name="name"
                        defaultValue={editingSponsor?.name || ""}
                        placeholder="Enter sponsor name"
                        className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                        required
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-3.5 text-slate-400">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          />
                        </svg>
                      </div>
                      <select
                        name="category_id"
                        defaultValue={editingSponsor?.category_id || ""}
                        className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition appearance-none"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.category_name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-3.5 text-slate-400 pointer-events-none">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Website */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Website <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-3.5 text-slate-400">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"
                          />
                        </svg>
                      </div>
                      <input
                        name="website"
                        defaultValue={editingSponsor?.website || ""}
                        placeholder="https://example.com"
                        className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-3xl">
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-xl transition font-semibold shadow-lg hover:shadow-xl"
                  >
                    {editingSponsor ? "Update Sponsor" : "Add Sponsor"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSponsor(null);
                      setSelectedLogo(null);
                      setPreviewImage("");
                      setIsModalOpen(false);
                    }}
                    className="flex-1 bg-white hover:bg-slate-50 text-slate-700 py-3 rounded-xl transition font-medium border border-slate-200"
                  >
                    Cancel
                  </button>
                </div>
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

export default Sponsors;
