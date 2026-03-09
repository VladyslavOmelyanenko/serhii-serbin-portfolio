// dependencies
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

// imports
import styles from "./Grid.module.css";
import Project from "./Project";
import Carousel from "./Carousel/Carousel";

const Grid = () => {
  let PROJECT_ID = "sv2kd5ay";
  let DATASET = "production";
  let GROQ_QUERY = `*[_type == "gridPage"]{
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

  let URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${encodeURIComponent(
    GROQ_QUERY,
  )}`;

  // variables
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

  // Intro flow: "card" -> "video" -> "off"
  const [introStage, setIntroStage] = useState("card");
  const endIntroVideo = () => setIntroStage("off");

  const videoRef = useRef(null);
  const gridRef = useRef(null);
  const activeProjectRef = useRef(null);

  const about = data?.aboutMedia;

  const location = useLocation();
  const navigate = useNavigate();
  const { projectId } = useParams();

  const isAboutActive = location.pathname === "/about";

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
    if (!event.target.className.includes("dontClose")) {
      setActiveProject(null);
      navigate("/");
    }
  };

  // Fetch data
  useEffect(() => {
    fetch(URL)
      .then((res) => res.json())
      .then(({ result }) => {
        setData(result[0]);
        setProjects(
          result[0].projects.map((project, i) => ({ ...project, order: i })),
        );
      })
      .catch((err) => console.error(err));
  }, [URL]);
useEffect(() => {
  if (activeProject?.isCarousel) {
    const total = 1 + (activeProject.slideFiles?.[0]?.slides?.length || 0);

    setCarouselMeta({
      index: 1,
      total,
    });
  } else {
    setCarouselMeta({ index: 1, total: 1 });
  }
}, [activeProject]);

  useEffect(() => {
    // CLOSE ON ESCAPE
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        navigate("/");
      }
    };

    // CHECK IF MOBILE
    const handleResize = () => {
      setIsMobile(window.innerWidth < 850);
    };

    handleResize();

    // GET ACTIVE PROJECT FROM URL
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

    if (isMobile) {
      if (fetchedActiveProject) {
        const toScroll = window.scrollY;
        gridRef.current.style.position = "fixed";
        gridRef.current.style.top = `-${toScroll}px`;
      } else {
        const windowScroll = -gridRef.current.style.top.replaceAll("px", "");
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

  // Distribute left/right
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
      {/* INTRO CARD (starts first) */}
      {/* {introStage === "card" && (
        <div className={styles.welcomeOverlay}>
          <div
            className={styles.welcomeCard}
            onClick={(e) => e.stopPropagation()}
          >
            {!data ? (
              <p>Loading…</p>
            ) : (
              <>
                <h2>{data?.welcomeTitle || "Welcome"}</h2>

                {data?.welcomeText ? (
                  <PortableText
                    value={data.welcomeText}
                    components={{
                      marks: {
                        link: ({ value, children }) => {
                          const href = value?.href || "#";
                          const blank = value?.blank;
                          return (
                            <a
                              href={href}
                              target={blank ? "_blank" : undefined}
                              rel={blank ? "noopener noreferrer" : undefined}
                            >
                              {children}
                            </a>
                          );
                        },
                      },
                    }}
                  />
                ) : (
                  <p>Click enter to start.</p>
                )}

                <button
                  className={styles.welcomeButton}
                  onClick={startIntroVideo}
                  disabled={!data?.welcomeVideoUrl}
                  title={
                    !data?.welcomeVideoUrl
                      ? "No welcome video set in Sanity"
                      : ""
                  }
                >
                  {data?.welcomeButtonText || "Enter"}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* INTRO VIDEO (starts after Enter, ends then disappears) */}
      {introStage === "video" && data?.welcomeVideoUrl && (
        <div className={styles.welcomeVideoOverlay}>
          <video
            className={styles.welcomeVideo}
            autoPlay
            playsInline
            muted
            onEnded={endIntroVideo}
          >
            <source src={data.welcomeVideoUrl} />
          </video>
        </div>
      )}

      {/* Grid */}
      {projects && isMobile ? (
        <div className={styles.mobileGrid}>
          {mobileProjects.map((project, index) => (
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
              jumping={project.jumping ? true : false}
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
            {leftProjects.map((project, index) => (
              <Project
                clickFunction={(e) => handleClick(project, e)}
                key={index}
                mediaSize={project.size}
                mediaType={project.type}
                imageUrl={project.imageFileUrl}
                trailerUrls={[project.trailerWebmUrl, project.trailerMovUrl]}
                projectTitle={project.title}
                mediaOrientation={project.orientation}
                id={projects.indexOf(project)}
                jumping={project.jumping ? true : false}
              />
            ))}
          </div>
          <div className={styles.p50}>
            {rightProjects.map((project, index) => (
              <Project
                clickFunction={(e) => handleClick(project, e)}
                key={index}
                mediaSize={project.size}
                mediaType={project.type}
                imageUrl={project.imageFileUrl}
                trailerUrls={[project.trailerWebmUrl, project.trailerMovUrl]}
                projectTitle={project.title}
                mediaOrientation={project.orientation}
                id={projects.indexOf(project)}
                jumping={project.jumping ? true : false}
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

          <div className={styles.projectOverlayContent}>
            <section className={`${styles.projectMediaStage} dontClose`}>
              <div className={`${styles.projectMediaFrame} dontClose`}>
                {about?._type === "image" ? (
                  <img
                    src={about.url}
                    className={`${styles.projectOpenMedia} dontClose`}
                    alt="About"
                  />
                ) : about?.url ? (
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className={`${styles.projectOpenMedia} dontClose`}
                  >
                    <source src={about.url} type="video/quicktime" />
                  </video>
                ) : null}
              </div>

              <h2 className={`${styles.projectTitleUnderMedia} dontClose`}>
                <span>About</span>
              </h2>
            </section>

            <section className={`${styles.projectText} dontClose`}>
              <div className={styles.projectTextInner}>
                <p dangerouslySetInnerHTML={{ __html: data?.aboutText }} />
              </div>
            </section>
          </div>
        </div>
      )}
      {/* Active project */}
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
                      images={activeProject.slideFiles[0].slides}
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
                <span>{activeProject.title}</span>
                {activeProject.isCarousel && carouselMeta.total > 1 && (
                  <span className={styles.projectMediaCounter}>
                    {carouselMeta.index}/{carouselMeta.total}
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
              <div className={styles.projectTextInner}>
                <p
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
          </div>
        </div>
      )}
      {(activeProject || isAboutActive) && (
        <button
          type="button"
          className={styles.newCloseButton}
          onClick={(e) => {
            e.stopPropagation();
            setActiveProject(null);
            navigate("/");
          }}
          aria-label="Close project"
        >
          &#x2715;
        </button>
      )}
    </div>
  );
};

export default Grid;
