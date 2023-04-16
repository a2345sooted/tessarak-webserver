import "reflect-metadata";
import { DataSource } from "typeorm";
import { getDbConfig } from './config';
import { Logger } from 'pino';
import { Ship } from './entities/ship.entity';

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

export async function connectToDatabase(log: Logger): Promise<DataSource> {
    const {username, port, password, host, dbName} = getDbConfig();
    const db = new DataSource({
        type: "postgres",
        host: host,
        port: port,
        username: username,
        password: password,
        database: dbName,
        synchronize: true,
        entities: ['dist/**/**/*.entity{.ts,.js}'],
    });
    await db.initialize();
    log.info('database is ready...');
    DB_CONN = db;
    return db;
}
