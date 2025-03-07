export default function exhaust(value: never) {
    throw new Error(`Exhaustive check failed: ${value}`);
}
