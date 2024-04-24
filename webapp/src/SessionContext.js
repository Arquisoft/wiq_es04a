import React, { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const SessionContext = createContext();

const SessionProvider = ({ children }) => {
    
    const [sessionId, setSessionId] = useState('');
    const [username, setUsername] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [avatar, setAvatar] = useState('/default_user.jpg');
  
    //This hook recovers user data if available in localstorage when the sessprovider is created
    useEffect(() => {
      const storedSessionId = localStorage.getItem('sessionId');
      if (storedSessionId) {
        setSessionId(storedSessionId);
        setIsLoggedIn(true);
        
        // Here you can get the username using the sessionID
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
          setUsername(storedUsername);
        }

        const storedAvatar = localStorage.getItem('avatar');
        if (storedAvatar) {
            setAvatar(storedAvatar);
        }
      }
    }, []);
  
    const createSession = (username) => {
      const newSessionId = uuidv4();
      setSessionId(newSessionId);
      setUsername(username);
      setIsLoggedIn(true);
      localStorage.setItem('sessionId', newSessionId);
      localStorage.setItem('username', username);
      localStorage.setItem('avatar', '/default_user.jpg');
    };
  
    const destroySession = () => {
      localStorage.removeItem('sessionId');
      localStorage.removeItem('username');
      setSessionId('');
      setUsername('');
      setIsLoggedIn(false);
      setAvatar('/default_user.jpg');
    };

    const updateAvatar = (newAvatar) => {
      setAvatar(newAvatar);
      localStorage.setItem('avatar', newAvatar);
    };
  
    return (
        // This values are the props we can access from the child objects
      <SessionContext.Provider value={{ sessionId, username, isLoggedIn, avatar, createSession, destroySession, updateAvatar }}>
        {children}
      </SessionContext.Provider>
    );
  };

export { SessionContext, SessionProvider };