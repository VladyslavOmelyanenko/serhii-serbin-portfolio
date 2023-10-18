import React from "react";
import styles from './Project.module.css';


const Project = (props) => {

  
  const mediaSize = props.mediaSize;
  const mediaType = props.mediaType;
  const mediaPath = props.mediaPath;
  const projectTitle = props.projectTitle;
  const mediaOrientation = props.mediaOrientation;
  const clickFunction = props.clickFunction;
  const id = props.id;
  const jumping = props.jumping;


  return (
    <div
      className={"grid-item " + styles.project + " " + styles[mediaSize]}
      onClick={clickFunction}
    >
      {mediaType === "image" ? (
        <img
          id={id}
          src={"/images/" + mediaPath}
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
          <source src={'/trailersmov/' + mediaPath + '.mov'}></source>
          <source src={'/trailerswebm/' + mediaPath + '.webm'}></source>
        </video>
      )}
      <pre className="project__title">{projectTitle}</pre>
    </div>
  );
};

export default Project;

