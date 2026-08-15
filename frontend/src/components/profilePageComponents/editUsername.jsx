import { useEffect, useState, useRef } from "react";
import styles from "./editUsername.module.css";
import Button from "../buttons/button";
import graphic from "../../assets/graphics/changeUsername.svg";
import FullScreenDialog from "../dialogBoxes/fullScreenDialog/fullScreenDialog";
import { updateUsername } from "../../utils/api";
import BtnLoader from "../loaders/btnLoader";
import Alert from "../alertPopUP/alertPopUp";
import { useNavigate } from "react-router-dom";

export default function EditUsername({ closeBtnFunction, username, dialogStateFunc }){

    const navigate = useNavigate();

    const [newUsername, setNewUsername] = useState("");
    
    async function handleSubmit() {

        setSubmitting(true);

        try{
        const response = await updateUsername(username, newUsername);
        showAlert("success", "Update successful");
        setTimeout(() => dialogStateFunc(false), 3000); //hide the  edit username dialog box)
        navigate(`/profile/${newUsername}`);

    } catch(err){
        const msg = err?.message || "Update failed";
        showAlert("error", msg);
    } finally{
        setSubmitting(false);
    }
};


    const [submitting, setSubmitting] = useState(false);
    const [empty, setEmpty] = useState(true);

    useEffect(() => {
        if (newUsername){
            setEmpty(false);
        }
    }, [newUsername]);

    //alert

 const alertRef = useRef(null);
  const [alert, setAlert] = useState(null);

  function showAlert(type, msg) {
    setAlert({ type, msg });
    clearTimeout(alertRef.current);
    alertRef.current = setTimeout(() => setAlert(null), 3000);
  }
  const closeAlert = () => setAlert(null);

    return(
        <>
        {alert && (<Alert type={alert.type} msg={alert.msg} handleCloseClick={closeAlert}/>)}
        <FullScreenDialog closeBtnFunction={closeBtnFunction} >
                <div className={styles.title}>Change Username</div>
            <div className={styles.itemsContainer}>
            <div className={styles.items}>
            
            <input value={newUsername} type="text" placeholder="New Username" onChange={(e) => setNewUsername(e.target.value)}></input>
           <Button variant="secondaryBlack" disabled={empty} onClick={handleSubmit}>
            {submitting ? <BtnLoader /> : "Submit"}
           </Button>
           </div>
           </div>
           <img src={graphic} className={styles.graphic}></img>
           
           </FullScreenDialog>
        </>
    );
}