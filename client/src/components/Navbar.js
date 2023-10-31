import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';


import styles from './Navbar.module.css';


const Navbar = ({active}) => {

  const [isMobile, setIsMobile] = useState(window.innerWidth < 850);
  const navigate = useNavigate();


  useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 850);
      };

      handleResize();

    window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };

  });

  return (
    <nav className={styles.navbar}>
      <h1>
        <Link to='/' onClick={() => {
          if (!isMobile) {
            navigate('/')
            window.location.reload();
          }
          }}>Serhii serbin</Link>
      </h1>
      <div className={styles.links}>
        <Link to="/about">about</Link>
      </div>
    </nav>
  );
}

export default Navbar;