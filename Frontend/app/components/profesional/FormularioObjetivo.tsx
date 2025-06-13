import React, { useState, useEffect, useRef } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native'
import { useRouter, useLocalSearchParams, useNavigation } from "expo-router"

import { DescartarCambiosObjetivoContext } from '../../context/DescartarCambiosObjetivo';

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

const FormularioObjetivo = () => {
    
    const router = useRouter();
    const navigation = useNavigation();
    
    const { paciente, id } = useLocalSearchParams();
    //Si es agregar-objetivo, id es undefined
    //Si es editar-objetivo, id es id_objetivo
    
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [categoria, setCategoria] = useState(null);
    const [loading, setLoading] = useState(true);

    const datosIniciales = useRef({ titulo: '', descripcion: '', categoria: null});

    const modoEdicion = !!id; 
    //Si es agregar-objetivo, modoEdicion es false
    //Si es editar-objetivo, modoEdicion es true

    useEffect(() => {
        if (modoEdicion) {
            const fetchObjetivo = async () => {
                const objetivo = {
                    id,
                    titulo: 'Mejorar comunicación',
                    descripcion: 'Incrementar la interacción social y el lenguaje funcional en el niño.',
                    categoria: 'Comunicación',
                    autor_creacion: 'Dr. Smith',
                    fecha_creacion: '2025-05-01',
                    autor_modificacion: 'Dr. Smith',
                    fecha_modificacion: '2025-05-01',
                };
                setTitulo(objetivo.titulo);
                setDescripcion(objetivo.descripcion);
                setCategoria(objetivo.categoria);
                setLoading(false);
                datosIniciales.current = {
                    titulo: objetivo.titulo,
                    descripcion: objetivo.descripcion,
                    categoria: objetivo.categoria,
                };
            };
            fetchObjetivo();
        } else {
            datosIniciales.current = {
                titulo: '',
                descripcion: '',
                categoria: null,
            };
            setLoading(false);
        }
    }, [modoEdicion, id]);

    const hayCambios = () => {
        return (
            titulo != datosIniciales.current.titulo ||
            descripcion != datosIniciales.current.descripcion ||
            categoria != datosIniciales.current.categoria
        )
    }

    //DESCARTAR CAMBIOS
    useEffect(() => {
        const beforeRemoveListener = navigation.addListener('beforeRemove', (e) => {
            if (!hayCambios()) {
                return;
            }
            e.preventDefault();
            Alert.alert(
                '¿Descartar cambios?',
                'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?',
                [
                    {
                        text: 'No',
                        style: 'cancel',
                        onPress: () => {}
                    },
                    {
                        text: 'Salir',
                        style: 'destructive',
                        onPress: () => navigation.dispatch(e.data.action),
                    }
                ]
            );
        });
        return () => beforeRemoveListener();
    }, [navigation, titulo, descripcion, categoria]);

    //DESCARTAR CAMBIOS
    const handleDescartarCambiosObjetivo = (path) => {
        if (hayCambios()) {
            Alert.alert(
                '¿Descartar cambios?',
                'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?',
                [
                    {
                        text: 'No',
                        style: 'cancel',
                        onPress: () => {}
                    },
                    {
                        text: 'Salir',
                        style: 'destructive',
                        onPress: () => router.push(path),
                    }
                ]
            );
        } else {
            router.push(path);
        }
    };

    const handleGuardar = () => {
        if (!titulo || !descripcion || !categoria) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }
        if (modoEdicion) {
            console.log('Editando objetivo: ', { id, titulo, descripcion, categoria });
            //LLAMADA A LA API
        } else {
            console.log('Creando objetivo: ', { id, titulo, descripcion, categoria });
            //LLAMADA A LA API
            //EL AUTOR DEBE SER EL ID DEL USUARIO (OBTENER POR USEAUTH())
            //LA FECHA SE DEBERÍA CREAR AUTOMÁTICAMENTE EN EL BACKEND
        }
        router.push(`/profesional/${paciente}/plan`)
    }

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <Text className="text-lg text-gray-600">Cargando objetivo...</Text>
            </View>
        );
    };
    
    return (
        
        <DescartarCambiosObjetivoContext.Provider value={{ handleDescartarCambiosObjetivo }}>

            <ScrollView className="flex-1 bg-white">

                {/*TÍTULO*/}    
                <Text className="text-3xl font-bold my-2 align-middle self-center color-primary">
                    {modoEdicion ? 'Editar objetivo' : 'Agregar objetivo'}
                </Text>
                
                {/*INPUT: NOMBRE*/}
                <Text className="font-semibold mb-1">Nombre</Text>
                <TextInput
                    value={titulo}
                    onChangeText={setTitulo}
                    placeholder="Título del objetivo"
                    className="border border-gray-400 rounded-xl px-4 py-3 mb-4"
                />

                {/*INPUT: CATEGORÍA*/}
                <Text className="font-semibold mb-1">Categoría</Text>
                <CategoriaDropdown selected={categoria} onSelect={setCategoria} />

                {/*INPUT: DESCRIPCIÓN*/}
                <Text className="font-semibold mb-1">Descripción</Text>
                <TextInput
                    value={descripcion}
                    onChangeText={setDescripcion}
                    placeholder="Descripción del objetivo"
                    multiline
                    numberOfLines={4}
                    className="border border-gray-400 rounded-xl px-4 py-10 mb-4 text-start"
                />

                <TouchableOpacity
                    onPress={handleGuardar}
                    className="bg-secondary rounded-xl py-3 mx-4 mt-4 mb-8 items-center"
                >
                    <Text className="text-white font-bold text-lg">Guardar</Text>
                </TouchableOpacity>
        
        </ScrollView>

        </DescartarCambiosObjetivoContext.Provider>
  
    );

};

export default FormularioObjetivo;