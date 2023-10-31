import React from "react";
import styles from './Project.module.css';


const Project = (props) => {

  const {
    mediaSize,
    mediaType,
    imageUrl,
    trailerUrls,
    projectTitle,
    mediaOrientation,
    clickFunction,
    id,
    jumping,
  } = props

  return (
    <div
      className={"grid-item " + styles.project + " " + styles[mediaSize]}
      onClick={clickFunction}
    >
      {mediaType !== "video" ? (
        <img
          id={id}
          src={imageUrl}
          alt={projectTitle}
          className={
            mediaOrientation === "horizontal"
              ? jumping
                ? `${styles.horizontalMedia} ${styles.jumping}`
                : `${styles.horizontalMedia}`
              : jumping
              ? `${styles.verticalMedia} ${styles.jumping}`
              : `${styles.verticalMedia}`
          }
          preload="auto"
        />
      ) : (
        <video
          id={id}
          muted
          autoPlay
          loop
          playsInline
          className={
            mediaOrientation === "horizontal"
              ? jumping
                ? `${styles.horizontalMedia} ${styles.jumping}`
                : `${styles.horizontalMedia}`
              : jumping
              ? `${styles.verticalMedia} ${styles.jumping}`
              : `${styles.verticalMedia}`
          }
          preload="auto"
        >
          {trailerUrls.reverse().map((trailerUrl, i) => <source src={trailerUrl} key={i}></source>)}
        </video>
      )}
      <span className="project__title">{projectTitle}</span>
    </div>
  );
};

export default Project;

