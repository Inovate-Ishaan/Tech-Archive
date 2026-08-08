import Button from "../components/buttons/button";
import NavWithSearch from "../components/navAndSearchBar/navAndSearchBar";
import styles from "./userProfile.module.css";
import githubLogo from "../assets/logos/github.svg";
import PostCard from "../components/postCard/postCard";
import { useState, useEffect } from "react";
import noPosts from "../assets/graphics/noPosts1.svg";
import emailIcon from "../assets/graphics/email.svg";
import EditUsername from "../components/profilePageComponents/editUsername";
import EditPFP from "../components/profilePageComponents/setPFP";

export default function ProfilePage() {
  const [sideMenuToggleVisible, setSideMenuToggleVisible] = useState(false);
  /////////////////////////////
  // Body scroll lock
  /////////////////////////////

  useEffect(() => {
    document.body.style.overflow = sideMenuToggleVisible ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [sideMenuToggleVisible]);

  //Edit username dialog
  const [editUsername, setEditUsername] = useState(false);

  const closeUsernameEditDialog = () => {
    editUsername ? setEditUsername(false) : setEditUsername(true);
  };

  //Edit PFP dialog
  const [editPFP, setEditPFP] = useState(false);

  const closePFPEditDialog = () => {
    editPFP ? setEditPFP(false) : setEditPFP(true);
  };

  return (
    <>
      <NavWithSearch
        className={styles.navWithSearch}
        sideMenuVisible={sideMenuToggleVisible}
        setSideMenuVisible={setSideMenuToggleVisible}
        selectedOption="you"
      />

      <div
        className={`${styles.bodyContainer} ${
          sideMenuToggleVisible ? "darkenPage" : ""
        }`}
      >
        {editUsername && <EditUsername closeBtnFunction={closeUsernameEditDialog}/>}
        {editPFP && <EditPFP closeBtnFunction={closePFPEditDialog}/>}

        <div className={styles.userDetailsContainer}>
          <div className={styles.profilePic}>
            <span
              className={`material-symbols-outlined icon ${styles.editProfilePic}`}
            onClick={() => {setEditPFP(true)}} style={{boxSizing : "content-box"}}>
              add_a_photo
            </span>
          </div>
          <div className={styles.userData}>
            <div className={styles.displayName}>Ishaan Shukla</div>
            <div className={styles.userName}>
              @ishaan_IIT{" "}
              <span className={`material-symbols-outlined icon ${styles.editUsername}`} onClick={() => {setEditUsername(true)}}>edit</span>
            </div>
            <div className={styles.links}>
              <Button variant="secondaryBlack">
                <div className={styles.logoBg}>
                  <img src={githubLogo} className={styles.linkIcons} />
                </div>
                GitHub
              </Button>
              <Button variant="secondaryBlack" onClick={() => {window.location.href="mailto:ishaan@gmail.com?subject=With reference to your post on Tech Archive"}}>
                <div className={styles.emailIcon}>
                  <img src={emailIcon} className={styles.linkIcons} />
                </div>
                Email
              </Button>
            </div>
          </div>
        </div>

        {/* HR */}
        <div className={styles.hr}></div>

        <div className={styles.noPostsYet}>
          <img src={noPosts} className={styles.noPostGraphic}></img>
          <span className={styles.noPostsLabel}>No Projects Yet</span>
        </div>
      </div>
    </>
  );
}
