import { About,  StarsCanvas } from ".";
import { useEffect, useState } from "react";

const Home = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div className="relative z-0 bg-primary">
      <div>
        <div>
          {/* <Navbar1 /> */}
          <About />
          {/* <KChart/> */}
          {/* <XDomainAirdrop /> */}
          {/* <Hero /> */}
          {/* <IPFS /> */}
        </div>
      </div>
      {/* <div style={{ zIndex: "999" }}>
        <StarsCanvas />
      </div> */}
    </div>
  );
};

export default Home;
