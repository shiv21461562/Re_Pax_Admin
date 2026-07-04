const BASE_URL = "http://electrocurrent.com/api";

/*------------Get Registrations------------*/

export const getRegistrations = async () => {
  const token = sessionStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/registrations`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
};

/*------------Delete Registration------------*/

export const deleteRegistration = async (id) => {
  const token = sessionStorage.getItem("token");

  const response = await fetch(
    `${BASE_URL}/registrations/delete/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await response.json();
};