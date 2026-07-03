import axios from "axios";

const API_URL = "http://localhost:5000/api/agendas";

export const getAgendas = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createAgenda = async (data) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateAgenda = async (id, data) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(`${API_URL}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deleteAgenda = async (id) => {
  const token = localStorage.getItem("token");

  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
