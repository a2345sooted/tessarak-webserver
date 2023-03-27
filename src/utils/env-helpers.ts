export function getString(key: string): string | undefined {
    return process.env[key];
}

export function getStringOrFail(key: string): string {
    const val = getString(key);
    if (!val) {
        throw new Error(`env var (string): ${key} not found`);
    }
    return val;
}

export function getNumber(key: string): number | undefined {
    const val = process.env[key];

    if (!val) {
        return undefined;
    }

    try {
        return parseInt(val);

    } catch (error) {
        return undefined;
    }
}

export function getNumberOrFail(key: string): number {
    const val = getNumber(key);
    if (!val) {
        throw new Error(`env var (number): ${key} not found or malformed`);
    }
    return val;
}

export function getBool(key: string): boolean | undefined {
    const val = process.env[key];
    if (val === 'true') {
        return true;
    }
    else if (val === 'false') {
        return false;
    }
    else {
        return undefined;
    }
}

export function getBoolOrFail(key: string): boolean {
    const val = getBool(key);
    if (val === undefined || val === null) {
        throw new Error(`env var (bool): ${key} is not found or malformed`);
    }
    return val;
}
