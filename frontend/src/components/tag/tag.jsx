import styles from "./tag.module.css"

export default function Tag({ label="Tag", removeable=false, onRemove}) {
  return (
    <>
      <div className={styles.tagContainer}>
        <div className={`${styles.tag} ${removeable ? styles.tagRemoveable : ""}`}>#{label}</div>
        { removeable && <span className="material-symbols-outlined" onClick={onRemove}>close</span>}
      </div>
    </>
  );
}
