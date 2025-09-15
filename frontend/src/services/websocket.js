export const connectWs = (onMessage, onStatusChange) => {
  const ws = new WebSocket("ws://localhost:8000/ws");

  ws.onopen = () => {
    console.log("WebSocket connected");
    onStatusChange && onStatusChange('connected');
  };

  ws.onclose = () => {
    console.log("WebSocket disconnected");
    onStatusChange && onStatusChange('disconnected');
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
    onStatusChange && onStatusChange('error');
  };

  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      onMessage(msg);
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  };

  return ws;
};
  