import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import CreatePasswordPage from "./pages/createPassword";
import FeedPage from "./pages/feed";
import CreatePostPage from "./pages/createPost";
import ComponentTest from "./pages/componentTest";
import ResetPasswordPage from "./pages/resetPassword";
import PostPage from "./pages/post";
import ProfilePage from "./pages/userProfile";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/create-password" element={<CreatePasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/create-post" element={<CreatePostPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/component-test" element={<ComponentTest />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
