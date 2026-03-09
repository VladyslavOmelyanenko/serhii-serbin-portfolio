import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./Carousel.module.css";

const Carousel = ({ images = [], firstImage, isMuted, onIndexChange }) => {
  const mediaItems = useMemo(() => {
    return [firstImage, ...images].filter(Boolean);
  }, [firstImage, images]);

  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = useRef([]);

  const isVideo = (item) => {
    if (Array.isArray(item)) return true;
    if (typeof item !== "string") return false;
    return /\.(mp4|mov|webm)$/i.test(item);
  };

  const isImage = (item) => {
    if (typeof item !== "string") return false;
    return /\.(png|jpe?g|webp|gif|avif)$/i.test(item);
  };

  const firstImageKey = Array.isArray(firstImage)
    ? firstImage.join("|")
    : firstImage || "";

  const imagesKey = images.join("|");

  useEffect(() => {
    setActiveIndex(0);
  }, [firstImageKey, imagesKey]);

useEffect(() => {
  if (onIndexChange) {
    onIndexChange(activeIndex + 1, mediaItems.length);
  }
}, [activeIndex, mediaItems.length, onIndexChange]);

  useEffect(() => {
    mediaItems.forEach((item) => {
      if (isImage(item)) {
        const img = new Image();
        img.src = item;
      }
    });
  }, [mediaItems]);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;

      video.muted = isMuted;

      if (index === activeIndex) {
        const playPromise = video.play();
        if (playPromise?.catch) playPromise.catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [activeIndex, isMuted]);

  const goToNext = (e) => {
    e.stopPropagation();
    if (mediaItems.length <= 1) return;
    setActiveIndex((prev) => (prev + 1) % mediaItems.length);
  };

  return (
    <div className={styles.carousel}>
      <button
        type="button"
        className={`${styles.mediaSwitch} dontClose`}
        onClick={goToNext}
        aria-label="Next media"
      >
        {mediaItems.map((item, index) => {
          const key = Array.isArray(item) ? item.join("|") : item;
          const isActive = index === activeIndex;

          return (
            <div
              key={key}
              className={`${styles.carouselSlide} ${
                isActive ? styles.isActive : ""
              } dontClose`}
            >
              {isImage(item) ? (
                <img
                  src={item}
                  alt=""
                  className={`${styles.carouselMedia} dontClose`}
                  draggable="false"
                />
              ) : isVideo(item) ? (
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el;
                  }}
                  loop
                  playsInline
                  muted={isMuted}
                  preload="metadata"
                  className={`${styles.carouselMedia} dontClose`}
                >
                  {Array.isArray(item) ? (
                    item.map((src) => <source src={src} key={src} />)
                  ) : (
                    <source src={item} />
                  )}
                </video>
              ) : null}
            </div>
          );
        })}
      </button>
    </div>
  );
};

export default Carousel;
