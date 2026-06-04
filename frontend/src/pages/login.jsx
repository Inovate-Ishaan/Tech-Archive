import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import styles from "./login.module.css";
import Button from "../components/buttons/button";
import welcomeGraphic from "../assets/graphics/welcome_aboard.svg";

export default function LoginPage() {
  return (
    <>
      <Header />

      <div className={styles.bodyContainer}>
        <div className={styles.formParent}>
          <div className={styles.formContainer}>
            <h1 className={styles.title}>Welcome Back</h1>
            <label className={styles.description}>
              Good to see you again...
            </label>
            <form>
              <div className={styles.inputGroup}>
                <label>Email address</label>
                <input></input>
              </div>
              <div className={styles.inputGroup}>
                <label>Password</label>
                <input></input>
              </div>

              <Button variant="primaryBlack">Login</Button>
            </form>
          </div>
          <p className={styles.register}>
            Don't have an account? <a>Register</a>
          </p>
        </div>
        <div className={styles.graphicContainer}>
          <img src={welcomeGraphic} className={styles.graphic} />
        </div>
      </div>

      <Footer />
    </>
  );
}
