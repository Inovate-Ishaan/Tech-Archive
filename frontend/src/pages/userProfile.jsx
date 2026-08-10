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
import { useParams } from "react-router-dom";
import { getUserProfile, getMyProfile } from "../utils/api";

export default function ProfilePage() {

  // get the username
     const [profileData, setProfileData] = useState({});
     const [editAccess, setEditAccess] = useState(false);
     const { username } = useParams();
     
     useEffect(() => {
      if (username === "me"){
        setEditAccess(true);
        return;
      };
      setEditAccess(false);
     }, [username])

    async function getMyProfileData() {
    const response = await getMyProfile();
    const data = response.data;
    setProfileData(data);
    

    // check if post count > 1, then make a request to get the posts
};

  async function getProfileData(username) {
        if (!username) return;
        
        const response = await getUserProfile(username);
        const data = response.data;
        setProfileData(data);
        console.log(data);

        // check if post count > 1, then make a request to get the posts
   };

useEffect(() => {
  if (editAccess) {
    getMyProfileData();
  } else{
    getProfileData(username);
  }
}, [username]);


  const [sideMenuToggleVisible, setSideMenuToggleVisible] = useState(false);
  const [sortDialogOpen, setSortDialogOpen] = useState(false);
  /////////////////////////////
  // Body scroll lock
  /////////////////////////////

  useEffect(() => {
    document.body.style.overflow = (sideMenuToggleVisible || sortDialogOpen) ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [sideMenuToggleVisible, sortDialogOpen]);

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
        sortDialogOpen={sortDialogOpen}
        setSortDialogOpen={setSortDialogOpen}
      />

      <div
        className={`${styles.bodyContainer} ${
          sideMenuToggleVisible ? "darkenPage" : ""
        }`}
      >
        {(editAccess && editUsername) && <EditUsername closeBtnFunction={closeUsernameEditDialog} username={profileData.username} dialogStateFunc={setEditUsername}/>}
        {(editAccess && editPFP) && <EditPFP closeBtnFunction={closePFPEditDialog}/>}

        <div className={styles.userDetailsContainer}>
          <div className={styles.profilePic}>
            { editAccess && <span
              className={`material-symbols-outlined icon ${styles.editProfilePic}`}
            onClick={() => {setEditPFP(true)}} style={{boxSizing : "content-box"}}>
              add_a_photo
            </span>}
          </div>
          <div className={styles.userData}>
            <div className={styles.displayName}>{profileData.displayname}</div>
            <div className={styles.userName}>
              @{profileData.username}
              {editAccess &&
              <span className={`material-symbols-outlined icon ${styles.editUsername}`} onClick={() => {setEditUsername(true)}}>edit</span>
              }</div>
            <div className={styles.links}>

              <Button variant="secondaryBlack" onClick={() => window.open(`${profileData.github}`, "_blank")}>
                <div className={styles.logoBg}>
                  <img src={githubLogo} className={styles.linkIcons} />
                </div>
                GitHub
              </Button>
            
              <Button variant="secondaryBlack" onClick={() => {window.location.href=`mailto:${profileData.email}?subject=With reference to your post on Tech Archive`}}>
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
