import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);

  const login = (correo, contrasena) => {
    if (correo === "usuario@demo.com" && contrasena === "123456") {
      setUser({ correo, id: 1, nombre: "Juanita Pérez", rol: "profesional" });
      return { success: true };
    }
    if (correo === "cuidador@demo.com" && contrasena === "123456") {
      setUser({ correo, id: 2, nombre: "Juanita Pérez", rol: "cuidador" });
      return { success: true };
    }
    return { success: false, message: "Credenciales inválidas" };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
  
}

export const useAuth = () => useContext(AuthContext);
