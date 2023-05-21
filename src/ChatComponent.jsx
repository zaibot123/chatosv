import React, { useState, useEffect, useRef } from "react";
import ChatMessage from "./ChatMessages";

function ChatComponent({ listOfChatMessages, handleDownload, changeText }) {
  // const [changeText, setChangeText] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
    console.log("object")
  }, [listOfChatMessages]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      console.log("object")
    }
  };

  return (
    <div ref={chatContainerRef} class="chat-container overflow-y-auto ">
      {
      listOfChatMessages.map((message) => (
        console.log(message.messageId),
        <ChatMessage
          key={message.messageId}
          showEncryptedMessage={changeText}
          handleDownload={handleDownload}
          message={message}
        />
      ))}
    </div>
  );
}

export default ChatComponent;