import { useState, useEffect, useRef } from "react";
import { fetchReadme, uploadPost } from "../utils/api";
import Footer from "../components/footer/footer";
import NavWithSearch from "../components/navAndSearchBar/navAndSearchBar";
import styles from "./createPost.module.css";
import postGraphic from "../assets/graphics/post_online.svg";
import Button from "../components/buttons/button";
import Tag from "../components/tag/tag";
import Alert from "../components/alertPopUP/alertPopUp";
import validator from "validator";
import MdEditor from "../components/mdx_md_editor/mdx_md_editor";

export default function CreatePostPage() {
  //FORM PART VISIBILITY STATES
  const [part1Visible, setPart1Visible] = useState(true);
  const [part2Visible, setPart2Visible] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    tags: [],
    githubUrl: "",
  });

  //THUMBNAIL UPLOAD LOGIC

  const [selectedFile, setSelectedFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const onFileChange = (e) => {
    const file = e.target.files[0];
    const max_file_size = 3145728; //3MB
    if (file) {
      if (file.size > max_file_size) {
        showAlert("error", "Thumbnail must be less than 3MB");
        e.target.value = "";
        return;
      }
      setSelectedFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  //For integration of cloudinay, upload image directly and get the url
  const onFileUpload = () => {
    const fileData = new FormData();
    fileData.append("thumbnail", selectedFile, selectedFile.name);

    //api call
  };

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
    if (formData.tags.length > 3) {
      showAlert("info", "Add upto 4 tags only");
      return;
    }
    if (!formData.tags.includes(tag)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  }

  const removeTag = (tag) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  //////////////////////////////////////////////////////////////
  //MARKDOWN SAVE and POST logic
  const editorRef = useRef(null);
  const [markdown, setMarkdown] = useState("");

  async function handlePost() {
    const obtainedMD = editorRef.current.getMarkdown();
    if (!(obtainedMD.length > 50)) {
      showAlert("error", "Please provide more detailed documentation");
      return;
    }

    if (obtainedMD.length > 50000) {
      showAlert("error", "Document exceeds the character limit (50,000)");
      return;
    }

    //inculcate the changes the user has made into the markdown state
    setMarkdown(obtainedMD);

    const postData = new FormData();
    postData.append("title", formData.title);
    postData.append("content", obtainedMD);
    postData.append("githubUrl", formData.githubUrl);
    postData.append("tags", JSON.stringify(formData.tags));
    postData.append("thumbnail", selectedFile);
  

    try {
      const resp = await uploadPost(postData);
      if (!resp.ok){
        showAlert("error", resp.statusText )
        return;
      };
      showAlert("success", "Uploaded succesfully");
    } catch(err) {
      const msg = (err && err.error) || (err && err.msg) || "Post upload failed";
      showAlert("error", msg)
    }
  }

  //Markdown editor ERROR handler
  function editorErrorHandler({ msg, source }) {
    showAlert("error", "Error Parsing the README contents")
    console.log(`Msg: ${msg}`);
    console.log(`Source: ${source}`);
  };
  ///////////////////////////////////////////////////////
  //NEXT BUTTON MANAGEMENT
  const formNotEmpty =
    formData.title.trim() &&
    formData.tags.length > 0 &&
    formData.githubUrl &&
    selectedFile;

  const [submitting, setSubmitting] = useState(false);

  const handleNext = async (e) => {
    e.preventDefault();
    if (!validator.isURL(formData.githubUrl)) {
      showAlert("info", "Enter a valid Repo URL");
      return;
    }

    if (formData.title.trim().length < 5) {
      showAlert("info", "Title must be at least 5 characters");
      return;
    }

    //make the request only if there's no markdown already
    if (!markdown) {
      showAlert("info", "Fetching your documentation from GitHub.");
      try {
        const data = await fetchReadme(formData.githubUrl);
        setMarkdown(data.content);
      } catch (err) {
        const msg =
          (err && err.message) ||
          (err && err.error) ||
          "Failed to fetch README";
        showAlert("error", msg);
      }
    }

    //show the doc editor (Part 2)
    setPart1Visible(false);
    setPart2Visible(true);

    //Sample populating the editor with obtained README.md
    // setMarkdown("I got this from GitHUB");
  };
  ////////////////////////////////////////////////////////////

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
    if (!alert) return;

    setTimeout(() => {
      setAlert(null);
    }, 3000);
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
        selectedOption={"post"}
        withPostButton={false}
        sticky={false}
      />

      {/* ALERT */}
      {alert && (
        <Alert
          type={alert.type}
          msg={alert.msg}
          handleCloseClick={closeAlert}
        />
      )}

      <div
        className={`${styles.parent} ${sideMenuToggleVisible ? "darkenPage" : ""}`}
      >
        {/* Body */}
        <div className={styles.bodyContainer}>
          {/* Page title */}
          <h1>Post your Project</h1>

          {/* THIS IS PART 1 OF THE POST FORM */}
          {part1Visible && (
            <div className={styles.formPart}>
              <label className={`${"description"} ${styles.description}`}>
                Project Details
              </label>

              <div className={styles.formContainer}>
                {/* Form container */}
                <div className={styles.postDetailsContainer}>
                  <div className={styles.inputGroup}>
                    <label>Title</label>
                    <input
                      placeholder="max 100 characters"
                      maxLength={100}
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
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
                      {formData.tags.map((tag) => (
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

              {/* Github Repo URL */}
                  <div className={styles.inputGroup}>
                    <label>GitHub repo URL</label>
                    <input
                      placeholder="https://github.com/Inovate-Ishaan/Tech-Archive"
                      type="url"
                      value={formData.githubUrl}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          githubUrl: e.target.value,
                        });
                        setMarkdown("") //discard previous markdown on URL change
                      }
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
            </div>
          )}

          {/* THIS IS THE PART 2 OF THE POST FORM */}

          {part2Visible && (
            <div className={styles.formPart}>
              <label className={`${"description"} ${styles.description}`}>
                Documentation Editor
              </label>

              <div className={styles.editorContainer}>
                <MdEditor initialMD={markdown} editorRef={editorRef} handleEditorError={editorErrorHandler} />
              </div>
            </div>
          )}

          {/* Post Button */}
         {part2Visible && 
         <div className={styles.postAndBackButtonContainer}>

            <div className={styles.button}>
            <Button
              variant="primaryWhiteLessPadding"
              status="active"
              onClick={() => {setPart1Visible(true); setPart2Visible(false)}}>
              <span className={`${"material-symbols-outlined"} ${styles.backButton}`}>arrow_back</span>
              </Button>
          </div> 

         <div className={styles.button}>
            <Button
              variant="primaryBlackLessPadding"
              status="active"
              onClick={handlePost}
            >
              {submitting ? <BtnLoader /> : "Post"}
            </Button>
            </div>
          </div>}

          {/* NEXT BUTTON */}
         {part1Visible && <div className={styles.button}>
            <Button
              variant="primaryBlack"
              status={formNotEmpty && !submitting ? "active" : "disabled"}
              onClick={handleNext}
            >
              {submitting ? <BtnLoader /> : "Next"}
            </Button>
          </div> }
        </div>

        <Footer /> 
      </div>
    </>
  );
}
