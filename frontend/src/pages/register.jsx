import { useState } from "react";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import styles from "./authForm.module.css";
import Button from "../components/buttons/button";
import signHereGraphic from "../assets/graphics/sign_here.svg";
import Alert from "../components/alertPopUP/alertPopUp";
import validator from "validator";

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
    firstName.trim() && lastName.trim() && department.trim() && instituteID.trim() && email.trim();

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

    //fields that cannot contain spaces (ID only for now)
    if (/\s/.test(instituteID)) {
      showAlert("error", "ID cannot have spaces");
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
      showAlert("success", "Show OTP popup")
    };
  }

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
                      <label>First name</label>
                      <input
                        placeholder="Pawan"
                        value={formData.firstName}
                        onChange={handleFirstNameChange}
                      ></input>
                    </div>

                    <div className={styles.inputGroup}>
                      <label>Last name</label>
                      <input
                        placeholder="Teja"
                        value={formData.lastName}
                        onChange={handleLastNameChange}
                      ></input>
                    </div>

                    <div className={styles.inputGroup}>
                      <label>Department</label>
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
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Email address</label>
                    <input
                      placeholder="pawanteja@email.com"
                      value={formData.email}
                      onChange={handleEmailChange}
                    ></input>
                  </div>
                </div>
                <Button
                  variant="primaryBlack"
                  status={formNotEmpty ? "active" : "disabled"}
                  onClick={handleSubmit}
                >
                  Verify email
                </Button>
              </form>
            </div>
            <p className={styles.register}>
              Already have an account? <a>Login</a>
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
