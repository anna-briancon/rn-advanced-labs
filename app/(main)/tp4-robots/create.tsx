import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView } from 'react-native';
import RobotForm from '../../tp4-robots-zustand/components/RobotForm';
import { useRobotsStore } from '../../tp4-robots-zustand/store/robotsStore';
import type { RobotInput } from '../../tp4-robots-zustand/validation/robotSchema';

export default function CreateRobotScreen() {
  const create = useRobotsStore(s => s.create);
  const router = useRouter();

  const onSubmit = async (values: RobotInput) => {
    create(values);
    router.replace('/tp4-robots'); // retour explicite à la liste
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <RobotForm mode="create" onSubmit={onSubmit} />
    </SafeAreaView>
  );
}
