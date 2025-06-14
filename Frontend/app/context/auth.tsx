import axios from 'axios';
import React, { createContext, ReactNode, useContext, useState } from "react";

//CHATGPT ME RECOMNEDO ESTO:
//import * as SecureStore from 'expo-secure-store';
//probar -> npx expo install expo-secure-store



/*
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

export const useAuth = () => useContext(AuthContext);*/

//Definimos tipos de datos para que no llore el react
type User = {
  email: string;
  nombre: string;
  role: string;
}

//Datos que almacena el contexto 
type AuthContextType = {
  authToken: string | null;
  refreshToken: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>; 
  logout: () => void;
}

type AuthProviderType = {
  children: ReactNode;
}

// Creamos un contexto para guardar info globalmente (mientras no se cierre la app)
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderType) => {
  const [authToken, setAuthToken] = useState<string | null>(null); //<tipos de dato posible>(tipo de dato con el q se crea)
  const [refreshToken, setRefreshToken] = useState<string | null>(null); //<tipos de dato posible>(tipo de dato con el q se crea)

  const [user, setUser] = useState<User | null>(null);
  

  //Función que se puede llamar desde cualquier parte si se llama al contexto
  const login = async (email: string, password: string): Promise<void> => {


      //Para acceder desde el pc la ruta es es: http://localhost:8000/token (endpoint de la api de bakcend)
      //Para acceder desde el celular la ruta es: http://<ipv4 del pc>:8000/token 
      //Eso pasa porque el celular no hace la conuslta al localhost (a el mismo) sino que lo hace al pc
    try{
      const response = await axios.post('http://localhost:8000/token/', {
        username: email,
        password: password
      });


      console.log("Token_obtained");
      console.log(response.data);

      //Cosas que nos da el backend
      const authtoken = response.data.access;
      const refreshToken = response.data.refresh;
      const nombre = response.data.nombre;
      const role = response.data.role;

      setAuthToken(authtoken);
      setRefreshToken(refreshToken);
      setUser({email: email, nombre: nombre, role:  role});

    }
    catch (error: unknown){
      throw error; // parar que se haga handling desde donde lo llamaron (pa q se pueda modificar en las vistas)
    } 
  };

  //Función global que se utilizará para cerrar sesión
  const logout = () => {
    setAuthToken(null);
    setRefreshToken(null);
    setUser(null);
  };


  //Al llamarlo entonces tendra acceso a las cosas que aparecen en value definidas en el tipo de datos más arriba
  return (
    <AuthContext.Provider value={{ authToken, refreshToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );

};

//useAuth nos servirá para llamar al contexto desde cualquier parte
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
