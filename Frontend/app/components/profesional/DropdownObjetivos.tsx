import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';

const categorias = ['Comunicación', 'Motricidad', 'Cognición', 'Conducta'];

const categoriaColores = {
  Comunicación: '#4f83cc',  // Azul
  Motricidad: '#81c784',    // Verde
  Cognición: '#f48fb1',     // Rosado
  Conducta: '#ffb74d',      // Naranjo
  default: '#b0bec5',       // Gris
};

const CategoriaDropdown = ({ selected, onSelect }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (categoria) => {
    onSelect(categoria);
    setOpen(false);
  };

  return (
    <View className="my-2 mb-4">
      {/* Botón principal */}
      <TouchableOpacity
        className="border border-gray-400 rounded-xl px-4 py-3"
        style={{
          borderColor: selected ? categoriaColores[selected] || categoriaColores.default : '#ccc',
        }}
        onPress={() => setOpen(!open)}
      >
        <Text className={`text-base ${selected ? 'text-gray-900' : 'text-gray-500'}`}>
          {selected || 'Selecciona una categoría'}
        </Text>
      </TouchableOpacity>

      {/* Lista desplegable */}
      {open && (
        <View className="bg-white rounded-xl border border-gray-300 shadow-lg">
          {categorias.map((item) => {
            const color = categoriaColores[item] || categoriaColores.default;
            return (
              <TouchableOpacity
                key={item}
                className="px-4 py-3 border-b border-gray-200"
                style={{
                  borderLeftWidth: 5,
                  borderLeftColor: color,
                }}
                onPress={() => handleSelect(item)}
              >
                <Text className="text-base text-gray-900">{item}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default CategoriaDropdown;
