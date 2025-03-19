import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Landpage.css";
import Navbar from "../Navbar/Navbar";

function Landpage() {
 
  const backgrounds = [
    "/images/img2.jpeg",
    "/images/img3.jpeg",
  
    "/images/img1.jpeg"
  ];
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, 10000);

    return () => clearInterval(timer);
  }, [backgrounds.length]);

  return (
  <>
   
    <div className="landpage-container">
     
      {backgrounds.map((bg, index) => (
        <div
          key={index}
          className={`bg-image ${index === currentBgIndex ? "active" : ""}`}
          style={{ backgroundImage: `url(${bg})` }}
        ></div>
      ))}


      <div className="overlay"></div>
      <div className="content">
        <h1>Your cybersecurity journey starts here.</h1>
        <p>
          Develop your skills with guided training and prove your expertise
          with industry certifications. Become a market-ready cybersecurity professional.
        </p>
        <div className="buttons">
          <Link to="/Login" className="btn btn-primary">
            Login
          </Link>
          <Link to="/Register" className="btn btn-secondary">
            Register
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}

export default Landpage;
