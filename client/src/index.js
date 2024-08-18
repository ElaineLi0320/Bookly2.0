import React from "react";
import * as ReactDOMClient from "react-dom/client";
import "setimmediate";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import { AuthTokenProvider } from "./utils/AuthTokenContext.js";
import { requestedScopes } from "./utils/constants.js";

import Header from "./components/Header.js";
import Homepage from "./pages/Homepage.js";
import BooksPage from "./pages/BooksPage.js";
import CartPage from "./pages/CartPage.js";
import LoginRegisterPage from "./pages/LoginRegisterPage.js";
import BookDetailsPage from "./pages/BookDetailsPage.js";
import VerifyUser from "./utils/VerifyUser.js";
import AuthDebugger from "./utils/AuthDebugger.js";
import ChatBot from "./components/ChatBot.js";

const container = document.getElementById("root");
const root = ReactDOMClient.createRoot(container);

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/verify-user`,
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        scope: requestedScopes.join(" "),
      }}
    >
      <AuthTokenProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginRegisterPage />} />
            <Route path="/verify-user" element={<VerifyUser />} />
            <Route path="/books/:id" element={<BookDetailsPage />} />
            <Route path="/auth-debugger" element={<AuthDebugger />} />
          </Routes>
          <ChatBot />
        </BrowserRouter>
      </AuthTokenProvider>
    </Auth0Provider>
  </React.StrictMode>
);
