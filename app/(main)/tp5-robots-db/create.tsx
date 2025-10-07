import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import RobotForm from '../../tp4-robots-zustand/components/RobotForm';
import { RobotInput } from '../../tp4-robots-zustand/validation/robotSchema';
import { useCreateRobot } from '../../tp5-robots-db/hooks/useRobotQueries';
import * as robotRepo from '../../tp5-robots-db/services/robotRepo';

export default function CreateRobotScreen() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { mutateAsync: createRobot } = useCreateRobot();
  const handleSubmit = async (values: RobotInput) => {
    setSubmitting(true);
    setError(null);
    // Validation nom unique
    const existing = await robotRepo.list({ q: values.name });
    if (existing.some((r: robotRepo.Robot) => r.name.toLowerCase() === values.name.toLowerCase())) {
      setSubmitting(false);
      throw new Error('Nom déjà utilisé');
    }
    try {
      await createRobot(values);
      router.replace('/tp5-robots-db');
    } catch (e: any) {
      setError(e?.message ?? 'Erreur lors de la création');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <RobotForm
        mode="create"
        onSubmit={handleSubmit}
        submitLabel="Créer"
        initialValues={{}}
        submitting={submitting}
      />
      {submitting && (
        <ActivityIndicator size="large" color="#1f6feb" style={{ marginTop: 16 }} />
      )}
      {!!error && (
        <Text style={{ color: 'red', marginTop: 16, textAlign: 'center' }}>{error}</Text>
      )}
    </View>
  );
}
