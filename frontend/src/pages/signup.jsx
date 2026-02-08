import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const submit = async () => {
    try {
      const res = await api.post("/users/signup", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (e) {
      alert(e.response.data.message);
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />
      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <input
        placeholder="First name"
        onChange={(e) => setForm({ ...form, firstname: e.target.value })}
      />
      <input
        placeholder="Last name"
        onChange={(e) => setForm({ ...form, lastname: e.target.value })}
      />
      <button onClick={submit}>Signup</button>
    </div>
  );
}
