//Standard button
//avaiable variants - Primary Black (primaryBlack), Secondary Black (secondaryBalck), Secondary White (secondaryWhite)
import styles from "./Button.module.css";

function Button({variant="primaryBlack", children, ...rest}) {
    return(
        <button 
            className={`${styles.btn} ${styles[variant]}`}
            {...rest}>
            {children}
        </button>
    )
}

export default Button;