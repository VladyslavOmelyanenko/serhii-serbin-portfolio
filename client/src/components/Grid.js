import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

// imports
import styles from "./Grid.module.css";
import Project from "./Project";
import Carousel from "./Carousel/Carousel";

const Grid = () => {
  const PROJECT_ID = "sv2kd5ay";
  const DATASET = "production";
  const GROQ_QUERY = `*[_type == "gridPage"]{
    welcomeTitle,
    welcomeText,
    welcomeButtonText,
    "welcomeVideoUrl": welcomeVideo.asset->url,
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
        slides,
        "slides": slides[].asset->.url
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
  const [isMuted, setIsMuted] = useState(isMobile);
  const [carouselMeta, setCarouselMeta] = useState({ index: 1, total: 1 });

  // Intro flow: "loading" -> "video" -> "off"
  const [introStage, setIntroStage] = useState("loading");
  const endIntroVideo = () => setIntroStage("off");

  const videoRef = useRef(null);
  const gridRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { projectId } = useParams();

  const about = data?.aboutMedia;
  const isAboutActive = location.pathname === "/about";
  const isHome = location.pathname === "/";

  const getMiddleCoordinates = (containerElement) => {
    const rect = containerElement.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    return {
      x: rect.left + scrollX + rect.width / 2,
      y: rect.top + scrollY + rect.height / 2,
    };
  };

  const jump = (img, order, stylesId = "") => {
    if (!projects?.length) return;

    const areaNumber = 5;
    let min = +order - areaNumber;
    let max = +order + areaNumber;

    min = min < 1 ? 1 : min;
    max = max >= projects.length ? projects.length : max;

    let rangeNumber = Math.floor(Math.random() * (max - min) + min);

    while (rangeNumber === order) {
      rangeNumber = Math.floor(Math.random() * (max - min) + min);
    }

    let element = document.getElementById(rangeNumber);
    if (!element) return;

    element = element.parentElement;
    if (!element) return;

    const coordinates = getMiddleCoordinates(element);

    if (stylesId === "overheated") {
      img.style.left = `${coordinates.x}px`;
      img.style.top = `${coordinates.y - window.innerWidth * 0.17 * 0.7}px`;
    } else if (stylesId === "cycling") {
      img.style.left = `${coordinates.x - window.innerWidth * 0.05 * 0.7}px`;
      img.style.top = `${coordinates.y}px`;
    } else {
      img.style.left = `${coordinates.x - window.innerWidth * 0.17 * 0.7}px`;
      img.style.top = `${coordinates.y - window.innerWidth * 0.17 * 0.45}px`;
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
      if (!image) return;

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
        )?.parentElement;
        if (!startingBlock || !gridRef.current) return;

        const startingCoordinates = getMiddleCoordinates(startingBlock);

        gridRef.current.appendChild(img);
        img.style.left = `${startingCoordinates.x - window.innerWidth * 0.17 * 0.45}px`;
        img.style.top = `${startingCoordinates.y - window.innerWidth * 0.17 * 0.45}px`;

        setTimeout(() => {
          img.style.height = "calc(10vw * 0.9)";
          jump(img, project.order, project.title.split(" ")[0].toLowerCase());
        }, 100);

        clickedOnce.push(project.order);
      }

      return;
    }

    if (project.toAbout === true) {
      navigate("/about");
      return;
    }

    navigate(`/${encodeURIComponent(project.title)}`);
  };

  const closeOverlay = (event) => {
    event?.stopPropagation?.();
    setActiveProject(null);
    navigate("/");
  };

  const closePage = (event) => {
    if (!event.target.closest(".dontClose")) {
      closeOverlay(event);
    }
  };

  // Fetch data
  useEffect(() => {
    fetch(URL)
      .then((res) => res.json())
      .then(({ result }) => {
        const pageData = result?.[0];
        if (!pageData) return;

        setData(pageData);
        setProjects(
          pageData.projects.map((project, i) => ({ ...project, order: i })),
        );

        if (
          pageData?.welcomeVideoUrl &&
          isHome &&
          !projectId &&
          !isAboutActive
        ) {
          setIntroStage("video");
        } else {
          setIntroStage("off");
        }
      })
      .catch((err) => console.error(err));
  }, [URL, isHome, projectId, isAboutActive]);

  // Lock background scroll when overlay is open
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

  // Carousel counter
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
        closeOverlay();
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

    setActiveProject(fetchedActiveProject || null);

    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    if (isMobile && gridRef.current) {
      if (fetchedActiveProject) {
        const toScroll = window.scrollY;
        gridRef.current.style.position = "fixed";
        gridRef.current.style.top = `-${toScroll}px`;
      } else {
        const windowScroll = -(gridRef.current.style.top || "0px").replaceAll(
          "px",
          "",
        );
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

  if (projects) {
    distributeProjects(projects);
  }

  return (
    <div ref={gridRef}>
      {/* Intro video */}
      {introStage === "video" && data?.welcomeVideoUrl && (
        <div className={styles.welcomeVideoOverlay}>
          <video
            className={styles.welcomeVideo}
            autoPlay
            playsInline
            muted
            preload="auto"
            onEnded={endIntroVideo}
          >
            <source src={data.welcomeVideoUrl} />
          </video>
        </div>
      )}

      {/* Grid */}
      {projects && isMobile ? (
        <div className={styles.mobileGrid}>
          {mobileProjects.map((project) => (
            <Project
              clickFunction={(e) => handleClick(project, e)}
              key={project.order}
              mediaSize={project.size}
              mediaType={project.type}
              imageUrl={project.imageFileUrl}
              trailerUrls={[project.trailerWebmUrl, project.trailerMovUrl]}
              projectTitle={project.title}
              mediaOrientation={project.orientation}
              id={projects.indexOf(project)}
              jumping={!!project.jumping}
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
                trailerUrls={[project.trailerWebmUrl, project.trailerMovUrl]}
                projectTitle={project.title}
                mediaOrientation={project.orientation}
                id={projects.indexOf(project)}
                jumping={!!project.jumping}
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
                trailerUrls={[project.trailerWebmUrl, project.trailerMovUrl]}
                projectTitle={project.title}
                mediaOrientation={project.orientation}
                id={projects.indexOf(project)}
                jumping={!!project.jumping}
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

      {/* About */}
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
                    <source src={about.url} type="video/quicktime" />
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

      {/* Active project */}
      {activeProject && (
        <div className={styles.posFixed} onClick={closePage} id="activePage">
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
                          ? [
                              activeProject.fullVideoMovUrl,
                              activeProject.fullVideoWebmUrl,
                            ]
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
                      if (videoRef.current) videoRef.current.controls = false;
                    }}
                    className={`${styles.projectOpenMedia} dontClose`}
                  >
                    <source
                      src={activeProject.fullVideoMovUrl}
                      type='video/mp4; codecs="hvc1"'
                    />
                    <source
                      src={activeProject.fullVideoWebmUrl}
                      type="video/webm"
                    />
                  </video>
                )}
              </div>

              <h2 className={`${styles.projectTitleUnderMedia} dontClose`}>
                {activeProject.isCarousel && carouselMeta.total > 1 && (
                  <span className={styles.projectMediaCounter}>
                    {carouselMeta.index}/{carouselMeta.total}
                  </span>
                )}
                <span className="dontClose">{activeProject.title}</span>
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
                    dangerouslySetInnerHTML={{ __html: activeProject.links }}
                  />
                )}
              </div>
            </section>

            <section className={`${styles.overlayFooter} dontClose`}>
              {data?.copyright}
              <br />
              <a href={`mailto:${data?.email}`}>{data?.email}</a>
            </section>
          </div>
        </div>
      )}

      {(activeProject || isAboutActive) && (
        <button
          type="button"
          className={styles.newCloseButton}
          onClick={closeOverlay}
          aria-label="Close project"
        >
          &#x2715;
        </button>
      )}
    </div>
  );
};

export default Grid;
