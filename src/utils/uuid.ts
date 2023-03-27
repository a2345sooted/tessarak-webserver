import validate from 'uuid-validate';
import {v4} from 'uuid';

export type UUID = string & { __brand: 'UUID' };

export function createUUID() : UUID {
    const id = v4() as UUID;
    return id;
}

export function isUUID(s: string): boolean {
    return validate(s);
}

