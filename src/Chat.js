import { useState } from 'react';
import './App.css';

const API_KEY = "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"

const App = () => {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm ChatGPT! Ask me anything!",
      sender: "ChatGPT",
    },
  ]);

  const [inputMessage, setInputMessage] = useState(''); 
  const [isTyping, setIsTyping] = useState(false);

  const handleSendRequest = async (inputMessage) => {
    const newMessage = {
      message: inputMessage,
      sender: "user",
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    console.log(messages, "messages")
    setIsTyping(true);

    try {
      const response = await processMessageToChatGPT([...messages, newMessage]);
      console.log(response, 'response')
      const content = response.choices[0]?.message?.content; 

      if (content) {
        const chatGPTResponse = {
          message: content,
          sender: "ChatGPT",
        };
        console.log(chatGPTResponse, 'chatGPTResponse')
        setMessages((prevMessages) => [...prevMessages, chatGPTResponse]);
      }
    } catch (error) {
      console.error("Error processing message:", error);
    } finally {
      setIsTyping(false);
    }
  };

  async function processMessageToChatGPT(chatMessages) {
    const apiMessages = chatMessages.map((messageObject) => {
      const role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
      return { role, content: messageObject.message };
    });

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        { role: "system", content: "I'm a Student using ChatGPT for learning" },
        ...apiMessages,
      ],
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    });

    return response.json();
  }

  return (
    <div className="App">
      <div style={{ position:"relative", height: "800px", width: "700px" }}>
        {messages.map((message, i) => (
          <span key={i} className={`message ${message.sender}`} style={{ whiteSpace: 'nowrap', marginRight: '10px' }}>
            {message.message}
          </span>
        ))}
        <input 
          type="text" 
          value={inputMessage} 
          onChange={(e) => setInputMessage(e.target.value)} 
        />
        <button onClick={() => handleSendRequest(inputMessage)}>Send</button>
      </div>
    </div>
  )
}

export default App;
