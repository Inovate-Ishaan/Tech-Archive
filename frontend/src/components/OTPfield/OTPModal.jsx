import styles from "./OTPModal.module.css";
import Button from "../buttons/button";
import BtnLoader from "../loaders/btnLoader";
import { useState, useRef } from "react";
import Alert from "../alertPopUP/alertPopUp";
import { verifyOtp } from "../../utils/api";

export default function OTPModal({ email, onVerified }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  function handleChange(index, e) {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === "Enter" && otp[index] && index === 5) {
      handleSubmit();
    }
  }

  const OTPentered = otp.every(Boolean);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

  function showAlert(type, msg) {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 3000);
  }

  const closeAlert = () => setAlert(null);

  async function handleSubmit() {
    if (!OTPentered) return;
    setIsSubmitting(true);
    try {
      const otpString = otp.join("");
      const data = await verifyOtp(email, otpString);
      if (data.data?.token) {
        localStorage.setItem("auth_token", data.data.token);
        setTimeout(() => {
          if (onVerified) onVerified(data.data.token);
        }, 500);
      } else if (data.data?.verified) {
        if (onVerified) onVerified();
      } else {
        showAlert("error", "Verification failed");
      }
    } catch (err) {
      const msg = err?.message || "Invalid or expired code";
      showAlert("error", msg);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className={styles.parentContainer}>
        <div className={styles.body}>

          {alert && <Alert type={alert.type} msg={alert.msg} handleCloseClick={closeAlert} />}

          <h1>OTP Verification</h1>
          <p className={styles.description}>
            Enter the 6-digit OTP sent to your email address
          </p>

          <div className={styles.inputContainer}>
            {Array.from({ length: 6 }, (_, i) => (
              <input
                type="text"
                maxLength={1}
                className={styles.OTPinput}
                key={i}
                value={otp[i]}
                onChange={(e) => handleChange(i, e)}
                ref={(el) => (inputRefs.current[i] = el)}
                onKeyDown={(e) => handleKeyDown(i, e)}
              ></input>
            ))}
          </div>

          <Button variant="primaryBlack" status={OTPentered && !isSubmitting ? "active" : "disabled"} id={styles.submitBtn} onClick={handleSubmit}>
            {isSubmitting ? <BtnLoader /> : "Continue"}
          </Button>
        </div>
      </div>
    </>
  );
}
