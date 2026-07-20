import styles from "./post.module.css";
import NavWithSearch from "../components/navAndSearchBar/navAndSearchBar";
import Footer from "../components/footer/footer";
import LeftSidebar from "../components/postPageComps/leftSidebar.jsx";
import PostDetails from "../components/postPageComps/postDetails.jsx";
import ContentBox from "../components/postPageComps/contentBox.jsx";

export default function PostPage() {
    return(
        <>
        <div className={styles.container}>
        <NavWithSearch selectedOption={"home"}/>
        <LeftSidebar selectedOption="overview"/>
        <PostDetails />
        <ContentBox />
        </div>
        </>
    )
}