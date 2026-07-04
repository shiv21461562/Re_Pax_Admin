import axios from "axios";

const API_URL = "http://electrocurrent.com/api/booth-bookings";

export const getBoothBookings = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const deleteBoothBooking = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};