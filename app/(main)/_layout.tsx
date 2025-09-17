import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: true,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tp1-profile-card"
        options={{
          title: "Profile Card",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="detail"
        options={{
          title: "Détail",
          href: null,
        }}
      />
      <Tabs.Screen
        name="TP3-forms/formik"
        options={{
          title: "TP3 - Formik",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="checkmark.seal.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="TP3-forms/formik/components/FormTextInput"
        options={{
          title: "TP3 - Formik",
          href: null,
        }}
      />
      <Tabs.Screen
        name="TP3-forms/formik/components/TermsSwitch"
        options={{
          title: "TP3 - Formik",
          href: null,
        }}
      />
      <Tabs.Screen
        name="TP3-forms/rhf"
        options={{
          title: "TP3 - RHF",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="checkmark.seal.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
