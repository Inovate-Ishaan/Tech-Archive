//for login/register/landing etc.
//for feed, navbar would be used
import logo from "../..//assets/logos/iitbh_logo.png";
import styles from "./Header.module.css";
import Button from "../buttons/button";

export default function Header() {

    return(
        <>
        <div className={styles.container}>
        <div className={styles.left}>
            <img src={logo} alt="logo" className={styles.headerLogo} />
            <h2 className={styles.title}>Tech Archive</h2>
        </div>

        <div className={styles.right}>
            <Button variant="secondaryWhite">
                Community
            </Button>

            <Button variant="secondaryBlack">
                Home
            </Button>
        </div>
        </div>
        </>
    )
}
