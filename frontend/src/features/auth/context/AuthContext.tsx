import React, { createContext, useContext, useState } from 'react';

// 🌟 1. Update the User interface signature
interface UserProfile {
  firstName: string;
  username: string;
}

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  user: UserProfile | null; // 🌟 Track the active user profile node
  login: (accessToken: string, refreshToken: string, firstName: string, username: string) => void; // 🌟 Accept user details on login
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('access_token'));

  // 🌟 2. Initialize user state from localStorage so it persists on tab refresh
  const [user, setUser] = useState<UserProfile | null>(() => {
    const savedFirstName = localStorage.getItem('user_first_name');
    const savedUsername = localStorage.getItem('user_username');

    if (savedFirstName && savedUsername) {
      return { firstName: savedFirstName, username: savedUsername };
    }
    return null;
  });

  // 🌟 3. Update login to write both tokens and user data into memory
  const login = (
    accessToken: string,
    refreshToken: string,
    firstName: string,
    username: string
  ) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('user_first_name', firstName);
    localStorage.setItem('user_username', username);

    setToken(accessToken);
    setUser({ firstName, username });
  };

  // 🌟 4. Clean out everything upon termination of the session
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_first_name');
    localStorage.removeItem('user_username');

    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
