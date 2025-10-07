import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import RobotForm from '../../../tp4-robots-zustand/components/RobotForm';
import { RobotInput } from '../../../tp4-robots-zustand/validation/robotSchema';
import { getById, update } from '../../../tp5-robots-db/services/robotRepo';

export default function EditRobotScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [robot, setRobot] = useState<RobotInput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (typeof id === 'string') {
      getById(id)
        .then(r => {
          if (r) {
            setRobot({ name: r.name, label: r.label, year: r.year, type: r.type });
          } else {
            setError('Robot introuvable');
          }
        })
        .catch(() => setError('Erreur lors du chargement'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = async (values: RobotInput) => {
    if (typeof id !== 'string') return;
    setSubmitting(true);
    setError(null);
    try {
      await update(id, values);
      router.back();
    } catch (e) {
      setError('Erreur lors de la sauvegarde');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;
  if (error) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>{error}</Text></View>;
  if (!robot) return null;

  return (
    <RobotForm
      initialValues={robot}
      onSubmit={handleSubmit}
      mode="edit"
      submitLabel="Enregistrer"
    />
  );
}
