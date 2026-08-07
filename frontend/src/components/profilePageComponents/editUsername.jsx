import { useState } from "react";
import styles from "./editUsername.module.css";
import Button from "../buttons/button";
import graphic from "../../assets/graphics/changeUsername.svg";

export default function EditUsername({ closeBtnFunction }){
    const [newUsername, setNewUsername] = useState("");
    return(
        <>
        <div className={styles.container}>
            <div className={styles.dialogBox}>
                <span className="material-symbols-outlined close icon" onClick={closeBtnFunction}>close</span>

                <div className={styles.title}>Change Username</div>
            <div className={styles.itemsContainer}>
            <div className={styles.items}>
            
            <input value={newUsername} type="text" placeholder="New Username" onChange={(e) => setNewUsername(e.target.value)}></input>
           <Button variant="secondaryBlack">
            Save
           </Button>
           </div>
           </div>
           <img src={graphic} className={styles.graphic}></img>
           </div>
        </div>
        </>
    );
}