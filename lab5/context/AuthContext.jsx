import { useRouter } from "expo-router";
import { createContext, useContext, useState } from "react";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const login = (email, password) => {
    setIsAuthenticated(true);
    router.replace("/");
  };

  const register = (email, password, name) => {
    setIsAuthenticated(true);
    router.replace("/");
  };

  const logout = () => {
    setIsAuthenticated(false);
    router.replace("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
