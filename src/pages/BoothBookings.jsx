import { FiSearch, FiTrash2, FiEye, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useState, useEffect } from "react";
import {
  getBoothBookings,
  deleteBoothBooking,
} from "../services/BoothBookingApi";

export default function BoothBookings() {
  const [search, setSearch] = useState("");
  const [bookings, setBookings] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  const fetchBoothBookings = async () => {
    try {
      const response = await getBoothBookings();

      if (response.success) {
        setBookings(response.data);
      }
    } catch (error) {
      console.error(error);
      showToast("Failed to load booth bookings", "error");
    }
  };

  useEffect(() => {
    fetchBoothBookings();
  }, []);

  const handleDeleteClick = (id) => {
    setDeleteTarget(id);
    setShowDeleteModal(true);
  };

  const handleDeleteBoothBooking = async () => {
    try {
      const response = await deleteBoothBooking(deleteTarget);

      if (response.success) {
        setBookings((prev) => prev.filter((item) => item.id !== deleteTarget));
        showToast("Booth booking deleted successfully!", "success");
      }
    } catch (error) {
      console.error(error);
      showToast("Failed to delete booth booking", "error");
    }

    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  const handleViewMessage = (booking) => {
    setSelectedBooking(booking);
    setShowMessageModal(true);
  };

  // Filter bookings based on search
  const filteredBookings = bookings.filter(
    (item) =>
      (item.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.company_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.phone || "").includes(search),
  );

  // Pagination logic
  const totalItems = filteredBookings.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let startPage = Math.max(1, currentPage - halfVisible);
      let endPage = Math.min(totalPages, currentPage + halfVisible);
      
      if (currentPage <= halfVisible) {
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - halfVisible) {
        startPage = totalPages - maxVisiblePages + 1;
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }
    
    return pageNumbers;
  };

  // Close modals when Escape key is pressed
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setShowDeleteModal(false);
        setShowMessageModal(false);
        setDeleteTarget(null);
        setSelectedBooking(null);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white z-[999] animate-slide-in`}
        >
          {toast.message}
        </div>
      )}

      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Booth Bookings</h2>
          <p className="text-gray-500 mt-1">
            Manage exhibition booth booking requests
          </p>
        </div>

        <div className="relative w-80">
          <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-orange-500 text-white">
              <th className="p-3 text-left border border-orange-400">#</th>
              <th className="p-3 text-left border border-orange-400">Name</th>
              <th className="p-3 text-left border border-orange-400">
                Company
              </th>
              <th className="p-3 text-left border border-orange-400">
                Designation
              </th>
              <th className="p-3 text-left border border-orange-400">Email</th>
              <th className="p-3 text-left border border-orange-400">Phone</th>
              <th className="p-3 text-left border border-orange-400">
                Package
              </th>
              <th className="p-3 text-center border border-orange-400">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="p-8 text-center text-gray-500 border border-gray-200"
                >
                  No booth bookings found
                </td>
              </tr>
            ) : (
              currentItems.map((item, index) => (
                <tr
                  key={item.id}
                  className="hover:bg-orange-50 transition-colors"
                >
                  <td className="p-3 border border-gray-200">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="p-3 font-semibold border border-gray-200">
                    {item.full_name}
                  </td>
                  <td className="p-3 border border-gray-200">
                    {item.company_name}
                  </td>
                  <td className="p-3 border border-gray-200">
                    {item.designation}
                  </td>
                  <td className="p-3 border border-gray-200">{item.email}</td>
                  <td className="p-3 border border-gray-200">{item.phone}</td>
                  <td className="p-3 border border-gray-200">
                    <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
                      {item.booth_package}
                    </span>
                  </td>
                  <td className="p-3 text-center border border-gray-200">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleViewMessage(item)}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
                        title="View Message"
                      >
                        <FiEye />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item.id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          {/* Showing info */}
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} entries
          </div>

          {/* Pagination controls */}
          <div className="flex items-center gap-2">
            {/* Items per page selector */}
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>

            {/* Navigation buttons */}
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg border transition-colors ${
                currentPage === 1
                  ? "border-gray-200 text-gray-400 cursor-not-allowed"
                  : "border-gray-300 text-gray-700 hover:bg-orange-50 hover:border-orange-300"
              }`}
            >
              <FiChevronLeft size={18} />
            </button>

            {/* Page numbers */}
            <div className="flex gap-1">
              {getPageNumbers().map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`w-10 h-10 rounded-lg border transition-colors ${
                    currentPage === number
                      ? "bg-orange-500 text-white border-orange-500"
                      : "border-gray-300 text-gray-700 hover:bg-orange-50 hover:border-orange-300"
                  }`}
                >
                  {number}
                </button>
              ))}
            </div>

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg border transition-colors ${
                currentPage === totalPages
                  ? "border-gray-200 text-gray-400 cursor-not-allowed"
                  : "border-gray-300 text-gray-700 hover:bg-orange-50 hover:border-orange-300"
              }`}
            >
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Message View Modal */}
      {showMessageModal && selectedBooking && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center animate-in fade-in duration-200">
          <div
            className="absolute inset-0 bg-black/10 backdrop-blur-[1.5px] transition-all duration-300"
            onClick={() => {
              setShowMessageModal(false);
              setSelectedBooking(null);
            }}
          />
          <div
            className="relative z-[10000] w-full max-w-2xl mx-4 rounded-2xl bg-white border border-gray-100 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.15)] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Booking Details
              </h3>
              <button
                onClick={() => {
                  setShowMessageModal(false);
                  setSelectedBooking(null);
                }}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all duration-200"
              >
                <FiX size={22} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Full Name</p>
                  <p className="font-semibold text-gray-900">
                    {selectedBooking.full_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Company</p>
                  <p className="font-semibold text-gray-900">
                    {selectedBooking.company_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Designation</p>
                  <p className="font-semibold text-gray-900">
                    {selectedBooking.designation}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Package</p>
                  <span className="inline-flex px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-sm font-semibold">
                    {selectedBooking.booth_package}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="font-semibold text-gray-900 break-all">
                    {selectedBooking.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phone</p>
                  <p className="font-semibold text-gray-900">
                    {selectedBooking.phone}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Message</p>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-gray-700 whitespace-pre-wrap leading-7">
                    {selectedBooking.message || "No message provided"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Submitted On</p>
                <p className="font-semibold text-gray-900">
                  {new Date(selectedBooking.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => {
                  setShowMessageModal(false);
                  setSelectedBooking(null);
                }}
                className="px-6 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center animate-in fade-in duration-200">
          <div
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] transition-all duration-300"
            onClick={() => {
              setShowDeleteModal(false);
              setDeleteTarget(null);
            }}
          />
          <div
            className="relative z-[10000] w-full max-w-md mx-4 rounded-2xl bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6 leading-7">
              Are you sure you want to delete this booth booking?
              <br />
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteTarget(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteBoothBooking}
                className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}