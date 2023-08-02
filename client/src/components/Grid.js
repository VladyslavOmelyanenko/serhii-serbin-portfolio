import React from "react";
import Masonry from 'react-masonry-css';


const Grid = () => {

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
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      {items.map(item => (
        <div key={item.id}>{item.content}</div>
      ))}
    </Masonry>
  );
}

export default Grid;