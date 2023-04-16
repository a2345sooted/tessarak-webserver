import { DataSource } from "typeorm";
import { getDbConfig } from './config';
import { Ship } from './entities/ship';

let DB_CONN: DataSource | null = null;

export function getDB(): DataSource {
    if (!DB_CONN) {
        throw new Error('DB is null');
    }
    return DB_CONN;
}

export const DatabaseEntities = [
    Ship,
];

export async function connectToDatabase(): Promise<DataSource> {
    const {username, port, password, host, dbName} = getDbConfig();
    const db = new DataSource({
        type: "postgres",
        host: host,
        port: port,
        username: username,
        password: password,
        database: dbName,
        synchronize: true,
        entities: DatabaseEntities,
    });
    DB_CONN = db;
    return db.initialize();
}
