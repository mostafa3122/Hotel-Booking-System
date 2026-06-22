import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "swiper/css";
import "swiper/css/autoplay";
import "./index.css";
import App from "./App.tsx";
import AuthProvider from "./context/AuthContext.tsx";
import './shared/utils/i18n';
import { FavoritesProvider } from "./context/Favoritescontext.tsx";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <FavoritesProvider>
      <App />
      <ToastContainer position="top-right" autoClose={3000} />
      </FavoritesProvider>
    </AuthProvider>
  </StrictMode>
);
