import { useRouter } from 'expo-router';
import React from 'react';
import RobotForm from '../../../components/RobotForm';
import { useAppDispatch, useAppSelector } from '../../tp4-robots-rtk/hooks';
import { clearRobotError, createRobot } from '../../tp4-robots-rtk/robots/robotsSlice';
import { store } from '../../tp4-robots-rtk/store';
import { RobotInput } from '../../tp4-robots-rtk/validation/robotSchema';

export default function CreateRobotScreen() {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const error = useAppSelector(state => state.robots.error);

	const handleSubmit = async (values: RobotInput) => {
		dispatch(clearRobotError());
		dispatch(createRobot(values));
		if (!store.getState().robots.error) {
			router.replace('/tp4-robots-rtk');
		}
	};

	return (
		<RobotForm
			mode="create"
			onSubmit={handleSubmit}
			submitLabel="Créer"
			error={error || undefined}
		/>
	);
}
