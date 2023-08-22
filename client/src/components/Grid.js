import React from "react";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, Link } from 'react-router-dom';

import styles from './Grid.module.css';

import Project from "./Project";



const Grid = () => {
  const [projects, setProjects] = useState(null);
  const [activeProject, setActiveProject] = useState(null);
  const [mediaCopy, setMediaCopy] = useState(null);

  const videoRef = useRef(null);

  const navigate = useNavigate();
  const { projectId } = useParams();  



  const handleClick = (project) => {
    navigate(`${project.projectTitle}`);
    const media = document.getElementById(project.order);
    setMediaCopy(media);
      if (videoRef.current) {
      videoRef.current.currentTime = mediaCopy.currentTime; // Set the desired time in seconds
    }
  }


  useEffect(() => {
    const fetchProjects = async () => {
      fetch('http://127.0.0.1:5000/api/projects')
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


  return (
    <div>
      {activeProject && (
        <div className={styles.posFixed}>
          <div className={styles.blurredBackground}></div>
          <h1 className={styles.projectTitle}>{activeProject.projectTitle}</h1>
          <Link to="/">
            <button className={styles.closeButton}>x</button>
          </Link>
          <div className={styles.detailedProject}>
             <div className={styles.copiedMedia}>
              {mediaCopy && (activeProject.mediaType==='image') ? 
              (<img src={mediaCopy.src} className={(activeProject.orientation === 'horizontal') ? styles.horizontalCopy : styles.verticalCopy} alt="active project"/>) :
              (<video ref={videoRef} src={mediaCopy.src} autoPlay loop className={(activeProject.orientation === 'horizontal') ? styles.horizontalCopy : styles.verticalCopy}></video>)}
            </div>
            <p className={styles.projectDescription}>
                {activeProject.description}
            </p>
          </div>  
        </div>
      )}
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
              mediaPath={'http://localhost:5000/media/' + project.mediaPath}
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
              mediaPath={'http://localhost:5000/media/' + project.mediaPath}
              projectTitle={project.projectTitle}
              mediaOrientation={project.orientation}
              id={project.order}
            />
          ))}
        </div>
      </div>
    </div>
    );
}

export default Grid;