import Button from "../../buttons/button";
import FullScreenDialog from "../../dialogBoxes/fullScreenDialog/fullScreenDialog";
import styles from "./sort.module.css";
import { useEffect, useState } from "react";

export default function Sort({ closeSortDialog, applied = true }) {
  const [appliedFilters, setAppliedFilters] = useState([]);

  const applyFilter = (filter) => {
    if (appliedFilters.includes(filter)) return;
    setAppliedFilters((prev) => [...prev, filter]);
  };

  const removeFilter = (e, filter) => {
    e.stopPropagation();
    setAppliedFilters((prev) =>
      prev.filter((f) => f !== filter),
    );
  };

  const basicFilters = [
    "Latest",
    "Solo Project",
    "Collaborations",
    "In progress",

  ];
  const tagFilters = ["ECE", "CSE", "Robotics", "CAD", "Research", "Mechanical"];

  return (
    <>
      <FullScreenDialog closeBtnFunction={closeSortDialog}>
        <div className={styles.title}>Filters</div>

        <div className={styles.filterContainer}>
        {/* <div className={styles.basicFilters}>
          {basicFilters.map((f, index) => (
            <div
              key={index}
              className={`${styles.filter} ${appliedFilters.includes(f) ? styles.filterApplied : ""}`}
              onClick={() => applyFilter(f)}
            >
              {f}
              {appliedFilters.includes(f) && (
                <span
                  className="material-symbols-outlined"
                  onClick={(e) => {
                    removeFilter(e, f);
                  }}
                >
                  close
                </span>
              )}
            </div>
          ))}
            
        </div> */}

        <div className={styles.hr}></div>
        <div className={styles.tagFilters}>
          {tagFilters.map((f, index) => (
            <div
              key={index}
              className={`${styles.filter} ${appliedFilters.includes(f) ? styles.filterApplied : ""}`}
              onClick={() => applyFilter(f)}
            >
              {f}
              {appliedFilters.includes(f) && (
                <span
                  className="material-symbols-outlined"
                  onClick={(e) => {
                    removeFilter(e, f);
                    console.log("removing");
                  }}
                >
                  close
                </span>
              )}
            </div>
          ))}
        </div>
        </div>
        <Button variant="secondaryBlack" className={styles.applyBtn}>Apply</Button>
      </FullScreenDialog>
    </>
  );
}
