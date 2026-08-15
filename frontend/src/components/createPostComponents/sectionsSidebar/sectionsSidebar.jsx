//This one is collapseable, but uses the same CSS (why not)
import styles from "./sectionsSidebar.module.css";
import { Link } from "react-router-dom";

export default function SectionsSidebar({className, sections, selectedOption="Overview", changeSection, deleteSection, closeBtnFunction}) {
    return(
        <>
        <div className={className}>
       
        <div className={styles.container}>
        {/* Subsections */}
        <div className={styles.subsectionContainer}>
            <div className={`${styles.close}`} onClick={closeBtnFunction}>
            <span className="material-symbols-outlined">close</span>
            </div>
        <div className={styles.subsectionLabel}>
        <label>Sections</label>
       </div>

        {/* HR */}
        <div className={styles.hr}></div>

        <div className={styles.subsectionOptionContainer}>

        {sections.map((section, index) => (<div key={index} className={`${styles.option} ${selectedOption === section[0] ? styles.selected : ""}`}
        onClick={(e) => {e.stopPropagation(); changeSection(index + 1); console.log(index)}}>
        <label className={styles.option_name}>{section[0]}</label>
        {!(selectedOption === section[0]) && <span className="material-symbols-outlined smallIcon" onClick={(e) => {e.stopPropagation(); deleteSection(index + 1)}}>delete</span>}
        </div>))}
        
       </div>
       </div>

        {/* HR */}
        <div className={styles.hr}></div>


       </div>
       </div>
        </>
    )
}