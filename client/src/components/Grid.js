import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import styles from "./Grid.module.css";
import Project from "./Project";
import Carousel from "./Carousel/Carousel";

const Grid = () => {
  const PROJECT_ID = "sv2kd5ay";
  const DATASET = "production";

  const GROQ_QUERY = `*[_type == "gridPage"]{
    welcomeVideoEnabled,
    welcomeVideoLoop,
    welcomeVideoLayer,
    welcomeVideoFreezeOnEnd,
    "welcomeVideoWebmUrl": welcomeVideoWebm.asset->url,
    "welcomeVideoMovUrl": welcomeVideoMov.asset->url,
    aboutText,
    aboutMedia[0]{
      _type,
      "url": asset->url
    },
    projects[]->{
      title,
      links,
      description,
      orientation,
      type,
      size,
      jumping,
      toAbout,
      isCarousel,
      slideFiles[]->{
        "slides": slides[].asset->url
      },
      "imageFileUrl": imageFile.asset->url,
      "trailerWebmUrl": trailerWebm.asset->url,
      "trailerMovUrl": trailerMov.asset->url,
      "fullVideoWebmUrl": fullVideoWebm.asset->url,
      "fullVideoMovUrl": fullVideoMov.asset->url
    },
    copyright,
    email
  }`;

  const URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${encodeURIComponent(
    GROQ_QUERY,
  )}`;

  let jumpHandler;
  const leftProjects = [];
  const rightProjects = [];
  const mobileProjects = [];

  const [clickedOnce] = useState([]);
  const [projects, setProjects] = useState(null);
  const [activeProject, setActiveProject] = useState(null);
  const [emailActive, setEmailActive] = useState(false);
  const [data, setData] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 850);
  const [isMuted, setIsMuted] = useState(window.innerWidth < 850);
  const [carouselMeta, setCarouselMeta] = useState({ index: 1, total: 1 });
  const [welcomeVideoFinished, setWelcomeVideoFinished] = useState(false);

  const videoRef = useRef(null);
  const welcomeVideoRef = useRef(null);
  const gridRef = useRef(null);
  const activeProjectRef = useRef(null);

  const about = data?.aboutMedia;

  const location = useLocation();
  const navigate = useNavigate();
  const { projectId } = useParams();

  const isAboutActive = location.pathname === "/about";
  const isHome = location.pathname === "/";

  const preferMovForTransparency = (() => {
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
  })();

  const showWelcomeVideo =
    isHome &&
    !welcomeVideoFinished &&
    data?.welcomeVideoEnabled &&
    (data?.welcomeVideoWebmUrl || data?.welcomeVideoMovUrl);

  const getOrderedVideoUrls = (webmUrl, movUrl) => {
    if (preferMovForTransparency) {
      return [movUrl, webmUrl].filter(Boolean);
    }
    return [webmUrl, movUrl].filter(Boolean);
  };

  const renderVideoSources = (webmUrl, movUrl) => {
    if (preferMovForTransparency) {
      return (
        <>
          {movUrl && <source src={movUrl} />}
          {!movUrl && webmUrl && <source src={webmUrl} type="video/webm" />}
        </>
      );
    }

    return (
      <>
        {webmUrl && <source src={webmUrl} type="video/webm" />}
        {movUrl && <source src={movUrl} />}
      </>
    );
  };

  const getMiddleCoordinates = (containerElement) => {
    const rect = containerElement.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    const middleX = rect.left + scrollX + rect.width / 2;
    const middleY = rect.top + scrollY + rect.height / 2;
    return { x: middleX, y: middleY };
  };

  const jump = (img, order, stylesId = "") => {
    const areaNumber = 5;
    let min = +order - areaNumber;
    let max = +order + areaNumber;
    min = min < 1 ? 1 : min;
    max = max >= projects.length ? projects.length : max;
    let rangeNumber = Math.floor(Math.random() * (max - min) + min);

    while (rangeNumber === order) {
      rangeNumber = Math.floor(Math.random() * max + min);
    }

    let element = document.getElementById(rangeNumber);
    element = element.parentElement;

    const coordinates = getMiddleCoordinates(element);

    if (stylesId === "overheated") {
      img.style.left = coordinates.x + "px";
      img.style.top = coordinates.y - window.innerWidth * 0.17 * 0.7 + "px";
    } else if (stylesId === "cycling") {
      img.style.left = coordinates.x - window.innerWidth * 0.05 * 0.7 + "px";
      img.style.top = coordinates.y + "px";
    } else {
      img.style.left = coordinates.x - window.innerWidth * 0.17 * 0.7 + "px";
      img.style.top = coordinates.y - window.innerWidth * 0.17 * 0.45 + "px";
    }

    img.removeEventListener("click", jumpHandler);

    jumpHandler = () => jump(img, element.firstElementChild.id, stylesId);
    img.addEventListener("click", jumpHandler);
  };

  const handleCarouselIndexChange = useCallback((index, total) => {
    setCarouselMeta((prev) => {
      if (prev.index === index && prev.total === total) return prev;
      return { index, total };
    });
  }, []);

  const handleClick = (project, event) => {
    if (Array.from(event.target.classList).includes("jumpingImage")) {
      return;
    }

    if (project.jumping === true) {
      const image = document.getElementById(project.order);
      if (image == null) return;

      if (!emailActive) {
        const projectBlock = image.parentElement;
        const mailLink = document.createElement("div");
        mailLink.innerHTML = `<a style="color:black;" href="mailto:nibressergo@gmail.com" id=${project.order}>nibressergo@gmail.com</a>`;
        mailLink.style.height = "80%";
        mailLink.style.width = "100%";
        mailLink.style.textAlign = "center";
        mailLink.style.margin = "auto auto";
        mailLink.style.display = "flex";
        mailLink.style.border = "1px solid black";
        mailLink.style.alignItems = "center";
        mailLink.style.justifyContent = "center";
        mailLink.style.textTransform = "uppercase";

        projectBlock.prepend(mailLink);
        setEmailActive(true);
      }

      if (!clickedOnce.includes(project.order)) {
        image.remove();
        const img = document.createElement("img");
        img.classList += "jumpingImage";
        img.src = image.src;

        const startingBlock = document.getElementById(
          project.order,
        ).parentElement;
        const startingCoordinates = getMiddleCoordinates(startingBlock);

        gridRef.current.appendChild(img);
        img.style.left =
          startingCoordinates.x - window.innerWidth * 0.17 * 0.45 + "px";
        img.style.top =
          startingCoordinates.y - window.innerWidth * 0.17 * 0.45 + "px";

        setTimeout(() => {
          img.style.height = "calc(10vw * 0.9)";
          jump(img, project.order, project.title.split(" ")[0].toLowerCase());
        }, 100);

        clickedOnce.push(project.order);
      }
    } else if (project.toAbout === true) {
      navigate("about");
    } else {
      navigate(`${project.title}`);
    }
  };

  const closePage = (event) => {
    if (!String(event.target.className).includes("dontClose")) {
      setActiveProject(null);
      navigate("/");
    }
  };

  useEffect(() => {
    fetch(URL)
      .then((res) => res.json())
      .then(({ result }) => {
        const pageData = result?.[0] || null;
        setData(pageData);
        setProjects(
          (pageData?.projects || []).map((project, i) => ({
            ...project,
            order: i,
          })),
        );
      })
      .catch((err) => console.error(err));
  }, [URL]);

  useEffect(() => {
    setWelcomeVideoFinished(false);
  }, [
    data?.welcomeVideoEnabled,
    data?.welcomeVideoLoop,
    data?.welcomeVideoFreezeOnEnd,
    data?.welcomeVideoWebmUrl,
    data?.welcomeVideoMovUrl,
  ]);

  useEffect(() => {
    const overlayOpen = activeProject || isAboutActive;

    if (!overlayOpen) return;

    const scrollY = window.scrollY;

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    return () => {
      const savedScrollY = document.body.style.top;

      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";

      window.scrollTo(0, Math.abs(parseInt(savedScrollY || "0", 10)));
    };
  }, [activeProject, isAboutActive]);

  useEffect(() => {
    if (activeProject?.isCarousel) {
      const total = 1 + (activeProject.slideFiles?.[0]?.slides?.length || 0);
      setCarouselMeta({ index: 1, total });
    } else {
      setCarouselMeta({ index: 1, total: 1 });
    }
  }, [activeProject]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        navigate("/");
      }
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 850);
    };

    handleResize();

    const fetchedActiveProject =
      projects &&
      projects.find(
        (project) =>
          project.title.toLowerCase().replaceAll("\n", "") ===
          decodeURIComponent(projectId || "").toLowerCase(),
      );

    setActiveProject(fetchedActiveProject);

    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    if (isMobile && gridRef.current) {
      if (fetchedActiveProject) {
        const toScroll = window.scrollY;
        gridRef.current.style.position = "fixed";
        gridRef.current.style.top = `-${toScroll}px`;
      } else {
        const topValue = gridRef.current.style.top || "0px";
        const windowScroll =
          Math.abs(parseInt(topValue.replace("px", ""), 10)) || 0;
        gridRef.current.style.position = "";
        gridRef.current.style.top = "";
        window.scrollTo(0, windowScroll);
      }
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [projectId, projects, navigate, isMobile]);

  const distributeProjects = (projectsArray) => {
    let leftHeight = 0;
    let rightHeight = 0;

    projectsArray.forEach((project) => {
      if (!isMobile) {
        if (Math.floor(leftHeight) <= Math.floor(rightHeight)) {
          leftProjects.push(project);
          leftHeight += project.size === "small" ? 0.5 : 2;
        } else {
          rightProjects.push(project);
          rightHeight += project.size === "small" ? 0.5 : 2;
        }
      } else {
        mobileProjects.push(project);
      }
    });
  };

  projects && distributeProjects(projects);

  return (
    <div ref={gridRef}>
      {showWelcomeVideo && (
        <div
          className={
            data?.welcomeVideoLayer === "back"
              ? styles.welcomeVideoBack
              : styles.welcomeVideoFront
          }
          aria-hidden="true"
        >
          <video
            ref={welcomeVideoRef}
            className={styles.welcomeVideo}
            autoPlay
            playsInline
            muted
            loop={!!data?.welcomeVideoLoop}
            preload="auto"
            onEnded={() => {
              if (data?.welcomeVideoLoop) return;

              if (data?.welcomeVideoFreezeOnEnd) {
                if (welcomeVideoRef.current) {
                  welcomeVideoRef.current.pause();
                }
                return;
              }

              setWelcomeVideoFinished(true);
            }}
          >
            {renderVideoSources(
              data?.welcomeVideoWebmUrl,
              data?.welcomeVideoMovUrl,
            )}
          </video>
        </div>
      )}

      {projects && isMobile ? (
        <div className={styles.mobileGrid}>
          {mobileProjects.map((project) => (
            <Project
              clickFunction={(e) => handleClick(project, e)}
              key={project.order}
              mediaSize={project.size}
              mediaType={project.type}
              imageUrl={project.imageFileUrl}
              trailerUrls={getOrderedVideoUrls(
                project.trailerWebmUrl,
                project.trailerMovUrl,
              )}
              projectTitle={project.title}
              mediaOrientation={project.orientation}
              id={projects.indexOf(project)}
              jumping={project.jumping === true}
            />
          ))}
          <div className={styles.footer}>
            {data?.copyright}
            <br />
            <a href={`mailto:${data?.email}`}>{data?.email}</a>
          </div>
        </div>
      ) : (
        <div className={styles.grid}>
          <div className={styles.p50}>
            {leftProjects.map((project) => (
              <Project
                clickFunction={(e) => handleClick(project, e)}
                key={project.order}
                mediaSize={project.size}
                mediaType={project.type}
                imageUrl={project.imageFileUrl}
                trailerUrls={getOrderedVideoUrls(
                  project.trailerWebmUrl,
                  project.trailerMovUrl,
                )}
                projectTitle={project.title}
                mediaOrientation={project.orientation}
                id={projects.indexOf(project)}
                jumping={project.jumping === true}
              />
            ))}
          </div>

          <div className={styles.p50}>
            {rightProjects.map((project) => (
              <Project
                clickFunction={(e) => handleClick(project, e)}
                key={project.order}
                mediaSize={project.size}
                mediaType={project.type}
                imageUrl={project.imageFileUrl}
                trailerUrls={getOrderedVideoUrls(
                  project.trailerWebmUrl,
                  project.trailerMovUrl,
                )}
                projectTitle={project.title}
                mediaOrientation={project.orientation}
                id={projects.indexOf(project)}
                jumping={project.jumping === true}
              />
            ))}
          </div>

          <div className={styles.footer}>
            {data?.copyright}
            <br />
            <a href={`mailto:${data?.email}`}>{data?.email}</a>
          </div>
        </div>
      )}

      {isAboutActive && (
        <div className={styles.posFixed} onClick={closePage}>
          <div className={styles.blurredBackground}></div>

          <div className={styles.aboutOverlayContent}>
            <section className={`${styles.aboutIntro} dontClose`}>
              <div className={`${styles.aboutMediaSmall} dontClose`}>
                {about?._type === "image" ? (
                  <img
                    src={about.url}
                    className={`${styles.aboutOpenMedia} dontClose`}
                    alt="About"
                  />
                ) : about?.url ? (
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className={`${styles.aboutOpenMedia} dontClose`}
                  >
                    <source src={about.url} />
                  </video>
                ) : null}
              </div>

              <div className={`${styles.aboutTextCompact} dontClose`}>
                <div
                  className={styles.aboutTextInner}
                  dangerouslySetInnerHTML={{ __html: data?.aboutText }}
                />

                <div className={styles.aboutFooter}>
                  {data?.copyright}
                  <br />
                  <a href={`mailto:${data?.email}`}>{data?.email}</a>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

      {activeProject && (
        <div
          className={styles.posFixed}
          onClick={(event) => closePage(event)}
          id="activePage"
          ref={activeProjectRef}
        >
          <div className={styles.blurredBackground}></div>

          <div className={styles.projectOverlayContent}>
            <section className={`${styles.projectMediaStage} dontClose`}>
              <div className={`${styles.projectMediaFrame} dontClose`}>
                {activeProject.isCarousel ? (
                  <div className={styles.carousel}>
                    <Carousel
                      isMobile={isMobile}
                      images={activeProject.slideFiles?.[0]?.slides || []}
                      firstImage={
                        activeProject.type !== "image"
                          ? getOrderedVideoUrls(
                              activeProject.fullVideoWebmUrl,
                              activeProject.fullVideoMovUrl,
                            )
                          : activeProject.imageFileUrl
                      }
                      isMuted={isMuted}
                      onIndexChange={handleCarouselIndexChange}
                    />
                  </div>
                ) : activeProject.type === "image" ? (
                  <img
                    src={activeProject.imageFileUrl}
                    className={`${styles.projectOpenMedia} dontClose`}
                    alt={activeProject.title}
                  />
                ) : (
                  <video
                    id="video"
                    ref={videoRef}
                    autoPlay
                    loop
                    playsInline
                    muted={isMuted}
                    controls={isMobile}
                    onPlay={() => {
                      if (videoRef.current) {
                        videoRef.current.controls = false;
                      }
                    }}
                    className={`${styles.projectOpenMedia} dontClose`}
                  >
                    {renderVideoSources(
                      activeProject.fullVideoWebmUrl,
                      activeProject.fullVideoMovUrl,
                    )}
                  </video>
                )}
              </div>

              <h2 className={`${styles.projectTitleUnderMedia} dontClose`}>
                <span className="dontClose">{activeProject.title}</span>
                {activeProject.isCarousel && carouselMeta.total > 1 && (
                  <span className={styles.projectMediaCounter}>
                    [{carouselMeta.index}/{carouselMeta.total}]
                  </span>
                )}
              </h2>

              <span
                className={`${styles.muteButton} dontClose`}
                onClick={() => setIsMuted(!isMuted)}
              >
                {JSON.stringify(activeProject).includes("webm") ||
                JSON.stringify(activeProject).includes("mov") ||
                activeProject.type === "video"
                  ? isMuted
                    ? "Unmute"
                    : "Mute"
                  : ""}
              </span>
            </section>

            <section className={`${styles.projectText} dontClose`}>
              <div className={`${styles.projectTextInner} dontClose`}>
                <p
                  className="dontClose"
                  dangerouslySetInnerHTML={{
                    __html: activeProject.description,
                  }}
                />
                {activeProject.links && activeProject.links !== "" && (
                  <p
                    className="dontClose"
                    dangerouslySetInnerHTML={{ __html: activeProject.links }}
                  />
                )}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default Grid;
