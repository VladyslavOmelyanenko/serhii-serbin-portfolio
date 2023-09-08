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
    <div className={"grid-item " + styles.project + ' ' + styles[mediaSize]} onClick={clickFunction}>
      { (mediaType === "image") ? 
      <img 
        id={id} 
        src={mediaPath} 
        alt={projectTitle} 
        className={(mediaOrientation === "horizontal") ? 
          (jumping) ? `${styles.horizontalMedia} ${styles.jumping}` : `${styles.horizontalMedia}` 
          : (jumping) ? `${styles.verticalMedia} ${styles.jumping}` : `${styles.verticalMedia}` }
        preload="none"
      />
      : <video 
          id={id} 
          src={mediaPath} muted autoPlay loop 
          className={(mediaOrientation === "horizontal") ? 
            (jumping) ? `${styles.horizontalMedia} ${styles.jumping}` : `${styles.horizontalMedia}` 
            : (jumping) ? `${styles.verticalMedia} ${styles.jumping}` : `${styles.verticalMedia}` }
          preload="none"
          // onMouseEnter={() => {document.getElementById(id).muted = false;}} 
          // onMouseLeave={() => document.getElementById(id).muted = true}
          >
        </video> }
      <pre className="project__title">{projectTitle}</pre>
    </div>
  );
};

export default Project;

