import React, { useState, useEffect } from "react";
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiFileText,
  FiImage,
  FiX,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../services/BlogApi";

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    author: "",
    short_description: "",
    content: "",
    image: "",
    status: "Draft",
  });

  // Toast State
  const [toast, setToast] = useState(null);
  const [progress, setProgress] = useState(0);

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    blogId: null,
  });

  // Toast function
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setProgress(0);
  };

  // Auto-dismiss toast with progress bar
  useEffect(() => {
    if (toast) {
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

  // Fetch Blogs
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await getBlogs();
      setBlogs(response.data || []);
      setError(null);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setError("Failed to load blogs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Calculate stats
  const publishedCount = blogs.filter(
    (blog) => blog.status === "Published",
  ).length;
  const draftCount = blogs.filter((blog) => blog.status === "Draft").length;

  const resetForm = () => {
    setSelectedImage(null);
    setFormData({
      title: "",
      category: "",
      author: "",
      short_description: "",
      content: "",
      image: "",
      status: "Draft",
    });
    setEditingBlog(null);
    setFormErrors({});
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.category.trim()) errors.category = "Category is required";
    if (!formData.author.trim()) errors.author = "Author is required";
    if (!formData.short_description.trim())
      errors.short_description = "Short description is required";
    if (!formData.content.trim()) errors.content = "Content is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const blogForm = new FormData();

      blogForm.append("title", formData.title.trim());
      blogForm.append("category", formData.category.trim());
      blogForm.append("author", formData.author.trim());
      blogForm.append("status", formData.status);
      blogForm.append("short_description", formData.short_description.trim());
      blogForm.append("content", formData.content.trim());

      if (selectedImage) {
        blogForm.append("image", selectedImage);
      }

      if (editingBlog) {
        await updateBlog(editingBlog.id, blogForm);
        showToast("Blog updated successfully!", "success");
      } else {
        await createBlog(blogForm);
        showToast("Blog created successfully!", "success");
      }

      await fetchBlogs();
      resetForm();
      setShowModal(false);
      setError(null);
    } catch (error) {
      console.error("Error saving blog:", error);
      showToast(
        error.response?.data?.message || "Failed to save blog",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title || "",
      category: blog.category || "",
      author: blog.author || "",
      short_description: blog.short_description || "",
      content: blog.content || "",
      image: blog.image || "",
      status: blog.status || "Draft",
    });
    setSelectedImage(null);
    setFormErrors({});
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);

      await deleteBlog(deleteModal.blogId);

      await fetchBlogs();

      showToast("Blog deleted successfully!", "success");

      setDeleteModal({
        open: false,
        blogId: null,
      });
    } catch (error) {
      showToast("Failed to delete blog", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    resetForm();
    setShowModal(false);
    setError(null);
    setFormErrors({});
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      showToast(
        "Please upload a valid image (JPEG, PNG, WEBP, or GIF)",
        "error",
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("Image size should be less than 5MB", "error");
      return;
    }

    setSelectedImage(file);
    setFormData({
      ...formData,
      image: URL.createObjectURL(file),
    });
  };

  const removeImage = () => {
    setSelectedImage(null);
    setFormData({ ...formData, image: "" });
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-4 relative overflow-hidden border border-slate-100">
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  toast.type === "success" ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {toast.type === "success" ? (
                  <FiCheckCircle className="text-green-600 text-xl" />
                ) : (
                  <FiAlertCircle className="text-red-600 text-xl" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`font-semibold ${
                    toast.type === "success" ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {toast.type === "success" ? "Success!" : "Error!"}
                </p>
                <p className="text-slate-600 text-sm break-words">
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => {
                  setToast(null);
                  setProgress(0);
                }}
                className="text-slate-400 hover:text-slate-600 flex-shrink-0"
              >
                <FiX size={18} />
              </button>
            </div>
            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100">
              <div
                className={`h-full transition-all duration-100 ${
                  toast.type === "success" ? "bg-green-500" : "bg-red-500"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Blog Management</h1>
          <p className="mt-1 text-slate-500">Manage all blog posts here</p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-medium text-white hover:bg-orange-600 transition shadow-lg hover:shadow-orange-200"
        >
          <FiPlus />
          Add Blog
        </button>
      </div>

      {/* Error Alert - Only for critical errors */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 p-4 text-red-700">
          <FiAlertCircle className="text-xl flex-shrink-0" />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <FiX />
          </button>
        </div>
      )}

      {/* Stats Card */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
          <p className="text-sm text-slate-500">Total Blogs</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">
            {loading ? "..." : blogs.length}
          </h3>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
          <p className="text-sm text-slate-500">Published</p>
          <h3 className="mt-2 text-3xl font-bold text-green-600">
            {loading ? "..." : publishedCount}
          </h3>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
          <p className="text-sm text-slate-500">Drafts</p>
          <h3 className="mt-2 text-3xl font-bold text-orange-500">
            {loading ? "..." : draftCount}
          </h3>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="text-lg font-semibold">All Blogs</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Image
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Author
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading && blogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-slate-500">
                    Loading blogs...
                  </td>
                </tr>
              ) : blogs.length > 0 ? (
                blogs.map((blog) => (
                  <tr
                    key={blog.id}
                    className="border-t border-slate-100 hover:bg-slate-50 transition"
                  >
                    <td className="px-6 py-4">
                      <img
                        src={
                          blog.image ||
                          "https://via.placeholder.com/64x48?text=No+Image"
                        }
                        alt={blog.title}
                        className="h-12 w-16 rounded-lg object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/64x48?text=No+Image";
                        }}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">
                        {blog.title}
                      </div>
                      <div className="mt-1 text-xs text-slate-500 line-clamp-2">
                        {blog.short_description}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-600">
                        {blog.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{blog.author}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${
                          blog.status === "Published"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {blog.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(blog)}
                          className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600 transition"
                          title="Edit"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteModal({
                              open: true,
                              blogId: blog.id,
                            })
                          }
                          className="rounded-lg bg-red-500 p-2 text-white hover:bg-red-600 transition"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-slate-500">
                    <FiFileText className="mx-auto text-4xl text-slate-300 mb-3" />
                    No blogs found. Create your first blog post!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>  
      </div>

      {/* Modal -  */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[2px] p-4"
          onClick={handleCloseModal}
        >
          <div
            className="relative w-full max-w-5xl rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white z-10 px-6 pt-5 pb-3 border-b border-slate-200 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">
                  {editingBlog ? "Edit Blog" : "Add New Blog"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8">
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Blog Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter blog title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className={`w-full rounded-lg border ${
                        formErrors.title ? "border-red-500" : "border-slate-200"
                      } px-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition`}
                    />
                    {formErrors.title && (
                      <p className="mt-1 text-xs text-red-500">
                        {formErrors.title}
                      </p>
                    )}
                  </div>

                  {/* Category & Author */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Technology"
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className={`w-full rounded-lg border ${
                          formErrors.category
                            ? "border-red-500"
                            : "border-slate-200"
                        } px-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition`}
                      />
                      {formErrors.category && (
                        <p className="mt-1 text-xs text-red-500">
                          {formErrors.category}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Author <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Author name"
                        value={formData.author}
                        onChange={(e) =>
                          setFormData({ ...formData, author: e.target.value })
                        }
                        className={`w-full rounded-lg border ${
                          formErrors.author
                            ? "border-red-500"
                            : "border-slate-200"
                        } px-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition`}
                      />
                      {formErrors.author && (
                        <p className="mt-1 text-xs text-red-500">
                          {formErrors.author}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Short Description */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Short Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Enter short description"
                      value={formData.short_description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          short_description: e.target.value,
                        })
                      }
                      className={`w-full rounded-lg border ${
                        formErrors.short_description
                          ? "border-red-500"
                          : "border-slate-200"
                      } px-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition resize-none`}
                    />
                    {formErrors.short_description && (
                      <p className="mt-1 text-xs text-red-500">
                        {formErrors.short_description}
                      </p>
                    )}
                  </div>

                  {/* Status */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
                    >
                      <option value="Draft">📝 Draft</option>
                      <option value="Published">✅ Published</option>
                    </select>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Blog Content */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Blog Content <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={8}
                      placeholder="Write full blog content..."
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          content: e.target.value,
                        })
                      }
                      className={`w-full rounded-lg border ${
                        formErrors.content
                          ? "border-red-500"
                          : "border-slate-200"
                      } px-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition resize-none`}
                    />
                    {formErrors.content && (
                      <p className="mt-1 text-xs text-red-500">
                        {formErrors.content}
                      </p>
                    )}
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Blog Image
                    </label>
                    <div className="rounded-lg border-2 border-dashed border-slate-200 p-4 hover:border-orange-400 transition">
                      {formData.image ? (
                        <div className="flex items-center gap-4">
                          <div className="relative flex-shrink-0">
                            <img
                              src={formData.image}
                              alt="Preview"
                              className="h-16 w-24 rounded-lg object-cover border border-slate-200"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                            <button
                              onClick={removeImage}
                              className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 transition shadow-md"
                            >
                              <FiX size={12} />
                            </button>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-700 truncate">
                              {selectedImage
                                ? selectedImage.name
                                : "Image uploaded"}
                            </p>
                            <p className="text-xs text-slate-500">
                              Click below to change
                            </p>
                          </div>
                          <label className="cursor-pointer rounded-lg bg-orange-50 px-3 py-1.5 text-sm font-medium text-orange-600 hover:bg-orange-100 transition flex-shrink-0">
                            Change
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleFileChange}
                            />
                          </label>
                        </div>
                      ) : (
                        <label className="cursor-pointer block">
                          <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-slate-50 p-3 flex-shrink-0">
                              <FiImage className="text-2xl text-slate-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-700">
                                Upload image
                              </p>
                              <p className="text-xs text-slate-400 truncate">
                                PNG, JPG, WEBP up to 5MB
                              </p>
                            </div>
                            <span className="rounded-lg bg-orange-50 px-3 py-1.5 text-sm font-medium text-orange-600 hover:bg-orange-100 transition flex-shrink-0">
                              Browse
                            </span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white px-8 py-4 border-t border-slate-200 rounded-b-2xl">
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCloseModal}
                  className="rounded-lg border border-slate-200 px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="rounded-lg bg-orange-500 px-5 py-2 text-sm font-medium text-white hover:bg-orange-600 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading
                    ? "Saving..."
                    : editingBlog
                      ? "Update Blog"
                      : "Add Blog"}
                </button>
              </div>
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

      {deleteModal.open && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/10 backdrop-blur-[2px]">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-fadeIn">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                <FiTrash2 className="text-red-600 text-3xl" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-center text-slate-900">
              Delete Blog
            </h3>

            <p className="text-center text-slate-500 mt-2">
              Are you sure you want to delete this blog?
              <br />
              This action cannot be undone.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() =>
                  setDeleteModal({
                    open: false,
                    blogId: null,
                  })
                }
                className="flex-1 rounded-xl border border-slate-200 py-3 font-medium hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="flex-1 rounded-xl bg-red-500 py-3 text-white font-medium hover:bg-red-600"
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

export default Blogs;
