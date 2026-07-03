  import axios from "axios";

  const API_URL = "http://localhost:5000/api/blogs";

  const getToken = () => sessionStorage.getItem("token");

  export const getBlogs = async () => {
    const response = await axios.get(API_URL);
    return response.data;
  };

  export const getBlogById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  };

  export const createBlog = async (formData) => {
    const response = await axios.post(API_URL, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  };

  export const updateBlog = async (id, formData) => {
    const response = await axios.put(`${API_URL}/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  };

  export const deleteBlog = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    return response.data;
  };