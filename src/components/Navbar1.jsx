import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { styles } from "../styles";
import { navLinks } from "../constants";

const Navbar1 = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 150) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1366);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <nav
      className={`${
        styles.paddingX
      } w-full flex items-center py-2.5 fixed top-0 z-20 ${
        scrolled ? "bg-primary" : "bg-transparent"
      }`}
    >
      <div
        className="w-full flex justify-between items-center mx-auto"
        style={{
          marginLeft: isMobile ? "5%" : "15%",
          marginRight: isMobile ? "5%" : "15%",
        }}
      >
        <Link
          to="https://beeclub-v2.4everland.website/"
          className="flex items-center gap-2"
          onClick={() => {
            setActive("");
            window.scrollTo(0, 0);
          }}
        >
          {/* <img
            src={freefundLogo}
            alt="Free Fund"
            style={{
              marginTop: "-10px",
              marginBottom: "-10px",
              width: "80px",
              height: "80px",
            }}
          /> */}
          &nbsp;
          {!isMobile && (
            <p
              className="text-white text-[22px] font-bold cursor-pointer flex "
              style={{ color: "#ff0000" }}
            >
              Web3 &nbsp;
              <span>|</span> &nbsp;&nbsp;
              <span className="sm:block hidden" style={{ color: "#f00" }}>
                ChainAnalysis
              </span>
            </p>
          )}
        </Link>

        <ul className="list-none hidden sm:flex flex-row gap-8">
          {navLinks.map((nav) => (
            <li
              key={nav.id}
              className={`${
                active === nav.title ? "text-white" : "text-finally"
              } hover:text-white text-[17px] font-medium cursor-pointer`}
              onClick={() => setActive(nav.title)}
            >
              {nav.title === "Attribute" ? (
                <Link to="https://beeclub-attribute.4everland.website/">
                  {nav.title}
                </Link>
              ) : nav.title === "Volunteer" ? (
                <Link
                  to="https://beeclub-volunteer.4everland.website/"
                  id={nav.id}
                >
                  {nav.title}
                </Link>
              ) : nav.title === "Interact" ? (
                <Link
                  to="https://beeclub-interact.4everland.website/"
                  id={nav.id}
                >
                  {nav.title}
                </Link>
              ) : (
                <a href={`https://beeclub-v2.4everland.website/#${nav.id}`}>
                  {nav.title}
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar1;
