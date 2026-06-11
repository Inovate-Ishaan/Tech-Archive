import { useState } from "react";
import styles from "./passwordField.module.css";

export default function PasswordField({value, onChange}) {

const [showPass, setshowPass] = useState(false);

  return (
    <>
      <div className={styles.passwordContainer}>
        <input
          placeholder="****************"
          type={showPass ? "text" : "password"}
          value={value}
          onChange={onChange}
          className={styles.passwordInput}
        ></input>
        <span onClick={() => setshowPass(prev => !prev)} class="material-symbols-outlined">{showPass ? "visibility_off" : "visibility"}</span>
      </div>
    </>
  );
}
