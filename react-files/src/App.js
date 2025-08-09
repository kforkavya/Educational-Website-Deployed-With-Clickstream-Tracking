import React, { useState } from "react";
import Login from "./Login";

function App() {
  const [user, setUser] = useState(null);

  return (
    <div>
      {user ? (
        <h2>Welcome {user.email}</h2>
      ) : (
        <Login onLogin={(loggedInUser) => setUser(loggedInUser)} />
      )}
    </div>
  );
}

export default App;