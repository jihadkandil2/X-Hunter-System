import React, { useState } from "react";
import { FaPaperPlane, FaSave } from "react-icons/fa";
import axios from "axios";
import Navbar from "../Navbar/Navbar";

function AdminChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [labs, setLabs] = useState([]);
  const [selectedLabs, setSelectedLabs] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { type: "user", text: input };
    setMessages([...messages, newMessage]);
    setInput("");

    try {
      const res = await axios.get("http://localhost:3000/labs/getByVulnName", {
        params: { vuln: input, limit: 5 },
      });

      const data = res.data.extractedLabs;
      
      if (data.length === 0) {
        setMessages((prev) => [...prev, { type: "bot", text: "No labs found for this vulnerability." }]);
      } else {
        setMessages((prev) => [...prev, { type: "bot", text: "Here are the labs found:" }]);
        setLabs(data);
      }
    } catch (error) {
      console.error("Error fetching labs:", error);
      setMessages((prev) => [...prev, { type: "bot", text: `{ "error": "Failed to fetch labs." }` }]);
    }
  };

  const handleLabSelection = (labId) => {
    setSelectedLabs(prev => 
      prev.includes(labId) 
        ? prev.filter(id => id !== labId) 
        : [...prev, labId]
    );
  };

  const addLabs = async () => {
    if (selectedLabs.length === 0) return;

    try {
      const res = await axios.post("http://localhost:3000/labs/add", {
        labIds: selectedLabs,
      });

      if (res.data.success) {
        setMessages((prev) => [...prev, { type: "bot", text: "Labs added successfully!" }]);
        setSelectedLabs([]);
        setLabs([]);
      }
    } catch (error) {
      console.error("Error adding labs:", error);
      setMessages((prev) => [...prev, { type: "bot", text: `{ "error": "Failed to add labs." }` }]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#000820] text-white">
      <Navbar />

      <div className="flex flex-col items-center justify-center flex-grow p-4">
        <h2 className="text-2xl font-bold mb-4">Admin Chat</h2>
        <div className="w-full max-w-4xl bg-[#000825] p-4 rounded-lg shadow-md">
          <div className="h-96 overflow-y-auto p-2 mb-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"} mb-3`}
              >
                <div
                  className={`p-3 rounded-lg max-w-[80%] ${
                    msg.type === "user"
                      ? "bg-[#0F2839] ml-auto"
                      : "bg-[#1D3044] border border-[#2a4365]"
                  }`}
                >
                  <pre className="whitespace-pre-wrap font-mono text-sm">{msg.text}</pre>
                </div>
              </div>
            ))}

            {labs.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-semibold mb-4 text-gray-300">Select labs to add:</p>
                <div className="space-y-3">
                  {labs.map((lab) => (
                    <div 
                      key={lab._id}
                      className={`p-3 rounded-md border transition-colors ${
                        selectedLabs.includes(lab._id)
                          ? "border-[#5DB717] bg-[#0F2839]/50"
                          : "border-[#2a4365] hover:border-[#3c5b7d]"
                      }`}
                    >
                      <label className="flex items-start cursor-pointer space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedLabs.includes(lab._id)}
                          onChange={() => handleLabSelection(lab._id)}
                          className="mt-1 h-4 w-4 text-[#5DB717] rounded focus:ring-[#5DB717]"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-[#5DB717]">
                              {lab.vulnerabilityName}
                            </h3>
                            <span 
                              className={`text-xs font-semibold px-2 py-1 rounded ${
                                lab.labLevel === 'easy' 
                                  ? 'bg-green-800/30 text-green-400'
                                  : lab.labLevel === 'medium'
                                  ? 'bg-yellow-800/30 text-yellow-400'
                                  : 'bg-red-800/30 text-red-400'
                              }`}
                            >
                              {lab.labLevel}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300 mb-1">{lab.labScenario}</p>
                          <p className="text-xs text-gray-400">{lab.labDescription}</p>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Enter vulnerability name..."
              className="flex-1 p-2 rounded-md bg-[#0F2839] border border-[#2a4365] focus:outline-none focus:border-[#5DB717]"
            />
            <button
              onClick={sendMessage}
              className="p-2 rounded-md bg-[#5DB717] hover:bg-[#4da314] transition-colors"
            >
              <FaPaperPlane className="w-5 h-5" />
            </button>
          </div>

          {labs.length > 0 && (
            <button
              onClick={addLabs}
              className="mt-4 w-full py-2 rounded-md bg-[#5DB717] hover:bg-[#4da314] transition-colors flex items-center justify-center space-x-2"
            >
              <FaSave className="w-4 h-4" />
              <span>Add Selected Labs ({selectedLabs.length})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminChat;