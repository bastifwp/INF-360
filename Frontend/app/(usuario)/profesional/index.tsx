import SelectorPaciente from "../../components/SelectorPaciente";
import { useAuth } from "../../context/auth";

export default function InicioProfesional() {

  const { user } = useAuth();
  
  return (
    <SelectorPaciente rol="profesional" nombre={user.nombre}/>
  );
  
}