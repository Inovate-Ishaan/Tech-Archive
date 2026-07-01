import { useEffect, useState } from "react";
import Footer from "../components/footer/footer";
import NavWithSearch from "../components/navAndSearchBar/navAndSearchBar";
import PostCard from "../components/postCard/postCard";
import SideMenuFixed from "../components/sideMenu/sideMenuFixed";
import SideMenuToggle from "../components/sideMenu/sideMenuToggle";
import styles from "./feed.module.css";

export default function FeedPage() {

  //to darken the remaining page when the side menu toggle is open
  const [sideMenuToggleVisible, setSideMenuToggleVisible] = useState(false);
  //prevent scroll when the side menu is open

  useEffect( () => {
    document.body.style.overflow = sideMenuToggleVisible ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [sideMenuToggleVisible]);

  return (
    <>
      <NavWithSearch className={styles.navWithSearch} sideMenuVisible={sideMenuToggleVisible} setSideMenuVisible={setSideMenuToggleVisible}/>

      {/*Feed Body*/}
      <div className={`${styles.feedBody} ${sideMenuToggleVisible ? "darkenPage" : ""}`}>

      
      <SideMenuFixed className={styles.sideMenuFixed} selectedOption={"home"} />

      <div className={styles.feed}>
        <PostCard
          title={"Title 1"}
          author={"Author 1"}
          thumbnail={
            "https://i.natgeofe.com/k/6496b566-0510-4e92-84e8-7a0cf04aa505/red-fox-portrait_3x4.jpg"
          }
          profilePic={
            "https://i.pinimg.com/564x/79/e1/29/79e129e5c4b24c6bbf068046a4c22933.jpg"
          }
        />
        <PostCard
          title={"Title 2"}
          author={"Author 2"}
          thumbnail={
            "https://i.natgeofe.com/k/6496b566-0510-4e92-84e8-7a0cf04aa505/red-fox-portrait_3x4.jpg"
          }
          profilePic={
            "https://i.pinimg.com/564x/79/e1/29/79e129e5c4b24c6bbf068046a4c22933.jpg"
          }
        />
        <PostCard
          title={"Title 2"}
          author={"Author 2"}
          thumbnail={
            "https://i.natgeofe.com/k/6496b566-0510-4e92-84e8-7a0cf04aa505/red-fox-portrait_3x4.jpg"
          }
          profilePic={
            "https://i.pinimg.com/564x/79/e1/29/79e129e5c4b24c6bbf068046a4c22933.jpg"
          }
        />
        <PostCard
          title={"Title 3"}
          author={"Author 3"}
          thumbnail={
            "https://i.natgeofe.com/k/6496b566-0510-4e92-84e8-7a0cf04aa505/red-fox-portrait_3x4.jpg"
          }
          profilePic={
            "https://i.pinimg.com/564x/79/e1/29/79e129e5c4b24c6bbf068046a4c22933.jpg"
          }
        />
        <PostCard
          title={"Title 4"}
          author={"Author 4"}
          thumbnail={
            "https://i.natgeofe.com/k/6496b566-0510-4e92-84e8-7a0cf04aa505/red-fox-portrait_3x4.jpg"
          }
          profilePic={
            "https://i.pinimg.com/564x/79/e1/29/79e129e5c4b24c6bbf068046a4c22933.jpg"
          }
        />
        <PostCard
          title={"Title 5"}
          author={"Author 5"}
          thumbnail={
            "https://i.natgeofe.com/k/6496b566-0510-4e92-84e8-7a0cf04aa505/red-fox-portrait_3x4.jpg"
          }
          profilePic={
            "https://i.pinimg.com/564x/79/e1/29/79e129e5c4b24c6bbf068046a4c22933.jpg"
          }
        />
      </div>
      </div>
    </>
  );
}
