import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import styles from "./authForm.module.css";
import Button from "../components/buttons/button";
import welcomeGraphic from "../assets/graphics/welcome_aboard.svg";
import Alert from "../components/alertPopUP/alertPopUp";
import PasswordField from "../components/passwordField/passwordField";
import { useState } from "react";
import validator from "validator";
import BtnLoader from "../components/loaders/btnLoader";
import OTPModal from "../components/OTPfield/OTPModal";
import { signin, requestOtp } from "../utils/api";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;
  const formNotEmpty = email.trim() && password.trim();
  const navigate = useNavigate();

  const [alert, setAlert] = useState(null);
  function showAlert(type, msg) {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 3000);
  }
  const closeAlert = () => setAlert(null);

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

  const [submitting, setSubmitting] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [verified, setVerified] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      await signin(email, password);
    } catch (err) {
      console.error('[Signin]', err);
      const msg = err && err.error ? err.error : (err?.message || 'Signin failed');
      showAlert('error', msg);
      setSubmitting(false);
      return;
    }
    try {
      const otpData = await requestOtp(email);
      if (otpData.devCode) {
        console.log("[DEV] OTP code:", otpData.devCode);
      }
      setShowOTP(true);
    } catch (err) {
      console.error('[OTP send]', err);
      showAlert('error', 'Password correct but failed to send OTP. Try again.');
      setSubmitting(false);
    }
  }

  function handleVerified() {
    setVerified(true);
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  }

  return (
    <>
      <div className={styles.app}>
        <Header />

        {alert && (
          <Alert type={alert.type} msg={alert.msg} handleCloseClick={closeAlert} />
        )}

        {showOTP && !verified && (
          <OTPModal
            email={email}
            onVerified={handleVerified}
          />
        )}

        {verified && (
          <div style={{ padding: "40px", textAlign: "center" }}>
            <h1>Logged In!</h1>
            <p>Redirecting...</p>
          </div>
        )}

        {!showOTP && (
        <div className={styles.bodyContainer}>
          <div className={styles.formParent}>
            <div className={styles.formContainer}>
              <h1 className={styles.title}>Welcome Back</h1>
              <label className={styles.description}>
                Good to see you again...
              </label>
              <fieldset disabled={submitting} className={submitting ? "fieldsetDisabled" : ""}>
              <form>
                <div className={styles.inputGroup}>
                  <label>Email address</label>
                  <input
                    placeholder="pawanteja@email.com"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  ></input>
                </div>

                <div className={styles.inputGroup}>
                  <PasswordField
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>

                <Button
                  variant="primaryBlack"
                  status={formNotEmpty && !submitting ? "active" : "disabled"}
                  onClick={handleSubmit}
                >
                  {submitting ? <BtnLoader /> : "Login"}
                </Button>
              </form>
              </fieldset>
            </div>
            <p className={styles.register}>
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </div>
          <div className={styles.graphicContainer}>
            <img src={welcomeGraphic} className={styles.graphic} />
          </div>
        </div>
        )}

        <Footer className={styles.footer} />
      </div>
    </>
  );
}
