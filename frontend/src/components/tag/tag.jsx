import styles from "./tag.module.css"

export default function Tag({ label="Tag", onRemove}) {
  return (
    <>
      <div className={styles.tagContainer}>
        <div className={styles.tag}>#{label}</div>
        <span className="material-symbols-outlined" onClick={onRemove}>close</span>
      </div>
    </>
  );
}
