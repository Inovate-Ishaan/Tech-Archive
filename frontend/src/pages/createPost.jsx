import { useState, useEffect, useRef } from "react";
import { fetchReadme, uploadPost } from "../utils/api";
import Footer from "../components/footer/footer";
import NavWithSearch from "../components/navAndSearchBar/navAndSearchBar";
import styles from "./createPost.module.css";
import postGraphic from "../assets/graphics/post_online.svg";
import addSectionGraphic from "../assets/graphics/addSection.svg";
import Button from "../components/buttons/button";
import Tag from "../components/tag/tag";
import Alert from "../components/alertPopUP/alertPopUp";
import validator from "validator";
import MdEditor from "../components/mdx_md_editor/mdx_md_editor";
import LeftSidebarToggle from "../components/postPageComps/leftSidebar/leftSidebarToggle.jsx";
import SectionsSidebar from "../components/createPostComponents/sectionsSidebar/sectionsSidebar.jsx";
import FullScreenDialog from "../components/dialogBoxes/fullScreenDialog/fullScreenDialog.jsx";

export default function CreatePostPage() {
  //FORM PART VISIBILITY STATES
  const [part1Visible, setPart1Visible] = useState(false);
  const [part2Visible, setPart2Visible] = useState(true);

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

    allSections.map((section, index) => {
      if (section[1].length < 50) {
        showAlert("error", `Please provide more content for ${section[0]}`);
        return;
      };
      if (section[1].length > 50000) {
         showAlert("error", `Character limit exceeded in ${section[0]}`);
         return;
      }
    });

    const postData = new FormData();
    postData.append("title", formData.title);
    postData.append("content", allSections);
    postData.append("githubUrl", formData.githubUrl);
    postData.append("tags", JSON.stringify(formData.tags));
    postData.append("thumbnail", selectedFile);

    try {
      const resp = await uploadPost(postData);
      if (!resp.ok) {
        showAlert("error", resp.statusText);
        return;
      }
      showAlert("success", "Uploaded succesfully");
    } catch (err) {
      const msg =
        (err && err.error) || (err && err.msg) || "Post upload failed";
      showAlert("error", msg);
    }
  }

  //Markdown editor ERROR handler
  function editorErrorHandler({ msg, source }) {
    showAlert("error", "Error Parsing the README contents");
    console.log(`Msg: ${msg}`);
    console.log(`Source: ${source}`);
  }
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
  //sort dialog box state
  const [sortDialogOpen, setSortDialogOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow =
      sideMenuToggleVisible || sortDialogOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [sideMenuToggleVisible, sortDialogOpen]);

  //ALERT
  const [alert, setAlert] = useState(null);
  const alertRef = useRef(null);
  function showAlert(type, msg) {
    setAlert({
      type,
      msg,
    });
  }

  useEffect(() => {
    if (!alert) return;
    clearTimeout(alertRef.current);
    alertRef.current = setTimeout(() => {
      setAlert(null);
    }, 3000);
  }, [alert]);

  const closeAlert = () => {
    setAlert(null);
  };

  //////////////////////////////////////////
  //SECTION MANAGEMENT//////////////////////
  //////////////////////////////////////////

  const [allSections, setAllSections] = useState([["Overview", "Overview"]]);
  const [currentSection, setCurrentSection] = useState(1);
  const [currentSectionName, setCurrentSectionName] = useState("");
  const [currenSectionContent, setCurrentSectionContent] =
    useState("dddddddddd");

  //handling sections sidebar logic
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const handleViewAllSectionsClick = () => {
    setShowLeftSidebar(true);
  };
  const handleCloseLeftSidebar = () => {
    setShowLeftSidebar(false);
  };

  ////////////////////////////////////////
  //Section renaming logic (when double clicked on the displayed section name)
  const [isRenaming, setIsRenaming] = useState(false);

  useEffect(() => {
    setCurrentSectionName(allSections[currentSection - 1][0]);
    setCurrentSectionContent(allSections[currentSection - 1][1]);
  }, [currentSection, isRenaming]);
  const [newName, setNewName] = useState(""); //tracks the renaming but used just to fill the input bar with old section name, nothing else
  useEffect(() => {
    console.log(newName);
  }, [newName]);

  const renameInputRef = useRef(null);

  useEffect(() => {
    if (!isRenaming) return;

    console.log("Inside the effect");
    setNewName(currentSectionName); //set the new name to the old section name so the input value can be assigned to it
    // focus the input bar
    renameInputRef.current.focus();

    const handleClick = (e) => {
      if (!renameInputRef.current.contains(e.target)) {
        //basically it is closing the edit name mode and saves the renamed section name
        const updatedName = renameInputRef.current?.value?.trim() || "";

        if (updatedName.length === 0) return;
        console.log("NewName", updatedName);

        const updatedSections = allSections;

        updatedSections[currentSection - 1][0] = updatedName;
        setAllSections(updatedSections);

        setIsRenaming(false);
        console.log("Inside the effects handleclick");
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [isRenaming, currentSection]);

  function handleSectionRename(e) {
    e.stopPropagation();
    setIsRenaming(true);
    console.log("Input should be visible");
  }
  ///////////////////////////////////////

  /////////////////////////////////////
  //Add section logic
  const addSectionInputRef = useRef(null);

  const [addSectionVisible, setAddSectionVisible] = useState(false);

  function handleAddSectionsClick() {
    setAddSectionVisible(true);
  }

  function handleAddSectionClose() {
    setAddSectionVisible(false);
  }

  const [newSectionName, setNewSectionName] = useState("");

  // handling clicking of Add button in the Add Section Dialog
  function handleNewSectionAddClick() {
    if (newSectionName in allSections) {
      showAlert("info", "Section already exists");
      setNewSectionName("");
      addSectionInputRef.current.focus();
      return;
    }
    if (newSectionName.trim().length <= 5) {
      if (newSectionName.trim().length === 0) {
        showAlert("info", "Provide a Section name");
      } else {
        showAlert("info", "Name too short");
      }
      setNewSectionName("");
      addSectionInputRef.current.focus();
      return;
    }
    setAllSections((prev) => [...prev, [newSectionName, ""]]);
    setNewSectionName("");
    setAddSectionVisible(false);
    showAlert("success", "Section added");
  }

  useEffect(() => {
    console.log(allSections);
  }, [allSections]);

  //////////////////////////////////////////
  //navigating between sections
  function changeSection(sectionNum) {
    //SAVE THE CONTENT in allSections for that section
    const content = editorRef.current.getMarkdown();
    setAllSections((prev) =>
      prev.map((entry, index) => {
        if (index !== currentSection - 1) {
          return entry;
        }
        return [entry[0], content];
      }),
    );

    let nextContent = "";
    if (allSections[sectionNum - 1]) {
      nextContent = allSections[sectionNum - 1][1];
    }
    //change the section
    setCurrentSection(sectionNum);
    //fill the editor with next section's content

    console.log("Next content", nextContent);

    if (nextContent.length === 0) {
      editorRef.current.setMarkdown(
        `## Write the content here...`,
      );
      return;
    }
    editorRef.current.setMarkdown(nextContent);
  }

  //delete sections
  function deleteSection(sectionNum) {
    if (allSections.length === 1) {
      showAlert("info", "Atleast one section should exist");
      return;
    }
    setAllSections((prev) =>
      prev.filter((_, index) => index !== sectionNum - 1),
    );
  }

  useEffect(() => {
    console.log(
      "All sections: ",
      allSections,
      "\nCurrentSection: ",
      currentSectionName,
    );
  }, [allSections, currentSectionName]);
  return (
    <>
      {/* Navigation Bar non-sticky*/}
      <NavWithSearch
        className={styles.navigationBar}
        sticky="true"
        sideMenuVisible={sideMenuToggleVisible}
        setSideMenuVisible={setSideMenuToggleVisible}
        selectedOption={"post"}
        withPostButton={false}
        sortDialogOpen={sortDialogOpen}
        setSortDialogOpen={setSortDialogOpen}
      />

      {showLeftSidebar && (
        <SectionsSidebar
          className={styles.sectionsSideBar}
          selectedOption={currentSectionName}
          sections={allSections}
          changeSection={changeSection}
          deleteSection={deleteSection}
          closeBtnFunction={handleCloseLeftSidebar}
        />
      )}

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
              <div className={styles.headerContainer}>
                <label className={`${"description"} ${styles.subHeading}`}>
                  Project Details
                </label>
              </div>

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
                          removeable={true}
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
                        setMarkdown(""); //discard previous markdown on URL change
                      }}
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
            <>
              {addSectionVisible && (
                <FullScreenDialog closeBtnFunction={handleAddSectionClose}>
                  <div className={styles.title}>New Section</div>
                  <div className={styles.itemsContainer}>
                    <div className={styles.items}>
                      <input
                        ref={addSectionInputRef}
                        value={newSectionName}
                        type="text"
                        placeholder="New Section"
                        onChange={(e) => setNewSectionName(e.target.value)}
                      ></input>
                      <Button
                        variant="secondaryBlack"
                        onClick={handleNewSectionAddClick}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                  <img src={addSectionGraphic} className={styles.graphic}></img>
                </FullScreenDialog>
              )}
              <div className={styles.formPart}>
                <div className={styles.headerContainer}>
                  <label className={`${"description"} ${styles.subHeading}`}>
                    Documentation Editor
                  </label>

                  <div
                    className={`${"description"} ${styles.viewAllSections}`}
                    onClick={handleViewAllSectionsClick}
                  >
                    <span className="material-symbols-outlined">toc</span>
                    <span>View all Sections</span>
                  </div>

                  <div className={styles.sectionNameAndAddSectionContainer}>
                    <div
                      className={`${"description"} ${styles.sectionsInfoContainer}`}
                    >
                      Section {currentSection}:
                      {!isRenaming && (
                        <>
                          <div
                            className={styles.sectionName}
                            onDoubleClick={handleSectionRename}
                            title="Double click to rename"
                          >
                            {currentSectionName}
                          </div>
                        </>
                      )}
                      {isRenaming && (
                        <input
                          type="text"
                          className={styles.sectionRename}
                          ref={renameInputRef}
                          value={newName} // as soon as the div is clicked, newName takes the value of the current section name via the function handleSectionRename
                          onChange={(e) => {
                            setNewName(e.target.value);
                          }} //this state does nothing, just for the value={} it is there
                          placeholder="rename"
                        ></input>
                      )}
                    </div>

                    <Button
                      variant="secondaryBlack"
                      onClick={handleAddSectionsClick}
                    >
                      Add Section
                    </Button>
                  </div>
                </div>

                <div className={styles.editorContainer}>
                  <div className={styles.editor}>
                    <MdEditor
                      initialMD={markdown} //markdown to get the content of readme
                      editorRef={editorRef}
                      handleEditorError={editorErrorHandler}
                    />
                  </div>

                  {/* Section Nav Buttons */}
                  <div className={styles.navButtons}>
                    {(currentSection > 1) && <Button variant="tertiaryWhite" onClick={() => {changeSection(currentSection - 1)}}>Previous</Button>}
                    {!((allSections.length > 1) && (currentSection === allSections.length)) && <Button variant="tertiaryBlack" status={(currentSection < allSections.length) ? "active" : "disabled"} onClick={() => changeSection(currentSection + 1)}>Next Section</Button>}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Buttons */}
          {part2Visible && (
            <>
              {/* Post and Back Button */}
              <div className={styles.postAndBackButtonContainer}>
                <div className={styles.button}>
                  <Button
                    variant="primaryWhiteLessPadding"
                    status="active"
                    onClick={() => {
                      setPart1Visible(true);
                      setPart2Visible(false);
                    }}
                  >
                    <span
                      className={`${"material-symbols-outlined"} ${styles.backButton}`}
                    >
                      arrow_back
                    </span>
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
              </div>
            </>
          )}

          {/* NEXT BUTTON */}
          {part1Visible && (
            <div className={styles.button}>
              <Button
                variant="primaryBlack"
                status={formNotEmpty && !submitting ? "active" : "disabled"}
                onClick={handleNext}
              >
                {submitting ? <BtnLoader /> : "Next"}
              </Button>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}
