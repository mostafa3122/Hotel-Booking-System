import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axiosClient from "../services/api/axiosClient";

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

  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [userData, setUserData] = useState<any>(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserName = localStorage.getItem("userName");
    const storedProfileImage = localStorage.getItem("profileImage");
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken) as any;
        return {
          ...decoded,
          userName: storedUserName || decoded.userName,
          profileImage: storedProfileImage || decoded.profileImage
        };
      } catch (error) {
        return null;
      }
    }
    return null;
  });
  const [role, setRole] = useState<string | null>(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    if (storedToken) {
      try {
        const decoded: any = jwtDecode(storedToken);
        return storedRole || decoded.userRole || decoded.role || null;
      } catch (error) {
        return storedRole;
      }
    }
    return null;
  });

  const saveUserData = () => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    const storedUserName = localStorage.getItem("userName");
    const storedProfileImage = localStorage.getItem("profileImage");

    if (storedToken) {
      setToken(storedToken);
      try {
        const decoded: any = jwtDecode(storedToken);
        setUserData({
          ...decoded,
          userName: storedUserName || decoded.userName,
          profileImage: storedProfileImage || decoded.profileImage
        });
        setRole(storedRole || decoded.userRole || decoded.role || null);
      } catch (error) {
        setRole(storedRole);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    localStorage.removeItem("profileImage");
    setToken(null);
    setUserData(null);
    setRole(null);
  };

  useEffect(() => {
    saveUserData();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        const decoded: any = jwtDecode(token);
        const userId = decoded._id || decoded.id || decoded.userId;
        if (!userId) return;

        const currentRole = role || decoded.userRole || decoded.role;
        const endpoint = currentRole === "admin" ? `admin/users/${userId}` : `portal/users/${userId}`;

        const response = await axiosClient.get(endpoint);
        const user = response.data?.data?.user || response.data?.user || response.data;
        const profileImg = user?.profileImage || user?.image || user?.avatar;
        const name = user?.userName || user?.name;

        if (profileImg) {
          localStorage.setItem("profileImage", profileImg);
          setUserData((prev: any) => prev ? { ...prev, profileImage: profileImg } : { profileImage: profileImg });
        }
        if (name) {
          localStorage.setItem("userName", name);
          setUserData((prev: any) => prev ? { ...prev, userName: name } : { userName: name });
        }
      } catch (err) {
      }
    };

    fetchProfile();
  }, [token, role]);

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
