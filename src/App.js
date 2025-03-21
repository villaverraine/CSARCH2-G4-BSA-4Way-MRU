import './App.css';
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Container, Typography, TextField, Select, MenuItem, Button, FormControl, InputLabel } from "@mui/material";
import { CACHE_BLOCKS, CACHE_LINE_SIZE, WAYS_PER_SET, READ_POLICY, NUM_SETS } from './utils/constants.js';
import { generateSequence } from './utils/SequenceHelper.js';
import { simulateCache } from './utils/SimulationHelper.js';

function App() {
  const [memoryBlocks, setMemoryBlocks] = useState(1024);
  const [testCase, setTestCase] = useState("sequential");
  const [Sequence, setSequence] = useState("");
  const [simulationResult, setSimulationResult] = useState(null);

  const handleGenerate = () => {
    setSequence(null);
    setSimulationResult(null);

    const generatedSequence = generateSequence(testCase, memoryBlocks).replace(/\s/g, "");
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

    setSequence(cleanSequence);

    const result = simulateCache({
        mainMemSize: memoryBlocks.toString(),
        cacheCycle: "1",
        memoryCycle: "10",
        programSequence: cleanSequence,
    });

    console.log("Simulation Result:", result);
    setSimulationResult(result);
  };
  return (
    <Container 
      maxWidth="md" 
      sx={{
        textAlign: "center",
        mt: 5,
        p: 4,
        borderRadius: 3,
        background: "linear-gradient(to right, #232526, #414345)",
        color: "white",
        boxShadow: 3
      }}
    >
      <Typography variant='h4' gutterBottom sx={{ fontWeight: "bold", color: "#FFD700" }}>
        Cache Simulation (4-Way BSA + MRU)
      </Typography>
      
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
        sx={{
          backgroundColor: "white",
          borderRadius: 1,
          '& .MuiInputLabel-root': { 
            fontSize: "1.8rem",
            fontWeight: "bold",
            color: "#FFD700",
            textShadow: "2px 2px 2px black", 
          },
          '& .MuiInputBase-input': { 
            fontSize: "1.5rem",
            padding: "12px",
          },
        }}
      />

      <FormControl fullWidth margin="normal" sx={{ backgroundColor: "white", borderRadius: 1 }}>
        <InputLabel 
          sx={{
            fontSize: "1.8rem",
            fontWeight: "bold",
            color: "#FFD700",
            textShadow: "2px 2px 2px black",
          }}
        >
          Test Case
        </InputLabel>
        <Select value={testCase} onChange={(e) => setTestCase(e.target.value)}>
          <MenuItem value="sequential">Sequential</MenuItem>
          <MenuItem value="random">Random</MenuItem>
          <MenuItem value="mid-repeat">Mid-Repeat</MenuItem>
        </Select>
      </FormControl>

      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button 
          variant="contained" 
          color="warning" 
          sx={{ mt: 2, fontWeight: "bold" }}
          onClick={handleGenerate}
        >
          Generate Sequence
        </Button>
      </motion.div>

      {Sequence && (
        <Typography variant="body1" sx={{ mt: 3, wordWrap: "break-word", color: "#FFD700" }}>
          <strong>Generated Sequence:</strong> {Sequence.join(", ")}
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
          <Typography variant="h6" sx={{ mt: 2 }}>Cache Memory Snapshot:</Typography>
          <pre style={{ textAlign: "left", whiteSpace: "pre-wrap" }}>{simulationResult.cacheSnapshot}</pre>
          <Typography variant="h6" sx={{ mt: 2 }}>Step-by-Step Log:</Typography>
          <pre style={{ textAlign: "left", whiteSpace: "pre-wrap", fontSize: "1rem", lineHeight: "1.5", background: "#1e1e1e", color: "#00ff00", padding: "10px", borderRadius: "5px" }}>{simulationResult.stepByStepLog}</pre>
        </>
      )}
    </Container>
  );
}

export default App;
