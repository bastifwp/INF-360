import { useAuth } from "../../context/auth";
import SelectorPaciente from "../../components/SelectorPaciente";

export default function InicioCuidador() {
  
  const { user } = useAuth();
    
    return (
      <SelectorPaciente rol="cuidador" nombre={user.nombre}/>
    );
  
}