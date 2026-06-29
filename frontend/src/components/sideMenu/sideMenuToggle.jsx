//It is a child of navAndSearchBar

import styles from "./sideMenuToggle.module.css"

export default function SideMenuToggle({ className, selectedOption, closeBtnFunction }) {
    return(
        <>
        <div className={className}>
       
        <div className={styles.container}>

        <div className={styles.header}>
            <span className={`material-symbols-outlined icon ${styles.close}`} onClick={closeBtnFunction}>close</span>
            <h2 className="title">Tech Archive</h2>

        </div>
        
        <div className={styles.optionContainer}>
        <div className={styles.option}>
        <span className={`material-symbols-outlined icon ${selectedOption === "home" ? "filled" : ""}`}>home</span>
        <label className={styles.option_name}>Home</label>
        </div>

        <div className={styles.option}>
        <span className={`material-symbols-outlined icon ${selectedOption === "explore" ? "filled" : ""}`}>category</span>
        <label className={styles.option_name}>Explore</label>
        </div>

        <div className={styles.option}>
        <span className={`material-symbols-outlined icon ${selectedOption === "saved" ? "filled" : ""}`}>bookmarks</span>
        <label className={styles.option_name}>Saved</label>
        </div>

        <div className={styles.option}>
        <span className={`material-symbols-outlined icon ${selectedOption === "you" ? "filled" : ""}`}>account_circle</span>
        <label className={styles.option_name}>You</label>
        </div>

       </div>
       </div>
       </div>
        </>
    )
}