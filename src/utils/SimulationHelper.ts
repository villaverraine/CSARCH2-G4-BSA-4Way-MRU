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

    // ✅ Initialize Cache Memory (Each set has a stack for MRU tracking)
    let cacheMemory = Array.from({ length: NUM_SETS }, () =>
        Array(WAYS_PER_SET).fill(null).map(() => ({ block: null, timestamp: 0 }))
    );

    // ✅ MRU Stack Tracking for each set
    let mruStack = Array.from({ length: NUM_SETS }, () => [] as number[]);

    let cacheHits = 0;
    let cacheMisses = 0;
    let currentTime = 0;

    // 🔄 **Process Each Memory Access**
    progFlow.forEach((block) => {
        const setIndex = block % NUM_SETS;
        const hit = updateCacheMemory(cacheMemory, setIndex, block, ++currentTime, mruStack);

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
    const totalAccessTime = cacheHits * cacheCycleTime + cacheMisses * penaltyMiss;

    return { avgAccessTime, totalAccessTime };
}

/**
 * ✅ **Stack-based MRU replacement**
 */
function updateCacheMemory(cacheMemory, setIndex, block, timeStamp, mruStack) {
    let set = cacheMemory[setIndex];

    // ✅ **Check for Cache Hit**
    let hitIndex = set.findIndex(entry => entry.block === block);
    if (hitIndex !== -1) {
        // ✅ Move Block to the Top of the Stack (MRU)
        mruStack[setIndex] = mruStack[setIndex].filter(b => b !== block);
        mruStack[setIndex].push(block);

        // ✅ Update Timestamp
        set[hitIndex].timestamp = timeStamp;
        return true; // Cache HIT
    }

    // 🔍 **Find an Empty Slot**
    let emptySlot = set.findIndex(entry => entry.block === null);
    if (emptySlot !== -1) {
        // ✅ Insert into Empty Slot
        set[emptySlot] = { block, timestamp: timeStamp };
        mruStack[setIndex].push(block);
        return false; // Cache MISS
    }

    // 🔄 **If Full: Replace MRU Block (Top of Stack)**
    let mruBlock = mruStack[setIndex].pop(); // **Remove the MRU block**
    let mruIndex = set.findIndex(entry => entry.block === mruBlock);

    console.log(`❌ No empty slot. Replacing MRU block ${set[mruIndex].block} in Set ${setIndex}`);

    // ✅ Replace MRU Block
    set[mruIndex] = { block, timestamp: timeStamp };

    // ✅ Add New Block to the Top of the Stack
    mruStack[setIndex].push(block);

    return false; // Cache MISS
}