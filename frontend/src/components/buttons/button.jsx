//Standard button
//avaiable variants - Primary Black (primaryBlack), Secondary Black (secondaryBalck), Secondary White (secondaryWhite)
import styles from "./Button.module.css";

function Button({variant="primaryBlack", status="active", children, ...rest}) {
    return(
        <>
        <button 
            className={`${styles.btn} ${styles[variant]} ${styles[status]}`}
            {...rest}
            disabled={status === "disabled"? true : false}>
            {children}
        </button>
        </>
    )
}

export default Button;