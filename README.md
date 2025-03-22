# CSARCH2 Cache Simulator

This website simulates a **4-Way Block Set Associative** cache structure that uses **Most Recently Used** replacement algorithm.

Group 4:
- Abendan, Ashley
- Aquino, Mark
- Maunahan, Alliyah
- Planta, Jesus Angelov
- Villaver, Raine

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

## Running the Code 
In the project directory, you can run this command in the terminal:
 
 ### `npm start`

 ## Website Link
 Alternatively, you can access the website through this link: 
 
 https://csarch-2-g4-bsa-4-way-mru.vercel.app/

## Demonstration Video Link 
[insert link]

## Performance Analysis 
1. Sequential Sequence


![image](https://github.com/user-attachments/assets/74b61f93-3055-4d21-97bf-c4e7b758a770)


The main comparable metric here is the **lower hit rate than the miss rate.**
- In a 4-way set-associative cache, ideally, sequential access should show a higher hit rate over time if the cache effectively retains data, however, this doesn't seem to be the case.
- The low hit rate suggests that the **MRU algorithm** may be **evicting useful blocks too soon**, possibly replacing blocks that will be needed again in the next iteration.
- If blocks are frequently replaced by newer blocks before they can be reused causing a lower hit rate, we can infer that MRU performs worse than Least Recently Used (LRU) in this case.

2. Random Sequence


![image](https://github.com/user-attachments/assets/d0c56a0a-e1aa-491a-99d4-66435f73cf80)

Although the image here used is just one instance of the randomized test case, one attribute that is consistent is that the **hit rate is once again lower than the miss rate.**
- Random access means we’re constantly replacing blocks before they can be reused. With a large main memory (1024 blocks or more) vs. a small cache (32 blocks), the chance of hitting an already cached block is low.
- MRU assumes recent accesses are less useful—but with random access, **there’s no clear pattern to exploit.**


3. Mid-Repeat Blocks


![image](https://github.com/user-attachments/assets/35aeaa92-2ce3-4a7e-963e-be8ed408f85b)

lorem ipsum lorem

## Conclusion
In conclusion, our tests on a 4-way set-associative cache with MRU replacement reveal that its performance varies based on access patterns. Sequential access ( the 64-block sequence) results in frequent evictions, leading to moderate hit rates. Random access leads to high miss rates, as aside from the conviction, there is no clear pattern to exploit unlike the other two cases. Mid-repeat access (28-block sequence with repetition) benefits from partial reuse, improving hit counts.  Overall, memory access time is directly impacted by the number of misses; more misses lead to slower performance since fetching from main memory is costly. MRU is effective when recent accesses are unlikely to be reused but can struggle with patterns that require retaining older data for efficiency.












