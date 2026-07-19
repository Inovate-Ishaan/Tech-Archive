import NavWithSearch from "../components/navAndSearchBar/navAndSearchBar";
import Footer from "../components/footer/footer";
import LeftSidebar from "../components/postPageComps/leftSidebar";

export default function PostPage() {
    return(
        <>
        <NavWithSearch selectedOption={"home"}/>
        <LeftSidebar selectedOption="overview"/>
      
        </>
    )
}