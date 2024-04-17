import '../App.css';
import React, { useState } from 'react';


const API_KEY = process.env.OPENAI_API_KEY


export async function handleSendRequest (inputMessage, messages, setMessages) {
    console.log('here')

    const newMessage = {
      message: inputMessage,
      sender: "user",
    };

    console.log('here 1')

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    console.log('here 2')

    try {
      console.log('hi')
      const response = await processMessageToChatGPT([...messages, newMessage]);
      console.log('1')
      const content = response.choices[0]?.inputMessage?.content; 
      console.log('2')

      if (content) {
        const chatGPTResponse = {
          message: content,
          sender: "ChatGPT",
        };
        console.log('3')
        console.log(chatGPTResponse, 'chatGPTResponse')
        console.log('4')
        setMessages((prevMessages) => [...prevMessages, chatGPTResponse]);

      }
    } catch (error) {
      console.error("Error processing message:", error);
    } finally {
    }
  };


async function processMessageToChatGPT(chatMessages) {
    console.log('a1')
    const apiMessages = chatMessages.map((messageObject) => {
      const role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
      return { role, content: messageObject.message };
    });
    console.log('a2')

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        { role: "system", content: "I'm a Student using ChatGPT for learning" },
        ...apiMessages,
      ],
    };
    console.log('a3')

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    });
    console.log('a4')

    return response.json();
};