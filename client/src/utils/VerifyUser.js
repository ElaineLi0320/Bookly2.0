import { useEffect } from "react";
import { useAuthToken } from "./AuthTokenContext";
import { useNavigate } from "react-router-dom";

export default function VerifyUser() {
  const navigate = useNavigate();
  const { accessToken } = useAuthToken();

  useEffect(() => {
    async function verifyUser() {
      // make a call to our API to verify the user in our database, if it doesn't exist we'll insert it into our database
      // finally we'll redirect the user to the /app route
      const data = await fetch(`${process.env.REACT_APP_API_URL}/verify-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const user = await data.json();

      // TODO: redirect here to where the user should go after verifying their account
      if (user.auth0Id) {
        navigate("/");
      }
    }

    if (accessToken) {
      verifyUser();
    }
  }, [accessToken, navigate]);

  return (
    <div className="loading">
      <h1>Loading...</h1>
      <p>
        If you keep seeing this message after logging in, please verify your
        Network tab in the browser's Developer Tools to see if there are any
        errors.
      </p>
      <p>
        Check also your api terminal for any errors in the POST /verify-user
        route.
      </p>
    </div>
  );
}
