

import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../db/index';

export type RobotType = 'industrial' | 'service' | 'medical' | 'educational' | 'other';

export interface Robot {
	id: string;
	name: string;
	label: string;
	year: number;
	type: RobotType;
	created_at: string;
	updated_at: string;
	archived?: boolean;
}

export interface RobotInput {
	name: string;
	label: string;
	year: number;
	type: RobotType;
}

interface ListOptions {
	q?: string;
	sort?: 'name' | 'year';
	limit?: number;
	offset?: number;
	archived?: boolean;
}

export async function create(robot: RobotInput): Promise<Robot> {
	const db = await getDatabase();
	const id = uuidv4();
	const now = new Date().toISOString();
	await db.runAsync(
		`INSERT INTO robots (id, name, label, year, type, created_at, updated_at, archived) VALUES (?, ?, ?, ?, ?, ?, ?, 0);`,
		[id, robot.name, robot.label, robot.year, robot.type, now, now]
	);
	return { ...robot, id, created_at: now, updated_at: now };
}

export async function update(id: string, changes: Partial<RobotInput>): Promise<void> {
	const db = await getDatabase();
	const now = new Date().toISOString();
	const fields = Object.keys(changes).map(k => `${k} = ?`).join(', ');
	const values = Object.values(changes);
	await db.runAsync(
		`UPDATE robots SET ${fields}, updated_at = ? WHERE id = ?;`,
		[...values, now, id]
	);
}

export async function remove(id: string): Promise<void> {
	const db = await getDatabase();
	// Soft delete (archived=1), fallback hard delete si pas de colonne archived
	const res = await db.runAsync(`UPDATE robots SET archived = 1 WHERE id = ?;`, [id]);
	if (res.changes === 0) {
		await db.runAsync(`DELETE FROM robots WHERE id = ?;`, [id]);
	}
}

export async function getById(id: string): Promise<Robot | null> {
	const db = await getDatabase();
	const result = await db.getFirstAsync<Robot>(`SELECT * FROM robots WHERE id = ?;`, [id]);
	return result ?? null;
}

export async function list(options: ListOptions = {}): Promise<Robot[]> {
	const db = await getDatabase();
	let sql = 'SELECT * FROM robots WHERE 1=1';
	const params: any[] = [];
	if (options.q) {
		sql += ' AND (name LIKE ? OR label LIKE ?)';
		params.push(`%${options.q}%`, `%${options.q}%`);
	}
	if (typeof options.archived === 'boolean') {
		sql += ' AND archived = ?';
		params.push(options.archived ? 1 : 0);
	}
	if (options.sort) {
		sql += ` ORDER BY ${options.sort} COLLATE NOCASE`;
	}
	if (options.limit) {
		sql += ' LIMIT ?';
		params.push(options.limit);
	}
	if (options.offset) {
		sql += ' OFFSET ?';
		params.push(options.offset);
	}
	const rows = await db.getAllAsync<Robot>(sql + ';', params);
	return rows;
}

