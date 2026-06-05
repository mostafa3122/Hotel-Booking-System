import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  token: string | null;
  userData: any;
  saveUserData: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);

  const saveUserData = () => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
      setUserData(jwtDecode(storedToken));
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUserData(null);
  };

  useEffect(() => {
    saveUserData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        userData,
        saveUserData,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
