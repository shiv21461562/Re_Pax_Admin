const BASE_URL = "http://electrocurrent.com/api";

export const getContacts = async () => {
const token = sessionStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/contacts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
};

export const getBrochureLeads = async () => {
  const token = sessionStorage.getItem("token");

  const response = await fetch(
    `${BASE_URL}/contacts?source=brochure`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await response.json();
};

export const deleteContact = async (id) => {
const token = sessionStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/contacts/delete/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
};