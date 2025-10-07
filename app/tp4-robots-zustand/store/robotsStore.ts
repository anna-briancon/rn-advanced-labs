import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Robot } from '../types/robot';
import type { RobotInput } from '../validation/robotSchema';

interface RobotsState {
	robots: Robot[];
	selectedId?: string;
	create: (input: RobotInput) => void | never;
	update: (id: string, changes: RobotInput) => void | never;
	remove: (id: string) => void;
	getById: (id: string) => Robot | undefined;
	setSelected: (id?: string) => void;
}

export const useRobotsStore = create<RobotsState>()(
	persist(
		(set, get) => ({
			robots: [],
			selectedId: undefined,
			setSelected: (id) => set({ selectedId: id }),
			getById: (id) => get().robots.find(r => r.id === id),
			create: (input) => {
				const exists = get().robots.some(r => r.name.trim().toLowerCase() === input.name.trim().toLowerCase());
				if (exists) throw new Error('Un robot avec ce nom existe déjà.');
				const robot: Robot = { id: uuid(), ...input };
				set(state => ({ robots: [robot, ...state.robots] }));
			},
			update: (id, changes) => {
				const robots = get().robots;
				const idx = robots.findIndex(r => r.id === id);
				if (idx === -1) throw new Error('Robot introuvable.');
				// unicité du nom (exclure moi-même)
				const nameTaken = robots.some(r =>
					r.id !== id && r.name.trim().toLowerCase() === changes.name.trim().toLowerCase()
				);
				if (nameTaken) throw new Error('Nom déjà utilisé par un autre robot.');
				const next = robots.slice();
				next[idx] = { ...next[idx], ...changes };
				set({ robots: next });
			},
			remove: (id) => set(state => ({ robots: state.robots.filter(r => r.id !== id) })),
		}),
		{
			name: 'robots-store',
			storage: createJSONStorage(() => AsyncStorage),
			partialize: (s) => ({ robots: s.robots, selectedId: s.selectedId }),
		}
	)
);
