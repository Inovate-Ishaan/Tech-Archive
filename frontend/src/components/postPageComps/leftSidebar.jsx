import styles from "./leftSidebar.module.css";
import { Link } from "react-router-dom";
import githubLogo from "../../assets/graphics/github.svg";

export default function LeftSidebar({className, selectedOption="overview"}) {
    return(
        <>
        <div className={className}>
       
        <div className={styles.container}>
        
        {/* Subsections */}
        <div className={styles.subsectionContainer}>
        <div className={styles.subsectionLabel}>
        <label>Subsections</label>
       </div>

        <div className={styles.subsectionOptionContainer}>

        <div className={`${styles.option} ${selectedOption === "overview" ? styles.selected : ""}`}>
        <label className={styles.option_name}>Overview</label>
        </div>
    

        <div className={`${styles.option} ${selectedOption === "explore" ? "selected" : ""}`}>
        <label className={styles.option_name}>Tech Stack</label>
        </div>

        <div className={`${styles.option} ${selectedOption === "explore" ? "selected" : ""}`}>
        <label className={styles.option_name}>The motivation</label>
        </div>

        <div className={`${styles.option} ${selectedOption === "explore" ? "selected" : ""}`}>
        <label className={styles.option_name}>Project requirements</label>
        </div>

        <div className={`${styles.option} ${selectedOption === "explore" ? "selected" : ""}`}>
        <label className={styles.option_name}>Procedure</label>
        </div>

        <div className={`${styles.option} ${selectedOption === "explore" ? "selected" : ""}`}>
        <label className={styles.option_name}>Future Extension</label>
        </div>
       </div>
       </div>

        {/* HR */}
        <div className={styles.hr}></div>

       {/* Github */}
        <div className={styles.github}>
            <img src={githubLogo} className={styles.githubLogo}/>
            <p>Project Repository</p>
        </div>

        {/* HR */}
        <div className={styles.hr}></div>

        {/* Collaborations */}
        <div className={styles.collaborations}>
            <p className={styles.desc}>This project is a collaboration</p>
            <p className={styles.collabTitle}>Collaborators</p>

            <div className={styles.author}>
                <img className={styles.profilePic} src="https://miro.medium.com/v2/resize:fit:1024/format:webp/1*exDGqMaZUl3giVsakNotWg.jpeg" />
                <label className={styles.authorName}>Ishaan Shukla</label>
            </div>

            <div className={styles.author}>
                <img className={styles.profilePic} src="https://miro.medium.com/v2/resize:fit:1024/format:webp/1*exDGqMaZUl3giVsakNotWg.jpeg" />
                <label className={styles.authorName}>Pawan Teja</label>
            </div>

            <div className={styles.author}>
                <img className={styles.profilePic} src="https://miro.medium.com/v2/resize:fit:1024/format:webp/1*exDGqMaZUl3giVsakNotWg.jpeg" />
                <label className={styles.authorName}>Bavirisetti Jayavardhan</label>
            </div>
        </div>

       </div>
       </div>
        </>
    )
}