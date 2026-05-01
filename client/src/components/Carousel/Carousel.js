import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./Carousel.module.css";

const Carousel = ({ images = [], firstImage, isMuted, onIndexChange }) => {
  const prefersMovForTransparency = useMemo(() => {
    if (typeof navigator === "undefined") return false;

    const ua = navigator.userAgent || "";
    const platform = navigator.platform || "";
    const maxTouchPoints = navigator.maxTouchPoints || 0;

    const isIOS = /iPhone|iPad|iPod/.test(ua);
    const isIPadOS = platform === "MacIntel" && maxTouchPoints > 1;
    const isSafariDesktop =
      /Safari/.test(ua) &&
      !/Chrome|CriOS|EdgiOS|Edg|OPR|Firefox|FxiOS/.test(ua);

    return isIOS || isIPadOS || isSafariDesktop;
  }, []);

  const normalizeVideoSources = (item) => {
    if (!Array.isArray(item)) return item;

    const urls = item.filter(Boolean);
    const webm = urls.find((url) => /\.webm($|\?)/i.test(url));
    const mov = urls.find((url) => /\.(mov|mp4)($|\?)/i.test(url));

    if (prefersMovForTransparency) {
      return [mov, webm].filter(Boolean);
    }

    return [webm, mov].filter(Boolean);
  };

  const mediaItems = useMemo(() => {
    const normalizedFirstImage = Array.isArray(firstImage)
      ? normalizeVideoSources(firstImage)
      : firstImage;

    return [normalizedFirstImage, ...images].filter(Boolean);
  }, [firstImage, images, prefersMovForTransparency]);

  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = useRef([]);
  const switchRef = useRef(null);

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

  const goToNext = () => {
    if (mediaItems.length <= 1) return;
    setActiveIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const goToPrevious = () => {
    if (mediaItems.length <= 1) return;
    setActiveIndex(
      (prev) => (prev - 1 + mediaItems.length) % mediaItems.length,
    );
  };

  const handleMediaClick = (e) => {
    e.stopPropagation();

    if (!switchRef.current || mediaItems.length <= 1) return;

    const rect = switchRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const midpoint = rect.width / 2;

    if (clickX < midpoint) {
      goToPrevious();
    } else {
      goToNext();
    }
  };

  return (
    <div className={styles.carousel}>
      <div
        ref={switchRef}
        className={`${styles.mediaSwitch} dontClose`}
        onClick={handleMediaClick}
        role="button"
        tabIndex={0}
        aria-label="Browse media"
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            goToPrevious();
          }
          if (e.key === "ArrowRight") {
            e.preventDefault();
            goToNext();
          }
        }}
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
                    item.map((src) =>
                      /\.webm($|\?)/i.test(src) ? (
                        <source src={src} key={src} type="video/webm" />
                      ) : (
                        <source src={src} key={src} />
                      ),
                    )
                  ) : (
                    <source
                      src={item}
                      {...(/\.webm($|\?)/i.test(item)
                        ? { type: "video/webm" }
                        : {})}
                    />
                  )}
                </video>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Carousel;
