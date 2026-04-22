import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="barn" size={28} color={color} />
        ),
        }}
      />
      <Tabs.Screen
        name="galpoes"
        options={{
          title: "Galpões",
          tabBarIcon: ({ color }) => (
<           MaterialCommunityIcons name="format-list-bulleted" size={28} color={color} />          ),
        }}
      />
      <Tabs.Screen
        name="coletas"
        options={{
          title: "Coletas",
          tabBarIcon: ({ color }) => (
<           MaterialCommunityIcons name="calendar" size={28} color={color} />          ),
        }}
      />
    </Tabs>
  );
}
  