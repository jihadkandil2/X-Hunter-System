const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Simulated insecure LLM response function (vulnerable to XSS via prompt injection)
function simulateLLMResponse(input) {
  // For lab purposes, the response simply echoes the input without sanitization.
  return `LLM Response: ${input}`;
}

// Live chat route (simulated LLM output is rendered unsanitized)
app.get('/chat', (req, res) => {
  res.send(`
    <h1>Live Chat</h1>
    <form method="POST" action="/chat">
      <label for="message">Your Message:</label><br>
      <textarea id="message" name="message" rows="4" cols="50"></textarea><br><br>
      <button type="submit">Send</button>
    </form>
    <div id="chatbox"></div>
    <p>Hint: Try injecting a prompt that includes an XSS payload to trigger a malicious response.</p>
  `);
});

app.post('/chat', (req, res) => {
  const userMessage = req.body.message || '';
  // Insecurely output the LLM response without sanitization
  const llmResponse = simulateLLMResponse(userMessage);
  res.send(`
    <h1>Live Chat</h1>
    <form method="POST" action="/chat">
      <label for="message">Your Message:</label><br>
      <textarea id="message" name="message" rows="4" cols="50"></textarea><br><br>
      <button type="submit">Send</button>
    </form>
    <div id="chatbox">${llmResponse}</div>
    <p>Hint: If the output is not sanitized, you can inject HTML/JS payloads.</p>
  `);
});

// Endpoint simulating an admin action (e.g., deletion of user carlos)
app.get('/admin/delete-carlos', (req, res) => {
  res.send("<h1>User Carlos has been deleted.</h1>");
});

// Root route with lab instructions
app.get('/', (req, res) => {
  res.send(`
    <h1>Web LLM Attacks Lab - Insecure Output Handling</h1>
    <p>This lab demonstrates an insecure handling of LLM output which is vulnerable to XSS.</p>
    <ul>
      <li>Live Chat is available at <a href="/chat">/chat</a>.</li>
      <li>The LLM response is not sanitized, so you can use indirect prompt injection.</li>
      <li>For example, try injecting a payload that includes a script redirecting to <code>/admin/delete-carlos</code>.</li>
      <li>Use the credentials: <strong>Not required</strong> (this lab focuses on prompt injection).</li>
    </ul>
  `);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Lab running on http://localhost:${PORT}`);
});
