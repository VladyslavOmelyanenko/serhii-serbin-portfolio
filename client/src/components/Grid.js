// dependencies

import React from "react";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';


//imports

import styles from './Grid.module.css';
import Project from "./Project";



const Grid = () => {

  //variables

  const [projects, setProjects] = useState(null);
  const [activeProject, setActiveProject] = useState(null);

  const location = useLocation();
  const isAboutActive = location.pathname === "/about";
  const serverUrl = 'https://servertest264895.onrender.com';

  const videoRef = useRef(null);

  const navigate = useNavigate();
  const { projectId } = useParams();  

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

  const handleClick = (project) => {
    navigate(`${project.projectTitle}`);
  }


  // Fetch the data and if there is an active project set it

  useEffect(() => {
    const fetchProjects = async () => {
      fetch(serverUrl + '/api/projects')
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Failed to fetch projects:', response.status, response.statusText);
          }
        })
        .then((data) => {
          setProjects(data.sort((project1, project2) => +project1.order - +project2.order));
        })
        .catch((error) => {
          console.error('Error while fetching projects:', error);
        });
      }
    fetchProjects();
    projects && setActiveProject(projects.find((project) => project.projectTitle.toLowerCase().replaceAll('\n', '') === decodeURIComponent(projectId).toLowerCase()));
  }, [projectId, projects]);


  // Distribute left column and right

  const leftProjects = [];
  const rightProjects = [];

  const distributeProjects = (projectsArray) => {

    let leftHeight = 0;
    let rightHeight = 0;

    projectsArray.forEach((project) => {
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
      {isAboutActive && (
        <div className={styles.posFixed}>
          <div className={styles.blurredBackground}></div>
          <h1 className={styles.projectTitle}>About</h1>
          <Link to="/">
            <button className={styles.closeButton}>x</button>
          </Link>
          <div className={styles.detailedProject}>
            <div className={styles.copiedMedia}>
            <video src={serverUrl + "/media/about.webm"} autoPlay loop className={styles.verticalCopy}></video>
            </div>
            <p className={styles.projectDescription} dangerouslySetInnerHTML={{ __html: aboutText }} >
            </p>
          </div>  
        </div>
      )}


      {/* Grid */}

      <div className={styles.grid}>
        <div className={styles.p50}>
          {leftProjects.map((project, index) => (
            <Project 
              clickFunction={(e) => {
                handleClick(project);
              } }
              key={index}
              mediaSize={project.mediaSize} 
              mediaType={project.mediaType}
              mediaPath={serverUrl + '/media/' + project.mediaPath}
              projectTitle={project.projectTitle}
              mediaOrientation={project.orientation}
              id={project.order}
            />
          ))}
        </div>
        <div className={styles.p50}>
          {rightProjects.map((project, index) => (
            <Project 
              clickFunction={(e) => {
                handleClick(project);
                }}
              key={index}
              mediaSize={project.mediaSize} 
              mediaType={project.mediaType}
              mediaPath={serverUrl + '/media/' + project.mediaPath}
              projectTitle={project.projectTitle}
              mediaOrientation={project.orientation}
              id={project.order}
            />
          ))}
        </div>
      </div>


      {/* If there is an active project */}

      {activeProject && (
        <div className={styles.posFixed}>

          <div className={styles.blurredBackground}></div>
          <h1 className={styles.projectTitle}>{activeProject.projectTitle}</h1>
          <Link to="/">
            <button className={styles.closeButton}>x</button>
          </Link>

          <div className={styles.detailedProject}>

            <div className={styles.copiedMedia}>
              {(activeProject.mediaType==='image') ? 
                (<img 
                  src={serverUrl + '/media/' + activeProject.mediaPath} 
                  className={(activeProject.orientation === 'horizontal') ? styles.horizontalCopy : styles.verticalCopy} 
                  alt="active project"/>)
                : (<video 
                  ref={videoRef} 
                  src={serverUrl + '/media/' + activeProject.mediaPath} 
                  autoPlay controls loop 
                  className={(activeProject.orientation === 'horizontal') ? styles.horizontalCopy : styles.verticalCopy}>
                  </video>)}
            </div>

            <div className={styles.projectDescription}>
              <p>
                  {activeProject.description}
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