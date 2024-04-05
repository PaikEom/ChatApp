import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./Register/Register";
import "./App.css";
import LogIn from "./LogIn/LogIn";
import Home from "./Home/Home";
import Chat from "./Chat/Chat";
import { AuthContext } from "./index";
import AddFriends from "./AddFriends/AddFriend";
import Friends from "./Friends/Friends";
import Pending from "./Pending/Pending";
import ChatMessage from "./ChatMessage/ChatMessage";
function App() {
  const { currentUser } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  return (
    <div style={{ overflow: "hidden" }}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<AddFriends />} />
            <Route path="friends" element={<Friends />} />
            <Route path="add-friends" element={<AddFriends />} />
            <Route path="pending" element={<Pending />} />
            <Route path="/chats_message" element={<ChatMessage />} />
          </Route>
          <Route path="/chat" element={<Chat />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
