import { CACHE_BLOCKS } from "./constants.ts";
export function generateSequence(testCase: string): string {
    const n = CACHE_BLOCKS;
    let sequence: number[] = [];

    if (testCase === "sequential") {
        sequence = [...Array(2 * n).keys()]; // Generates [0, 1, 2, ..., 2n-1]
        sequence = [...sequence, ...sequence, ...sequence, ...sequence]; // Repeat 4 times
    } else if (testCase === "random") {
        sequence = Array.from({ length: 4 * n }, () => Math.floor(Math.random() * 4 * n));
    } else if (testCase === "mid-repeat") {
        sequence = [
            ...Array(n).keys(),            // 0 to n-1
            ...Array(n - 1).keys(),        // 0 to n-2 (repeat middle)
            ...Array(n).keys(),            // 0 to n-1 (repeat middle again)
            ...Array(2 * n).keys()         // n to 2n-1 (continue up to 2n)
        ];
        sequence = [...sequence, ...sequence, ...sequence, ...sequence]; // Repeat 4 times
    }
    return sequence.join(", ");
}
