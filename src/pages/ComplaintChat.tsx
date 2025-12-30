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

    const optimisticMsg = {
      STAFF_ID: user.userId,
      EMAIL_ADDRESS: user.emailId,
      TEXT: text,
      CREATED_AT: new Date().toISOString(),
      optimistic: true,
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setText("");
    setSending(true);

    try {
      await axios.post("https://insightuat.phed.com.ng/api/crmcomment/InsertComment", {
        TicketId: ticketId,
        StaffId: user.userId,
        Text: optimisticMsg.TEXT,
      });
    } catch (err) {
      console.error("Send failed", err);
    } finally {
      setSending(false);
    }
  };

  /* ------------------ UI ------------------ */
  return (
    <div style={styles.chatContainer}>
      <div style={styles.chatHeader}>Internal Discussion</div>

      <div style={styles.chatBody}>
        {messages.map((msg, index) => {
          const isMe = msg.STAFF_ID === user.userId;

          return (
            <div
              key={index}
              style={{
                ...styles.messageRow,
                justifyContent: isMe ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  ...styles.bubble,
                  ...(isMe ? styles.myBubble : styles.otherBubble),
                }}
              >
                {!isMe && (
                  <div style={styles.userName}>{msg.EMAIL_ADDRESS}</div>
                )}
                <div style={styles.time}>
                  {msg.EMAIL_ADDRESS || msg.STAFF_ID}
                </div>
                <div style={styles.text}>{msg.TEXT}</div>
                <div style={styles.time}>
                  {new Date(msg.CREATED_AT).toLocaleString()}
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
