import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import styles from "./authForm.module.css";
import Button from "../components/buttons/button";
import Alert from "../components/alertPopUP/alertPopUp";
import forgotPasswordGraphic from "../assets/graphics/forgot_password.svg";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../utils/api";
import BtnLoader from "../components/loaders/btnLoader";
import PasswordField from "../components/passwordField/passwordField";
import validator from "validator";
import { requestOtp } from "../utils/api";
import OTPModal from "../components/OTPfield/OTPModal";

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

    if (!/[!@#$%^&*(),.?":{}|<>_]/.test(formData.password)) {
      showAlert(
        "error",
        'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>_)',
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
    if (verified) {
      setEmailSectionVisible(false);
      setPasswordSectionVisible(true);
      setLoading(false);
    } else {
      try {
        const otpData = await requestOtp(formData.email);
        if (otpData.data?.devCode) {
          console.log("[DEV] OTP code:", otpData.data.devCode);
        }
        setShowOTP(true);
        setLoading(false);
      } catch {
        showAlert("error", "Failed to send OTP. Try again.");
        setLoading(false);
      }
    }
  }

  function handleVerified() {
    setVerified(true);
    setShowOTP(false);
    setEmailSectionVisible(false);
    setPasswordSectionVisible(true);
  }

  async function handleResetPassClick(e) {
    e.preventDefault();

    if (!validatePasswords()) return;
    setLoading(true);

    try {
      await resetPassword(formData.email, formData.password);
      localStorage.removeItem("auth_token");
      showAlert("success", "Password reset. Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      const msg = err?.message || "Failed to reset password";
      showAlert("error", msg);
      setLoading(false);
      setPasswordSectionVisible(false);
      setEmailSectionVisible(true);
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
            {/* Enter Email Section */}
            {emailSectionVisible && (
              <>
                <div className={styles.formContainer}>
                  <div className={styles.formTitleDescription}>
                    <h1 className={styles.title}>Reset Password</h1>
                    <label className={"description"}>
                      Haha! Looks like you're bad at remembering...
                    </label>
                  </div>
                  <fieldset
                    disabled={loading}
                    className={loading ? "fieldsetDisabled" : ""}
                  >
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
                        status={
                          formData.email && !loading ? "active" : "disabled"
                        }
                        onClick={handleVerifyEmailClick}
                      >
                        {loading ? <BtnLoader /> : "Verify Email"}
                      </Button>
                    </form>
                  </fieldset>
                </div>

                <div className={styles.otherLinks}>
                  <p>
                    Back to{" "}
                    <Link to="/login" className="link">
                      Login
                    </Link>
                  </p>
                </div>
              </>
            )}

            {/* New Password Section */}
            {passwordSectionVisible && (
              <>
                <div className={styles.formContainer}>
                  <div className={styles.formTitleDescription}>
                    <h1 className={styles.title}>Reset Password</h1>
                    <label className={"description"}>
                      Don't forget this though...
                    </label>
                  </div>
                  <fieldset
                    disabled={loading}
                    className={loading ? "fieldsetDisabled" : ""}
                  >
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
                          formData.password &&
                          formData.confirmPassword &&
                          !loading
                            ? "active"
                            : "disabled"
                        }
                        onClick={handleResetPassClick}
                      >
                        {loading ? <BtnLoader /> : "Reset Password"}
                      </Button>
                    </form>
                  </fieldset>
                </div>
              </>
            )}
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
