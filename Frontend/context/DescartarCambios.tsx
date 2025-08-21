import { createContext, useContext } from "react";

export const DescartarCambiosContext = createContext({
    handleDescartarCambios: null,
});

export const useDescartarCambios = () => useContext(DescartarCambiosContext);