import styles from "./footer.module.css";

export default function Footer(){
    return (
      <>
        <div className={styles.parent}>
          <div className={styles.left}>
            <p className={styles.subheading}>Tech Archive - IIT Bhilai</p>
          </div>
          <div className={styles.right}>
            <a className={styles.link}>Link 1</a>
            <a className={styles.link}>Link 2</a>
            <a className={styles.link}>Link 3</a>
            <a className={styles.link}>Link 4</a>
          </div>
        </div>
      </>
    );
}