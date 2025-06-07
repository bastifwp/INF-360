import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';



const InicioP = () => {
  
    const { patient } = useLocalSearchParams();
  
    return (
        <View>
        <Text>InicioP, Este es el inicio del paciente {patient}</Text>
        </View>
    )
}

export default InicioP