// dependencies

import React from "react";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useLocation } from 'react-router-dom';


//imports

import styles from './Grid.module.css';
import Project from "./Project";
import projectsData from "../projects";




const Grid = () => {

  //variables

  // const [projects, setProjects] = useState(null);
  const [activeProject, setActiveProject] = useState(null);
  const [clickedOnce] = useState([]);
  const [addShovel, setAddShovel] = useState(true);

  const location = useLocation();
  const isAboutActive = location.pathname === "/about";
  // const serverUrl = 'https://serhii-serbin-portfolio-x7ayj.kinsta.app';
  // const serverUrl = 'http://localhost:5000';

  const videoRef = useRef(null);

  const navigate = useNavigate();
  const { projectId } = useParams();  
  const projects = projectsData.sort((proj1, proj2) => proj1.order - proj2.order);


  const aboutText = `I'm Serhii, a 23-year-old motion design artist with a passion for visual experiments and technology. Currently, I call Amsterdam home, working with the talented Wieden+Kennedy team.
While working on small experimental projects, I’m busy with big campaigns for Nike, Lexus, Puma, YSL, Evian, and Samsung. This dynamic balance keeps me on my toes and constantly inspired.
During my downtime, I enjoy travelling, exploring vintage markets and meeting funny people. And of course, I can't resist staying up-to-date with the latest gadgets and innovations.

Cool links:
My IG <a href="https://www.instagram.com/nibressergo/">(https://www.instagram.com/nibressergo/)</a>
Fav refs on Are.na  <a href="https://www.are.na/serhii-serbin/">(https://www.are.na/serhii-serbin)</a>
CV (boring) (link will be added later)
I like things…  (link will be added later)
OFFF Barcelona <a href="https://www.instagram.com/p/CdMdzCVlAdM/">(https://www.instagram.com/p/CdMdzCVlAdM)</a>
Adweek article <a href="https://www.adweek.com/agencies/ukrainian-thank-you-posters-global-support/">(https://www.adweek.com/agencies/ukrainian-thank-you-posters-global-support/)</a>
Adage article <a href="https://adage.com/creativity/work/ukrainian-creatives-have-created-artwork-thank-those-helping-nation/240748/">(https://adage.com/creativity/work/ukrainian-creatives-have-created-artwork-thank-those-helping-nation/240748)</a>

Email <a href="mailto:nibressergo@gmail.com">(nibressergo@gmail.com)</a>`;


  // Functions

  const JumpingImage = () => {
    let img;
    if (!addShovel) return false;
    if (addShovel) {
      let element = document.getElementById('10');
      element = element.parentElement;
      img = document.createElement('img');
      img.classList += 'jumpingImage';
      img.src = '/media/funny.png';
      img.style.height = '130px';
      img.style.width = 'auto';
      img.style.position = 'absolute';
      img.style.marginLeft = element.clientWidth/2 + 'px';
      img.style.marginTop = '60px';
      img.style.zIndex = '200'
      img.addEventListener('click', () => jump(img, element.firstElementChild.id));
      element.appendChild(img);
      setAddShovel(false);
    }
    
  }

  const jump = (image, order, stylesId='') => {
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

    const img = document.createElement('img');
    img.classList += 'jumpingImage';
    img.src = image.src;

    // if (stylesId == 'cycling') console.log('cycling');
    console.log(element.clientHeight);

    if (image.style.height === '') {
      img.style.height = '130px';
      img.style.width = 'auto';
      img.style.position = 'absolute';
      img.style.zIndex = '200';
      if (stylesId === 'cycling') {
        img.style.marginTop = element.clientHeight/2 + 'px';
      } if (stylesId === 'overheated') {
        img.style.marginTop = -element.clientHeight/1.2 + 'px';
        img.style.marginLeft = element.clientWidth/3 + 'px';
        
      }
    } else {
      img.style.height = image.style.height;
      img.style.width = image.style.width;
      img.style.position = image.style.position;
      img.style.zIndex = image.style.zIndex;
      img.style.marginTop = image.style.marginTop;
      img.style.marginLeft = image.style.marginLeft;
    }

    img.addEventListener('click', () => jump(img, element.firstElementChild.id));
    element.appendChild(img);
    image.remove();

  }
  
  const handleClick = (project, event) => {
    if (Array.from(event.target.classList).includes('jumpingImage')) {
      return;
    }

    if (project.jumping === true) {
      const image = document.getElementById(project.order);
      const projectBlock = image.parentElement;
      projectBlock.lastElementChild.innerHTML = 'Contact hours \n 08:00—17:00';
      const mailLink = document.createElement('div');
      mailLink.innerHTML = '<a style="color:black;" href="mailto:nibressergo@gmail.com">nibressergo@gmail.com</a>'
      mailLink.style.height = '80%';
      mailLink.style.margin = 'auto auto';
      mailLink.style.display = 'flex';
      mailLink.style.alignItems = 'center';
      mailLink.style.textTransform = 'uppercase';

      projectBlock.prepend(mailLink);
      if (!clickedOnce.includes(project.order)) {
        jump(image, project.order, project.projectTitle.split(' ')[0].toLowerCase());
        clickedOnce.push(project.order);
      };
      
    } else {
      navigate(`${project.projectTitle}`);
    }
  }

   const closePage = (event) => {
    const videoContainer = document.getElementById('copiedMedia');
    const textContainer = document.getElementById('projectDescription');

    console.log(videoContainer, textContainer)

    if (videoContainer.isEqualNode(event.target) || textContainer.isEqualNode(event.target)) {
      navigate('/');
    }
  }


 

  // Fetch the data and if there is an active project set it

  useEffect(() => {
    projects && setActiveProject(projects.find((project) => project.projectTitle.toLowerCase().replaceAll('\n', '') === decodeURIComponent(projectId).toLowerCase()));
  }, [projectId, projects]);


  // Distribute left column and right

  const leftProjects = [];
  const rightProjects = [];

  const distributeProjects = (projectsArray) => {

    let leftHeight = 0;
    let rightHeight = 0;

    projectsArray.forEach((project) => {
      console.log(leftProjects);
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
    })
  }
  projects && distributeProjects(projects);


  // DOM structure 

  return (


    // if about is active 

    <div>
      


      {/* Grid */}

      <div className={styles.grid}>
        <div className={styles.p50}>
          {leftProjects.map((project, index) => (
            <Project 
              clickFunction={(e) => {
                handleClick(project, e);
              } }
              key={index}
              mediaSize={project.mediaSize} 
              mediaType={project.mediaType}
              mediaPath={'/media/' + project.mediaPath}
              projectTitle={project.projectTitle}
              mediaOrientation={project.orientation}
              id={project.order}
              jumping={(project.jumping) ? true : false}
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
              mediaSize={project.mediaSize} 
              mediaType={project.mediaType}
              mediaPath={'/media/' + project.mediaPath}
              projectTitle={project.projectTitle}
              mediaOrientation={project.orientation}
              id={project.order}
              jumping={(project.jumping) ? true : false}
            />
          ))}
        </div>
      </div>

      {(document.getElementById('10')) && (addShovel) && JumpingImage()}

      {isAboutActive && (
        <div className={styles.posFixed} onClick={(event) => closePage(event)} >
          <div className={styles.blurredBackground}></div>
          <h1 className={styles.projectTitle}>About</h1>
          <div className={styles.detailedProject} id="projectDescription">
            <div className={styles.copiedMedia} id="copiedMedia">
              <video src={"/media/about.webm"} autoPlay loop className={styles.verticalCopy}></video>
            </div>
            <p className={styles.projectDescription} dangerouslySetInnerHTML={{ __html: aboutText }} >
            </p>
          </div>  
        </div>
      )}


      {/* If there is an active project */}

      {activeProject && (
        <div className={styles.posFixed} onClick={(event) => closePage(event)} id="activePage">

          <div className={styles.blurredBackground}></div>

          <div className={styles.detailedProject} id="projectDescription" >

            <div className={styles.copiedMedia} id="copiedMedia">
              {(activeProject.mediaType==='image') ?
                (<img 
                  src={'/media/' + activeProject.mediaPath} 
                  className={(activeProject.orientation === 'horizontal') ? styles.horizontalCopy : styles.verticalCopy }
                  alt="active project"
                />)
                : (<video 
                  id="video"
                  ref={ videoRef } 
                  src={'/media/' + activeProject.mediaPath} 
                  autoPlay loop playsInline 
                  className={(activeProject.orientation === 'horizontal') ? styles.horizontalCopy : styles.verticalCopy}>
                </video>)}
            </div>
            <div className={styles.projectDescription}>
              <h2 className={styles.projectTitle}>{activeProject.projectTitle}</h2>
              <p  dangerouslySetInnerHTML={{ __html: activeProject.description }}>
              </p>
              {(activeProject.link !== '') && (
                <a href={activeProject.link} target="blank">See full project</a>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
    );
}

export default Grid;