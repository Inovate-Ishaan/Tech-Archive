import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import styles from "./authForm.module.css";
import Button from "../components/buttons/button";
import Alert from "../components/alertPopUP/alertPopUp";
import passwordGraphic from "../assets/graphics/enter_password.svg";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function CreatePasswordPage() {

  const [formData, setFormData] = useState({
    password : "",
    confirmPassword : "",
  });

  function handlePassChange(e) {
    setFormData({
      ...formData,
      password : e.target.value,
    })
  };

  function handleConfirmPassChange(e) {
    setFormData({
      ...formData,
      confirmPassword : e.target.value,
    })
  };

  function validatePasswords() {
    // length >= 8 and both passwords matching only for now, not checking the strength
    if (formData.password !== formData.confirmPassword) {
      //show error
      showAlert("error", "Passwords must match")
      return false;

    } 

    else if (formData.password.length < 8){
      //error
      showAlert("error","Passwords must be of atleast 8 characters")
      return false;
    }

    //tabs spaces and newlines
    else if (/\s/.test(formData.password)) {
      showAlert("error", "Spaces not allowed in password")
      return false;
    }

    return true;
  }

  function handleCreatePassClick(e) {
      e.preventDefault();

      //validatePasswords
      if (validatePasswords()) {
          //send data to backend
          showAlert("success", "Sending data to Backend")
        }
  };


  //managing the popup
  const [alert, setAlert] = useState(null);

  function showAlert(type, msg) {
      setAlert({
          type,
          msg,
      })

      setTimeout(() => {
        setAlert(null)
      }, 3000);
  };

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
                    <input
                      placeholder="****************"
                      type="password"
                      value={formData.password}
                      onChange={handlePassChange}
                    ></input>
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Confirm Password</label>
                    <input
                      placeholder="****************"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleConfirmPassChange}
                    ></input>
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
