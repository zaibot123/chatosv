import React from "react";
import './App.css';

function ChatMessage({ showEncryptedMessage, message, file = false, handleDownload, index }) {
  let width = "80%"
  const messageStyle = {
    // minHeight,
    
    maxWidth: width, 
    textAlign: message.isMessageFromUser ? "right" : "left", // Align the text inside the box
    marginLeft: message.isMessageFromUser ? "auto" : "0", // Align the message box to the right for user messages
    marginRight: message.isMessageFromUser ? "0" : "auto", // Align the message box to the left for other messages
  };

  if (message.fileId !== "message") {
    return (
      <div>
        <div className={`${message.isMessageFromUser ? "text-right" : "text-left"}`}>
          <div className={`${message.isMessageFromUser ? "bg-teal-400 p-3 rounded-3xl my-3" : "bg-green-400 p-3 rounded-3xl my-3 "} space-y-20`} style={messageStyle}>
            <button onClick={() => handleDownload(message.fileId)}>Download {showEncryptedMessage ? message.encrypted : message.textContent}</button>
          </div>
          {message.author}, {message.timestamp}
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div className={`${message.isMessageFromUser ? "text-right" : "text-left"}`}>
          <div className={`${message.isMessageFromUser ? "bg-teal-400 p-3 rounded-3xl my-4 overflow-wrap: normal " : "bg-green-400 p-3 rounded-3xl my-3 overflow-wrap: normal"} space-y-20`}  style={messageStyle}>
            {message.textContent ? (showEncryptedMessage ? "encrypted message" + message.encrypted.body + " \n v:" + message.encrypted.iv : message.textContent) : ""}
          </div>
          {message.author}, {message.timestamp}
        </div>
      </div>
    );
  }
}

export default ChatMessage;
