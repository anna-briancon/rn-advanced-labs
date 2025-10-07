import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { Robot } from '../../tp4-robots-zustand/types/robot';

export interface RobotsState {
	items: Robot[];
	error?: string | null;
}

const initialState: RobotsState = {
	items: [],
	error: null,
};

const robotsSlice = createSlice({
	name: 'robots',
	initialState,
	reducers: {
		createRobot: (state, action: PayloadAction<Omit<Robot, 'id'>>) => {
			const nameExists = state.items.some(r => r.name.trim().toLowerCase() === action.payload.name.trim().toLowerCase());
			if (nameExists) {
				state.error = 'Un robot avec ce nom existe déjà.';
				return;
			}
			const year = action.payload.year;
			const currentYear = new Date().getFullYear();
			if (year < 1950 || year > currentYear || !Number.isInteger(year)) {
				state.error = `L'année doit être un entier entre 1950 et ${currentYear}.`;
				return;
			}
			state.items.push({ ...action.payload, id: uuidv4() });
			state.error = null;
		},
		updateRobot: (state, action: PayloadAction<{ id: string; changes: Partial<Omit<Robot, 'id'>> }>) => {
			const { id, changes } = action.payload;
			const robotIndex = state.items.findIndex(r => r.id === id);
			if (robotIndex === -1) {
				state.error = "Robot introuvable.";
				return;
			}
			if (changes.name) {
				const nameExists = state.items.some(r => r.name.trim().toLowerCase() === changes.name!.trim().toLowerCase() && r.id !== id);
				if (nameExists) {
					state.error = 'Un robot avec ce nom existe déjà.';
					return;
				}
			}
			if (changes.year !== undefined) {
				const year = changes.year;
				const currentYear = new Date().getFullYear();
				if (year < 1950 || year > currentYear || !Number.isInteger(year)) {
					state.error = `L'année doit être un entier entre 1950 et ${currentYear}.`;
					return;
				}
			}
			state.items[robotIndex] = { ...state.items[robotIndex], ...changes };
			state.error = null;
		},
		deleteRobot: (state, action: PayloadAction<string>) => {
			state.items = state.items.filter(r => r.id !== action.payload);
			state.error = null;
		},
		clearRobotError: (state) => {
			state.error = null;
		}
	},
});

export const { createRobot, updateRobot, deleteRobot, clearRobotError } = robotsSlice.actions;
export default robotsSlice.reducer;
