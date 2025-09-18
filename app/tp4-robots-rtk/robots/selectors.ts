import { createSelector } from '@reduxjs/toolkit';
import { Robot } from '../../../types/robot';
import { RootState } from '../rootReducer';

export const selectRobots = (state: RootState) => state.robots.items;

export const selectRobotById = (id: string) => (state: RootState) =>
	state.robots.items.find((r: Robot) => r.id === id);

export const selectRobotsSortedByName = createSelector(
	[selectRobots],
	(robots) => [...robots].sort((a, b) => a.name.localeCompare(b.name))
);
