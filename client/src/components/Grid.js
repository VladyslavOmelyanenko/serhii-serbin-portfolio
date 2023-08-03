import React from "react";
import Masonry from 'react-masonry-css';
import { useEffect, useState } from "react";



const Grid = () => {
  const [projects, setProjects] = useState(null);


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
          setProjects(data);
        })
        .catch((error) => {
          console.error('Error while fetching projects:', error);
        });
      }
    fetchProjects();
  }, []);


  return (
    <div> 
      {projects && projects.map((project) => (
        <video key={project.id} src={'http://localhost:5000/media/' + project.mediaPath}></video>
      ))}
    </div>
  );
}

export default Grid;