import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginRegisterPage.css";

const LoginRegisterPage = () => {
  const { loginWithRedirect } = useAuth0();
  const navigate = useNavigate();

  return (
    <div className="login-register-page">
      <div className="login-register-container">
        <h1>🤔 Want to explore more?</h1>
        <button onClick={() => loginWithRedirect()}>Log In / Register</button>
        <button onClick={() => navigate("/")}>Return to Home</button>
      </div>
    </div>
  );
};

export default LoginRegisterPage;
