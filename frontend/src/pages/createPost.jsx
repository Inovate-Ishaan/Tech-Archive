import { useState, useEffect, useRef } from "react";
import Footer from "../components/footer/footer";
import NavWithSearch from "../components/navAndSearchBar/navAndSearchBar";
import styles from "./createPost.module.css";
import postGraphic from "../assets/graphics/post_online.svg";
import Button from "../components/buttons/button";
import Tag from "../components/tag/tag";
import Alert from "../components/alertPopUP/alertPopUp";

export default function CreatePostPage() {
  const [formData, setFormData] = useState({
    title: "",
    tags: [],
    gitHubRepoURL: "",
  });

  //THUMBNAIL UPLOAD LOGIC

  const [selectedFile, setSelectedFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(e.target.files[0]);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };
  const onFileUpload = () => {
    const fileData = new FormData();
    formData.append("thumbnail", selectedFile, selectedFile.name);

    //api call
  };

  // import axios from "axios";
  // import React, { useState } from "react";

  // const App = () => {
  // 	const [selectedFile, setSelectedFile] = useState(null);
  // 	const onFileChange = (event) => {
  // 		setSelectedFile(event.target.files[0]);
  // 	};
  // 	const onFileUpload = () => {
  // 		const formData = new FormData();
  // 		formData.append(
  // 			"myFile",
  // 			selectedFile,
  // 			selectedFile.name
  // 		);
  // 		console.log(selectedFile);
  // 		axios.post("api/uploadfile", formData);
  // 	};
  // 	const fileData = () => {
  // 		if (selectedFile) {
  // 			return (
  // 				<div>
  // 					<h2>File Details:</h2>
  // 					<p>File Name: {selectedFile.name}</p>
  // 					<p>File Type: {selectedFile.type}</p>
  // 					<p>
  // 						Last Modified: {selectedFile.lastModifiedDate.toDateString()}
  // 					</p>
  // 				</div>
  // 			);
  // 		} else {
  // 			return (
  // 				<div>
  // 					<br />
  // 					<h4>Choose before Pressing the Upload button</h4>
  // 				</div>
  // 			);
  // 		}
  // 	};

  // 	return (
  // 		<div>
  // 			<h1>GeeksforGeeks</h1>
  // 			<h3>File Upload using React!</h3>
  // 			<div>
  // 				<input type="file" onChange={onFileChange} />
  // 				<button onClick={onFileUpload}>Upload!</button>
  // 			</div>
  // 			{fileData()}
  // 		</div>
  // 	);
  // };

  // export default App;

  //TAG MANAGEMENT
  const allTags = [
    "ECE",
    "CSE",
    "Robotics",
    "CAD",
    "Mechanical",
    "Research",
    "Physics",
    "Electrical",
  ];
  const [selectedTags, setSelectedTags] = useState([]);

  const [showTagMenu, setShowTagMenu] = useState(false);
  const tagMenuRef = useRef(null);

  useEffect(() => {
    if (!showTagMenu) return;

    const handleClick = (e) => {
      if (!tagMenuRef.current.contains(e.target)) {
        setShowTagMenu(false);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [showTagMenu]);

  function addTag(tag) {
    if (selectedTags.length > 3){
        showAlert("info", "Add upto 4 tags only");
        return;
    }
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  }

  const removeTag = (tag) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  //to darken the remaining page when the side menu toggle is open
  const [sideMenuToggleVisible, setSideMenuToggleVisible] = useState(false);
  //prevent scroll when the side menu is open

  useEffect(() => {
    document.body.style.overflow = sideMenuToggleVisible ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [sideMenuToggleVisible]);

  //ALERT
  const [alert, setAlert] = useState(null);

  function showAlert(type, msg) {
    setAlert({
      type,
      msg,
    });
  }

  useEffect(() => {
    if (!alert)return;

    setTimeout(() => {
    setAlert(null);},
3000)
  }, [alert]);

  const closeAlert = () => {
    setAlert(null);
  };

  return (
    <>
      {/* Navigation Bar non-sticky*/}
      <NavWithSearch
        sideMenuVisible={sideMenuToggleVisible}
        setSideMenuVisible={setSideMenuToggleVisible}
        withPostButton={false}
        sticky={false}
      />

      {/* ALERT */}
        {alert && (<Alert type={alert.type} msg={alert.msg} handleCloseClick={closeAlert}/>)}

      <div
        className={`${styles.parent} ${sideMenuToggleVisible ? "darkenPage" : ""}`}
      >
        {/* Body */}
        <div className={styles.bodyContainer}>
          {/* Page title */}
          <h1>Post your Project</h1>

          <div className={styles.formContainer}>
            {/* Form container */}
            <div className={styles.postDetailsContainer}>
              <div className={styles.inputGroup}>
                <label>Title</label>
                <input
                  placeholder="max 100 characters"
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                ></input>
              </div>

              {/* TAGS */}
              <div
                className={styles.inputGroup}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTagMenu(true);
                }}
              >
                <label>Tags</label>
                <div className={styles.tagInputBar}>
                  {selectedTags.map((tag) => (
                    <Tag
                      label={tag}
                      key={tag}
                      onRemove={() => removeTag(tag)}
                    />
                  ))}
                </div>
              </div>

              {/* TAG Menu */}
              {showTagMenu && (
                <div className={styles.tagMenu} ref={tagMenuRef}>
                  {allTags.map((tag) => (
                    <div
                      key={tag}
                      className={styles.tagMenuOption}
                      onClick={() => addTag(tag)}
                    >
                      #{tag} <div className={styles.dot}></div>
                    </div>
                  ))}
                </div>
              )}

              <div className={styles.inputGroup}>
                <label>GitHub repo URL</label>
                <input
                  placeholder="https://github.com/Inovate-Ishaan/Tech-Archive"
                  type="url"
                  value={formData.gitHubRepoURL}
                  onChange={(e) =>
                    setFormData({ ...formData, gitHubRepoURL: e.target.value })
                  }
                ></input>
              </div>

              <div
                className={`${styles.inputGroup} ${styles.thumbnailUploadContainer}`}
              >
                <label>Thumbnail</label>

                <label
                  htmlFor="thumbnailInput"
                  className={styles.thumbnailUploadButton}
                >
                  <span className="material-symbols-outlined icon">
                    image_arrow_up
                  </span>
                  <p>{selectedFile ? "Change" : "Upload"} Thumbnail</p>
                </label>

                <input
                  id="thumbnailInput"
                  type="file"
                  accept="image/*"
                  className={styles.hiddenFileInput}
                  onChange={onFileChange}
                ></input>
              </div>

              {/* Thumbnail Preview */}
              {selectedFile && (
                <div
                  className={`${styles.inputGroup} ${styles.thumbnailPreviewContainer}`}
                >
                  <label>Thumbnail Preview</label>

                  <label className={styles.thumbnailPreviewBox}>
                    <img
                      src={thumbnailPreview}
                      className={styles.thumbnailPreview}
                    ></img>
                  </label>

                  <input
                    id="thumbnailInput"
                    type="file"
                    accept="image/*"
                    className={styles.hiddenFileInput}
                    onChange={onFileChange}
                  ></input>
                </div>
              )}
            </div>

            {/* the graphic */}
            <div className={styles.graphicContainer}>
              <img src={postGraphic} className={styles.graphic} />
            </div>
          </div>

          <div className={styles.button}>
            {/* <Button
                  variant="primaryBlack"
                  status={formNotEmpty && !submitting ? "active" : "disabled"}
                  onClick={handleSubmit}
                >
                  {submitting ? <BtnLoader /> : "Login"}
                </Button> */}
          </div>
        </div>

        {/* <Footer /> */}
      </div>
    </>
  );
}
