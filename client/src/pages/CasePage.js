import React, { useRef } from 'react';

import Navbar from '../components/Navbar'

import styles from './CasePage.module.css';

const CasePage = (props) => {
  const containerRef = useRef(null);
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
            {caseObject.images.map((image, i) =>
              image.includes(".mp4") ? (
                <video
                  src={"media/" + caseObject.folder + "/" + image}
                  muted
                ></video>
              ) : (
                <img
                  src={"media/" + caseObject.folder + "/" + image}
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