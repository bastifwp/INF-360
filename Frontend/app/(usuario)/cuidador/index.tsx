import { Text } from 'react-native';
import SelectorPaciente from "../../components/SelectorPaciente";
import { useAuth } from "../../context/auth";

export default function InicioCuidador() {
  
  const { user } = useAuth();
    
  if (!user) return <Text>User not logged </Text>; 

    return (
      <SelectorPaciente rol="cuidador" nombre={user.nombre}/>
    );
  
}