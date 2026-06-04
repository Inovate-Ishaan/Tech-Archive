import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import styles from "./authForm.module.css";
import Button from "../components/buttons/button";
import signHereGraphic from "../assets/graphics/sign_here.svg";

export default function RegisterPage() {
  return (
    <>
      <div className={styles.app}>
        <Header />

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
                      <input placeholder="Pawan"></input>
                    </div>

                    <div className={styles.inputGroup}>
                      <label>Last name</label>
                      <input placeholder="Teja"></input>
                    </div>

                    <div className={styles.inputGroup}>
                      <label>Department</label>
                      <select>
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
                      <input placeholder="B25EC049"></input>
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Email address</label>
                    <input placeholder="pawanteja@email.com"></input>
                  </div>
                </div>
                <Button variant="primaryBlack">Verify email</Button>
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
