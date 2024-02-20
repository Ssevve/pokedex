const baseURL = 'https://pokeapi.co/api/v2';

export const pokeAPI = async (endpoint: string) => {
  const res = await fetch(baseURL + endpoint);

  if (!res.ok) {
    return Promise.reject({
      status: res.status,
      message: res.statusText,
    });
  }

  return res.json();
};
