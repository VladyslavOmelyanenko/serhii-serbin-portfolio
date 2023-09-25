import React, { useRef, useState } from 'react';

import Navbar from '../components/Navbar'

import styles from './CasePage.module.css';

const CasePage = (props) => {
  const containerRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const caseObject = props.caseObject;

  const handleScroll = () => {
    const container = containerRef.current;
    const videos = container.querySelectorAll('video');
    const center = container.offsetHeight / 2 + container.scrollTop;

    let closestVideo = null;
    let closestDistance = Infinity;

    videos.forEach(video => {
      const distance = Math.abs(video.offsetTop + video.offsetHeight / 2 - center);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestVideo = video;
      }
    });

    if (closestVideo) {
      videos.forEach(video => {
        if (video === closestVideo) {
          video.play();
        } else {
          video.pause();
        }
      });
    }
  }

  const handleMute = () => {
    setIsMuted(!isMuted);
  }


  return (
    <>
      <Navbar />
      <section>
        <div className={styles.casePage}>
          <div
            className={styles.images}
            ref={containerRef}
            onScroll={handleScroll}
          >
          <div className={styles.mute} onClick={() => handleMute()}>{(isMuted) ? "unmute" : "mute"}</div>
            {caseObject.images.map((image, i) =>
              image.includes(".webm") ? (
                <video
                  src={ caseObject.folder + "/" + image}
                  muted={isMuted}
                ></video>
              ) : (
                <img
                  src={caseObject.folder + "/" + image}
                  alt="i"
                ></img>
              )
            )}
          </div>
          <div className={styles.projectDescription}>
            <h1>{caseObject.title}</h1>
            <p>{caseObject.description}</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default CasePage;