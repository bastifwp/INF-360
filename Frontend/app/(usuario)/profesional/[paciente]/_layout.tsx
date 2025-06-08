import { icons } from '@/constants/icons';
import { Tabs, useLocalSearchParams } from 'expo-router';
import { Image, StatusBar, Text } from 'react-native';
//import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';


const TabIcon = ({ focused, icon }: any) => {
    return (
       <Image
            source={icon}
            style={{
                width: 24,
                height: 24,
                tintColor: focused ? "#FFFFFF" : "#bdbbb3",
                marginTop: 12
            }}
        />
    )
}

const TabLabel = ({ focused, text }: any) => {
    return (
        <Text className='text-xs' style={{
            color: focused?"#FFFFFF"  : "#bdbbb3",
            marginTop: 9
        }}>{text}</Text>
    )
}

const _layout = () => {

  const { patient } = useLocalSearchParams<{ patient: string }>();  

  return (
        <>
            <StatusBar hidden={false} className="bg-primary"/>

            <Tabs
                screenOptions={{
                    tabBarStyle:{
                        backgroundColor: "#114F80",
                        borderRadius: 50,
                        marginHorizontal: 10,
                        marginBottom: 10,
                        height: 70,
                        position: 'absolute'
                    },
                    tabBarItemStyle: {
                        width:"100%",
                        height:"100%",
                        justifyContent: 'center',
                        alignItems: 'center',

                    },
                }}
                >
                <Tabs.Screen
                    name="index"
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <TabIcon focused={focused} icon={icons.inicio}/>
                        ),
                        tabBarLabel: ({ focused }) => (
                            <TabLabel focused={focused} text="Inicio"/>
                        )
                    }}
                />
                <Tabs.Screen
                    name="Plan"
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <TabIcon focused={focused} icon={icons.plan}/>
                        ),
                        tabBarLabel: ({ focused }) => (
                            <TabLabel focused={focused} text="Plan"/>
                        )
                    }}
                />
                <Tabs.Screen
                    name="Bitacora"
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <TabIcon focused={focused} icon={icons.bitacora}/>
                        ),
                        tabBarLabel: ({ focused }) => (
                            <TabLabel focused={focused} text="Bitácora"/>
                        )
                    }}
                />
                <Tabs.Screen
                    name="Chat"
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <TabIcon focused={focused} icon={icons.chat}/>
                        ),
                        tabBarLabel: ({ focused }) => (
                            <TabLabel focused={focused} text="Chat"/>
                        )
                    }}
                />
            </Tabs>
        </>
  )
}

export default _layout