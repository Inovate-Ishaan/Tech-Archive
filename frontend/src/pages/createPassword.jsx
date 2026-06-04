import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import styles from "./authForm.module.css";
import Button from "../components/buttons/button";
import passwordGraphic from "../assets/graphics/enter_password.svg";

export default function CreatePasswordPage() {
  return (
    <>
      <div className={styles.app}>
        <Header />

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
                    ></input>
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Confirm Password</label>
                    <input
                      placeholder="****************"
                      type="password"
                    ></input>
                  </div>
                </div>

                <Button variant="primaryBlack">Create Account</Button>
              </form>
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
