import React from "react";

import Grid from '../components/Grid'


const ProjectsPage = () => {

  const items = [
     { id: 1, content: 'Item 1' },
     { id: 2, content: 'Item 2' },
     { id: 3, content: 'Item 3' },
     // Add more items as needed
   ];
  const breakpointColumnsObj = {
     default: 4,
     1100: 2,
     700: 1
  };

  return (
    <div>
      <nav><h1>Serhii Serbin</h1></nav>
      <Grid />
    </div>
  );
}

export default ProjectsPage;