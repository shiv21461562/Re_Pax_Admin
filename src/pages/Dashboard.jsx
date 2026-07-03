import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  FiUsers,
  FiMail,
  FiDownload,
  FiTrendingUp,
  FiClock,
  FiUserPlus,
  FiCalendar,
  FiSearch,
  FiEye,
  FiTrash2,
} from "react-icons/fi";
import { getContacts, deleteContact } from "../services/EnquiriesApi";
import { getBrochureLeads } from "../services/EnquiriesApi";

function Dashboard() {
  const [contacts, setContacts] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [progress, setProgress] = useState(0);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Fetch all data
  const fetchAllData = async () => {
    try {
      const [contactsRes, downloadsRes] = await Promise.all([
        getContacts(),
        getBrochureLeads(),
      ]);

      if (contactsRes.success) setContacts(contactsRes.data);
      if (downloadsRes.success) setDownloads(downloadsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      showToast("Failed to load data", "error");
    }
  };

  useEffect(() => {
    fetchAllData();
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

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Stats
  const stats = [
    {
      title: "Total Contacts",
      value: contacts.length,
      icon: <FiUsers className="text-2xl" />,
      color: "from-blue-500 to-blue-600",
      bg: "bg-blue-50",
      textColor: "text-blue-600",
      borderColor: "border-blue-200",
    },
    {
      title: "Brochure Downloads",
      value: downloads.length,
      icon: <FiDownload className="text-2xl" />,
      color: "from-orange-500 to-orange-600",
      bg: "bg-orange-50",
      textColor: "text-orange-600",
      borderColor: "border-orange-200",
    },
    {
      title: "New This Week",
      value: contacts.filter((c) => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(c.created_at) > weekAgo;
      }).length,
      icon: <FiUserPlus className="text-2xl" />,
      color: "from-green-500 to-green-600",
      bg: "bg-green-50",
      textColor: "text-green-600",
      borderColor: "border-green-200",
    },
    {
      title: "Total Queries",
      value: contacts.length + downloads.length,
      icon: <FiMail className="text-2xl" />,
      color: "from-purple-500 to-purple-600",
      bg: "bg-purple-50",
      textColor: "text-purple-600",
      borderColor: "border-purple-200",
    },
  ];

  // Chart data - distribution of contacts vs downloads
  const chartData = [
    { name: "Contacts", value: contacts.length, color: "#3b82f6" },
    { name: "Downloads", value: downloads.length, color: "#f97316" },
  ];

  // Line data - weekly trend (last 7 days)
  const getLineData = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStr = date.toLocaleDateString("en-US", { weekday: "short" });

      const dayContacts = contacts.filter((c) => {
        const cDate = new Date(c.created_at);
        return cDate.toDateString() === date.toDateString();
      }).length;

      const dayDownloads = downloads.filter((d) => {
        const dDate = new Date(d.created_at);
        return dDate.toDateString() === date.toDateString();
      }).length;

      days.push({
        day: dayStr,
        contacts: dayContacts,
        downloads: dayDownloads,
      });
    }
    return days;
  };

  const lineData = getLineData();

  // Recent activities - combine both data sources
  const getRecentActivities = () => {
    const activities = [];

    contacts.slice(0, 3).forEach((c) => {
      activities.push({
        id: `c-${c.id}`,
        icon: <FiMail />,
        bg: "bg-blue-100",
        text: `New Contact: ${c.full_name}`,
        time: formatDate(c.created_at),
        color: "text-blue-600",
        type: "contact",
      });
    });

    downloads.slice(0, 3).forEach((d) => {
      activities.push({
        id: `d-${d.id}`,
        icon: <FiDownload />,
        bg: "bg-orange-100",
        text: `Brochure Downloaded: ${d.full_name}`,
        time: formatDate(d.created_at),
        color: "text-orange-600",
        type: "download",
      });
    });

    return activities
      .sort((a, b) => {
        const timeA = new Date(a.time).getTime();
        const timeB = new Date(b.time).getTime();
        return timeB - timeA;
      })
      .slice(0, 4);
  };

  const recentActivities = getRecentActivities();

  // Combined data for table
  const combinedData = [
    ...contacts.map((c) => ({ ...c, type: "contact" })),
    ...downloads.map((d) => ({ ...d, type: "download" })),
  ].sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return dateB - dateA;
  });

  // Filter combined data
  const filteredData = combinedData.filter(
    (item) =>
      (item.full_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.phone || "").includes(searchTerm) ||
      (item.message || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.subject || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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
                  Delete Record?
                </h3>
                <p className="text-slate-600 text-sm mt-1">
                  Are you sure you want to delete{" "}
                  <strong className="text-slate-800">
                    {deleteTarget.name}
                  </strong>
                  's record?
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

      {/* View Modal */}
      {showViewModal && selectedContact && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-xl">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-slate-800">
                Message Details
              </h2>
            </div>
            <div className="p-6">
              <div>
                <label className="text-sm font-medium text-slate-500">
                  From: {selectedContact.full_name}
                </label>
                <div className="bg-gray-50 p-4 rounded-xl mt-2 border border-gray-100">
                  <p className="text-slate-800 text-lg">
                    {selectedContact.message}
                  </p>
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

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Welcome back
          </h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            <span> Admin</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2">
            <FiClock className="text-sm" />
            <span>Last 30 days</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((item, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-[28px] bg-white border border-slate-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-sm font-medium">
                  {item.title}
                </p>
                <h2 className="text-4xl font-bold text-slate-900 mt-3">
                  {item.value}
                </h2>
              </div>
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color}
                  flex items-center justify-center text-white shadow-lg`}
              >
                {item.icon}
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <span className="text-xs text-slate-400">Last 30 Days</span>
            </div>
            <div
              className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${item.color}`}
            />
          </div>
        ))}
      </div>

      

      {/* Charts Section */}
      <div className="grid xl:grid-cols-3 gap-6">
        {/* Distribution Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-lg">
                Data Distribution
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Contacts vs Downloads Overview
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-50 to-orange-100 text-orange-600 font-medium border border-orange-200">
                2026
              </span>
              <span className="text-xs px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 font-medium border border-blue-200">
                Live
              </span>
            </div>
          </div>

          <div className="h-[240px] relative">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={60}
                  outerRadius={85}
                  dataKey="value"
                  paddingAngle={4}
                  stroke="white"
                  strokeWidth={3}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.color}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    padding: "12px 16px",
                  }}
                  formatter={(value, name) => [`${value} records`, name]}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-800">
                  {chartData.reduce((sum, item) => sum + item.value, 0)}
                </p>
                <p className="text-xs text-slate-500 -mt-0.5">Total</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            {chartData.map((item) => (
              <div
                className="group text-center bg-slate-50 hover:bg-white rounded-xl p-3 transition-all duration-200 border-2 border-transparent hover:border-slate-200 cursor-pointer"
                key={item.name}
              >
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div
                    className="w-3 h-3 rounded-full shadow-sm"
                    style={{ background: item.color }}
                  />
                  <p className="text-xs font-medium text-slate-600">
                    {item.name}
                  </p>
                </div>
                <p className="font-bold text-lg text-slate-800">{item.value}</p>
                <p className="text-[10px] text-slate-400">
                  {item.value === 0
                    ? "No records"
                    : `${Math.round((item.value / chartData.reduce((sum, d) => sum + d.value, 0)) * 100)}%`}
                </p>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            {chartData.map((item, index) => {
              const total = chartData.reduce((sum, d) => sum + d.value, 0);
              const percentage = total > 0 ? (item.value / total) * 100 : 0;
              return (
                <div
                  key={index}
                  className="h-full float-left transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    background: item.color,
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Trend Card */}
        <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:shadow-lg transition-all">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="font-bold text-slate-800">Weekly Trend</h3>
              <p className="text-xs text-slate-500">7 Day Analytics</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-semibold">
                +
                {lineData.reduce((sum, d) => sum + d.contacts + d.downloads, 0)}
              </span>
              <FiTrendingUp className="text-green-500" />
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="contacts"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="downloads"
                  stroke="#f97316"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid xl:grid-cols-3 gap-6 mt-8">
        {/* Recent Activity */}
        <div className="xl:col-span-1 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Recent Activity
              </h3>
              <p className="text-sm text-slate-500">Live platform updates</p>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${activity.bg} ${activity.color}`}
                >
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-slate-800 text-sm">
                      {activity.text}
                    </h4>
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                </div>
                <div className="text-xs text-slate-400">→</div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Table */}

        <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <FiSearch className="absolute left-4 top-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search all records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-600">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-600">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-600">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-600">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-600">
                    Date
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
                      <td className="px-6 py-4">
                        <div>
                          <h4 className="font-semibold text-slate-900">
                            {item.full_name || "-"}
                          </h4>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {item.email || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {item.phone || "-"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            item.type === "contact"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {item.type === "contact" ? "Contact" : "Download"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatDate(item.created_at)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-10 text-slate-500"
                    >
                      {searchTerm
                        ? "No records found matching your search"
                        : "No records available"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredData.length > 0 && (
            <div className="flex flex-col items-center justify-between gap-4 border-t p-5 lg:flex-row">
              <p className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-700">
                  {indexOfFirstItem + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-slate-700">
                  {Math.min(indexOfLastItem, filteredData.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-700">
                  {filteredData.length}
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
                  ),
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
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
