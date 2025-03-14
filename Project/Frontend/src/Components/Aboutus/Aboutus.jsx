import React from "react";
import Navbar from "../Navbar/Navbar";
import "./Aboutus.css";

const AboutUs = () => {
  return (
    <div className="aboutus-container">
      {/* Navbar */}
      <Navbar />

      {/* هيدر الصفحة مع الصورة */}
      <header className="aboutus-header">
        <div className="overlay"></div>
        <img src="/images/img2.jpeg" alt="Hacker Background" className="header-image" />
        <div className="header-content">
          <h1>
            Track, improve and <br />
            <span className="highlight">stay ahead of threats....</span>
          </h1>
        </div>
      </header>

      {/* محتوى الصفحة */}
      <section className="aboutus-content bg-[#051527]">
        <div className="content-box left">
          <h2>WHAT WE <span className="green">PROVIDE</span></h2>
          <p>
            "At <span className="highlight">X-HUNTER</span>, we are committed to delivering cutting-edge security
            solutions tailored to meet the unique needs of our clients."
          </p>
        </div>

        <div className="content-box right">
          <h2>HOW WE ARE <span className="green">DIFFERENT</span></h2>
          <p>
            "We stand out by challenging you with multi-level questions - pushing your
            <span className="highlight"> skills</span> from beginner to expert, one step at a time."
          </p>
        </div>

        <div className="content-box left">
          <h2>WHO WE <span className="green">HELP</span></h2>
          <p>
            "We help students, security enthusiasts, professionals, and businesses of all sizes to build stronger defenses and
            excel in <span className="highlight">cybersecurity</span>."
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;