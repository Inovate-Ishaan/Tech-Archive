import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import styles from "./authForm.module.css";
import Button from "../components/buttons/button";
import Alert from "../components/alertPopUP/alertPopUp";
import passwordGraphic from "../assets/graphics/enter_password.svg";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { setPassword } from "../utils/api";

export default function CreatePasswordPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [email, setEmail] = useState("");

  // Get email from sessionStorage (set after OTP verification)
  useEffect(() => {
    const storedEmail = sessionStorage.getItem("registrationEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // No email in session, redirect to register
      navigate("/register");
    }
  }, [navigate]);

  function handlePassChange(e) {
    setFormData({
      ...formData,
      password: e.target.value,
    });
  }

  function handleConfirmPassChange(e) {
    setFormData({
      ...formData,
      confirmPassword: e.target.value,
    });
  }

  function validatePasswords() {
    if (formData.password !== formData.confirmPassword) {
      showAlert("error", "Passwords must match");
      return false;
    }

    if (formData.password.length < 8) {
      showAlert("error", "Passwords must be of at least 8 characters");
      return false;
    }

    if (/\s/.test(formData.password)) {
      showAlert("error", "Spaces not allowed in password");
      return false;
    }

    if (!/[A-Z]/.test(formData.password)) {
      showAlert("error", "Password must contain at least one uppercase letter");
      return false;
    }

    if (!/[a-z]/.test(formData.password)) {
      showAlert("error", "Password must contain at least one lowercase letter");
      return false;
    }

    if (!/[0-9]/.test(formData.password)) {
      showAlert("error", "Password must contain at least one number");
      return false;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      showAlert("error", "Password must contain at least one special character (!@#$%^&*(),.?\":{}|<>)");
      return false;
    }

    return true;
  }

  const [loading, setLoading] = useState(false);

  async function handleCreatePassClick(e) {
    e.preventDefault();

    if (!validatePasswords()) return;
    setLoading(true);

    try {
      await setPassword(email, formData.password);
      showAlert("success", "Password set successfully! Redirecting to login...");
      sessionStorage.removeItem("registrationEmail");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      const msg = err?.message || "Failed to set password";
      showAlert("error", msg);
      setLoading(false);
    }
  }

  // managing the popup
  const [alert, setAlert] = useState(null);

  function showAlert(type, msg) {
    setAlert({
      type,
      msg,
    });

    setTimeout(() => {
      setAlert(null);
    }, 3000);
  }

  const closeAlert = () => {
    setAlert(null);
  };

  return (
    <>
      <div className={styles.app}>
        <Header />
        
        {alert && (<Alert type={alert.type} msg={alert.msg} handleCloseClick={closeAlert}/>)}

        <div className={styles.bodyContainer}>
          <div className={styles.formParent}>
            <div className={styles.formContainer}>
              <h1 className={styles.title}>Create Password</h1>

              <label className={styles.description}>
                Become a member of the University's Tech Community
              </label>

              <form>
                <div className={styles.formFieldContainer}>
                  <div className={styles.inputGroup}>
                    <label>Create Password</label>
                    <div className={styles.passwordWrapper}>
                      <input
                        placeholder="****************"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handlePassChange}
                      ></input>
                      <button
                        type="button"
                        className={styles.togglePassword}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Confirm Password</label>
                    <div className={styles.passwordWrapper}>
                      <input
                        placeholder="****************"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleConfirmPassChange}
                      ></input>
                      <button
                        type="button"
                        className={styles.togglePassword}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>
                </div>

                <Button
                  variant="primaryBlack" 
                  status={formData.password && formData.confirmPassword ? "active" : "disabled"}
                  onClick={handleCreatePassClick}
                  >
                    Create Account
                </Button>

              </form>
            </div>
            <p className={styles.register}>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
          <div className={styles.graphicContainer}>
            <img src={passwordGraphic} className={styles.graphic} />
          </div>
        </div>

        <Footer className={styles.footer} />
      </div>
    </>
  );
}
