import { useState } from "react";
import Button from "../buttons/button";
import PasswordField from "../passwordField/passwordField";
import styles from "./navAndSearchBar.module.css";

export default function NavWithSearch() {

    const [searchQuery, setSearchQuery] = useState("");

    function clearSearchBar() {
        setSearchQuery("");
    };

    //Searching
    const [isSearching, setIsSearching] = useState(false);

    function handleSearch() {
        if (!searchQuery) {
            return
        }
        
        setIsSearching(true);
    }

    return (
        <>
        <div className={styles.container}>
            <div className={styles.left}>
                <span className="material-symbols-outlined">menu</span>
                <h2 className="title">Tech Archive</h2>
            </div>

            <div className={styles.center}>
                <div className={styles.searchBar}>
                    <input type="text" placeholder="Search Projects" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}></input>
                    {searchQuery && <span onClick={clearSearchBar} className="material-symbols-outlined" id={styles.closeBtn}>close</span>}
                    <span className="material-symbols-outlined" id={styles.searchIcon} onClick={handleSearch}>search</span>
                    {isSearching && <p>Searching for {searchQuery}</p>}
                </div>
                <span className="material-symbols-outlined">sort</span>
            </div>

            <div className={styles.right}>
            <Button variant="secondaryBlack" status="active">
                <span className="material-symbols-outlined">add_2</span>
                Post
            </Button>
            <span className="material-symbols-outlined">account_circle</span>
            </div>
        </div>
        </>
    )
};