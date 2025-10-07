import { Tabs } from "expo-router";


import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

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
            <AntDesign name="form" size={24} color={color} />
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
            <AntDesign name="form" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="TP3-forms/rhf/components/FormTextInput"
        options={{
          title: "TP3 - RHF",
          href: null,
        }}
      />
      <Tabs.Screen
        name="TP3-forms/rhf/components/TermsSwitch"
        options={{
          title: "TP3 - RHF",
          href: null,
        }}
      />
      <Tabs.Screen
        name="tp4-robots"
        options={{
          title: "TP4 - Robots",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="robot" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tp4-robots/edit/[id]"
        options={{
          title: "Éditer Robot",
          href: null,
        }}
      />
      <Tabs.Screen
        name="tp4-robots/create"
        options={{
          title: "Créer Robot",
          href: null,
        }}
      />
      <Tabs.Screen
        name="tp4-robots-rtk"
        options={{
          title: "TP4 - Robots RTK",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="robot" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tp4-robots-rtk/edit/[id]"
        options={{
          title: "Éditer Robot",
          href: null,
        }}
      />
      <Tabs.Screen
        name="tp4-robots-rtk/create"
        options={{
          title: "Créer Robot",
          href: null,
        }}
      />
      <Tabs.Screen
        name="tp5-robots-db"
        options={{
          title: "TP5 - Robots DB",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="robot" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tp5-robots-db/edit/[id]"
        options={{
          title: "Éditer Robot",
          href: null,
        }}
      />
      <Tabs.Screen
        name="tp5-robots-db/create"
        options={{
          title: "Créer Robot",
          href: null,
        }}
      />
      <Tabs.Screen
        name="TP6-camera"
        options={{
          title: "TP6 - Camera",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="camera" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="TP6-camera/camera"
        options={{
          title: "Prendre Photo",
          href: null,
        }}
      />
      <Tabs.Screen
        name="TP6-camera/detail/[id]" 
        options={{
          title: "Choisir Photo",
          href: null,
        }}
      />
    </Tabs>
  );
}
