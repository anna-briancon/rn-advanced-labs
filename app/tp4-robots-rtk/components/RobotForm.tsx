import { zodResolver } from '@hookform/resolvers/zod';
import { Picker } from '@react-native-picker/picker';
import React, { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { RobotType } from '../../tp4-robots-zustand/types/robot';
import { RobotInput, robotSchema } from '../validation/robotSchema';

type RobotFormProps = {
	initialValues?: Partial<RobotInput>;
	onSubmit: (values: RobotInput) => void;
	submitLabel?: string;
	isSubmitting?: boolean;
	error?: string | null;
};

export default function RobotForm({ initialValues, onSubmit, submitLabel = 'Valider', isSubmitting, error }: RobotFormProps) {
	const robotTypes: { label: string; value: RobotType }[] = [
		{ label: 'Industriel', value: 'industrial' },
		{ label: 'Service', value: 'service' },
		{ label: 'Médical', value: 'medical' },
		{ label: 'Éducatif', value: 'educational' },
		{ label: 'Autre', value: 'other' },
	];
	const labelRef = useRef<TextInput>(null);
	const yearRef = useRef<TextInput>(null);
	const { control, handleSubmit, formState: { errors, isValid, isSubmitting: isRHFSubmitting }, setFocus } = useForm<RobotInput>({
		resolver: zodResolver(robotSchema),
		mode: 'onChange',
		defaultValues: {
			name: '',
			label: '',
			year: undefined as unknown as number,
			type: undefined as any,
			...initialValues,
		},
	});

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : undefined}
			style={{ flex: 1 }}
			keyboardVerticalOffset={80}
		>
			<View style={styles.form}>
				<Text style={styles.label}>Nom</Text>
				<Controller
					control={control}
					name="name"
					render={({ field: { onChange, onBlur, value } }) => (
						<TextInput
							style={styles.input}
							value={value}
							onChangeText={onChange}
							onBlur={onBlur}
							placeholder="Nom du robot"
							returnKeyType="next"
							autoCapitalize="none"
							onSubmitEditing={() => labelRef.current?.focus()}
							ref={labelRef}
							accessible accessibilityLabel="Nom du robot"
						/>
					)}
				/>
				{errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

				<Text style={styles.label}>Label</Text>
				<Controller
					control={control}
					name="label"
					render={({ field: { onChange, onBlur, value } }) => (
						<TextInput
							style={styles.input}
							value={value}
							onChangeText={onChange}
							onBlur={onBlur}
							placeholder="Label du robot"
							returnKeyType="next"
							onSubmitEditing={() => yearRef.current?.focus()}
							ref={yearRef}
							accessible accessibilityLabel="Label du robot"
						/>
					)}
				/>
				{errors.label && <Text style={styles.error}>{errors.label.message}</Text>}

				<Text style={styles.label}>Année</Text>
				<Controller
					control={control}
					name="year"
					render={({ field: { onChange, onBlur, value } }) => (
						<TextInput
							style={styles.input}
							value={value?.toString() ?? ''}
							onChangeText={t => onChange(t.replace(/[^\d]/g, ''))}
							onBlur={onBlur}
							placeholder="Année"
							keyboardType="number-pad"
							returnKeyType="done"
							accessible accessibilityLabel="Année du robot"
						/>
					)}
				/>
				{errors.year && <Text style={styles.error}>{errors.year.message}</Text>}

				<Text style={styles.label}>Type</Text>
				<Controller
					control={control}
					name="type"
					render={({ field: { onChange, value } }) => (
						<View style={styles.pickerWrapper}>
							<Picker selectedValue={value} onValueChange={onChange} accessibilityLabel="Type du robot">
								<Picker.Item label="Sélectionner un type..." value={undefined} />
								{robotTypes.map(rt => (
									<Picker.Item key={rt.value} label={rt.label} value={rt.value} />
								))}
							</Picker>
						</View>
					)}
				/>
				{errors.type && <Text style={styles.error}>{errors.type.message}</Text>}

				{error && <Text style={styles.error}>{error}</Text>}

				<Button
					title={submitLabel}
					onPress={handleSubmit(onSubmit)}
					disabled={!isValid || isSubmitting || isRHFSubmitting}
					accessibilityLabel={submitLabel}
				/>
			</View>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	form: {
		flex: 1,
		padding: 16,
		justifyContent: 'center',
	},
	label: {
		fontWeight: 'bold',
		marginTop: 12,
		marginBottom: 4,
	},
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 4,
		padding: 8,
		marginBottom: 4,
	},
	error: {
		color: 'red',
		marginBottom: 4,
	},
	pickerWrapper: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 4,
		marginBottom: 4,
	},
});
