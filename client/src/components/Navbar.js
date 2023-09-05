import React from "react";
import { Link } from 'react-router-dom';


import styles from './Navbar.module.css';


const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <h1>Serhii serbin</h1>  
      <div className={styles.links}>
        <Link to="/about">
         about
        </Link>
      </div>
    </nav>
  )
}

export default Navbar;