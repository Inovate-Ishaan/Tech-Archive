import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import styles from "./authForm.module.css";
import Button from "../components/buttons/button";
import Alert from "../components/alertPopUP/alertPopUp";
import PasswordField from "../components/passwordField/passwordField";
import passwordGraphic from "../assets/graphics/enter_password.svg";
import { useState } from "react";
import BtnLoader from "../components/loaders/btnLoader";

export default function CreatePasswordPage() {

  const [formData, setFormData] = useState({
    password : null,
    confirmPassword : null,
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
    if (formData.password != formData.confirmPassword) {
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
        //display the loader
          setSubmitted(true);
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

  //btn loader
  const[submitted, setSubmitted] = useState(false);

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

              <fieldset disabled={submitted} className={submitted ? "fieldsetDisabled" : ""}>
              <form>
                <div className={styles.formFieldContainer}>
                  <div className={styles.inputGroup}>
                    <label>Create Password</label>
                    <PasswordField value={formData.password} onChange={handlePassChange}/>
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Confirm Password</label>
                    <PasswordField value={formData.confirmPassword} onChange={handleConfirmPassChange}/>
                  </div>
                </div>

                <Button
                  variant="primaryBlack" 
                  status={formData.password && formData.confirmPassword ? "active" : "disabled"}
                  onClick={handleCreatePassClick}
                  >
                    {submitted ? <BtnLoader /> : "Create Account"}
                </Button>

              </form>
              </fieldset>
            </div>
            <p className={styles.register}>
              Already have an account? <a>Login</a>
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
