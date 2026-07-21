import styles from "./post.module.css";
import NavWithSearch from "../components/navAndSearchBar/navAndSearchBar";
import Footer from "../components/footer/footer";
import LeftSidebar from "../components/postPageComps/leftSidebar/leftSidebar.jsx";
import LeftSidebarToggle from "../components/postPageComps/leftSidebar/leftSidebarToggle.jsx";
import PostDetails from "../components/postPageComps/postDetails.jsx";
import ContentBox from "../components/postPageComps/contentBox.jsx";
import Button from "../components/buttons/button.jsx";
import { useState, useEffect } from "react";

export default function PostPage() {
    
    //LeftSidebar is not collapsable and it is for >768px
    //LeftsidebarToggle is collapsable
    //Switching betwenn these two is handled by CSS media queries, so no worries about it here
    //below is the logic to open and close LeftSideBarToggle
    const [showLeftSidebar, setShowLeftSidebar] = useState(false);
    const handleViewAllSectionsClick = () => {
        setShowLeftSidebar(true);
    }
    const handleCloseLeftSidebar = () => {
        setShowLeftSidebar(false);
    }

    //Nav Bar Stuff
      //to darken the remaining page when the side menu toggle is open
      const [sideMenuToggleVisible, setSideMenuToggleVisible] = useState(false);
      //prevent scroll when the side menu is open
      useEffect( () => {
        document.body.style.overflow = sideMenuToggleVisible ? "hidden" : "auto";
        return () => {
          document.body.style.overflow = 'auto';
        };
      }, [sideMenuToggleVisible]);

    return(
        <>
        <div className={styles.container}>
        <NavWithSearch sideMenuVisible={sideMenuToggleVisible} setSideMenuVisible={setSideMenuToggleVisible} selectedOption={"home"}/>
        <LeftSidebar className={styles.leftSideBar} selectedOption="overview"/>
        {showLeftSidebar && <LeftSidebarToggle className={styles.leftSideBarToggle} selectedOption="overview" closeBtnFunction={handleCloseLeftSidebar}/>}
        <PostDetails showLeftSidebar={handleViewAllSectionsClick}/>
        <ContentBox />
        <div className={styles.navButtons}>
            <Button variant="tertiaryWhite">
                Previous
            </Button>

            <Button variant="tertiaryBlack">
                Next Section
            </Button>
        </div>
        </div>
        </>
    )
}