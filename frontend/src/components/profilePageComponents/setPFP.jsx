import { useState } from "react";
import styles from "./setPFP.module.css";
import Button from "../buttons/button";
import avatar from "../../assets/avatars/avataaars(14).svg";
import FullScreenDialog from "../dialogBoxes/fullScreenDialog/fullScreenDialog";

export default function EditPFP({ closeBtnFunction }){
    const [newUsername, setNewUsername] = useState("");
    return(
        <>
        <FullScreenDialog closeBtnFunction={closeBtnFunction} >
            
            
            <div className={styles.pfpGallary}>
                <div className={styles.pfpCard}><img src={avatar} className={styles.avatar}></img></div>
                <div className={styles.pfpCard}><img src={avatar} className={styles.avatar}></img></div>
                <div className={styles.pfpCard}><img src={avatar} className={styles.avatar}></img></div>
                <div className={`${styles.pfpCard} ${styles.selected}`}><img src={avatar} className={styles.avatar}></img></div>
                <div className={styles.pfpCard}><img src={avatar} className={styles.avatar}></img></div>
                <div className={styles.pfpCard}><img src={avatar} className={styles.avatar}></img></div>
                <div className={styles.pfpCard}><img src={avatar} className={styles.avatar}></img></div>
                <div className={styles.pfpCard}><img src={avatar} className={styles.avatar}></img></div>
                <div className={styles.pfpCard}><img src={avatar} className={styles.avatar}></img></div>
                <div className={styles.pfpCard}><img src={avatar} className={styles.avatar}></img></div>
            </div>
            
           <Button variant="secondaryBlack">
            Save
           </Button>
           

           </FullScreenDialog>
        </>
    );
}