/** @jsx h */

import {
  h,
  IS_BROWSER,
  useEffect,
  useReducer,
  useState, PageConfig
} from "../deps.ts";

export default function Home() {
  
  return (
    <div>
      {IS_BROWSER && <ChatHistory />}
    </div>
  );
}

const DISCONNECTED = "🔴 Disconnected";
const CONNECTING = "🟡 Connecting...";
const CONNECTED = "🟢 Connected";

function ChatHistory() {
  const [status, setStatus] = useState(DISCONNECTED);
  const [connTime, setConntime] = useState(Date.now());
  const [messages, addMessage] = useReducer<any[], any>(
    (msgs, msg) => [...msgs, msg],
    [],
  );

  useEffect(() => {
    const events = new EventSource("/api/listen");
    setStatus(CONNECTING);
    events.addEventListener("open", () => {
      setStatus(CONNECTED)
      console.log(Date.now(), connTime)
      setConntime(Date.now() - connTime);
    });
    events.addEventListener("error", () => {
      switch (events.readyState) {
        case EventSource.OPEN:
          setStatus(CONNECTED);
          break;
        case EventSource.CONNECTING:
          setStatus(CONNECTING);
          break;
        case EventSource.CLOSED:
          setStatus(DISCONNECTED);
          break;
      }
    });
    events.addEventListener("message", (e) => {
      addMessage(`${e.data} ${new Date()}`);
    });
  }, []);

  return (
    <div>
      <p>Status: {status}</p>
      <p>onnection delay: {connTime} ms</p>
      <ul>
        {messages.map((msg) => (
          <li>
            {msg}
          </li>
        ))}
      </ul>
    </div>
  );
}

export const config: PageConfig = { runtimeJS: true };

