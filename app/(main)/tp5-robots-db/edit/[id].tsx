import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import RobotForm from '../../../tp4-robots-zustand/components/RobotForm';
import { RobotInput } from '../../../tp4-robots-zustand/validation/robotSchema';
import { useRobotQuery, useUpdateRobot } from '../../../tp5-robots-db/hooks/useRobotQueries';

export default function EditRobotScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { data, isLoading } = useRobotQuery(typeof id === 'string' ? id : '');
  const { mutateAsync: updateRobot } = useUpdateRobot();



  const handleSubmit = async (values: RobotInput) => {
    if (typeof id !== 'string') return;
    setSubmitting(true);
    setError(null);
    try {
      await updateRobot({ id, ...values });
      router.back();
    } catch (e) {
      setError('Erreur lors de la sauvegarde');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <ActivityIndicator style={{ flex: 1 }} />;
  if (error) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>{error}</Text></View>;
  if (!data) return null;

  return (
    <RobotForm
      initialValues={{ name: data.name, label: data.label, year: data.year, type: data.type }}
      onSubmit={handleSubmit}
      mode="edit"
      submitLabel="Enregistrer"
    />
  );
}
