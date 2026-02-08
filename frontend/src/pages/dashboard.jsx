import { useEffect, useState } from "react";
import api from "../api";

export default function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    api.get("/account/balance").then((res) => {
      setBalance(res.data.balance);
    });
  }, []);

  const transfer = async () => {
    await api.post("/account/transfer", { to, amount: Number(amount) });
    alert("Transfer successful");
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <h3>Balance: ₹{balance}</h3>

      <input
        placeholder="Receiver userId"
        onChange={(e) => setTo(e.target.value)}
      />
      <input placeholder="Amount" onChange={(e) => setAmount(e.target.value)} />
      <button onClick={transfer}>Send</button>
    </div>
  );
}
