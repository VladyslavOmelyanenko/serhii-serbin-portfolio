import React, { useMemo } from "react";
import styles from "./Project.module.css";

const Project = ({
  mediaSize,
  mediaType,
  imageUrl,
  trailerUrls,
  projectTitle,
  mediaOrientation,
  clickFunction,
  id,
  jumping,
}) => {
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

  const orderedTrailerUrls = useMemo(() => {
    const urls = (trailerUrls || []).filter(Boolean);

    const webm = urls.find((url) => /\.webm($|\?)/i.test(url));
    const mov = urls.find((url) => /\.(mov|mp4)($|\?)/i.test(url));

    if (prefersMovForTransparency) {
      return [mov, webm].filter(Boolean);
    }

    return [webm, mov].filter(Boolean);
  }, [trailerUrls, prefersMovForTransparency]);

  const mediaClassName =
    mediaOrientation === "horizontal"
      ? jumping
        ? `${styles.horizontalMedia} ${styles.jumping}`
        : `${styles.horizontalMedia}`
      : jumping
        ? `${styles.verticalMedia} ${styles.jumping}`
        : `${styles.verticalMedia}`;

  return (
    <div
      className={`grid-item ${styles.project} ${styles[mediaSize]}`}
      onClick={clickFunction}
    >
      {mediaType !== "video" ? (
        <img
          id={id}
          src={imageUrl}
          alt={projectTitle}
          className={mediaClassName}
          preload="auto"
        />
      ) : (
        <video
          id={id}
          muted
          autoPlay
          loop
          playsInline
          className={mediaClassName}
          preload="auto"
        >
          {orderedTrailerUrls.map((src) =>
            /\.webm($|\?)/i.test(src) ? (
              <source src={src} key={src} type="video/webm" />
            ) : (
              <source src={src} key={src} />
            ),
          )}
        </video>
      )}

      <span className="project__title">{projectTitle}</span>
    </div>
  );
};

export default Project;
