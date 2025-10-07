import { readAsStringAsync } from 'expo-file-system';
import * as SQLite from 'expo-sqlite';

const DB_NAME = 'robots.db';
const DB_VERSION = 3;

const migrationFiles = [
  './migrations/001_init.sql',
  './migrations/002_add_indexes.sql',
  './migrations/003_add_archived.sql',
];

export let db: SQLite.SQLiteDatabase;

export async function openDatabaseAsync() {
	db = SQLite.openDatabase(DB_NAME);
	await runMigrations(db);
	return db;
}

async function runMigrations(db: SQLite.SQLiteDatabase) {
	const userVersion = await getUserVersion(db);
	for (let i = userVersion; i < DB_VERSION; i++) {
		const migrationSQL = await getMigrationSQL(i);
		if (migrationSQL) {
			await execSqlAsync(db, migrationSQL);
		}
	}
	await setUserVersion(db, DB_VERSION);
}


function getMigrationSQL(index: number): Promise<string> {
  // On lit toujours le fichier SQL avec expo-file-system
  return readAsStringAsync(migrationFiles[index]);
}


function execSqlAsync(db: SQLite.SQLiteDatabase, sql: string): Promise<void> {
	return new Promise((resolve, reject) => {
		db.transaction(tx => {
			tx.executeSql(
				sql,
				[],
				() => resolve(),
				(_, error) => {
					reject(error);
					return false;
				}
			);
		});
	});
}


function getUserVersion(db: SQLite.SQLiteDatabase): Promise<number> {
	return new Promise((resolve, reject) => {
		db.transaction(tx => {
			tx.executeSql(
				'PRAGMA user_version;',
				[],
				(_, res) => {
					resolve(res.rows.item(0).user_version || 0);
				},
				(_, err) => {
					reject(err);
					return false;
				}
			);
		});
	});
}


function setUserVersion(db: SQLite.SQLiteDatabase, version: number): Promise<void> {
  return execSqlAsync(db, `PRAGMA user_version = ${version};`);
}
