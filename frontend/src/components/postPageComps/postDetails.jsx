import styles from "./postDetails.module.css";
import Tag from "../tag/tag.jsx";
import { useState } from "react";
export default function PostDetails() {
  // Handling Bookmarks
  const [bookmarked, setBookmarked] = useState(false);
  function handleBookmarkClick() {
    bookmarked ? setBookmarked(false) : setBookmarked(true);
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.backToFeed}>
          <span className="material-symbols-outlined">arrow_back</span>
          <span>Back to Feed</span>
        </div>

        <div className={styles.postTitle}>
          <span>
            Autonomous Surveillance Hexacopter This is a longer title to observe
            the behaviour of long titiles
          </span>
        </div>

        <div className={styles.tagsAndBookmark}>
          <span className={styles.tags}>
            <Tag label="ECE" removeable={false} />{" "}
            <Tag label="CSE" removeable={false} />
          </span>
          <span
            className={`material-symbols-outlined icon ${bookmarked ? "filled" : ""}`}
            id={styles.bookmark}
            onClick={handleBookmarkClick}
          >
            bookmark
          </span>
        </div>

        <div className={styles.authorsContainer}>
          <span className={styles.authorLabel}>
            Authors - 
             </span>
             <div className={styles.authors}>
            <div className={styles.author}>
              <img
                className={styles.profilePic}
                src="https://miro.medium.com/v2/resize:fit:1024/format:webp/1*exDGqMaZUl3giVsakNotWg.jpeg"
              />
              <label className={styles.authorName}>Ishaan Shukla</label>
            </div>

            <div className={styles.author}>
              <img
                className={styles.profilePic}
                src="https://miro.medium.com/v2/resize:fit:1024/format:webp/1*exDGqMaZUl3giVsakNotWg.jpeg"
              />
              <label className={styles.authorName}>Ishaan Shukla</label>
            </div>
            </div>
        </div>

        {/* Relative Date */}
        <div className={styles.relativeDate}>
            <span>Posted 2 months ago</span>
        </div>

      </div>
    </>
  );
}
