import axios from "axios";

export const fetchTrades = async () => {
  const res = await axios.get("http://localhost:8000/trades/");
  return res.data;
};
