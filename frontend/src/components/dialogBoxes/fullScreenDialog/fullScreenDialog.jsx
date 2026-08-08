import styles from "./fullScreenDialog.module.css";
import { createPortal } from 'react-dom';

export default function FullScreenDialog({ closeBtnFunction, children }) {
    return(<>
    {createPortal(
            <div className={styles.container}>
                <div className={styles.dialogBox}>
                    <span className="material-symbols-outlined close icon" onClick={closeBtnFunction}>close</span>
                    {children}
                </div>
                </div>, document.body)}
    </>)
}