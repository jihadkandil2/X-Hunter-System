import React, { useState } from "react";
import { FaPaperPlane, FaSave } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import "./AdminChat.css";
import "../Homepage/Homepage.css";
import Adminside from "../Adminside/Adminside";


function AdminChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [labs, setLabs] = useState([]);
  const [selectedLabs, setSelectedLabs] = useState([]);
  const [isAdding, setIsAdding] = useState(false);

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

    setIsAdding(true);

    try {
      const labsToSend = labs
        .filter((lab) => selectedLabs.includes(lab._id))
        .map(({ _id, ...rest }) => rest);

      const res = await axios.post("http://localhost:3000/labs/add", {
        labs: labsToSend,
      });

      if (res.data.vulnerabilityName) {
        setMessages((prev) => [...prev, { type: "bot", text: "Labs added successfully!" }]);
        Swal.fire({
          icon: "success",
          title: `Labs Added!`,
          text: `Labs for ${res.data.vulnerabilityName} added successfully.`,
          confirmButtonColor: "#1D3044"
        });
        setSelectedLabs([]);
        setLabs([]);
     

      }
    } catch (error) {
      console.error("Error adding labs:", error);
      setMessages((prev) => [...prev, { type: "bot", text: `{ "error": "Failed to add labs." }` }]);

    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="homepage-background admin-chat-container">
      <Adminside />

      <div className="chat-content ">
        <h2 className="text-2xl font-bold mb-6 text-white text-center mt-4">Generate Labs</h2>

        {/* Messages Container */}
        <div className="messages-container">
          <div className="h-96 overflow-y-auto pr-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message-bubble ${msg.type === "user" ? "user-message" : "bot-message"}`}
              >
                <pre className="whitespace-pre-wrap font-mono text-sm text-gray-200">{msg.text}</pre>
              </div>
            ))}

            {labs.length > 0 && (
              <div className="mt-6 space-y-4">
                <p className="text-sm font-semibold mb-4 text-gray-300">Select labs to add:</p>
                {labs.map((lab) => (
                  <div
                    key={lab._id}
                    className={`lab-item p-4 rounded-md ${
                      selectedLabs.includes(lab._id)
                        ? "lab-item-selected border-[#5DB717]"
                        : "border-[#2a4365] hover:border-[#3c5b7d]"
                    }`}
                  >
                    <label className="flex items-start gap-4 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedLabs.includes(lab._id)}
                        onChange={() => handleLabSelection(lab._id)}
                        className="mt-1 h-4 w-4 text-[#5DB717] rounded focus:ring-[#5DB717]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
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
                        <p className="text-sm text-gray-300 mb-2">{lab.labScenario}</p>
                        <p className="text-xs text-gray-400">{lab.labDescription}</p>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Input Section */}
        <div className="input-section">
          <div className="flex gap-3">
            <input
              type="text"
              value={input || ""}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Enter vulnerability name..."
              className="flex-1 p-3 rounded-md bg-[#0F2839] border border-[#2a4365] focus:outline-none focus:border-[#5DB717] text-gray-200"
            />
            <button
              onClick={sendMessage}
              className="p-3 rounded-md bg-[#5DB717] hover:bg-[#4da314] transition-colors flex items-center"
            >
              <FaPaperPlane className="w-5 h-5 text-white" />
            </button>
          </div>

          {labs.length > 0 && (
            <button
              onClick={addLabs}
              disabled={isAdding}
              className="mt-4 w-full py-3 rounded-md bg-[#5DB717] hover:bg-[#4da314] transition-colors flex items-center justify-center gap-2"
            >
              <FaSave className="w-5 h-5" />
              <span>{isAdding ? "Adding..." : `Add Selected Labs (${selectedLabs.length})`}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminChat;
