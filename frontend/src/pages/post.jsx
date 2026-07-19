import styles from "./post.module.css";
import NavWithSearch from "../components/navAndSearchBar/navAndSearchBar";
import Footer from "../components/footer/footer";
import LeftSidebar from "../components/postPageComps/leftSidebar";
import PostDetails from "../components/postPageComps/postDetails";

export default function PostPage() {
    return(
        <>
        <div className={styles.container}>
        <NavWithSearch selectedOption={"home"}/>
        <LeftSidebar selectedOption="overview"/>
        <PostDetails />
        </div>
        </>
    )
}