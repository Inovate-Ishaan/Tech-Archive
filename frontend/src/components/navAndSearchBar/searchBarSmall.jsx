//this is just the search bar which appears only on small devices when the search icon is clicked
//on large devices, navAndSearchBar component has the search bar included in the nav itself
//navAndSearchBar has a breakpoint at 600px which makes the input field disappear, and now, a click on the search icon
//would render this component

//it is a child of navAndSearchBar

import styles from './searchBarSmall.module.css';
import Button from '../buttons/button';

export default function SearchBarSmall( {searchQuery, onChange, handleSearch, clearSearchBar, isSearchBarVisible, hideSearchBar} ) {

    const showCloseBtn = searchQuery.trim().length > 0 && isSearchBarVisible;

    return(
        <>
            <div className={styles.container}>
            <div className={styles.left}>
                <span className="material-symbols-outlined" onClick={hideSearchBar}>arrow_back</span>
            </div>

            <div className={styles.center}>
                <div className={styles.searchBar}>
                    
                    {/*Search field*/}
                    <input type="text" placeholder="Search Projects" value={searchQuery} onChange={onChange}></input>
                    
                    {/*Close Button*/}
                    {showCloseBtn && <span onClick={clearSearchBar} className="material-symbols-outlined" id={styles.closeBtn}>close</span>}
                    
                    {/*Search Icon*/}
                    <span className="material-symbols-outlined" id={styles.searchIcon} onClick={handleSearch}>search</span>
                    
                </div>
                
            </div>

            {/*Sort button*/}
            <div className={styles.right}>
                <span className="material-symbols-outlined">sort</span>
            </div>
        </div>
        </>
    )
};