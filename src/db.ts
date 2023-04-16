import "reflect-metadata";
import { DataSource } from "typeorm";
import { getDbConfig } from './config';
import { Logger } from 'pino';

let DATASOURCE: DataSource | null = null;

export function getDB(): DataSource {
    if (!DATASOURCE) {
        throw new Error('DataSource is null');
    }
    return DATASOURCE;
}

export async function connectToDatabase(log: Logger): Promise<DataSource> {
    const {username, port, password, host, dbName} = getDbConfig();
    const dataSource = new DataSource({
        type: "postgres",
        host: host,
        port: port,
        username: username,
        password: password,
        database: dbName,
        synchronize: true,
        entities: ['dist/**/**/*.entity{.ts,.js}'],
    });
    await dataSource.initialize();
    DATASOURCE = dataSource;
    return dataSource;
}
