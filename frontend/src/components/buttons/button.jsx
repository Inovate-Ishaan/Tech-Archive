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
        className={`${styles.btn} ${className} ${styles[variant]} ${styles[status]}`}
        {...rest}
        disabled={status === "disabled" ? true : false}
      >
        {children}
      </button>
    </>
  );
}

export default Button;
