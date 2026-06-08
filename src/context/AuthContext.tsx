import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  token: string | null;
  userData: any;
  role: string | null;
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
  const [role, setRole] = useState<string | null>(null);

  const saveUserData = () => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    if (storedToken) {
      setToken(storedToken);
      try {
        const decoded: any = jwtDecode(storedToken);
        setUserData(decoded);
        setRole(storedRole || decoded.userRole || decoded.role || null);
      } catch (error) {
        console.error("Error decoding JWT token:", error);
        setRole(storedRole);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setUserData(null);
    setRole(null);
  };

  useEffect(() => {
    saveUserData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        userData,
        role,
        saveUserData,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
