/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState, CSSProperties, useCallback } from "react";
import axios from "axios";
import * as signalR from "@microsoft/signalr";

interface Message {
  ID: number;
  STAFF_ID: string;
  EMAIL_ADDRESS: string;
  TEXT: string;
  CREATED_AT: string;

  ACCOUNT_NO?: string;
  ASSIGNED_TO?: string;
  PHONE?: string;
  SOURCE?: string;
  PARENT_CHAT_ID?: number | null;
  DATE_RESOLVED?: string | null;
  DELETED_AT?: string | null;

  optimistic?: boolean;
  STATUS?: "sending" | "sent" | "failed";
}

interface User {
  userName: string;
  emailId: string;
}

interface Props {
  ticketId: number;
  user: User;
}

const mapServerMessage = (msg: any): Message => ({
  ID: Number(msg.comment_Id),
  STAFF_ID: msg.staff_Id,
  EMAIL_ADDRESS: msg.email_Address,
  TEXT: msg.text,
  CREATED_AT: msg.created_At,

  ACCOUNT_NO: msg.account_no,
  ASSIGNED_TO: msg.assigned_To,
  PHONE: msg.phone,
  SOURCE: msg.source,
  PARENT_CHAT_ID: msg.parent_Chat_Id,
  DATE_RESOLVED: msg.date_Resolved,
  DELETED_AT: msg.deleted_At,

  STATUS: "sent",
  optimistic: true,
});

const ComplaintChat = ({ ticketId, user }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [connectionState, setConnectionState] = useState<"Connecting" | "Connected" | "Disconnected">("Disconnected");
  const [typers, setTypers] = useState<string[]>([]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  const HUB_URL = `${import.meta.env.VITE_API_URL}/hubs/complaint`;

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

  // /* ------------------ SEND MESSAGE ------------------ */
  // const sendMessage = async () => {
  //   if (!text.trim()) return;

  //   const tempId = Date.now();

  //   const optimisticMsg = {
  //     ID: tempId,
  //     STAFF_ID: user.userName,
  //     EMAIL_ADDRESS: user.emailId,
  //     TEXT: text,
  //     CREATED_AT: new Date().toISOString(),
  //     optimistic: true,
  //     STATUS: 'sending',
  //   };

  //   setMessages((prev) => [...prev, optimisticMsg]);
  //   setText("");
  //   setSending(true);

  //   console.log(user);

  //   try {
  //     await axios.post("https://insightuat.phed.com.ng/api/crmcomment/InsertComment", {
  //       TicketId: ticketId,
  //       StaffId: user.userName,
  //       Text: optimisticMsg.TEXT,
  //     });

  //     setMessages((prev) =>
  //       prev.map((msg) =>
  //         msg.ID === tempId ? { ...msg, STATUS: 'sent' } : msg
  //       )
  //     );
  //   } catch (err) {
  //     console.error("Send failed", err);

  //     setMessages((prev) =>
  //       prev.map((msg) =>
  //         msg.ID === tempId ? { ...msg, STATUS: 'failed' } : msg
  //       )
  //     );
  //   } finally {
  //     setSending(false);
  //   }
  // };

  /* ------------------ SIGNALR CONNECTION ------------------ */
  useEffect(() => {
    const conn = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    conn.onreconnecting(() => setConnectionState("Connecting"));
    conn.onreconnected(() => setConnectionState("Connected"));
    conn.onclose(() => setConnectionState("Disconnected"));

    conn.start()
      .then(() => {
        setConnectionState("Connected");
        // Join the group for this specific ticket
        return conn.invoke("JoinComplaint", ticketId, user.userName);
      })
      .catch((err) => {
        console.error("SignalR connection failed:", err);
        setConnectionState("Disconnected");
      });

    setConnection(conn);
    connectionRef.current = conn;

    return () => {
      conn.invoke("LeaveComplaint", ticketId, user.userName).catch(() => { });
      conn.stop();
    };
  }, [ticketId, user.userName]);

  /* ------------------ SIGNALR EVENT LISTENERS ------------------ */
  useEffect(() => {
    if (!connection) return;

    // A new comment was saved and broadcast by the hub
    const onNewComment = (serverMsg: any) => {
      const comment = mapServerMessage(serverMsg);

      setMessages((prev) => {
        // Prevent duplicates
        if (prev.some((m) => !m.optimistic && m.ID === comment.ID)) {
          return prev;
        }

        const optimisticIndex = prev.findIndex(
          (m) =>
            m.optimistic &&
            m.STAFF_ID === comment.STAFF_ID &&
            m.TEXT === comment.TEXT
        );

        if (optimisticIndex !== -1) {
          const updated = [...prev];
          updated[optimisticIndex] = { ...comment, STATUS: "sent" };
          return updated;
        }

        return [...prev, comment];
      });

      // IMPORTANT: ensure sending stops
      setSending(false);
    };

    // Another staff member is typing
    const onUserTyping = ({ userName, isTyping }: { userName: string; isTyping: boolean }) => {
      if (userName === user.userName) return;
      setTypers((prev) =>
        isTyping ? [...new Set([...prev, userName])] : prev.filter((u) => u !== userName)
      );
    };

    // Staff member opened this ticket
    const onUserJoined = ({ userName }: { userName: string }) => {
      if (userName !== user.userName) {
        console.info(`${userName} is now viewing this ticket`);
      }
    };

    connection.on("NewComment", onNewComment);
    connection.on("UserTyping", onUserTyping);
    connection.on("UserJoined", onUserJoined);

    return () => {
      connection.off("NewComment", onNewComment);
      connection.off("UserTyping", onUserTyping);
      connection.off("UserJoined", onUserJoined);
    };
  }, [connection, user.userName]);

  /* ------------------ TYPING INDICATOR ------------------ */
  const handleTextChange = (val: string) => {
    setText(val);

    if (!connectionRef.current || connectionState !== "Connected") return;

    connectionRef.current.invoke("SendTyping", ticketId, user.userName, true).catch(() => { });

    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      connectionRef.current?.invoke("SendTyping", ticketId, user.userName, false).catch(() => { });
    }, 2000);
  };

  /* ------------------ SEND MESSAGE ------------------ */
  const sendMessage = useCallback(async () => {
    if (!text.trim() || sending) return;

    const tempId = Date.now();
    const messageText = text.trim();

    const optimisticMsg: Message = {
      ID: tempId,
      STAFF_ID: user.userName,
      EMAIL_ADDRESS: user.emailId,
      TEXT: messageText,
      CREATED_AT: new Date().toISOString(),
      optimistic: true,
      STATUS: "sending",
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setText("");
    setSending(true);

    // Stop typing indicator immediately on send
    if (typingTimer.current) clearTimeout(typingTimer.current);
    connectionRef.current?.invoke("SendTyping", ticketId, user.userName, false).catch(() => { });

    const payload = {
      TicketId: ticketId,
      StaffId: user.userName,
      Text: messageText,
    };

    try {
      if (connectionRef.current && connectionState === "Connected") {
        // Send via SignalR — hub persists to DB and broadcasts to all viewers
        await connectionRef.current.invoke("SendComment", {
          TicketId: ticketId,
          StaffId: user.userName,
          Text: messageText,
          ParentChatId: null,
        });
        // Optimistic message will be reconciled via the "NewComment" event
      } else {
        // Fallback: REST when SignalR is offline
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/crmcomment/InsertComment`,
          payload
        );
        setMessages((prev) =>
          prev.map((msg) => (msg.ID === tempId ? { ...msg, STATUS: "sent" } : msg))
        );
      }
    } catch (err) {
      console.error("Send failed", err);
      setMessages((prev) =>
        prev.map((msg) => (msg.ID === tempId ? { ...msg, STATUS: "failed" } : msg))
      );
    } finally {
      setSending(false);
    }
  }, [text, sending, ticketId, user, connectionState]);


  /* ------------------ UI ------------------ */
  return (
    <div style={styles.chatContainer}>
      <div style={styles.chatHeader}>
        <span>Internal Discussion</span>
        <span style={{
          ...styles.connectionBadge,
          background: connectionState === "Connected" ? "#dcfce7" : connectionState === "Connecting" ? "#fef9c3" : "#fee2e2",
          color: connectionState === "Connected" ? "#16a34a" : connectionState === "Connecting" ? "#ca8a04" : "#dc2626",
        }}>
          <span style={{
            ...styles.connectionDot,
            background: connectionState === "Connected" ? "#16a34a" : connectionState === "Connecting" ? "#ca8a04" : "#dc2626",
            animation: connectionState === "Connecting" ? "pulse 1s infinite" : "none",
          }} />
          {connectionState === "Connected" ? "Live" : connectionState === "Connecting" ? "Connecting..." : "Offline"}
        </span>
      </div>

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

        {typers.length > 0 && (
          <div className="flex items-center gap-2 px-2">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <span key={i} style={{ ...styles.typingDot, animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
            <span className="text-xs text-gray-400">
              {typers.join(", ")} {typers.length === 1 ? "is" : "are"} typing...
            </span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div style={styles.chatFooter}>
        <input
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Type a message..."
          style={styles.input}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} disabled={sending || !text.trim()} style={{
          ...styles.sendBtn,
          opacity: sending || !text.trim() ? 0.5 : 1,
          cursor: sending || !text.trim() ? "not-allowed" : "pointer",
        }}>
          {sending ? "..." : "Send"}
        </button>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes bounce { 0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; } 40% { transform: scale(1); opacity: 1; } }
      `}</style>
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
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
  connectionBadge: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    padding: "3px 10px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
  },
  connectionDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    display: "inline-block",
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
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#9ca3af",
    display: "inline-block",
    animation: "bounce 1.2s infinite",
  } as CSSProperties,
};

export default ComplaintChat;
