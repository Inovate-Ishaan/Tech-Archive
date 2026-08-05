import styles from "./postDetails.module.css";
import Tag from "../tag/tag.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PostDetails({
  title = "No title",
  tags = [],
  author="",
  showLeftSidebar,
}) {
  // Handling Bookmarks
  const [bookmarked, setBookmarked] = useState(false);
  function handleBookmarkClick() {
    bookmarked ? setBookmarked(false) : setBookmarked(true);
  }

  const naviagate = useNavigate();

  return (
    <>
      <div className={styles.container}>
        <div className={styles.backAndToc}>
          <div
            className={styles.backToFeed}
            onClick={() => {
              naviagate("/feed");
            }}
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <span>Back to Feed</span>
          </div>
          <div className={styles.viewAllSections} onClick={showLeftSidebar}>
            <span className="material-symbols-outlined">toc</span>
            <span>View all Sections</span>
          </div>
        </div>

        <div className={styles.postTitle}>
          <span>{title}</span>
        </div>

        <div className={styles.tagsAndBookmark}>
          <span className={styles.tags}>
            {tags.map((tag, index) => {
              return (
                <Tag key={index} label={tag.tags.name} removeable={false} />
              );
            })}
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
          <span className={styles.authorLabel}>Author -</span>
          <div className={styles.authors}>
            <div className={styles.author}>
              {/* Show profile picture if exits */}
              {author.avatar && (
                <img
                  className={styles.profilePic}
                  src="https://miro.medium.com/v2/resize:fit:1024/format:webp/1*exDGqMaZUl3giVsakNotWg.jpeg"
                />
              )}

              {/* Show default icon if not */}
              {!author.avatar && (
                <div className={styles.defaultProfilePic}>
                  <span className={`material-symbols-outlined`} id={styles.faceIcon}>face</span>{" "}
                </div>
              )}

              <label className={styles.authorName}>{author.displayname}</label>
            </div>

            {/* <div className={styles.author}>
              <img
                className={styles.profilePic}
                src="https://miro.medium.com/v2/resize:fit:1024/format:webp/1*exDGqMaZUl3giVsakNotWg.jpeg"
              />
              <label className={styles.authorName}>Ishaan Shukla</label>
            </div> */}
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
