import axios from "axios";

export const TOKEN_KEY = "token";

// Una sola instancia de axios para toda la app, apuntando a la API
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Antes de cada request: si hay token guardado, lo mandamos en el header Authorization
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Después de cada respuesta: si el backend dice 401 con un token guardado, la sesión venció -> al login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem(TOKEN_KEY)) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Saca un mensaje legible de los errores que devuelve el backend ({ message } o { errors: [...] })
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data?.errors?.length) {
      return data.errors.map((e: { message: string }) => e.message).join(". ");
    }
    if (data?.message) {
      return data.message;
    }
  }
  return "Ocurrió un error inesperado";
}
