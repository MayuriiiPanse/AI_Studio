import { useEffect, useRef, useState, useCallback } from "react";
import { Send, MessagesSquare, Wifi, WifiOff } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import MessageBubble from "../components/chat/MessageBubble";
import { getSocket } from "../api/socket";
import { sendChatMessage } from "../api/chat";
import { getErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import styles from "./Chat.module.css";

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi, I'm your studio assistant. Ask me for ideas, ask about a past post, or hand me a document in Knowledge and I'll use it here too." },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [connected, setConnected] = useState(false);
  const scrollRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;
    socket.connect();

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onResponse = (payload) => {
      setSending(false);
      if (payload?.success) {
        setMessages((m) => [...m, { role: "ai", text: payload.chat?.response || "…", ragUsed: payload.ragUsed }]);
      } else {
        toast.error(payload?.message || "The assistant couldn't respond.");
      }
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("chat-response", onResponse);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("chat-response", onResponse);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  const handleSend = useCallback(
    async (e) => {
      e?.preventDefault();
      const message = input.trim();
      if (!message || sending) return;

      setMessages((m) => [...m, { role: "user", text: message }]);
      setInput("");
      setSending(true);

      const socket = socketRef.current;
      if (socket?.connected && user?.id) {
        socket.emit("chat-message", { userId: user.id, message });
        // Safety net: if no response arrives in time, fall back to REST.
        const timeout = setTimeout(async () => {
          try {
            const res = await sendChatMessage(message);
            setMessages((m) => [...m, { role: "ai", text: res.chat?.response || "…" }]);
          } catch (error) {
            toast.error(getErrorMessage(error, "The assistant is unavailable right now."));
          } finally {
            setSending(false);
          }
        }, 12000);
        socket.once("chat-response", () => clearTimeout(timeout));
      } else {
        try {
          const res = await sendChatMessage(message);
          setMessages((m) => [...m, { role: "ai", text: res.chat?.response || "…" }]);
        } catch (error) {
          toast.error(getErrorMessage(error, "The assistant is unavailable right now."));
        } finally {
          setSending(false);
        }
      }
    },
    [input, sending, user]
  );

  return (
    <div className={styles.page}>
      <PageHeader
        eyebrow="Studio assistant"
        title="Ask, brainstorm, refine"
        description="Grounded in your own posts and knowledge base — not just a generic chatbot."
        actions={
          <span className={[styles.status, connected ? styles.online : styles.offline].join(" ")}>
            {connected ? <Wifi size={13} /> : <WifiOff size={13} />}
            {connected ? "Live" : "Connecting…"}
          </span>
        }
      />

      <Card padded={false} className={styles.chatCard}>
        <div className={styles.messages} ref={scrollRef}>
          {messages.map((m, i) => (
            <MessageBubble key={i} role={m.role} text={m.text} ragUsed={m.ragUsed} />
          ))}
          {sending && (
            <div className={styles.typing}>
              <MessagesSquare size={13} />
              <span>Thinking…</span>
            </div>
          )}
        </div>
        <form className={styles.inputRow} onSubmit={handleSend}>
          <input
            className={styles.input}
            placeholder="Ask for reel ideas, a caption tweak, anything…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type="submit" icon={<Send size={15} />} disabled={!input.trim()} loading={sending}>
            Send
          </Button>
        </form>
      </Card>
    </div>
  );
}
