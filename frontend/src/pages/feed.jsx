import { useEffect, useState } from "react";
import Footer from "../components/footer/footer";
import NavWithSearch from "../components/navAndSearchBar/navAndSearchBar";
import PostCard from "../components/postCard/postCard";
import SideMenuFixed from "../components/sideMenu/sideMenuFixed";
import SideMenuToggle from "../components/sideMenu/sideMenuToggle";
import styles from "./feed.module.css";
import { getPosts } from "../utils/api";

export default function FeedPage() {

  //to darken the remaining page when the side menu toggle is open
  const [sideMenuToggleVisible, setSideMenuToggleVisible] = useState(false);
  //prevent scroll when the side menu is open
  useEffect( () => {
    document.body.style.overflow = sideMenuToggleVisible ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [sideMenuToggleVisible]);

  //adding 3 extra states for page effects
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

   //adding backend used frontend
  const loadPosts = async () => {
    try {
      const response = await getPosts();
      setPosts(response.data)
    } catch (err) {
      setError(err.message || "Failed to load posts");
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  if (loading) {
      return <h2>Loading...</h2>;
  }

  if (error) {
      return <h2>{error}</h2>;
  }

  if (posts.length === 0) {
      return <h2>No posts yet.</h2>;
  }

  return (
    <>
      <NavWithSearch className={styles.navWithSearch} sideMenuVisible={sideMenuToggleVisible} setSideMenuVisible={setSideMenuToggleVisible} selectedOption={"home"}/>

      {/*Feed Body*/}
      <div className={`${styles.feedBody} ${sideMenuToggleVisible ? "darkenPage" : ""}`}>

      
      <SideMenuFixed className={styles.sideMenuFixed} selectedOption={"home"} />

      <div className={styles.feed}>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          title={post.title}
          image={post.image}
          author={post.author.username}
          profilePic={post.author.avatar}
          tags={post.tags}
        />
      ))}
      </div>
      </div>
    </>
  );
}
