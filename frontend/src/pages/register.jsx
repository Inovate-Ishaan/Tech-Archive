import { useState } from "react";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import styles from "./authForm.module.css";
import Button from "../components/buttons/button";
import signHereGraphic from "../assets/graphics/sign_here.svg";
import Alert from "../components/alertPopUP/alertPopUp";
import validator from "validator";
import BtnLoader from "../components/loaders/btnLoader";
import OTPModal from "../components/OTPfield/OTPModal";
import { register as apiRegister } from "../utils/api";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    department: "ECE",
    instituteID: "",
    email: "",
    username: "",
  });

  const { firstName, lastName, department, instituteID, email, username } = formData;
  const formNotEmpty =
    firstName.trim() && lastName.trim() && department.trim() && instituteID.trim() && email.trim() && username.trim();

  function validateInputs() {
    if ((firstName.trim().length < 3) || (lastName.trim().length < 3)) {
      showAlert("error", "Name too short!");
      return false;
    }

    if (!validator.isEmail(email)) {
      showAlert("error", "Invalid email!");
      return false;
    }

    if (!email.toLowerCase().endsWith("@iitbhilai.ac.in")) {
      showAlert("error", "Use your institute email (@iitbhilai.ac.in)");
      return false;
    }

    if (/\s/.test(instituteID)) {
      showAlert("error", "ID cannot have spaces");
      return false;
    }

    if (!username.trim()) {
      showAlert('error', 'Username is required');
      return false;
    }

    if (username.length < 3 || username.length > 30) {
      showAlert('error', 'Username must be 3-30 characters');
      return false;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      showAlert('error', 'Username can only contain letters, numbers, and underscores');
      return false;
    }

    return true;
  }

  const [alert, setAlert] = useState(null);
  function showAlert(type, msg) {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 3000);
  }
  const closeAlert = () => setAlert(null);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [verified, setVerified] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateInputs()) return;
    setLoading(true);
    try {
      const regData = await apiRegister({ email, username, instituteId: instituteID, firstName, lastName });
      if (regData?.data?.devCode) {
        console.log("[DEV] OTP code:", regData.data.devCode);
      }
      setShowOTP(true);
      setLoading(false);
    } catch (err) {
      const msg = err?.message || 'Registration failed';
      showAlert('error', msg);
      setLoading(false);
    }
  }

  function handleVerified() {
    sessionStorage.setItem("registrationEmail", email);
    setVerified(true);
    setTimeout(() => {
      navigate("/create-password");
    }, 1500);
  }

  return (
    <>
      <div className={styles.app}>
        <Header />

        {alert && <Alert type={alert.type} msg={alert.msg} handleCloseClick={closeAlert}/>}

        {showOTP && !verified && (
          <OTPModal
            email={email}
            onVerified={handleVerified}
          />
        )}

        {verified && (
          <div style={{ padding: "40px", textAlign: "center" }}>
            <h1>Account Verified!</h1>
            <p>Redirecting to login...</p>
          </div>
        )}

        {!showOTP && (
        <div className={styles.bodyContainer}>
          <div className={styles.formParent}>
            <div className={styles.formContainer}>
              <h1 className={styles.title}>Create Account</h1>

              <label className={styles.description}>
                Become a member of the University's Tech Community
              </label>

              <fieldset disabled={loading} className={loading ? "fieldsetDisabled" : ""}>
              <form>
                <div className={styles.formFieldContainer}>
                  <div className={styles.blockFormFields}>
                    <div className={styles.inputGroup}>
                      <label >First name</label>
                      <input
                        placeholder="firstname"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      ></input>
                    </div>

                    <div className={styles.inputGroup}>
                      <label >Last name</label>
                      <input
                        placeholder="lastname"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      ></input>
                    </div>

                    <div className={styles.inputGroup}>
                      <label >Department</label>
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      >
                        <option>ECE</option>
                        <option>CSE</option>
                        <option>EE</option>
                        <option>ME</option>
                        <option>MSME</option>
                        <option>DSAI</option>
                        <option>MT</option>
                      </select>
                    </div>

                    <div className={styles.inputGroup}>
                      <label>Institute ID</label>
                      <input
                        placeholder="B25EC049"
                        value={formData.instituteID}
                        onChange={(e) => setFormData({ ...formData, instituteID: e.target.value })}
                      ></input>
                    </div>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Username</label>
                    <input
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    ></input>
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Email address</label>
                    <input
                      placeholder="example@iitbhilai.ac.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    ></input>
                  </div>
                </div>
                <Button
                  variant="primaryBlack"
                  status={formNotEmpty && !loading ? "active" : "disabled"}
                  onClick={handleSubmit}
                >
                  {loading ? <BtnLoader /> : 'Create account'}
                </Button>
              </form>
              </fieldset>
            </div>
            <p className={styles.register}>
              Already have an account? <Link to="/login" className="link">Login</Link>
            </p>

          </div>
          <div className={styles.graphicContainer}>
            <img src={signHereGraphic} className={styles.graphic} />
          </div>
        </div>
        )}
      </div>
    </>
  );
}
