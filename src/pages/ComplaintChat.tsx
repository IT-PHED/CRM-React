import { useEffect, useRef, useState, CSSProperties } from "react";
import axios from "axios";

const ComplaintChat = ({ ticketId, user }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  /* ------------------ AUTO SCROLL ------------------ */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ------------------ LOAD CHAT ------------------ */
  useEffect(() => {
    if (!ticketId) return;

    const loadChats = async () => {
      try {
        const { data } = await axios.get(
          `https://insightuat.phed.com.ng/api/crmcomment/getcomments?ticketId=${ticketId}`
        );
        setMessages(data || []);
      } catch (err) {
        console.error("Failed to load chats", err);
      }
    };

    loadChats();
  }, [ticketId]);

  /* ------------------ SEND MESSAGE ------------------ */
  const sendMessage = async () => {
    if (!text.trim()) return;

    const tempId = Date.now();

    const optimisticMsg = {
      ID: tempId,
      STAFF_ID: user.userName,
      EMAIL_ADDRESS: user.emailId,
      TEXT: text,
      CREATED_AT: new Date().toISOString(),
      optimistic: true,
      STATUS: 'sending',
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setText("");
    setSending(true);

    console.log(user);

    try {
      await axios.post("https://insightuat.phed.com.ng/api/crmcomment/InsertComment", {
        TicketId: ticketId,
        StaffId: user.userName,
        Text: optimisticMsg.TEXT,
      });

      setMessages((prev) =>
        prev.map((msg) =>
          msg.ID === tempId ? { ...msg, STATUS: 'sent' } : msg
        )
      );
    } catch (err) {
      console.error("Send failed", err);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.ID === tempId ? { ...msg, STATUS: 'failed' } : msg
        )
      );
    } finally {
      setSending(false);
    }
  };

  /* ------------------ UI ------------------ */
  return (
    <div style={styles.chatContainer}>
      <div style={styles.chatHeader}>Internal Discussion</div>

      <div className="flex flex-col gap-4 p-4 bg-gray-50 h-full overflow-y-auto">
        {messages.map((msg, index) => {
          const isMe = msg.STAFF_ID === user.userName;
          const isFailed = msg.STATUS === 'failed';
          const isSending = msg.STATUS === 'sending';

          return (
            <div key={msg.ID || index} className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`relative max-w-[75%] px-4 py-2 shadow-sm rounded-2xl ${isMe
                ? `bg-blue-600 text-white rounded-tr-none ${isFailed ? "ring-2 ring-red-400 bg-blue-700" : ""}`
                : "bg-white text-gray-800 rounded-tl-none border border-gray-200"
                }`}>

                {!isMe && (
                  <div
                    className="text-[10px] font-semibold text-blue-500 mb-1 truncate max-w-[150px]"
                    title={msg.EMAIL_ADDRESS}
                  >
                    {msg.EMAIL_ADDRESS}
                  </div>
                )}
                <div className="text-sm">{msg.TEXT}</div>

                <div className="flex items-center justify-end gap-1 mt-1 opacity-70">
                  <span className="text-[10px]">
                    {new Date(msg.CREATED_AT).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  {isMe && (
                    <div className="flex items-center">
                      {isFailed ? (
                        /* Failed Icon */
                        <span className="flex items-center gap-1 cursor-pointer" onClick={() => {/* Optional: Retry Logic */ }}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-red-300" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </span>
                      ) : isSending ? (
                        /* Loading/Sending Spinner */
                        <div className="h-2 w-2 border-2 border-blue-200 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        /* Sent Icon */
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-blue-200" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div style={styles.chatFooter}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          style={styles.input}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} disabled={sending} style={styles.sendBtn}>
          Send
        </button>
      </div>
    </div>
  );
};

/* ------------------ STYLES ------------------ */
const styles: { [key: string]: CSSProperties } = {
  chatContainer: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    borderRadius: 12,
    border: "2px solid #e5e7eb",
  },
  chatHeader: {
    padding: "12px 16px",
    fontWeight: 600,
    borderBottom: "1px solid #e5e7eb",
  },
  chatBody: {
    flex: 1,
    overflowY: "auto",
    padding: 16,
    background: "#f9fafb",
  },
  messageRow: {
    display: "flex",
    marginBottom: 10,
  },
  bubble: {
    maxWidth: "70%",
    padding: "10px 14px",
    borderRadius: 14,
    fontSize: 14,
  },
  myBubble: {
    background: "#2563eb",
    color: "#fff",
    borderBottomRightRadius: 2,
  },
  otherBubble: {
    background: "#e5e7eb",
    color: "#111827",
    borderBottomLeftRadius: 2,
  },
  userName: {
    fontWeight: 600,
    fontSize: 12,
    marginBottom: 4,
    opacity: 0.8,
  },
  text: {
    marginBottom: 4,
  },
  time: {
    fontSize: 11,
    opacity: 0.7,
    textAlign: "right",
  },
  chatFooter: {
    display: "flex",
    gap: 8,
    padding: 12,
    borderTop: "1px solid #e5e7eb",
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    border: "1px solid #d1d5db",
    outline: "none",
  },
  sendBtn: {
    padding: "10px 16px",
    borderRadius: 8,
    border: "none",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
  },
};

export default ComplaintChat;
