//searchBarSmall is a child component of this (NavWithSearch) component
//searchIcon click calls handleSearch on devices > 600px, but opens searchBar (handleSearchIconClick) on devices < 600px

//sideMenuToggle is also a child of this component
//rendering the navAndSearchBar will contain the side menu that is toggled using the hamburger icon

import { useEffect, useState } from "react";
import Button from "../buttons/button";
import PasswordField from "../passwordField/passwordField";
import styles from "./navAndSearchBar.module.css";
import SearchBarSmall from "./searchBarSmall.jsx";
import SideMenuToggle from "../sideMenu/sideMenuToggle.jsx";

export default function NavWithSearch({ className, sideMenuVisible, setSideMenuVisible}) {
  const [searchQuery, setSearchQuery] = useState("");

  function clearSearchBar() {
    setSearchQuery("");
  }

  //Searching
  const [isSearching, setIsSearching] = useState(false);

  function handleSearch() {
    if (!searchQuery) {
      return;
    }

    setIsSearching(true);
  }

  //changing the searchbar UI for mobile devices
  const [onSmallDevice, setOnSmallDevice] = useState(window.innerWidth < 600);
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);

  useEffect(() => {
    function handleResize() {
      setOnSmallDevice(window.innerWidth < 600);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  //open the searchbar for smaller devices
  function handleSearchIconClick() {
    setIsSearchBarVisible(true);
  }

  function handleLeftArrowClick() {
    setIsSearchBarVisible(false);
  }

  //toggling of the side menu (hamburger)
  //state has been uplifted to feed.jsx to enable darkening of the screen when menu is open
  const isSideMenuVisible = sideMenuVisible;
  const setIsSideMenuVisible = setSideMenuVisible;

  const showSideMenu = () => {
    setSideMenuVisible(true);
  }
  const hideSideMenu = () => {
    setSideMenuVisible(false)
  }

  return (
    <>
      <div className={className}>
        <div className={styles.container}>
          {/*searchbar for mobile devices ( < 600px ), visible when search icon is clicked*/}
          {isSearchBarVisible && onSmallDevice && (
            <SearchBarSmall
              searchQuery={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              handleSearch={handleSearch}
              clearSearchBar={clearSearchBar}
              isSearchBarVisible={isSearchBarVisible}
              hideSearchBar={handleLeftArrowClick}
            />
          )}

          {/*Parent searchbar component */}
          {!(isSearchBarVisible && onSmallDevice) && (
            <>
              <div className={styles.left}>
                <span className={`material-symbols-outlined icon`} onClick={showSideMenu}>menu</span>
                <h2 className="title">Tech Archive</h2>
              </div>

              <div className={styles.center}>
                <div className={styles.searchBar}>
                  <input
                    type="text"
                    placeholder="Search Projects"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  ></input>

                  {/*Close Button (hide permanently on small screens)*/}
                  {searchQuery && !onSmallDevice && (
                    <span
                      onClick={clearSearchBar}
                      className={`material-symbols-outlined icon`}
                      id={styles.closeBtn}
                    >
                      close
                    </span>
                  )}

                  {/*Search Icon*/}
                  <span
                    className={`material-symbols-outlined icon`}
                    id={styles.searchIcon}
                    onClick={
                      onSmallDevice ? handleSearchIconClick : handleSearch
                    }
                  >
                    search
                  </span>
                  {isSearching && <p>Searching for {searchQuery}</p>}
                </div>
                <span className={`material-symbols-outlined icon`}>sort</span>
              </div>

              <div className={styles.right}>
                <Button variant="secondaryBlack" status="active">
                  <span className={`material-symbols-outlined icon`}>
                    add_2
                  </span>
                  Post
                </Button>
                <span className={`material-symbols-outlined icon`}>
                  account_circle
                </span>
              </div>
            </>
          )}
        </div>

        {sideMenuVisible && <SideMenuToggle
          className={styles.sideMenuToggle}
          selectedOption={"home"}
          closeBtnFunction={hideSideMenu}
        /> }
      </div>
    </>
  );
}
