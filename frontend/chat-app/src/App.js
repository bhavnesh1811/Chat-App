import React, { useState } from "react";
import Login from "./components/Login";
import Chat from "./components/Chat";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  return (
    <div>{!token ? <Login setToken={setToken} /> : <Chat token={token} />}</div>
  );
}

export default App;
