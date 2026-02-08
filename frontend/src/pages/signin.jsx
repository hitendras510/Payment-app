import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Signin() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const submit = async () => {
    try {
      const res = await api.post("/users/signin", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (e) {
      alert(e.response.data.message);
    }
  };

  return (
    <div>
      <h2>Signin</h2>
      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />
      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button onClick={submit}>Signin</button>
    </div>
  );
}
