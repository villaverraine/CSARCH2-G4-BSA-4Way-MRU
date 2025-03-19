import './App.css';
import React, { useState, useEffect } from "react";
import { Container, Typography, TextField, Select, MenuItem, Button, FormControl, InputLabel } from "@mui/material";
import { CACHE_BLOCKS, CACHE_LINE_SIZE, WAYS_PER_SET, READ_POLICY, NUM_SETS } from './utils/constants.ts';

import { generateSequence } from './utils/SequenceHelper.ts';
import { simulateCache } from './utils/SimulationHelper.ts';
function App() {
  const [memoryBlocks, setMemoryBlocks] = useState(1024);
  const [testCase, setTestCase] = useState("sequential");
  const [Sequence, setSequence] = useState("");
  const [simulationResult, setSimulationResult] = useState(null);

  const handleGenerate = () => {
    setSequence(null);
    setSimulationResult(null);

    const generatedSequence = generateSequence(testCase).replace(/\s/g, "");
    console.log("Raw Sequence: ", generatedSequence);

    let cleanSequence = generatedSequence
        .split(",")
        .map(num => parseInt(num, 10))
        .filter(num => !isNaN(num));

    console.log("Cleaned Sequence: ", cleanSequence);

    if (cleanSequence.length === 0) {
        alert("⚠️ Error: Generated sequence is empty or invalid.");
        return;
    }

    const sequenceForSimulation = cleanSequence.join(",");
    setSequence(sequenceForSimulation); 

    const result = simulateCache({
        mainMemSize: memoryBlocks.toString(),
        cacheCycle: "1",
        memoryCycle: "10",
        programSequence: sequenceForSimulation, 
    });

    console.log("Simulation Result:", result);
    setSimulationResult(result);
};

  return (
    <Container maxWidth="md" style={{ textAlign: "center", marginTop: "50px" }}>
      <Typography variant='h4' gutterBottom>Cache Simulation (4-Way BSA + MRU)</Typography>

      <Typography variant='h6'>Cache Blocks: {CACHE_BLOCKS}</Typography>
      <Typography variant='h6'>Cache line Size: {CACHE_LINE_SIZE}</Typography>
      <Typography variant='h6'>Ways Per Set: {WAYS_PER_SET}</Typography>
      <Typography variant='h6'>Number of Sets: {NUM_SETS}</Typography>
      <Typography variant='h6'>Read Policy: {READ_POLICY}</Typography>

      <TextField
        label="Number of Memory Blocks? (Min 1024)"
        type="number"
        value={memoryBlocks}
        onChange={(e) => setMemoryBlocks(Number(e.target.value))}
        fullWidth
        margin="normal"
      />

      <FormControl fullWidth margin="normal">
        <InputLabel>Test Case</InputLabel>
        <Select value={testCase} onChange={(e) => setTestCase(e.target.value)}>
          <MenuItem value="sequential">Sequential</MenuItem>
          <MenuItem value="random">Random</MenuItem>
          <MenuItem value="mid-repeat">Mid-Repeat</MenuItem>
        </Select>
      </FormControl>

      <Button variant="contained" color="primary" style={{ marginTop: "20px" }} onClick={handleGenerate}>
        Generate Sequence
      </Button>

      {Sequence && (
        <Typography variant="body1" style={{ marginTop: "20px", wordWrap: "break-word" }}>
          <strong>Generated Sequence:</strong> {Sequence}
        </Typography>
      )}

      {simulationResult && (
        <>
          <Typography variant="h6">Memory Access Count: {simulationResult.memoryAccessCount}</Typography>
          <Typography variant="h6">Cache Hits: {simulationResult.cacheHits}</Typography>
          <Typography variant="h6">Cache Misses: {simulationResult.cacheMisses}</Typography>
          <Typography variant="h6">Hit Rate: {simulationResult.hitRate}</Typography>
          <Typography variant="h6">Miss Rate: {simulationResult.missRate}</Typography>
          <Typography variant="h6">Avg. Memory Access Time: {simulationResult.avgAccessTime} ns</Typography>
          <Typography variant="h6">Total Memory Access Time: {simulationResult.totalAccessTime} ns</Typography>
          <Typography variant="h6" sx={{ marginTop: 2 }}>Cache Memory Snapshot:</Typography>
          <pre style={{ textAlign: "left", whiteSpace: "pre-wrap" }}>{simulationResult.cacheSnapshot}</pre>
          <Typography variant="h6" sx={{ marginTop: 2 }}>Step-by-Step Log:</Typography>
          <pre style={{ textAlign: "left", whiteSpace: "pre-wrap" }}>{simulationResult.stepByStepLog}</pre>
        </>
      )}
    </Container>
  );
}

export default App;
