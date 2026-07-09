import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import styles from "./authForm.module.css";
import Button from "../components/buttons/button";
import Alert from "../components/alertPopUP/alertPopUp";
import forgotPasswordGraphic from "../assets/graphics/forgot_password.svg";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { setPassword } from "../utils/api";
import BtnLoader from "../components/loaders/btnLoader";
import PasswordField from "../components/passwordField/passwordField";
import validator from "validator";
import { requestOtp } from "../utils/api";

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [emailSectionVisible, setEmailSectionVisible] = useState(true);
  const [passwordSectionVisible, setPasswordSectionVisible] = useState(false);

  function handleEmailChange(e) {
    setFormData({ ...formData, email: e.target.value });
  }

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

  function validateEmail() {
    if (!validator.isEmail(formData.email)) {
      showAlert("error", "Invalid email!");
      return false;
    }

    if (!formData.email.toLowerCase().endsWith("@iitbhilai.ac.in")) {
      showAlert("error", "Use your institute email (@iitbhilai.ac.in)");
      return false;
    }
    return true;
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
      showAlert(
        "error",
        'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)',
      );
      return false;
    }

    return true;
  }

  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [verified, setVerified] = useState(false);

  async function handleVerifyEmailClick(e) {
    e.preventDefault();
    if (!validateEmail()) return;
    setLoading(true);
    try {
      const otpData = await requestOtp(formData.email);
      if (otpData.devCode) {
        console.log("[DEV] OTP code:", otpData.devCode);
      }
      setShowOTP(true);
    } catch (err) {
      showAlert("error", "Failed to send OTP. Try again.");
      setLoading(false);
    }
  }

  function handleVerified() {
    setVerified(true);
    showOTP(false);
    setEmailSectionVisible(false);
    setPasswordSectionVisible(true);
  }

  async function handleResetPassClick(e) {
    e.preventDefault();

    if (!validatePasswords()) return;
    setLoading(true);

    try {
      await setPassword(formData.email, formData.password);
      showAlert("success", "Password changed. Login again...");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      const msg = err && err.error ? err.error : "Failed to set password";
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

        {alert && (
          <Alert
            type={alert.type}
            msg={alert.msg}
            handleCloseClick={closeAlert}
          />
        )}

        {showOTP && !verified && (
          <OTPModal email={formData.email} onVerified={handleVerified} />
        )}

        <div className={styles.bodyContainer}>
          <div className={styles.formParent}>
            <div className={styles.formContainer}>
              <h1 className={styles.title}>Reset Password</h1>

              {/* Enter Email Section */}
              {emailSectionVisible && (
                <>
                  <label className={"description"}>
                    Haha! Looks like you're bad at remembering...
                  </label>

                  <form>
                    <div className={styles.formFieldContainer}>
                      <div className={styles.inputGroup}>
                        <label>Email</label>
                        <input
                          type="email"
                          placeholder="pawanteja@email.com"
                          value={formData.email}
                          onChange={handleEmailChange}
                        />
                      </div>
                    </div>

                    <Button
                      variant="primaryBlackLessPadding"
                      status={formData.email ? "active" : "disabled"}
                      onClick={handleVerifyEmailClick}
                    >
                      {loading ? <BtnLoader /> : "Verify Email"}
                    </Button>
                  </form>
                </>
              )}

              {/* New Password Section */}
              {passwordSectionVisible && (
                <>
                  <label className={"description"}>
                    Don't forget this though...
                  </label>

                  <form>
                    <div className={styles.formFieldContainer}>
                      <div className={styles.inputGroup}>
                        <label>New Password</label>
                        <PasswordField
                          value={formData.password}
                          onChange={handlePassChange}
                        />
                      </div>

                      <div className={styles.inputGroup}>
                        <label>Confirm Password</label>
                        <PasswordField
                          value={formData.confirmPassword}
                          onChange={handleConfirmPassChange}
                        />
                      </div>
                    </div>

                    <Button
                      variant="primaryBlackLessPadding"
                      status={
                        formData.password && formData.confirmPassword
                          ? "active"
                          : "disabled"
                      }
                      onClick={handleResetPassClick}
                    >
                      {loading ? <BtnLoader /> : "Reset Password"}
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
          <div className={styles.graphicContainer}>
            <img src={forgotPasswordGraphic} className={styles.graphic} />
          </div>
        </div>

        <Footer className={styles.footer} />
      </div>
    </>
  );
}
