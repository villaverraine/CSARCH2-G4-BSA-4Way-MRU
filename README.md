# CSARCH2 Cache Simulator

This website simulates a **4-Way Block Set Associative** cache structure that uses **Most Recently Used** replacement algorithm.

## Specifications 
- **Cache line:** 16 words
- **Number of cache blocks:** 32 blocks
- **Cache line:** 16 words
- **Read policy:** non load-through
- Number of **memory blocks** is a user input that should be **at least 1024 blocks**

## Test Cases 
Three test simulations can be tested. 

1. Sequential Sequence
   - The memory accesses follow a sequential pattern, iterating through **2n** cache blocks before repeating the entire sequence **four times.**
   - **n = 32**, meaning the pattern repeats 0-63 (64) four times.
   - This test case simulates **linear memory accesses**, testing the efficiency of the algorithm in terms of cache utilization and hit rate growth.
2.   Random Sequence
     - Instead of a predictable pattern, memory accesses are **randomly chosen** from a pool of **4n** memory blocks.
     - In this case it gets a randomized selection from 128 (4 * 32) blocks
     - This evaluates how well the cache handles non-locality and more unpredictable data.
3. Mid-repeat blocks
   - The sequence starts at **block 0** and follows a pattern where it repeats the range **(0 to n-1)** twice, then continues sequentially from **n to 2n** and repeats **4 times.**
   - Tests the effect of re-accessing certain blocks and loop heavy workloads on cache performance.
  
  ## Calculated Metrics
  The program calculates the following performance metrics for each run. 
  - Memory Access Count
  - Cache Hit & miss
  - Hit & Miss rate
  - Average Memory Access Time
  - Total Memory Access Time

The program also provides the cache memory snapshot and a viewable step-by-step log of the entire process.
