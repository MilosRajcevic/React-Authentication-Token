import { useState, useRef, useContext } from "react";
import { useHistory } from "react-router-dom";

import classes from "./AuthForm.module.css";

import useHttp from "../../hooks/use-http";
import { SendSignRequest } from "../../lib/api";
import LoadingSpinner from "../UI/LoadingSpinner";
import AuthContext from "../../store/auth-context";

const AuthForm = () => {
  const { sendRequest, error, status, data } = useHttp(SendSignRequest);

  const history = useHistory();

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const authCtx = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const requestConfig = {
      body: {
        email: emailInputRef.current.value,
        password: passwordInputRef.current.value,
        returnSecureToken: true,
      },
      url: "",
    };

    if (isLogin) {
      requestConfig.url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD8uMUlSxkZ6BRXFzd7Hm-eNWPEE1Bkydo";
    } else {
      requestConfig.url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD8uMUlSxkZ6BRXFzd7Hm-eNWPEE1Bkydo";
    }

    sendRequest(requestConfig);
  };

  if (status === "pending") {
    return (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );
  }

  if (status === "completed" && !error) {
    const experationTime = new Date(
      new Date().getTime() + +data.expiresIn * 1000
    );
    authCtx.login(data.idToken, experationTime.toISOString());

    history.replace("/");
  }

  if (error) {
    alert(error);
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? "Login" : "Create Account"}</button>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
