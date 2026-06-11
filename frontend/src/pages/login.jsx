import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import styles from "./authForm.module.css";
import Button from "../components/buttons/button";
import welcomeGraphic from "../assets/graphics/welcome_aboard.svg";
import Alert from "../components/alertPopUP/alertPopUp";
import PasswordField from "../components/passwordField/passwordField";
import { useState, useSyncExternalStore } from "react";
import validator from "validator";
import BtnLoader from "../components/loaders/btnLoader";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const formNotEmpty = email.trim() && password.trim();

  //Alert
  const [alert, setAlert] = useState(null);

  function showAlert(type, msg) {
    setAlert({ type, msg });
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  }

  const closeAlert = () => {
    setAlert(null);
  };
  //////////////////////////////////////////

  function validateForm() {
    if (!validator.isEmail(email)) {
      showAlert("error", "Invalid email!");
      return false;
    } else if (/\s/.test(password)) {
      showAlert("error", "Password cannot have spaces");
      return false;
    }

    return true;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validForm = validateForm();
    if (validForm) {
      setSubmiting(true);
      showAlert("success", "User logged in successfully");
    }
  }

  //managed button loader
  const [submiting, setSubmiting] = useState(false);

  return (
    <>
      <div className={styles.app}>
        <Header />

        {alert && (
          <Alert
            type={alert.type}
            msg={alert.msg}
            handleCloseClick={closeAlert}
          />
        )}

        <div className={styles.bodyContainer}>
          <div className={styles.formParent}>
            <div className={styles.formContainer}>
              <h1 className={styles.title}>Welcome Back</h1>
              <label className={styles.description}>
                Good to see you again...
              </label>
              <fieldset disabled={submiting} className={submiting ? "fieldsetDisabled" : ""}>
              <form>
                <div className={styles.inputGroup}>
                  <label>Email address</label>
                  <input
                    placeholder="pawanteja@email.com"
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                    }}
                  ></input>
                </div>
                
                {/*Password */}
                <div className={styles.inputGroup}>
                  <PasswordField
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                    }}
                  />
                </div>

                <Button
                  variant="primaryBlack"
                  status={formNotEmpty ? "active" : "disabled"}
                  onClick={handleSubmit}
                >
                  {submiting? <BtnLoader /> : "Login"}
                </Button>
              </form>
              </fieldset>
            </div>
            <p className={styles.register}>
              Don't have an account? <a>Register</a>
            </p>
          </div>
          <div className={styles.graphicContainer}>
            <img src={welcomeGraphic} className={styles.graphic} />
          </div>
        </div>

        <Footer className={styles.footer} />
      </div>
    </>
  );
}
