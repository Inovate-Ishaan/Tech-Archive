//Standard button
//avaiable variants - Primary Black (primaryBlack), Primary White (primaryWhite), Primary Black (primaryBlackLessPadding), Primary White (primaryWhiteLessPadding), Secondary Black (secondaryBalck), Secondary White (secondaryWhite)
import styles from "./Button.module.css";

function Button({
  variant = "primaryBlack",
  status = "active",
  className = "",
  children,
  ...rest
}) {
  return (
    <>
      <button
        className={`${styles.btn} ${styles[variant]} ${styles[status]} ${className} ${status === "active" ? "hvr-underline-from-center" : ""}`}
        {...rest}
        disabled={status === "disabled" ? true : false}
      >
        {children}
      </button>
    </>
  );
}

export default Button;
