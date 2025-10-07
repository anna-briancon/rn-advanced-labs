import { zodResolver } from '@hookform/resolvers/zod';
import { Picker } from '@react-native-picker/picker';
import * as Haptics from 'expo-haptics';
import React, { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { RobotInput, robotSchema } from '../validation/robotSchema';

type Props = {
	initialValues?: Partial<RobotInput>;
	onSubmit: (values: RobotInput) => Promise<void> | void;
	mode: 'create' | 'edit';
	submitLabel?: string;
};

export default function RobotForm({ initialValues, onSubmit, mode, submitLabel }: Props) {
	const { control, handleSubmit, formState: { errors, isValid, isSubmitting }, setFocus } =
		useForm<RobotInput>({
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

	const labelRef = useRef<TextInput>(null);
	const yearRef  = useRef<TextInput>(null);

	const submit = async (data: RobotInput) => {
		try {
			await onSubmit(data);
			await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
		} catch (e: any) {
			await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
			Alert.alert('Erreur', e?.message ?? 'Une erreur est survenue');
		}
	};

	return (
		<KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={{ flex: 1 }}>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
				<View style={{ padding: 16, gap: 12 }}>
				{/* Name */}
				<Text>Nom</Text>
				<Controller
					control={control}
					name="name"
					render={({ field: { onChange, onBlur, value } }) => (
						<TextInput
							placeholder="R2-D2"
							autoCapitalize="none"
							returnKeyType="next"
							onSubmitEditing={() => labelRef.current?.focus()}
							style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
							onBlur={onBlur}
							value={value}
							onChangeText={onChange}
							editable={!isSubmitting}
						/>
					)}
				/>
				{errors.name && <Text style={{ color: 'red' }}>{errors.name.message}</Text>}

				{/* Label */}
				<Text>Label</Text>
				<Controller
					control={control}
					name="label"
					render={({ field: { onChange, onBlur, value } }) => (
						<TextInput
							ref={labelRef}
							placeholder="Robot de service"
							returnKeyType="next"
							onSubmitEditing={() => yearRef.current?.focus()}
							style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
							onBlur={onBlur}
							value={value}
							onChangeText={onChange}
							editable={!isSubmitting}
						/>
					)}
				/>
				{errors.label && <Text style={{ color: 'red' }}>{errors.label.message}</Text>}

				{/* Year */}
				<Text>Année</Text>
				<Controller
					control={control}
					name="year"
					render={({ field: { onChange, onBlur, value } }) => (
						<TextInput
							ref={yearRef}
							placeholder="2020"
							keyboardType="numeric"
							style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
							onBlur={onBlur}
							value={value ? String(value) : ''}
							onChangeText={text => onChange(text.replace(/[^0-9]/g, ''))}
							editable={!isSubmitting}
						/>
					)}
				/>
				{errors.year && <Text style={{ color: 'red' }}>{errors.year.message}</Text>}

				{/* Type */}
				<Text>Type</Text>
				<Controller
					control={control}
					name="type"
					render={({ field: { onChange, value } }) => (
						<Picker
							selectedValue={value}
							onValueChange={onChange}
							enabled={!isSubmitting}
						>
							<Picker.Item label="Sélectionner..." value={undefined} />
							<Picker.Item label="Industriel" value="industrial" />
							<Picker.Item label="Service" value="service" />
							<Picker.Item label="Médical" value="medical" />
							<Picker.Item label="Éducatif" value="educational" />
							<Picker.Item label="Autre" value="other" />
						</Picker>
					)}
				/>
				{errors.type && <Text style={{ color: 'red' }}>{errors.type.message}</Text>}

				<Pressable
					onPress={handleSubmit(submit)}
					style={{ backgroundColor: isValid ? '#1f6feb' : '#ccc', padding: 16, borderRadius: 8, marginTop: 24 }}
					disabled={!isValid || isSubmitting}
				>
					<Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
						{submitLabel || (mode === 'edit' ? 'Enregistrer' : 'Créer')}
					</Text>
				</Pressable>
				</View>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
}
