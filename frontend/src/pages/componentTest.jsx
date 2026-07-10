//Just for testing various components without disturbing anything
import { useState } from "react";
import NavWithSearch from "../components/navAndSearchBar/navAndSearchBar";
import PostCard from "../components/postCard/postCard";
import OTPModal from "../components/OTPfield/OTPModal";

export default function ComponentTest() {
    const [sideMenuToggleVisible, setSideMenuToggleVisible] = useState(false);
    return(
        <>
        <NavWithSearch sideMenuVisible={sideMenuToggleVisible} setSideMenuVisible={setSideMenuToggleVisible} selectedOption={"home"}/>
        <PostCard />
        <OTPModal />
        </>
    )
}