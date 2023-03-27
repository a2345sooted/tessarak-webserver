import dotenv from 'dotenv';
dotenv.config({path: '.env'});

import { TessarakWebserver } from './server';
import { getServerConfig } from './config';


export async function main() {
    const serverConfig = getServerConfig();
    const server = new TessarakWebserver(serverConfig);
    await server.init();
    await server.start();
}

main().catch(console.error);
