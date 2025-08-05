import axios from "axios";
import Constants from "expo-constants";
import { decode as atob } from "base-64"; //Decodificar token
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl;

//TIPOS
type User = {
  email: string;
  nombre: string;
  role: string;
  cargo?: string;
  institucion?: string;
}

type AuthContextType = {
  authToken: string | null;
  refreshToken: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>; 
  logout: () => void;
  setAuthToken: (arg1: string | null) => void;
  createApi: (authToken, refreshToken, setAuthToken) => any;
}

type AuthProviderType = {
  children: ReactNode;
}

//FUNCIONES ÚTILES
const decodeToken = (token: string) => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (e) {
    console.error("[auth] Error al decodificar token:", e);
    return null;
  }
};

//CONTEXTO
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderType) => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  //REFRESCO AUTOMÁTICO DEL TOKEN
  useEffect(() => {
    if (!authToken || !refreshToken) return;

    const decoded = decodeToken(authToken);
    if (!decoded?.exp) return;

    const expirationTime = decoded.exp * 1000;
    const now = Date.now();
    const delay = expirationTime - now - 30000; // 30s antes

    if (delay > 0) {
      const timeout = setTimeout(() => {
        axios.post(`${API_BASE_URL}/token/refresh`, {
          refresh: refreshToken,
        })
        .then(res => {
          const newAccess = res.data.access;
          setAuthToken(newAccess);
          console.log("[auth] Token actualizado automáticamente");
        })
        .catch(err => {
          console.error("[auth] Error al refrescar token automáticamente", err);
          logout();
        });
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [authToken, refreshToken]);

  //LOGIN
  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/token/`, {
        username: email,
        password: password
      }, {timeout: 5000});

      console.log("[auth] Token_obtained:", response.data);

      const authtoken = response.data.access;
      const refreshToken = response.data.refresh;
      const nombre = response.data.nombre;
      const role = response.data.role;
      const cargo = response.data.cargo;
      const institucion = response.data.institucion;

      setAuthToken(authtoken);
      setRefreshToken(refreshToken);
      setUser({ email: email, nombre: nombre, role: role, cargo: cargo, institucion: institucion });
    } catch (error: unknown) {
      throw error;
    }
  };

  //LOGOUT
  const logout = async () => {
    console.log("[auth] Borrando datos...")
    await AsyncStorage.clear();
    setAuthToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  //API CON INTERCEPTORES
  const createApi = (authToken, refreshToken, setAuthToken) => {
    const api = axios.create({
      baseURL: `${API_BASE_URL}`,
    });

    api.interceptors.request.use(async config => {
      if (authToken) {
        config.headers["Authorization"] = `Bearer ${authToken}`;
      }
      return config;
    });

    api.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          if (refreshToken) {
            try {
              const res = await axios.post(`${API_BASE_URL}/token/refresh`, {
                refresh: refreshToken,
              },
              {timeout: 2000});

              const newAccess = res.data.access;
              setAuthToken(newAccess);

              originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
              return api(originalRequest);
            } catch (e) {
              console.error("[auth] No se pudo refrescar el token", e);
              throw e;
            }
          }
        }
        return Promise.reject(error);
      }
    );

    return api;
  };

  return (
    <AuthContext.Provider value={{ authToken, refreshToken, user, login, logout, createApi, setAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// HOOK PARA USAR EL CONTEXTO
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};