import { useRef, useContext } from "react";
import { useHistory } from "react-router-dom";

import classes from "./ProfileForm.module.css";

import useHttp from "../../hooks/use-http";
import { SendSignRequest } from "../../lib/api";
import AuthContext from "../../store/auth-context";
import LoadingSpinner from "../UI/LoadingSpinner";

const ProfileForm = () => {
  const { data, status, sendRequest, error } = useHttp(SendSignRequest);

  const history = useHistory();

  const newPasswordInputRef = useRef();

  const authCtx = useContext(AuthContext);

  const submitHandler = (event) => {
    event.preventDefault();

    const requestConfig = {
      body: {
        idToken: authCtx.token,
        password: newPasswordInputRef.current.value,
        returnSecureToken: false,
      },
      url: "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyD8uMUlSxkZ6BRXFzd7Hm-eNWPEE1Bkydo",
    };

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
    history.replace("/");
  }

  if (error) {
    alert(error);
  }

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" ref={newPasswordInputRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
