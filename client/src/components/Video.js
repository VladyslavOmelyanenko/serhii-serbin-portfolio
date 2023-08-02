import React from "react";

const Video = (props) => {
  
  const mediaSize = props.mediaSize;
  const mediaType = props.mediaType;
  const mediaPath = props.mediaPath;
  const projectTitle = props.projectTitle;

  return (
    <div className={"grid-item project" + mediaSize}>
      { (mediaType === "image") ? <img path={mediaPath} alt={projectTitle} /> : <video path={mediaPath} muted autoPlay loop></video> }
      <span className="project__title">{projectTitle}</span>
    </div>
  );
};

export default Video;