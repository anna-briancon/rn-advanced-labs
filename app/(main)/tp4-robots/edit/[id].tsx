
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import RobotForm from '../../../tp4-robots-zustand/components/RobotForm';
import { useRobotsStore } from '../../../tp4-robots-zustand/store/robotsStore';

export default function EditRobotScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const getById = useRobotsStore(s => s.getById);
  const update = useRobotsStore(s => s.update);
  const router = useRouter();
  const robot = getById(id!);

  if (!robot) return <RobotNotFound />;

  const handleEdit = async (values: import('../../../tp4-robots-zustand/validation/robotSchema').RobotInput) => {
    update(robot.id, values);
    router.replace('/tp4-robots');
  };

  return (
    <RobotForm
      mode="edit"
      initialValues={robot}
      onSubmit={handleEdit}
      submitLabel="Enregistrer"
    />
  );
}

function RobotNotFound() {
  return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text>Robot introuvable.</Text></View>;
}
