import React, { useRef } from "react";
import styles from "./Carousel.module.css";

const Carousel = ({ images, firstImage, isMuted, isMobile }) => {

  const track = useRef(null);
  const videoRef = useRef(null);

  const getClosestImageToCenter = (side) => {
    const slides = Array.from(track.current.children);

    if (slides.length === 0) {
      return null; // No images or videos found in the container
    }

    const containerRect = track.current.getBoundingClientRect();
    const containerCenterX =
      containerRect.width/2 + track.current.scrollLeft;

    let closestImage = null;
    let minDistance = Infinity;

    slides.forEach((element) => {
      const elementRect = element.getBoundingClientRect();
      const elementCenterX = elementRect.left + elementRect.width / 2 - containerRect.left + track.current.scrollLeft;

      // Calculate the distance from the element's center to the container's center
      const distance = Math.abs(elementCenterX - containerCenterX);
      // console.log(distance);
      if (
        (side === "right" && elementCenterX > containerCenterX) ||
        (side === "left" && elementCenterX < containerCenterX) 
      ) {
        if ((distance < minDistance) && (distance >= 5)) {
          closestImage = element;
          minDistance = distance;
        }
      } else if (side === "") {
          if (distance < minDistance) {
            closestImage = element;
            minDistance = distance;
          }
      }

    });

    return closestImage;
  };

  const moveImageToCenter = (side) => {
    const closestImage = getClosestImageToCenter(side);

    

    if (!closestImage) {
      console.log("No suitable image found to move.");
      return;
    }

    const containerRect = track.current.getBoundingClientRect();
    const imageRect = closestImage.getBoundingClientRect();
    let desiredScrollLeft = Math.round(
      imageRect.left -
      containerRect.left -
      containerRect.width / 2 +
      imageRect.width / 2);

      const startingScrollPos = track.current.scrollLeft;

    const scrollInterval = setInterval(() => {
      let scroll = track.current.scrollLeft;
      if (desiredScrollLeft <= 0) {
        scroll -= 20;
        if (+scroll - startingScrollPos <= desiredScrollLeft) {
          clearInterval(scrollInterval);
          track.current.scrollLeft = Math.round(startingScrollPos + desiredScrollLeft);
        } else track.current.scrollLeft = scroll;
      } else {
        scroll += 20;
        if (+scroll - startingScrollPos >= desiredScrollLeft){
          clearInterval(scrollInterval);
          track.current.scrollLeft = Math.round(startingScrollPos + desiredScrollLeft);
        } else track.current.scrollLeft = scroll;
      }

    }, 5)
  }

  const handleScroll = () => {
    const videos = track.current.querySelectorAll("video");

    const closestSlide = getClosestImageToCenter("");
    const closestVideo = closestSlide.querySelector("video");


    if (closestVideo) {
      videos.forEach((video) => {
        if (video === closestVideo) {
          video.controls = true;
          video.addEventListener('play', () => {
            video.controls = false;
          });
          video.play();
          video.controls = false;
        } else {
          video.pause();

        }
      });
    }


  }


  return (
    <div className={styles.carousel}>
      <button
        className={`${styles.carouselButton} dontClose`}
        onClick={() => console.log(moveImageToCenter("left"))}
      >
        &lt;
      </button>
      <div className={styles.carouselTrackContainer}>
        <ul
          className={styles.carouselTrack}
          ref={track}
          onScroll={() => handleScroll()}
        >
          <li className={styles.carouselSlide}>
            {firstImage.includes("webp") ||
            firstImage.includes("png") ||
            firstImage.includes("jpg") ||
            firstImage.includes("jpeg") ? (
              <img src={firstImage} alt={firstImage} />
            ) : (
              <video
                autoPlay
                ref={videoRef}
                loop
                playsInline
                className="dontClose"
                muted={isMuted}
                controls={isMobile}
                preload="auto"
                onPlay={() => {
                  videoRef.current.controls = videoRef.current && false;
                }}
              >
                {firstImage.map((src) => (
                  <source src={src}></source>
                ))}
              </video>
            )}
          </li>
          {images.map((image, i) =>
            image.includes("mp4") ||
            image.includes("mov") ||
            image.includes("webm") ? (
              <li key={i} className={styles.carouselSlide}>
                <video
                  muted={isMuted}
                  loop
                  playsInline
                  controls={true}
                  className="dontClose"
                  preload="metadata"
                  onPlay={() => {
                    videoRef.current.controls = videoRef.current && false;
                  }}
                >
                  <source src={image}></source>
                </video>
              </li>
            ) : (
              <li key={i} className={styles.carouselSlide}>
                <img src={image} alt={image} className="dontClose"></img>
              </li>
            )
          )}
        </ul>
      </div>
      <button
        className={`${styles.carouselButton} dontClose`}
        onClick={() => console.log(moveImageToCenter("right"))}
      >
        &gt;
      </button>
    </div>
  );
};

export default Carousel;
