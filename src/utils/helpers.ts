export async function delayMillis(millis: number): Promise<void> {
    return new Promise((resolve, _) => {
        setTimeout(() => resolve(), millis);
    });
}
