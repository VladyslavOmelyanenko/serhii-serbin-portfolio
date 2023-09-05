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

  return (
    <div className={"grid-item " + styles.project + ' ' + styles[mediaSize]} onClick={clickFunction}>
      { (mediaType === "image") ? 
      <img 
        id={id} 
        src={mediaPath} 
        alt={projectTitle} 
        className={(mediaOrientation === "horizontal") ? styles.horizontalMedia : styles.verticalMedia}
      />
      : <video 
          id={id} 
          src={mediaPath} muted autoPlay loop 
          className={(mediaOrientation === "horizontal") ? styles.horizontalMedia : styles.verticalMedia} 
          // onMouseEnter={() => {document.getElementById(id).muted = false;}} 
          // onMouseLeave={() => document.getElementById(id).muted = true}
          >
        </video> }
      <pre className="project__title">{projectTitle}</pre>
    </div>
  );
};

export default Project;

