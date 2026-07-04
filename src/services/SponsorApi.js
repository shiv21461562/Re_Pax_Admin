import axios from "axios";

const API_URL = "https://electrocurrent.com/api/sponsors";

export const getSponsors = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createSponsor = async (formData) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(API_URL, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const updateSponsor = async (id, formData) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(`${API_URL}/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const deleteSponsor = async (id) => {
  const token = localStorage.getItem("token");

  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};



// get sponsorCategory

export const getSponsorCategories = async () => {
  const response = await axios.get(
    "http://localhost:5000/api/sponsor-categories"
  );
  return response.data;
};