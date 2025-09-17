import { Stack } from "expo-router";
import React from "react";
import { HeaderBack } from "../../../components/HeaderBack";

export default function Tp4RobotsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Robots", headerShown: false }}
      />
      <Stack.Screen
        name="create"
        options={{
          title: "Créer un robot",
          headerLeft: () => <HeaderBack />,
        }}
      />
      <Stack.Screen
        name="edit/[id]"
        options={{
          title: "Modifier un robot",
          headerLeft: () => <HeaderBack />,
        }}
      />
    </Stack>
  );
}
