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

// export function simulateCache(memoryBlocks: number, sequence: number[]) {
//     const cacheCycleTime = 1;
//     const memoryCycleTime = 10;
//     let cache: { block: number | null; timestamp: number }[][] = 
//         Array.from({ length: NUM_SETS }, () => Array(WAYS_PER_SET).fill(null).map(() => ({ block: null, timestamp: 0 })));

//     let memoryAccessCount = 0;
//     let cacheHits = 0;
//     let cacheMisses = 0;
//     let currentTime = 0;
//     let log: string[] = [];

//     sequence.forEach((block, index) => {
//         // Ensure block is within valid memory range
//         if (block >= memoryBlocks) {
//             log.push(`Step ${index + 1}: ERROR - Block ${block} is out of range (Max: ${memoryBlocks - 1})`);
//             return; // Skip invalid accesses
//         }

//         memoryAccessCount++;
//         const setIndex = block % NUM_SETS;
//         const set = cache[setIndex];

//         // Check if block is in the set (hit)
//         let hitIndex = set.findIndex(entry => entry.block === block);

//         if (hitIndex !== -1) {
//             // Cache hit: update MRU timestamp
//             cacheHits++;
//             set[hitIndex].timestamp = ++currentTime;
//             log.push(`Step ${index + 1}: HIT - Block ${block} found in Set ${setIndex}`);
//         } else {
//             // Cache miss: Find the MRU block (largest timestamp)
//             cacheMisses++;

//             // Find MRU block (highest timestamp)
//             let mruIndex = set.reduce((maxIndex, entry, idx) =>
//                 entry.timestamp > set[maxIndex].timestamp ? idx : maxIndex, 0);

//             log.push(`Step ${index + 1}: MISS - Block ${block} replacing MRU Block ${set[mruIndex].block} in Set ${setIndex}`);

//             // Replace MRU block
//             set[mruIndex] = { block, timestamp: ++currentTime };
//         }
//     });

//     // Calculate statistics
//     const hitRate = cacheHits / memoryAccessCount;
//     const missRate = 1 - hitRate;
//     const penaltyMiss = (2 * cacheCycleTime) + (CACHE_LINE_SIZE * memoryCycleTime);
//     const avgAccessTime = (hitRate * cacheCycleTime) + (missRate * penaltyMiss);
//     const totalAccessTime = memoryAccessCount * avgAccessTime;

//     // Generate final cache memory snapshot
//     const cacheSnapshot = cache.map((set, i) =>
//         `Set ${i}: ${set.map(block => block.block ?? "Empty").join(", ")}`).join("\n");

//     // Return full result after the loop
//     return {
//         memoryAccessCount,
//         cacheHits,
//         cacheMisses,
//         hitRate: hitRate.toFixed(2),
//         missRate: missRate.toFixed(2),
//         avgAccessTime: avgAccessTime.toFixed(2),
//         totalAccessTime: totalAccessTime.toFixed(2),
//         cacheSnapshot,
//         stepByStepLog: log.join("\n")
//     };
// }
