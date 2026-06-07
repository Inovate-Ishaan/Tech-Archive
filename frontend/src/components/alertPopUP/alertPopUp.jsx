import styles from "./alertPopUp.module.css"
import closeIcon from "../../assets/ui_symbols/close.svg"
import { useState } from "react"

//type takes values "success" or "error"
export default function Alert({type="success", msg, handleCloseClick , ...rest}) {
    return(
        <>
        
        <div className={`${styles.alert} ${styles[type]}`}>
            <div className={styles.msg}>
                {msg}
            </div>
            <div className={styles.closeIcon}>
                <button onClick={handleCloseClick}><img src={closeIcon}/></button>
            </div>
        </div>
        
        </>
    )
}