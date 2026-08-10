import { Link } from "react-router-dom"
import styles from "./sideMenuFixed.module.css"

export default function SideMenuFixed({ className, selectedOption }) {
    return(
        <>
        <div className={className}>
       <div className={styles.container}>
        <Link to={"/feed"}>
        <div className={styles.option}>
        <span className={`material-symbols-outlined icon ${selectedOption === "home" ? "filled" : ""}`}>home</span>
        <label className={styles.option_name}>Home</label>
        </div>
        </Link>

        {/* <div className={styles.option}>
        <span className={`material-symbols-outlined icon ${selectedOption === "explore" ? "filled" : ""}`}>category</span>
        <label className={styles.option_name}>Explore</label>
        </div> */}

        <Link to={"/saved"}>
        <div className={styles.option}>
        <span className={`material-symbols-outlined icon ${selectedOption === "saved" ? "filled" : ""}`}>bookmarks</span>
        <label className={styles.option_name}>Saved</label>
        </div>
        </Link>

        <Link to={"/create-post"}>
        <div className={styles.option}>
        <span className={`material-symbols-outlined icon ${selectedOption === "you" ? "filled" : ""}`}>add_2</span>
        <label className={styles.option_name}>Post Project</label>
        </div>
        </Link>

        <Link to={"/profile/me"}>
        <div className={styles.option}>
        <span className={`material-symbols-outlined icon ${selectedOption === "you" ? "filled" : ""}`}>account_circle</span>
        <label className={styles.option_name}>You</label>
        </div>
        </Link>

       </div>
       </div>
        </>
    )
}