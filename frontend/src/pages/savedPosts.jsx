import { useCallback, useEffect, useReducer, useRef, useState } from "react";

import NavWithSearch from "../components/navAndSearchBar/navAndSearchBar";
import PostCard from "../components/postCard/postCard";
import SideMenuFixed from "../components/sideMenu/sideMenuFixed";
import Alert from "../components/alertPopUP/alertPopUp.jsx";
import BtnLoader from "../components/loaders/btnLoader.jsx";

import { getPosts } from "../utils/api";
import styles from "./feed.module.css";

export default function SavedPostsPage() {
  const observerElementRef = useRef(null);

  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const pageRef = useRef(1);
  const feedRef = useRef(null);
  const timeoutRef = useRef(null);
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);
  const [sideMenuToggleVisible, setSideMenuToggleVisible] = useState(false);

  /////////////////////////////
  // Alerts
  /////////////////////////////

  const showAlert = (type, msg) => {
    setAlert({ type, msg });

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  const closeAlert = () => {
    setAlert(null);
  };

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  /////////////////////////////
  // Load posts
  /////////////////////////////

  const loadPosts = useCallback(async () => {
    // Prevent simultaneous requests or requests after the final page.
    if (loadingRef.current || !hasMoreRef.current) {
      return;
    };

    loadingRef.current = true;

    setLoading(true);
    setError(null);

    try {
      const currentPage = pageRef.current;

      // Assumes getPosts accepts a page number.
      const response = await getPosts(currentPage);

      const newPosts = Array.isArray(response?.data)
        ? response.data
        : [];

      console.log(`Received page ${currentPage}:`, newPosts);

      if (newPosts.length === 0) {
        hasMoreRef.current = false;
        setHasMore(false);
        return;
      }

      setPosts((previousPosts) => [
        ...previousPosts,
        ...newPosts,
      ]);

      // Move to the next page only after a successful response.
      pageRef.current += 1;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to load posts";

      setError(message);
      showAlert("error", message);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  /////////////////////////////
  // Initial load
  /////////////////////////////

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  /////////////////////////////
  // Intersection observer
  /////////////////////////////

  useEffect(() => {
    // Wait for the current request to finish.
    if (loading || !hasMore || error) {
      return;
    }

    const observerElement = observerElementRef.current;

    if (!observerElement) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        console.log("Observer reached");

        // loadPosts contains its own duplicate-request guard.
        loadPosts();
      },
      {
        // Use the browser viewport as the scroll container.
        root: null,

        // Fetch before the user reaches the exact bottom.
        rootMargin: "0px",

        threshold: 0.7,
      }
    );

    observer.observe(observerElement);

    console.log("Observer created");

    return () => {
      observer.disconnect();
      console.log("Observer disconnected");
    };
  }, [loading, hasMore, error, loadPosts]);

  /////////////////////////////
  // Body scroll lock
  /////////////////////////////

  useEffect(() => {
    document.body.style.overflow = sideMenuToggleVisible
      ? "hidden"
      : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [sideMenuToggleVisible]);

  /////////////////////////////
  // Render
  /////////////////////////////

  const initialLoading = loading && posts.length === 0;
  const loadingMore = loading && posts.length > 0;
  const initialError = error && posts.length === 0;
  const noPosts =
    !loading &&
    !error &&
    posts.length === 0 &&
    !hasMore;

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
        selectedOption="saved"
      />

      <div
        className={`${styles.feedBody} ${
          sideMenuToggleVisible ? "darkenPage" : ""
        }`}
      >
        <SideMenuFixed
          className={styles.sideMenuFixed}
          selectedOption="saved"
        />

        <div className={styles.feed} ref={feedRef}>
          {initialLoading && <BtnLoader />}

          {initialError && <h2>{error}</h2>}

          {noPosts && <h2>No posts yet.</h2>}

          {posts.map((post) => (
            <PostCard
              key={post.id}
              postID={post.id}
              title={post.title}
              thumbnail={post.image}
              author={post.author?.username}
              profilePic={post.author?.avatar}
              tags={post.tags}
            />
          ))}

          {/* Intersection observer sentinel */}
          {hasMore && !initialError && (
            <div
              ref={observerElementRef}
              className={styles.observer}
              aria-hidden="true"
            ></div>
          )}
        </div>
    {/* currently this conditional button loader not working */}
          {loadingMore && (
            <div className={styles.infiniteLoader}>
              <BtnLoader />
            </div>
          )}

          {!hasMore && posts.length > 0 && (
            <div className={styles.endMessage}>
             <> Reached the end :) </>
            </div>
          )}

      </div>
    </>
  );
}