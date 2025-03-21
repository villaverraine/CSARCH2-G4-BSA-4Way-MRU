import { CACHE_LINE_SIZE, WAYS_PER_SET, NUM_SETS } from "./constants.ts";

export function simulateCache(input: {
    mainMemSize: string;
    cacheCycle: string;
    memoryCycle: string;
    programSequence: string | number[];
}) {
    const mmSize = parseInt(input.mainMemSize);
    const cacheCycleTime = parseInt(input.cacheCycle);
    const memCycleTime = parseInt(input.memoryCycle);

    let progFlow = Array.isArray(input.programSequence)
        ? input.programSequence
        : input.programSequence.trim().split(/\s*,\s*/).map(Number);

    if (!progFlow.length || !progFlow.every(num => Number.isInteger(num))) {
        throw new Error("ERROR: Invalid program flow.");
    }

    if (progFlow.some(num => num >= mmSize)) {
        throw new Error("ERROR: Program flow entry cannot exceed main memory size.");
    }

    // Initialize Cache Memory (Each set has a stack for MRU tracking)
    let cacheMemory = Array.from({ length: NUM_SETS }, () =>
        Array(WAYS_PER_SET).fill(null).map(() => ({ block: null, timestamp: 0 }))
    );


    let cacheHits = 0;
    let cacheMisses = 0;
    let currentTime = 0;

    // **Process Each Memory Access**
    progFlow.forEach((block) => {
        const setIndex = block % NUM_SETS;
        const hit = updateCacheMemory(cacheMemory, setIndex, block, ++currentTime);

        hit ? cacheHits++ : cacheMisses++;
    });

    const { avgAccessTime, totalAccessTime } = calculateTotalAccessTime(
        cacheHits, cacheMisses, cacheCycleTime, memCycleTime
    );

    return {
        memoryAccessCount: progFlow.length,
        cacheHits,
        cacheMisses,
        hitRate: (cacheHits / (cacheHits + cacheMisses)).toFixed(2),
        missRate: (cacheMisses / (cacheHits + cacheMisses)).toFixed(2),
        avgAccessTime: avgAccessTime.toFixed(2),
        totalAccessTime: totalAccessTime.toFixed(2),
        cacheSnapshot: generateMemorySnapshot(cacheMemory),
    };
}

function generateMemorySnapshot(cacheMemory) {
    return cacheMemory.map((set, i) =>
        `Set ${i}: ${set.map(entry => (entry.block !== null ? entry.block : "Empty")).join(", ")}`
    ).join("\n");
}

function calculateTotalAccessTime(cacheHits: number, cacheMisses: number, cacheCycleTime: number, memCycleTime: number) {
    const penaltyMiss = (2 * cacheCycleTime) + (CACHE_LINE_SIZE * memCycleTime);
    const avgAccessTime = (cacheHits / (cacheHits + cacheMisses)) * cacheCycleTime +
                          (cacheMisses / (cacheHits + cacheMisses)) * penaltyMiss;
    const totalAccessTime = (cacheHits * CACHE_LINE_SIZE * cacheCycleTime) + (cacheMisses * CACHE_LINE_SIZE * (cacheCycleTime + memCycleTime)) + cacheMisses * cacheCycleTime;

    return { avgAccessTime, totalAccessTime };
}

/**
 * **Stack-based MRU replacement**
 */
function updateCacheMemory(cacheMemory, setIndex, block, timeStamp) {
    let set = cacheMemory[setIndex];
    console.log("SET VALUE: ", set);

    // **Check for Cache Hit**
    let hitIndex = set.findIndex(entry => entry.block === block);
    if (hitIndex !== -1) {
        // Update Timestamp
        set[hitIndex].timestamp = timeStamp;
        return true; // Cache HIT
    }

    // **Find an Empty Slot**
    let emptySlot = set.findIndex(entry => entry.block === null);
    if (emptySlot !== -1) {
        // Insert into Empty Slot
        set[emptySlot] = { block, timestamp: timeStamp };
        return false; // Cache MISS
    }

    let mruIndex = set.reduce((maxIdx, entry, idx) =>
        entry.timestamp > set[maxIdx].timestamp ? idx : maxIdx, 0);

    console.log(`No empty slot. Replacing MRU block ${set[mruIndex].block} in Set ${setIndex}`);

    // Replace MRU Block
    set[mruIndex] = { block, timestamp: timeStamp };

    return false; // Cache MISS
}