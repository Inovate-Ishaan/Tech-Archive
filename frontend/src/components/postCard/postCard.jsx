import styles from "./postCard.module.css";
import thumbnail_placeholder from "../../assets/other_images/thumbnail_placeholder.jpeg";

export default function PostCard({
  title = "AGAIN THIS IS KINDA LONG TITLE JUST TO CHECK HOW THE ",
  author = "Author",
  uploadTime = "1 month",
  thumbnail = thumbnail_placeholder,
  profilePic = "P",
  tags = ["tag1", "tag2"],
}) {
  //Stripping short the title if its too long (just to display on the card)
  if (title.length > 48) {
    title = title.slice(0, 48) + "...";
  }

  //adding "ago" to upload time
  uploadTime = uploadTime + " ago";

  //destructuring tags
  const tagsMarkup = (
    <>
      {tags.map((tag, index) => (
        <p key={index} className={styles.tag}>
          #{tag}
        </p>
      ))}
    </>
  );

  return (
    <>
      {/*Thumbnail*/}
      <div className={styles.container}>
        <img src={thumbnail} className={styles.thumbnail} />

        {/*Post Description*/}
        <div className={styles.postDetailsContainer}>
          {/*Profile Pic*/}
          {/*Not Implemented, just a circle*/}
          <div>
            <img src={profilePic} className={styles.profilePic} />
          </div>

          {/*Post Details*/}
          <div className={styles.postDetails}>
            {/*Title*/}
            <div className={styles.postTitle}>
              <p>{title}</p>
            </div>

            <div className={styles.authorAndTime}>
              {/*Author*/}
              <div className={styles.author}>
                <p>{author}</p>
              </div>

              {/*Upload time*/}
              <div className={styles.uploadTime}>
                <p>{uploadTime}</p>
              </div>
            </div>

            {/*Tags and save*/}
            <div className={styles.tagsAndSave}>
              <div className={styles.tagContainer}> {tagsMarkup} </div>

              <span className="material-symbols-outlined">bookmark</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
