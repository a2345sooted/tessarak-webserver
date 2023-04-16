import { DataSource } from "typeorm";
import { getDbConfig } from './config';
import { Ship } from './entities/ship';

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
    return db.initialize();
}
