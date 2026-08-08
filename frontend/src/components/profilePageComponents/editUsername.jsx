import { useState } from "react";
import styles from "./editUsername.module.css";
import Button from "../buttons/button";
import graphic from "../../assets/graphics/changeUsername.svg";
import FullScreenDialog from "../dialogBoxes/fullScreenDialog/fullScreenDialog";

export default function EditUsername({ closeBtnFunction }){
    const [newUsername, setNewUsername] = useState("");
    return(
        <>
        <FullScreenDialog closeBtnFunction={closeBtnFunction} >
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
           
           </FullScreenDialog>
        </>
    );
}