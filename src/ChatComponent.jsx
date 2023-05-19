import React, { useEffect, useRef } from 'react';

function ChatComponent({ listOfMessages }) {
  const chatContainerRef = useRef(null);

  // Scroll to the bottom of the chat container whenever new messages are received
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [listOfMessages]);

  return (
    <div ref={chatContainerRef}>
      {listOfMessages.map((message) => (
        <div key={message.id}>{message.text}</div>
      ))}
    </div>
  );
}

export default ChatComponent;
