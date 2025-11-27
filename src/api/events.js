const apiUrl = import.meta.env.VITE_API_URL;
console.log(apiUrl);

export const fetchEvents = async () => {
  try {
    const response = await fetch(`${apiUrl}/events`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};