import React, { useState, useEffect, useRef } from "react";
import ChatMessage from "./ChatMessages";

function ChatComponent({ listOfChatMessages, handleDownload, changeText }) {
  // const [changeText, setChangeText] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [listOfChatMessages]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  return (
    <div ref={chatContainerRef} class="chat-container overflow-y-auto ">
      {
      
      listOfChatMessages.map((message, index) => (
        console.log(index),
        <ChatMessage
          key={message.messageId}
          showEncryptedMessage={changeText}
          handleDownload={handleDownload}
          message={message}
          index = {index}
        />
      ))}
    </div>
  );
}

export default ChatComponent;