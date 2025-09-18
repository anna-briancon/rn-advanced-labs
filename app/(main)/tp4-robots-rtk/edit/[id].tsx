import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import RobotForm from '../../../tp4-robots-rtk/components/RobotForm';
import { useAppDispatch, useAppSelector } from '../../../tp4-robots-rtk/hooks';
import { clearRobotError, updateRobot } from '../../../tp4-robots-rtk/robots/robotsSlice';
import { selectRobotById } from '../../../tp4-robots-rtk/robots/selectors';
import { store } from '../../../tp4-robots-rtk/store';
import { RobotInput } from '../../../tp4-robots-rtk/validation/robotSchema';

export default function EditRobotScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const dispatch = useAppDispatch();
	const router = useRouter();
	const robot = useAppSelector(selectRobotById(id));
	const error = useAppSelector(state => state.robots.error);

	useEffect(() => {
		dispatch(clearRobotError());
	}, [id]);

	if (!robot) {
		return null;
	}

	const handleSubmit = async (values: RobotInput) => {
		dispatch(clearRobotError());
		dispatch(updateRobot({ id, changes: values }));
		if (!store.getState().robots.error) {
			router.replace('/tp4-robots-rtk');
		}
	};

	return (
		<RobotForm
			mode="edit"
			initialValues={robot}
			onSubmit={handleSubmit}
			submitLabel="Enregistrer"
			error={error || undefined}
		/>
	);
}
