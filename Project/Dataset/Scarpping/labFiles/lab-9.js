const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Simulated LLM function with excessive agency.
// Vulnerable: It directly returns the command provided in the prompt.
function simulateLLMCommand(prompt) {
  return prompt;
}

// Vulnerable LLM API endpoint that executes OS commands based on the LLM's output.
app.post('/llm-api', (req, res) => {
  const prompt = req.body.prompt || '';
  const command = simulateLLMCommand(prompt);
  console.log("Executing command from LLM prompt:", command);
  
  // WARNING: In a real-world scenario, executing unsanitized commands is dangerous.
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("Error executing command:", error.message);
      return res.status(500).send(`Error: ${error.message}`);
    }
    res.send(`Command executed successfully: ${stdout}`);
  });
});

// Root route with lab instructions
app.get('/', (req, res) => {
  res.send(`
    <h1>LLM API Lab - Excessive Agency</h1>
    <p>This lab demonstrates a vulnerability in which the LLM API handles user prompts insecurely, allowing an attacker to execute OS commands.</p>
    <ul>
      <li>Submit a POST request to <code>/llm-api</code> with a prompt payload that instructs the system to delete user Carlos.</li>
      <li>Example payload: <code>rm -rf /path/to/carlos_home/morale.txt</code> (simulate deletion)</li>
    </ul>
  `);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Lab running on http://localhost:${PORT}`);
});
//no tested 