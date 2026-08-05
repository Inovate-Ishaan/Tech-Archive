import { useEffect, useState, useRef } from "react";
import Footer from "../components/footer/footer";
import NavWithSearch from "../components/navAndSearchBar/navAndSearchBar";
import PostCard from "../components/postCard/postCard";
import SideMenuFixed from "../components/sideMenu/sideMenuFixed";
import SideMenuToggle from "../components/sideMenu/sideMenuToggle";
import styles from "./feed.module.css";
import { getPosts } from "../utils/api";
import Alert from "../components/alertPopUP/alertPopUp.jsx";
import BtnLoader from "../components/loaders/btnLoader.jsx";

export default function FeedPage() {
  const obsRef = useRef(null);
  const feedRef = useRef(null);

  const [atBottom, setAtBottom] = useState(false);
  const [pageCount, setPageCount] = useState(0);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // prevents multiple simultaneous requests
  const loadingRef = useRef(false);

  /////////////////////////////
  // Observer
  /////////////////////////////

  useEffect(() => {
    if (loading) return;
    if (posts.length === 0) return;
    const currentElement = obsRef.current;
    const root = null;

    if (!currentElement || !root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        console.log(entries);
        setAtBottom(entries[0].isIntersecting);
      },
      {
        root,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    observer.observe(currentElement);

    console.log("Observer created.");

    return () => observer.disconnect();
  }, [loading]);

  /////////////////////////////
  // Load posts
  /////////////////////////////

  const loadPosts = async () => {
    if (loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);

    try {
      const response = await getPosts();

      console.log("Received Posts:", response.data);

      setPosts((prev) => [...prev, ...response.data]);

      setPageCount((prev) => prev + 1);
    } catch (err) {
      setError(err.message || "Failed to load posts");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  };

  /////////////////////////////
  // Initial load
  /////////////////////////////

  useEffect(() => {
    loadPosts();
  }, []);

  /////////////////////////////
  // Infinite scroll
  /////////////////////////////

  useEffect(() => {
    if (!atBottom) return;

    console.log("Reached bottom");

    loadPosts();
  }, [atBottom]);

  /////////////////////////////
  // Body scroll lock
  /////////////////////////////

  const [sideMenuToggleVisible, setSideMenuToggleVisible] = useState(false);

  useEffect(() => {
    document.body.style.overflow = sideMenuToggleVisible ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [sideMenuToggleVisible]);

  /////////////////////////////
  // Alerts
  /////////////////////////////

  const [alert, setAlert] = useState(null);
  const timeoutRef = useRef(null);

  function showAlert(type, msg) {
    setAlert({ type, msg });

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setAlert(null);
    }, 3000);
  }

  const closeAlert = () => setAlert(null);

  /////////////////////////////

  if (error) {
    return <h2>{error}</h2>;
  }

  if (loading && posts.length === 0) {
    return <BtnLoader />;
  }

  if (!loading && posts.length === 0) {
    return <h2>No posts yet.</h2>;
  }

  return (
    <>
      {alert && (
        <Alert
          type={alert.type}
          msg={alert.msg}
          handleCloseClick={closeAlert}
        />
      )}

      <NavWithSearch
        className={styles.navWithSearch}
        sideMenuVisible={sideMenuToggleVisible}
        setSideMenuVisible={setSideMenuToggleVisible}
        selectedOption="home"
      />

      <div
        className={`${styles.feedBody} ${
          sideMenuToggleVisible ? "darkenPage" : ""
        }`}
      >
        <SideMenuFixed
          className={styles.sideMenuFixed}
          selectedOption="home"
        />

        <div ref={feedRef} className={styles.feed}>
          {posts.map((post, index) => (
            <PostCard
              key={index}
              postID={post.id}
              title={post.title}
              image={post.image}
              author={post.author.username}
              profilePic={post.author.avatar}
              tags={post.tags}
            />
          ))}

          <div
            ref={obsRef}
            className={styles.observer}
            style={{ height: "10px" }}
          />
        </div>

        {loading && (
          <div className={styles.infiniteLoader}>
            <BtnLoader />
          </div>
        )}
      </div>
    </>
  );
}