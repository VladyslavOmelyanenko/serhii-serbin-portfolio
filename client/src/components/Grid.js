// dependencies

import React from "react";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useLocation } from 'react-router-dom';


//imports

import styles from './Grid.module.css';
import Project from "./Project";
// import projectsData from "../projects";
import Carousel from "./Carousel/Carousel";



const Grid = () => {
  let PROJECT_ID = "sv2kd5ay";
  let DATASET = "production";
  let GROQ_QUERY = `*[_type == "gridPage"]{
    aboutText,
    "aboutVideoWebmUrl": aboutVideoWebm.asset->url,
    "aboutVideoMovUrl": aboutVideoMov.asset->url,
    projects[]->{
      title,
      link,
      description,
      orientation,
      type,
      size,
      "imageFileUrl": imageFile.asset->url,
      "trailerWebmUrl": trailerWebm.asset->url,
      "trailerMovUrl": trailerMov.asset->url,
      "fullVideoWebmUrl": fullVideoWebm.asset->url,
      "fullVideoMovUrl": fullVideoMov.asset->url,
    }
  }`;

  let URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${encodeURIComponent(GROQ_QUERY)}`;

  //variables
  
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
  
  const videoRef = useRef(null);
  const gridRef = useRef(null);
  const activeProjectRef = useRef(null);  
  
  const location = useLocation();
  const navigate = useNavigate();
  const { projectId } = useParams();  


  const isAboutActive = location.pathname === "/about";
  // const projects = projectsData.sort((proj1, proj2) => proj1.order - proj2.order);

  const getMiddleCoordinates = (containerElement) => {
    const rect = containerElement.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    const middleX = rect.left + scrollX + rect.width / 2;
    const middleY = rect.top + scrollY + rect.height / 2;
    return { x: middleX, y: middleY };
  }

  const jump = (img, order, stylesId='') => {
    console.log('jumpiiiing');
    const areaNumber = 5;
    let min = +order - areaNumber;
    let max = +order + areaNumber;
    min = (min < 1) ? 1 : min; 
    max = (max >= projects.length) ? projects.length : max; 
    let rangeNumber = Math.floor(Math.random() * (max - min) + min);

    while (rangeNumber === order) {
      rangeNumber = Math.floor((Math.random() * max) + (min));
    } 
    
    let element = document.getElementById(rangeNumber);
    element = element.parentElement;
    
    const coordinates = getMiddleCoordinates(element);

    if (stylesId === 'overheated') {
       img.style.left = coordinates.x + "px";
       img.style.top = coordinates.y - window.innerWidth * 0.17 * 0.70 + "px";
    } else if (stylesId === 'cycling') {
      img.style.left = coordinates.x - window.innerWidth * 0.05 * 0.7 + "px";
      img.style.top = coordinates.y + "px";
    } else {
      img.style.left = coordinates.x - window.innerWidth * 0.17 * 0.7 + "px";
      img.style.top = coordinates.y - window.innerWidth * 0.17 * 0.45 + "px";
    }

    img.removeEventListener("click", jumpHandler);

      
    jumpHandler = () => jump(img, element.firstElementChild.id, stylesId);
    
    img.addEventListener('click', jumpHandler);
  }

  const handleClick = (project, event) => {
    if (Array.from(event.target.classList).includes('jumpingImage')) {
      return;
    }

    if (project.jumping === true) {
      const image = document.getElementById(project.order);
      if (image == null) {
        return;
      }
      if (!emailActive) {
        const projectBlock = image.parentElement;
        projectBlock.lastElementChild.innerHTML = 'text me when\nyou get here';
        const mailLink = document.createElement('div');
        mailLink.innerHTML = `<a style="color:black;" href="mailto:nibressergo@gmail.com" id=${project.order}>nibressergo@gmail.com</a>`
        mailLink.style.height = '80%';
        mailLink.style.margin = 'auto auto';
        mailLink.style.display = 'flex';
        mailLink.style.alignItems = 'center';
        mailLink.style.textTransform = 'uppercase';

        projectBlock.prepend(mailLink);
        setEmailActive(true);
      } 
      if (!clickedOnce.includes(project.order)) {
        image.remove();
        const img = document.createElement("img");
        img.classList += "jumpingImage";
        img.src = image.src;
        const startingBlock = document.getElementById(project.order).parentElement;
        const startingCoordinates = getMiddleCoordinates(startingBlock);
        gridRef.current.appendChild(img);
        img.style.left = startingCoordinates.x - window.innerWidth * 0.17 * 0.45  + "px";
        img.style.top = startingCoordinates.y - window.innerWidth * 0.17 * 0.45 + "px";


        setTimeout(
          () =>{
            img.style.height = 'calc(10vw * 0.9)';
            jump(img, project.order, project.projectTitle.split(" ")[0].toLowerCase())},
          100
        );

        clickedOnce.push(project.order);
      };
      
    } else if (project.toAbout === true) {
      navigate('about');
    }  else {
      navigate(`${project.title}`);
    } 
  }

   const closePage = (event) => {
    if (!event.target.className.includes('dontClose')) {
      navigate('/');
    }
  }

  // Fetch the data and if there is an active project set it

  useEffect(() => {
    fetch(URL)
      .then((res) => res.json())
      .then(({ result }) => {
        console.log(result[0]);
        setData(result[0]);
        setProjects(result[0].projects)
      })
      .catch((err) => console.error(err));
  }, [URL])

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
    }

    handleResize();

    // GET ACTIVE PROJECT FROM URL

    projects && setActiveProject(projects.find((project) => project.title.toLowerCase().replaceAll('\n', '') === decodeURIComponent(projectId).toLowerCase()));

    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);
  

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };

  }, [projectId, projects, navigate]);


  // Distribute left column and right

  const distributeProjects = (projectsArray) => {

    let leftHeight = 0;
    let rightHeight = 0;

    projectsArray.forEach((project) => {
      if (!isMobile) {
        if (Math.floor(leftHeight) <= Math.floor(rightHeight)) {
          leftProjects.push(project);
          if (project.mediaSize === 'small') {
            leftHeight += 0.5;
          } else {
            leftHeight += 2;
          }
        } else {
          rightProjects.push(project);
          if (project.mediaSize === 'small') {
            rightHeight += 0.5;
          } else {
            rightHeight += 2;
          }
        }
      } else {
        mobileProjects.push(project);
      }
    
    })
  }

  projects && distributeProjects(projects);

  // DOM structure 

  return (
    <div ref={gridRef}>
      {/* Grid */}

      {projects && isMobile ? (
        <div className={styles.mobileGrid}>
          {mobileProjects &&
            mobileProjects.map((project, index) => (
              <Project
                clickFunction={(e) => {
                  handleClick(project, e);
                }}
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
          <div className={styles.footer}>&copy; 2023 Serhii Serbin</div>
        </div>
      ) : (
        <div className={styles.grid}>
          <div className={styles.p50}>
            {leftProjects.map((project, index) => (
              <Project
                clickFunction={(e) => {
                  handleClick(project, e);
                }}
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
                clickFunction={(e) => {
                  handleClick(project, e);
                }}
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
          <div className={styles.footer}>&copy; 2023 Serhii Serbin</div>
        </div>
      )}

      {isAboutActive && (
        <div className={styles.posFixed} onClick={(event) => closePage(event)}>
          <div className={styles.blurredBackground}></div>
          <h1 className={styles.projectTitle}>About</h1>
          <div className={styles.detailedProject} id="projectDescription">
            <div
              className={`${styles.copiedMedia} ${styles.aboutMedia}`}
              id="copiedMedia"
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className={`${styles.verticalCopy} dontClose`}
              >
                <source src={data && data.aboutVideoWebmUrl}></source>
                <source src={data && data.aboutVideoMovUrl}></source>
              </video>
            </div>
            <p
              className={`${styles.projectDescription} dontClose`}
              dangerouslySetInnerHTML={{ __html: data && data.aboutText }}
            ></p>
          </div>
        </div>
      )}

      {/* If there is an active project */}

      {activeProject && (
        <div
          className={styles.posFixed}
          onClick={(event) => closePage(event)}
          id="activePage"
          ref={activeProjectRef}
        >
          <div className={styles.blurredBackground}></div>
          <div className={styles.detailedProject} id="projectDescription">
            <div className={styles.copiedMedia} id="copiedMedia">
              {activeProject.sliderFolder ? (
                <div className={styles.carousel}>
                  <Carousel
                    isMobile={isMobile}
                    images={activeProject.sliderImages}
                    folder={activeProject.sliderFolder + "/"}
                    firstImage={
                      activeProject.mediaType === "video"
                        ? "/mediamov/" + activeProject.mediaPath + ".mov"
                        : "/mediawebm/" + activeProject.mediaPath
                    }
                    isMuted={isMuted}
                  />
                </div>
              ) : activeProject.type === "image" ? (
                <img
                  src={activeProject.imageFileUrl}
                  className={
                    activeProject.orientation === "horizontal"
                      ? `${styles.horizontalCopy} dontClose`
                      : `${styles.verticalCopy} dontClose`
                  }
                  alt="active project"
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
                    videoRef.current.controls = videoRef.current && false;
                  }}
                  className={
                    activeProject.orientation === "horizontal"
                      ? `${styles.horizontalCopy} dontClose`
                      : `${styles.verticalCopy} dontClose`
                  }
                >
                  <source
                    src={activeProject.fullVideoMovUrl}
                    type='video/mp4; codecs="hvc1"'
                  ></source>
                  <source
                    src={activeProject.fullVideoWebmUrl}
                    type="video/webm"
                  ></source>
                </video>
              )}
              <span
                className={`${styles.muteButton} dontClose`}
                onClick={() => setIsMuted(!isMuted)}
              >
                {JSON.stringify(activeProject).includes("webm") ||
                JSON.stringify(activeProject).includes("mov") ||
                activeProject.mediaType === "video"
                  ? isMuted
                    ? "Unmute"
                    : "Mute"
                  : ""}
              </span>
            </div>

            <div className={styles.projectDescription}>
              <h2 className={`${styles.projectTitle} dontClose`}>
                {activeProject.title}
              </h2>
              <p
                className="dontClose"
                dangerouslySetInnerHTML={{ __html: activeProject.description }}
              ></p>
              {activeProject.link !== "" && (
                <a href={activeProject.link} className="dontClose">
                  See full project
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Grid;