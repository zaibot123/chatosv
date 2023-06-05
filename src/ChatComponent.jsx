import React, { useState, useEffect, useRef } from "react";
import ChatMessage from "./ChatMessages";

function ChatComponent({ listOfChatMessages, handleDownload, changeText }) {
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
    <div className="flex  flex: 1 1 0%  h-screen" style={{ maxHeight: "50vh"}}>
      <div style={{ padding: "1rem" }} className="rounded-[7px] border border-blue-gray-200 w-1/5 overflow-y-auto flex-col flex-grow bg-purple-50">
        <div ref={chatContainerRef} className="chat-container overflow-y-auto">
          {listOfChatMessages.map((message, index) => (
            <ChatMessage
              key={message.messageId}
              showEncryptedMessage={changeText}
              handleDownload={handleDownload}
              message={message}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChatComponent;
