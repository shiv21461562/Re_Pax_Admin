import axios from "axios";

const API_URL = "https://electrocurrent.com/api/speakers";

export const getSpeakers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createSpeaker = async (formData) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    API_URL,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
export const updateSpeaker = async (id, formData) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(
    `${API_URL}/${id}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
export const deleteSpeaker = async (id) => {
  const token = localStorage.getItem("token");

  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
