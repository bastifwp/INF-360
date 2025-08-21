import React, { useMemo, useState, Dispatch, SetStateAction } from "react";
import { Ionicons } from '@expo/vector-icons';
import { Button, Platform, ScrollView, Text, TextInput, Touchable, TouchableOpacity, View } from "react-native"; 
import { colors } from "@/constants/colors";
import { BotonRadio } from "@/components/base/Boton";
import { CustomModal } from "@/components/base/Modal";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatearFechaDDMMYYYY } from "./FormatearFecha";

function capitalizeFirstLetter(text: string) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

interface FormularioCampoLabelProps {
  label: string;
  asterisco?: boolean;
  tipo?: number;
}

export function FormularioCampoLabel({
  label,
  asterisco,
  tipo = 1,
}: FormularioCampoLabelProps) {
  const estilos = estilosPorTipo[tipo] || estilosPorTipo[1];

  return (
    <Text className={estilos.label}>
      {label}{" "}
      {asterisco === true && <Text style={{ color: colors.mediumred }}>*</Text>}
      {asterisco === false && (
        <Text className="text-base" style={{ color: colors.mediumgrey }}>(opcional)</Text>
      )}
    </Text>
  );
}

const estilosPorTipo: Record<
  number,
  {
    container: string;
    label: string;
    input: string;
    placeholderColor: string;
  }
> = {
  1: {
    container: "w-full",
    label: "text-primary font-semibold mb-1",
    input: "border border-primary rounded-xl text-start px-4 mb-1",
    placeholderColor: colors.mediumgrey,
  },
  2: {
    container: "w-full",
    label: "text-black font-semibold mb-1",
    input: "border border-mediumgrey rounded-xl text-start px-4 mb-1",
    placeholderColor: colors.mediumdarkgrey,
  },
};

interface CampoFormularioProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  tipo?: number;
  maxLength?: number;
  multiline?: boolean;
  numberOfLines?: number;
  radioButton?: boolean;
  options?: string[];
  optionsLabel?: string[];
  desplegable?: boolean;
  open?: boolean; // estado externo
  setOpen?: (open: boolean) => void; // setter externo
  asterisco?: boolean;
}

export function FormularioCampo({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none",
  tipo = 1,
  maxLength,
  multiline = false,
  numberOfLines,
  radioButton = false,
  options,
  desplegable = false,
  open: openProp,
  setOpen: setOpenProp,
  asterisco,
}: CampoFormularioProps) {
  const estilos = estilosPorTipo[tipo] || estilosPorTipo[1];
  const [openInternal, setOpenInternal] = React.useState(false);
  const open = openProp !== undefined ? openProp : openInternal;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenInternal;
  return (
    <View className={estilos.container}>
      {label ? (
        <FormularioCampoLabel label={label} asterisco={asterisco} tipo={tipo}/>
      ) : null}
      {radioButton && options.length > 0 ? (
        <View>
          {options.map((option) => (
            <BotonRadio
              key={option}
              label={capitalizeFirstLetter(option)}
              value={option}
              selected={value === option}
              onSelect={onChangeText}
            />
          ))}
        </View>
      ) : (
        <View className="w-full relative">
          <TextInput
            className={estilos.input}
            style={{ paddingRight: 40 }}
            placeholder={placeholder}
            placeholderTextColor={estilos.placeholderColor}
            secureTextEntry={secureTextEntry}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            maxLength={maxLength}
            multiline={multiline}
            numberOfLines={numberOfLines}
            textAlignVertical={multiline ? "top" : "auto"}
          />
          {desplegable && (
            <TouchableOpacity
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: [{ translateY: -12 }],
              }}
              onPress={() => setOpen(!open)}
            >
              <Ionicons
                name={open ? "chevron-up" : "chevron-down"}
                size={24}
                color={colors.mediumgrey}
              />
            </TouchableOpacity>
          )}
          {maxLength && (
            <Text
              className="text-xs text-right mt-1"
              style={{ color: colors.mediumgrey }}
            >
              {value.length} / {maxLength}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

export function FormularioCampoSelect({
  label,
  items,
  selectedId,
  onChange,
  placeholder,
  asterisco,
  tipo,
}) {

  //ESTADOS
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredItems = useMemo(() => {
    if (!search) return items;
    return items.filter(item => item.titulo.toLowerCase().includes(search.toLowerCase()));
  }, [search, items]);

  const handleSelect = (id) => {
    onChange(id);
    setOpen(false); //Cerrar el modal al seleccionar
  };

  const selectedItem = items.find(i => i.id === selectedId);

  //VISTA
  return (
    <View>
      <FormularioCampoLabel label={label} asterisco={asterisco} tipo={tipo}/>
      {/*CAMPO PARA ABRIR MODAL*/}
      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={{
          backgroundColor: selectedItem ? selectedItem.color : 'white',
          borderWidth: 1,
          borderColor: selectedItem ? selectedItem.color : colors.mediumgrey,
          borderRadius: 8,
          padding: 12,
          marginBottom: 6,
        }}
      >
        <Text style={{ color: selectedItem ? 'white' : colors.mediumdarkgrey }}>
          {selectedItem ? selectedItem.titulo : placeholder}
        </Text>
      </TouchableOpacity>
      {/*MODAL*/}
      <CustomModal tipo="0" visible={open} onClose={() => setOpen(false)}>
        <View className="flex-1 gap-2">
          <View className="gap-1">
            <Text className="text-black text-xl font-bold">{label}</Text>
            <Text className="text-mediumgrey text-sm">{"Selecciona una opción"}</Text>
          </View>
          <ScrollView className="flex-1">
            {filteredItems.map(item => {
              const isSelected = selectedId === item.id;
              const color = item.color || colors.primary;
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => handleSelect(item.id)}
                  style={{
                    padding: 12,
                    marginBottom: 6,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: isSelected ? color : colors.lightgrey,
                    backgroundColor: isSelected ? colors.light : colors.lightgrey,
                  }}
                >
                  <Text style={{ color: isSelected ? color : colors.mediumdarkgrey }}>
                    {item.titulo}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </CustomModal>
    </View>
  );
}

interface ItemMultiSelect<T extends string | number> {
  id: T;
  titulo: string;
  color?: string;
}

interface FormularioCampoMultiSelectProps<T extends string | number> {
  label: string;
  items: ItemMultiSelect<T>[];
  selected: T[];
  onChange: (selectedIds: T[]) => void;
  placeholder: string;
  placeholderSelected?: string;
  asterisco?: boolean;
  tipo?: number;
  onAddItem?: (item: ItemMultiSelect<T>) => void; // opcional
}
export function FormularioCampoMultiSelect<T extends string | number>({
  label,
  items,
  selected,
  onChange,
  placeholder,
  placeholderSelected,
  asterisco,
  tipo,
  onAddItem,
}: FormularioCampoMultiSelectProps<T>) {

  //ESTADOS
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [addingNew, setAddingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const filteredItems = useMemo(() => {
    if (!search) return items;
    return items.filter(item => item.titulo.toLowerCase().includes(search.toLowerCase()));
  }, [search, items]);

  const toggleItem = (id: T) => {
    if (selected.includes(id)) {
      onChange(selected.filter(i => i !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  //HANDLE: ADD
  const handleAdd = () => {
    if (!newTitle.trim()) return;

    // Crear id compatible con T
    const newId: T = (typeof selected[0] === "number" ? Date.now() : Date.now().toString()) as T;

    const newItem: ItemMultiSelect<T> = { id: newId, titulo: newTitle };
    if (onAddItem) onAddItem(newItem);
    onChange([...selected, newItem.id]);
    setNewTitle('');
    setAddingNew(false);
  };

  //VISTA
  return (
    <View>
      <FormularioCampoLabel label={label} asterisco={asterisco} tipo={tipo}/>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 2 }}>
        {selected.map(id => {
          const item = items.find(i => i.id === id);
          if (!item) return null;
          const color = item.color || colors.primary;
          return (
            <TouchableOpacity
              key={id}
              onPress={() => toggleItem(id)}
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
              <Text style={{ color: 'white', marginRight: 6 }}>{item.titulo}</Text>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>×</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={{
          borderWidth: 1,
          borderColor: colors.mediumgrey,
          borderRadius: 8,
          padding: 10,
          marginBottom: 6,
        }}
      >
        <Text className="text-mediumdarkgrey">
          {selected.length > 0
            ? `${selected.length} ${placeholderSelected}`
            : placeholder}
        </Text>
      </TouchableOpacity>
      <CustomModal tipo="0" visible={open} onClose={() => {setAddingNew(false); setOpen(false)}}>
        <View className="flex-1 gap-2">
          <View className="gap-1">
            <Text className="text-black text-xl font-bold">{label}</Text>
            <Text className="text-mediumgrey text-sm">{"Selecciona una o más opciones"}</Text>
          </View>
          <ScrollView className="flex-1">
            {filteredItems.map(item => {
              const isSelected = selected.includes(item.id);
              const color = item.color || colors.primary;
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => toggleItem(item.id)}
                  style={{
                    padding: 12,
                    marginBottom: 6,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: isSelected ? color : colors.lightgrey,
                    backgroundColor: isSelected ? colors.light : colors.lightgrey,
                  }}
                >
                  <Text style={{ color: isSelected ? color : colors.mediumdarkgrey }}>
                    {item.titulo}
                  </Text>
                </TouchableOpacity>
              );
            })}
            {onAddItem && (
              addingNew ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TextInput
                    value={newTitle}
                    onChangeText={setNewTitle}
                    placeholder="Nueva opción"
                    className="flex-1 p-2 mb-2 mr-2"
                    style={{
                      borderColor: colors.mediumgrey,
                      borderWidth: 1,
                      borderRadius: 8,
                    }}
                  />
                  <TouchableOpacity
                    onPress={handleAdd}
                    className="p-2 mb-2 flex-row items-center start-right"
                    style={{
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: colors.secondary,
                      backgroundColor: colors.secondary,
                    }}
                  >
                    <Ionicons name={"add"} size={24} color={colors.white}/>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => setAddingNew(true)}
                  className="p-2 mb-2 flex-row items-center start-right"
                  style={{
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: colors.secondary,
                    backgroundColor: colors.secondary,
                  }}
                >
                  <Ionicons name={"add"} size={24} color={colors.white}/>
                  <Text className="text-white font-semibold">Agregar nueva opción</Text>
                </TouchableOpacity>
              )
            )}
          </ScrollView>
        </View>
      </CustomModal>
    </View>
  );
}

interface FormularioCampoFechaNacimientoProps {
  fecha: Date | null;
  setFecha: Dispatch<SetStateAction<Date | null>>;
  label: string;
  placeholder: string;
  asterisco?: boolean;
  tipo?: number;
}
export function FormularioCampoFechaNacimiento({ label, placeholder, asterisco, tipo, fecha, setFecha }: FormularioCampoFechaNacimientoProps) {
  const [show, setShow] = useState(false);
  const onChange = (event: any, selectedDate: Date | undefined) => {
    setShow(Platform.OS === "ios");
    if (selectedDate) setFecha(selectedDate);
  };
  return (
    <View>
      <FormularioCampoLabel label={label} asterisco={asterisco} tipo={tipo}/>
      <TouchableOpacity
        onPress={() => setShow(true)}
        style={{
          backgroundColor: 'white',
          borderWidth: 1,
          borderColor: colors.mediumgrey,
          borderRadius: 8,
          padding: 10,
          marginBottom: 6,
        }}
      >
        <Text className="text-left" style={{ color: colors.mediumdarkgrey }}>
          {fecha ? formatearFechaDDMMYYYY(fecha.toLocaleDateString("es-CL", { day: "2-digit", month: "2-digit", year: "numeric" })) : placeholder}
        </Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          value={fecha || new Date()}
          mode={"date"}
          display={"default"}
          onChange={onChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
}

//ENTRADA ENVIAR
interface EntradaEnviarProps {
  placeholder?: string;
  onSend: (texto: string) => void;
}
export function EntradaEnviar({
  placeholder,
  onSend,
}: EntradaEnviarProps) {
  //ESTADOS
  const [texto, setTexto] = useState("");
  const [inputHeight, setInputHeight] = useState(40);
  //VISTA
  return (
    <View
      className="bg-light pb-4 pt-2 flex-row items-end"
      style={{
        borderTopWidth: 0.5,
        borderTopColor: colors.mediumgrey,
      }}
    >
      <TextInput
        className="bg-lightgrey text-black rounded-lg p-2 flex-1"
        style={{
          minHeight: 40,
          maxHeight: 200,
          height: inputHeight,
          textAlignVertical: "top",
        }}
        placeholder={placeholder}
        value={texto}
        onChangeText={setTexto}
        multiline
        maxLength={500}
        onContentSizeChange={(e) =>
          setInputHeight(Math.max(40, e.nativeEvent.contentSize.height))
        }
      />
      <TouchableOpacity
        className="bg-secondary rounded-full p-2 ml-2 justify-center items-center"
        onPress={() => {
          onSend(texto);
          setTexto("");
          setInputHeight(40);
        }}
      >
        <Ionicons name="send" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}