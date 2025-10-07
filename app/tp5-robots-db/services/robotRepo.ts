import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/index';

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

export async function create(robot: RobotInput): Promise<Robot> {
	const id = uuidv4();
	const now = new Date().toISOString();
	return new Promise((resolve, reject) => {
		db.transaction(tx => {
			tx.executeSql(
				`INSERT INTO robots (id, name, label, year, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?);`,
				[id, robot.name, robot.label, robot.year, robot.type, now, now],
				() => resolve({ ...robot, id, created_at: now, updated_at: now }),
				(_, err) => { reject(err); return false; }
			);
		});
	});
}

export async function update(id: string, changes: Partial<RobotInput>): Promise<void> {
	const now = new Date().toISOString();
	const fields = Object.keys(changes).map(k => `${k} = ?`).join(', ');
	const values = Object.values(changes);
	return new Promise((resolve, reject) => {
		db.transaction(tx => {
			tx.executeSql(
				`UPDATE robots SET ${fields}, updated_at = ? WHERE id = ?;`,
				[...values, now, id],
				() => resolve(),
				(_, err) => { reject(err); return false; }
			);
		});
	});
}

export async function remove(id: string): Promise<void> {
	// Soft delete si colonne archived existe, sinon hard delete
	return new Promise((resolve, reject) => {
		db.transaction(tx => {
			tx.executeSql(
				`UPDATE robots SET archived = 1 WHERE id = ?;`,
				[id],
				(_, res) => {
					if (res.rowsAffected === 0) {
						// fallback hard delete si pas de colonne archived
						tx.executeSql(
							`DELETE FROM robots WHERE id = ?;`,
							[id],
							() => resolve(),
							(_, err) => { reject(err); return false; }
						);
					} else {
						resolve();
					}
				},
				(_, err) => { reject(err); return false; }
			);
		});
	});
}

export async function getById(id: string): Promise<Robot | null> {
	return new Promise((resolve, reject) => {
		db.transaction(tx => {
			tx.executeSql(
				`SELECT * FROM robots WHERE id = ?;`,
				[id],
				(_, res) => {
					if (res.rows.length > 0) resolve(res.rows.item(0));
					else resolve(null);
				},
				(_, err) => { reject(err); return false; }
			);
		});
	});
}

interface ListOptions {
	q?: string;
	sort?: 'name' | 'year';
	limit?: number;
	offset?: number;
	archived?: boolean;
}

export async function list(options: ListOptions = {}): Promise<Robot[]> {
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
	return new Promise((resolve, reject) => {
		db.transaction(tx => {
			tx.executeSql(
				sql + ';',
				params,
				(_, res) => {
					const items: Robot[] = [];
					for (let i = 0; i < res.rows.length; i++) {
						items.push(res.rows.item(i));
					}
					resolve(items);
				},
				(_, err) => { reject(err); return false; }
			);
		});
	});
}
