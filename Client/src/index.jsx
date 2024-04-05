import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";

const socket = io.connect("http://localhost:8800");
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [moveFriends, setMoveFriends] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [userUsername, setUserUsername] = useState("");
  const [currentChat, setCurrentChat] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("currentChat")) || null;
    } catch (error) {
      console.error("Error retrieving data from localStorage:", error);
      return null;
    }
  });
  useEffect(() => {
    localStorage.setItem("currentChat", JSON.stringify(currentChat));
  }, [currentChat]);
  const login = async (inputs) => {
    try {
      const res = await axios.post(
        "http://localhost:8800/api/auth/find/login",
        inputs,
        {
          withCredentials: true,
        }
      );

      setCurrentUser(res.data);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  const addUser = async (user_id_1, user_id_2) => {
    // as the name says it allows the user to add another user, by sending their id and the other user's id

    try {
      const res = await axios.post(
        "http://localhost:8800/api/finduser/add",
        {
          user_id_1,
          user_id_2,
        },
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error(error.response.data);
      throw error;
    }
  };
  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        currentChatId,
        setCurrentChatId,
        addUser,
        currentChat,
        setCurrentChat,
        moveFriends,
        setMoveFriends,
        userUsername,
        setUserUsername,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
