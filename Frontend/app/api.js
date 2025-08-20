import axios from "axios";
import Constants from "expo-constants";

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl;

export const createApi = (authToken, refreshToken, setAuthToken) => {
    
    const api = axios.create({
        baseURL: API_BASE_URL,
    });

    // Agrega token a cada solicitud
    api.interceptors.request.use(async config => {
        //const token = await SecureStore.getItemAsync('accessToken');
        
        if (authToken) {
            config.headers["Authorization"] = `Bearer ${authToken}`;
        }
        return config;
    });

    // Intenta refrescar el token si expiró
    api.interceptors.response.use(
        response => response,
        async error => {
            const originalRequest = error.config;

            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                //const refreshToken = await SecureStore.getItemAsync('refreshToken');

                if (refreshToken) {
                    try {
                    const res = await axios.post(`${API_BASE_URL}/token/refresh/`, {
                        refresh: refreshToken,
                    });

                    const newAccess = res.data.access;
                    //await SecureStore.setItemAsync('accessToken', newAccess);
                    setAuthToken(newAccess);

                    originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;
                    return api(originalRequest);
                    } catch (e) {
                    console.error("No se pudo refrescar el token", e);
                    // Opcional: redirigir al login o limpiar sesión
                    }
                }
            }
            return Promise.reject(error);
        }
    );
    return api
};

// import api from '../api';

// useEffect(() => {
//   api.get('/objetivo/1')
//      .then(res => console.log(res.data))
//      .catch(err => console.log(err));
// }, []);


// useEffect(() => {
//   const actualizarObjetivo = async () => {
//     try {
//       const datosActualizados = {
//         titulo: "Nuevo título del objetivo",
//         descripcion: "Descripción modificada del objetivo",
//         categoria: "Salud",
//         // otros campos que tu serializer espera
//       };

//       const res = await api.put('/objetivo/1/', datosActualizados); // ← el JSON va aquí
//       console.log("Respuesta:", res.data);
//     } catch (err) {
//       console.error("Error al actualizar:", err.response?.data || err.message);
//     }
//   };

//   actualizarObjetivo();
// }, []);