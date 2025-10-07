import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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
    <RobotForm
      mode="create"
      onSubmit={handleSubmit}
      submitLabel="Créer"
      initialValues={{}}
    />
  );
}
