import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';

const objetivos = [
  { id: 1, nombre: 'Mejorar comunicación', categoria: 'Comunicación' },
  { id: 2, nombre: 'Fomentar autonomía', categoria: 'Motricidad' },
  { id: 3, nombre: 'Desarrollar habilidades motoras', categoria: 'Motricidad' },
  { id: 4, nombre: 'Reducir conductas disruptivas', categoria: 'Conducta' },
];

const categoriaColores = {
  Comunicación: '#4f83cc',
  Motricidad: '#81c784',
  Cognición: '#f48fb1',
  Conducta: '#ffb74d',
  default: '#b0bec5',
};

export default function CustomMultiSelect({ items, selected, onChange }) {
  const [search, setSearch] = useState('');
  

  // Filtrar los ítems según búsqueda
  const filteredItems = useMemo(() => {
    if (!search) return items;
    return items.filter(item =>
      item.nombre.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, items]);

  const toggleItem = id => {
    if (selected.includes(id)) {
      onChange(selected.filter(i => i !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <View>
      {/* Chips */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 2 }}>
        {selected.map(id => {
          const item = items.find(i => i.id === id);
          if (!item) return null;
          const color = categoriaColores[item.categoria] || categoriaColores.default;

          return (
            <View
              key={id}
              style={{
                backgroundColor: color,
                borderRadius: 18,
                paddingHorizontal: 12,
                paddingVertical: 4,
                marginRight: 8,
                marginBottom: 6,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white', marginRight: 6 }}>{item.nombre}</Text>
              <TouchableOpacity onPress={() => toggleItem(id)}>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>×</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      {/* Input de búsqueda */}
      <TextInput
        placeholder="Buscar..."
        value={search}
        onChangeText={setSearch}
        style={{
          borderWidth: 1,
          borderColor: '#999',
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 12,
          marginBottom: 8,
        }}
      />

      {/* Lista */}
      <ScrollView style={{ maxHeight: 160, marginBottom: 8 }} nestedScrollEnabled={true} persistentScrollbar={true}>
        {filteredItems.map(item => {
            const isSelected = selected.includes(item.id);
            const color = categoriaColores[item.categoria] || categoriaColores.default;

            return (
            <TouchableOpacity
                key={item.id.toString()}
                onPress={() => toggleItem(item.id)}
                style={{
                padding: 12,
                backgroundColor: '#f0f0f0',
                borderWidth: 1,
                borderColor: isSelected ? color : '#f0f0f0',
                borderRadius: 12,
                marginBottom: 6,
                }}
            >
                <Text style={{ color: isSelected ? color : '#333' }}>{item.nombre}</Text>
            </TouchableOpacity>
            );
        })}
      </ScrollView>
    </View>
  );
}
