import React from "react";

import styles from './Navbar.module.css';


const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <h1>Serhii serbin</h1>  
      <div className={styles.links}>
        <a>motion designer</a>
        <a>about</a>
      </div>
    </nav>
  )
}

export default Navbar;