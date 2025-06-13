import { createContext, useContext } from "react";

export const DescartarCambiosObjetivoContext = createContext({
    handleDescartarCambiosObjetivo: null,
});

export const useDescartarCambiosObjetivo = () => useContext(DescartarCambiosObjetivoContext);