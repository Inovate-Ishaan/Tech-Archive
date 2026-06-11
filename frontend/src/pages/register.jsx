import { useState } from "react";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import styles from "./authForm.module.css";
import Button from "../components/buttons/button";
import signHereGraphic from "../assets/graphics/sign_here.svg";
import Alert from "../components/alertPopUP/alertPopUp";
import validator from "validator";
import { useNavigate } from "react-router-dom";
import { register as apiRegister, signin } from "../utils/api";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    department: "ECE",
    instituteID: "",
    email: "",
  });

  const { firstName, lastName, department, instituteID, email } = formData;
  //ensures form is not submitted empty
  const formNotEmpty =
    firstName.trim() && lastName.trim() && department.trim() && instituteID.trim() && email.trim() && formData.password && formData.password.trim();

  //validation library ==> validator.js
  function validateInputs() {
    //validate length of firstname and lastname
    if ((firstName.trim().length < 3) || (lastName.trim().length < 3)) {
      showAlert("error", "Name too short!");
      return false;
    }

    //validate email format
    if (!validator.isEmail(email)) {
      showAlert("error", "Invalid email!");
      return false;
    }

    if (!email.toLowerCase().endsWith("@iitbhilai.ac.in")) {
      showAlert("error", "Use your institute email (@iitbhilai.ac.in)");
      return false;
    }

    //fields that cannot contain spaces (ID only for now)
    if (/\s/.test(instituteID)) {
      showAlert("error", "ID cannot have spaces");
      return false;
    }

    if (typeof formData.password !== 'string' || formData.password.length < 6) {
      showAlert('error', 'Password must be at least 6 characters');
      return false;
    }

    return true;
  }
  ///////////////////////////////////////////////////

  //onChange function definitions for each field

  function handleFirstNameChange(e) {
    setFormData({
      ...formData,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setFormData({
      ...formData,
      lastName: e.target.value,
    });
  }

  function handleDeptChange(e) {
    setFormData({
      ...formData,
      department: e.target.value,
    });
  }

  function handleIDChange(e) {
    setFormData({
      ...formData,
      instituteID: e.target.value,
    });
  }

  function handleEmailChange(e) {
    setFormData({
      ...formData,
      email: e.target.value,
    });
  }

  ///////////////////////////////////////////

  //Alert
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
  //////////////////////////////////////////


  function handleSubmit(e) {
    e.preventDefault();
    const proceed = validateInputs();
    if (proceed) {
      // call register API
      setLoading(true);
      const username = `${firstName} ${lastName}`;
      apiRegister({ email, password: formData.password, username, instituteId: instituteID })
        .then(() => signin(email, formData.password))
        .then((data) => {
          if (data.token) {
            localStorage.setItem('auth_token', data.token);
            showAlert('success', 'Account created and signed in');
            navigate('/');
          }
        })
        .catch((err) => {
          const msg = err && err.error ? err.error : 'Registration failed';
          showAlert('error', msg);
        })
        .finally(() => setLoading(false));
    };
  }

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  return (
    <>
      <div className={styles.app}>
        <Header />

        {alert && <Alert type={alert.type} msg={alert.msg} handleCloseClick={closeAlert}/>}

        <div className={styles.bodyContainer}>
          <div className={styles.formParent}>
            <div className={styles.formContainer}>
              <h1 className={styles.title}>Create Account</h1>

              <label className={styles.description}>
                Become a member of the University's Tech Community
              </label>

              <form>
                <div className={styles.formFieldContainer}>
                  <div className={styles.blockFormFields}>
                    <div className={styles.inputGroup}>
                      <label >First name</label>
                      <input
                        placeholder="firstname"
                        value={formData.firstName}
                        onChange={handleFirstNameChange}
                      ></input>
                    </div>

                    <div className={styles.inputGroup}>
                      <label >Last name</label>
                      <input
                        placeholder="lastname"
                        value={formData.lastName}
                        onChange={handleLastNameChange}
                      ></input>
                    </div>

                    <div className={styles.inputGroup}>
                      <label >Department</label>
                      <select
                        value={formData.department}
                        onChange={handleDeptChange}
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
                        onChange={handleIDChange}
                      ></input>
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Password</label>
                      <input
                        placeholder="Choose a password"
                        type="password"
                        value={formData.password || ''}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      ></input>
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Email address</label>
                    <input
                      placeholder="example@iitbhilai.ac.in"
                      value={formData.email}
                      onChange={handleEmailChange}
                    ></input>
                  </div>
                </div>
                <Button
                  variant="primaryBlack"
                  status={formNotEmpty && !loading ? "active" : "disabled"}
                  onClick={handleSubmit}
                >
                  {loading ? 'Creating...' : 'Create account'}
                </Button>
              </form>
            </div>
            <p className={styles.register}>
              Already have an account? <a href="/login">Login</a>
            </p>

          </div>
          <div className={styles.graphicContainer}>
            <img src={signHereGraphic} className={styles.graphic} />
          </div>
        </div>

        <Footer className={styles.footer} />
      </div>
    </>
  );
}
