import React, { useState } from "react";
import { FaPaperPlane, FaSave } from "react-icons/fa";
import axios from "axios"; // استيراد axios
import Navbar from "../Navbar/Navbar";

function AdminChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [labs, setLabs] = useState([]); // لتخزين اللابات التي يعيدها الباك إند
  const [selectedLabs, setSelectedLabs] = useState([]); // لتخزين اللابات المحددة للإضافة
  const [response, setResponse] = useState(null);

  // إرسال اسم الثغرة إلى الباك إند باستخدام axios
  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { type: "user", text: input };
    setMessages([...messages, newMessage]);
    setInput("");

    try {
      const res = await axios.post("YOUR_API_ENDPOINT_SEARCH", {
        prompt: input,
      });
      const data = res.data;
      setMessages((prev) => [...prev, { type: "bot", text: "Here are the labs found:" }]);
      setLabs(data); // تخزين اللابات التي يعيدها الباك إند
    } catch (error) {
      setMessages((prev) => [...prev, { type: "bot", text: `{ "error": "Failed to fetch response." }` }]);
    }
  };

  // تحديد أو إلغاء تحديد لاب
  const handleLabSelection = (labId) => {
    if (selectedLabs.includes(labId)) {
      setSelectedLabs(selectedLabs.filter((id) => id !== labId));
    } else {
      setSelectedLabs([...selectedLabs, labId]);
    }
  };

  // إضافة اللابات المحددة باستخدام axios
  const addLabs = async () => {
    if (selectedLabs.length === 0) return;

    try {
      const res = await axios.post("YOUR_API_ENDPOINT_ADD", {
        labs: selectedLabs,
      });
      const data = res.data;
      if (data.success) {
        setMessages((prev) => [...prev, { type: "bot", text: "Labs added successfully!" }]);
        setSelectedLabs([]); // إفراغ القائمة بعد الإضافة
      }
    } catch (error) {
      setMessages((prev) => [...prev, { type: "bot", text: `{ "error": "Failed to add labs." }` }]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0b132b] text-white">
      {/* إضافة Navbar هنا */}
      <Navbar />

      {/* محتوى الصفحة */}
      <div className="flex flex-col items-center justify-center flex-grow">
        <h2 className="text-2xl font-bold mb-4">Admin Chat</h2>
        <div className="w-[60%] mx-auto bg-[#1D3044] p-4 rounded-lg shadow-md">
          {/* Chat Messages */}
          <div className="h-64 overflow-y-auto p-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-3 mb-2 rounded-lg text-sm max-w-[80%] ${
                    msg.type === "user"
                      ? "bg-[#0F2839] text-white" // User message color
                      : "bg-[#1D3044] text-white" // Bot response color
                  }`}
                >
                  <pre className="whitespace-pre-wrap">{msg.text}</pre>
                </div>
              </div>
            ))}

            {/* عرض اللابات التي يعيدها الباك إند */}
            {labs.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-semibold">Select labs to add:</p>
                {labs.map((lab) => (
                  <div key={lab.id} className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      checked={selectedLabs.includes(lab.id)}
                      onChange={() => handleLabSelection(lab.id)}
                      className="mr-2"
                    />
                    <span>{lab.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="flex mt-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter vulnerability name..."
              className="flex-1 p-2 text-black rounded-l-md focus:outline-none"
            />
            <button
              onClick={sendMessage}
              className="bg-[#5DB717] p-2 rounded-r-md hover:bg-green-600 transition"
            >
              <FaPaperPlane />
            </button>
          </div>

          {/* زر إضافة اللابات */}
          {labs.length > 0 && (
            <button
              onClick={addLabs}
              className="mt-3 w-full bg-[#5DB717] p-2 rounded-md flex items-center justify-center hover:bg-green-600 transition"
            >
              <FaSave className="mr-2" /> Add Selected Labs
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminChat;