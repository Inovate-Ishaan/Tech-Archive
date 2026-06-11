import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import styles from "./authForm.module.css";
import Button from "../components/buttons/button";
import welcomeGraphic from "../assets/graphics/welcome_aboard.svg";
import Alert from "../components/alertPopUP/alertPopUp";
import { useState } from "react";
import validator from "validator";
import { useNavigate, Link } from "react-router-dom";
import { signin } from "../utils/api";

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
    if (!email.toLowerCase().endsWith("@iitbhilai.ac.in")) {
      showAlert("error", "Use your institute email (@iitbhilai.ac.in)");
      return false;
    }

    return true;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validForm = validateForm();
    console.log(validForm);
    if (validForm) {
      // call backend
      setLoading(true);
      signin(email, password)
        .then((data) => {
          const { token } = data;
          if (token) {
            localStorage.setItem("auth_token", token);
            showAlert("success", "Logged in successfully");
            // redirect to home
            navigate("/");
          } else {
            showAlert("error", "No token received");
          }
        })
        .catch((err) => {
          const msg = err && err.error ? err.error : "Signin failed";
          showAlert("error", msg);
        })
        .finally(() => setLoading(false));
    }
  }

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
              <form>
                <div className={styles.inputGroup}>
                  <label >Email address</label>
                  <input
                    placeholder="example@iitbhilai.ac.in"
                    type="email"
                    value={email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  ></input>
                </div>
                <div className={styles.inputGroup}>
                  <label>Password</label>
                  <input
                    placeholder="****************"
                    type="password"
                    value={password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  ></input>
                </div>

                <Button
                  variant="primaryBlack"
                  status={formNotEmpty && !loading ? "active" : "disabled"}
                  onClick={handleSubmit}
                >
                  {loading ? "Signing in..." : "Login"}
                </Button>
              </form>
            </div>
            <p className={styles.register}>
              Don't have an account? <Link to="/register">Register</Link>
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
