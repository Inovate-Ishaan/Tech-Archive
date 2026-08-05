//It is a child of navAndSearchBar

import { Link } from "react-router-dom"
import styles from "./sideMenuToggle.module.css"

export default function SideMenuToggle({ className, selectedOption, closeBtnFunction }) {
    return(
        <>
        <div className={className}>
       
        <div className={styles.container}>

        <div className={styles.header}>
            <span className={`material-symbols-outlined icon ${styles.close}`} onClick={closeBtnFunction}>close</span>
            <h2 className={styles.title}>Tech Archive</h2>

        </div>
        
        <div className={styles.optionContainer}>
            <Link to={"/feed"}>
        <div className={`${styles.option} ${selectedOption === "home" ? "selected" : ""}`}>
        <span className={`material-symbols-outlined icon ${selectedOption === "home" ? "filled" : ""}`}>home</span>
        <label className={styles.option_name}>Home</label>
        </div>
        </Link>

        <div className={`${styles.option} ${selectedOption === "explore" ? "selected" : ""}`}>
        <span className={`material-symbols-outlined icon ${selectedOption === "explore" ? "filled" : ""}`}>category</span>
        <label className={styles.option_name}>Explore</label>
        </div>

        <Link to={"/saved"}>
        <div className={`${styles.option} ${selectedOption === "saved" ? "selected" : ""}`}>
        <span className={`material-symbols-outlined icon ${selectedOption === "saved" ? "filled" : ""}`}>bookmarks</span>
        <label className={styles.option_name}>Saved</label>
        </div>
        </Link>

        <Link to={"/create-post"}>
        <div className={`${styles.option} ${selectedOption === "post" ? "selected" : ""}`}>
        <span className={`material-symbols-outlined icon ${selectedOption === "post" ? "filled" : ""}`}>add_2</span>
        <label className={styles.option_name}>Post Project</label>
        </div>
        </Link>

        <div className={`${styles.option} ${selectedOption === "you" ? "selected" : ""}`}>
        <span className={`material-symbols-outlined icon ${selectedOption === "you" ? "filled" : ""}`}>account_circle</span>
        <label className={styles.option_name}>You</label>
        </div>

       </div>
       </div>
       </div>
        </>
    )
}