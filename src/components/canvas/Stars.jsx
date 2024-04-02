import React, { useState, useRef, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import * as THREE from "three";

const Stars1 = (props) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(500), { radius: 1.2 })
  );

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#f272c8"
          size={0.0015}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
};

const Stars2 = (props) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(600), { radius: 1.2 })
  );

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 25;
    ref.current.rotation.y -= delta / 25;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          size={0.0015}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
};

const Stars3 = (props) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(600), { radius: 1.2 })
  );

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 50;
    ref.current.rotation.y -= delta / 75;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#0000ff"
          size={0.0015}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
};

const Stars4 = (props) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(600), { radius: 1.2 })
  );

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 120;
    ref.current.rotation.y -= delta / 180;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#cd05ff"
          size={0.0015}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
};

const Stars5 = (props) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(600), { radius: 1.2 })
  );

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 200;
    ref.current.rotation.y -= delta / 300;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#008800"
          size={0.0015}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
};


const Stars12 = (props) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(15), { radius: 1.2 })
  );
  const [earthTexture, setEarthTexture] = useState();

  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      "./Venus.png",
      (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        setEarthTexture(texture);
        console.log("Texture loaded successfully!");
      },
      (progress) => {
        console.log(`Loading progress: ${progress.loaded} / ${progress.total}`);
      },
      (error) => {
        console.log("Failed to load earth texture", error);
      }
    );
  }, []);

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 80;
    ref.current.rotation.y -= delta / 100;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        {earthTexture && (
          <PointMaterial
            transparent
            map={earthTexture}
            sizeAttenuation={true}
            size={0.03}
            depthWrite={false}
            color={0x777777}
            opacity={0.8}
          />
        )}
      </Points>
    </group>
  );
};

const Stars13 = (props) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(15), { radius: 1.2 })
  );
  const [earthTexture, setEarthTexture] = useState();

  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      "./saturn.png",
      (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        setEarthTexture(texture);
        console.log("Texture loaded successfully!");
      },
      (progress) => {
        console.log(`Loading progress: ${progress.loaded} / ${progress.total}`);
      },
      (error) => {
        console.log("Failed to load earth texture", error);
      }
    );
  }, []);

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 150;
    ref.current.rotation.y -= delta / 180;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        {earthTexture && (
          <PointMaterial
            transparent
            map={earthTexture}
            sizeAttenuation={true}
            size={0.25}
            depthWrite={false}
            opacity={0.38}
          />
        )}
      </Points>
    </group>
  );
};

const Stars14 = (props) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(15), { radius: 1.2 })
  );
  const [earthTexture, setEarthTexture] = useState();

  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      "./Jupiter.png",
      (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        setEarthTexture(texture);
        console.log("Texture loaded successfully!");
      },
      (progress) => {
        console.log(`Loading progress: ${progress.loaded} / ${progress.total}`);
      },
      (error) => {
        console.log("Failed to load earth texture", error);
      }
    );
  }, []);

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 100;
    ref.current.rotation.y -= delta / 150;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        {earthTexture && (
          <PointMaterial
            transparent
            map={earthTexture}
            sizeAttenuation={true}
            size={0.08}
            depthWrite={false}
            color={0x777777}
            opacity={0.8}
          />
        )}
      </Points>
    </group>
  );
};

const Stars15 = (props) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(15), { radius: 1.2 })
  );
  const [earthTexture, setEarthTexture] = useState();

  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      "./world.png",
      (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        setEarthTexture(texture);
        console.log("Texture loaded successfully!");
      },
      (progress) => {
        console.log(`Loading progress: ${progress.loaded} / ${progress.total}`);
      },
      (error) => {
        console.log("Failed to load earth texture", error);
      }
    );
  }, []);

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 80;
    ref.current.rotation.y -= delta / 120;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        {earthTexture && (
          <PointMaterial
            transparent
            map={earthTexture}
            sizeAttenuation={true}
            size={0.05}
            depthWrite={false}
            color={0x888888}
            opacity={0.7}
          />
        )}
      </Points>
    </group>
  );
};

const Stars17 = (props) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(25), { radius: 1.2 })
  );
  const [earthTexture, setEarthTexture] = useState();

  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      "./galaxy2.png",
      (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        setEarthTexture(texture);
        console.log("Texture loaded successfully!");
      },
      (progress) => {
        console.log(`Loading progress: ${progress.loaded} / ${progress.total}`);
      },
      (error) => {
        console.log("Failed to load earth texture", error);
      }
    );
  }, []);

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 1000;
    ref.current.rotation.y -= delta / 800;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        {earthTexture && (
          <PointMaterial
            transparent
            map={earthTexture}
            sizeAttenuation={true}
            size={0.1}
            depthWrite={false}
            color={0x888888}
            opacity={0.75}
          />
        )}
      </Points>
    </group>
  );
};

const Stars18 = (props) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(12), { radius: 1.2 })
  );
  const [earthTexture, setEarthTexture] = useState();

  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      "./galaxy3.png",
      (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        setEarthTexture(texture);
        console.log("Texture loaded successfully!");
      },
      (progress) => {
        console.log(`Loading progress: ${progress.loaded} / ${progress.total}`);
      },
      (error) => {
        console.log("Failed to load earth texture", error);
      }
    );
  }, []);

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 900;
    ref.current.rotation.y -= delta / 1200;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        {earthTexture && (
          <PointMaterial
            transparent
            map={earthTexture}
            sizeAttenuation={true}
            size={0.2}
            depthWrite={false}
            color={0x88888888}
            opacity={0.6}
          />
        )}
      </Points>
    </group>
  );
};

const Stars19 = (props) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(15), { radius: 1.2 })
  );
  const [earthTexture, setEarthTexture] = useState();

  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      "./galaxy4.png",
      (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        setEarthTexture(texture);
        console.log("Texture loaded successfully!");
      },
      (progress) => {
        console.log(`Loading progress: ${progress.loaded} / ${progress.total}`);
      },
      (error) => {
        console.log("Failed to load earth texture", error);
      }
    );
  }, []);

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 500;
    ref.current.rotation.y -= delta / 900;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        {earthTexture && (
          <PointMaterial
            transparent
            map={earthTexture}
            sizeAttenuation={true}
            size={0.24}
            depthWrite={false}
            color={0x888888}
            opacity={0.8}
          />
        )}
      </Points>
    </group>
  );
};

const Stars20 = (props) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(2), { radius: 1.2 })
  );
  const [earthTexture, setEarthTexture] = useState();

  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      "./galaxy5.png",
      (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        setEarthTexture(texture);
        console.log("Texture loaded successfully!");
      },
      (progress) => {
        console.log(`Loading progress: ${progress.loaded} / ${progress.total}`);
      },
      (error) => {
        console.log("Failed to load earth texture", error);
      }
    );
  }, []);

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 900;
    ref.current.rotation.y -= delta / 600;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        {earthTexture && (
          <PointMaterial
            transparent
            map={earthTexture}
            sizeAttenuation={true}
            size={0.2}
            depthWrite={false}
            color={0x888888}
            opacity={0.8}
          />
        )}
      </Points>
    </group>
  );
};

const Stars21 = (props) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(5), { radius: 1.2 })
  );
  const [earthTexture, setEarthTexture] = useState();

  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      "./Venus.png",
      (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        setEarthTexture(texture);
        console.log("Texture loaded successfully!");
      },
      (progress) => {
        console.log(`Loading progress: ${progress.loaded} / ${progress.total}`);
      },
      (error) => {
        console.log("Failed to load earth texture", error);
      }
    );
  }, []);

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 100;
    ref.current.rotation.y -= delta / 70;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        {earthTexture && (
          <PointMaterial
            transparent
            map={earthTexture}
            sizeAttenuation={true}
            size={0.08}
            depthWrite={false}
            color={0x777777}
            opacity={0.8}
          />
        )}
      </Points>
    </group>
  );
};

const Stars22 = (props) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(15), { radius: 1.2 })
  );
  const [earthTexture, setEarthTexture] = useState();

  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      "./saturn.png",
      (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        setEarthTexture(texture);
        console.log("Texture loaded successfully!");
      },
      (progress) => {
        console.log(`Loading progress: ${progress.loaded} / ${progress.total}`);
      },
      (error) => {
        console.log("Failed to load earth texture", error);
      }
    );
  }, []);

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 200;
    ref.current.rotation.y -= delta / 150;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        {earthTexture && (
          <PointMaterial
            transparent
            map={earthTexture}
            sizeAttenuation={true}
            size={0.5}
            depthWrite={false}
            opacity={0.38}
          />
        )}
      </Points>
    </group>
  );
};

const Stars23 = (props) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(5), { radius: 1.2 })
  );
  const [earthTexture, setEarthTexture] = useState();

  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      "./Jupiter.png",
      (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        setEarthTexture(texture);
        console.log("Texture loaded successfully!");
      },
      (progress) => {
        console.log(`Loading progress: ${progress.loaded} / ${progress.total}`);
      },
      (error) => {
        console.log("Failed to load earth texture", error);
      }
    );
  }, []);

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 120;
    ref.current.rotation.y -= delta / 175;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        {earthTexture && (
          <PointMaterial
            transparent
            map={earthTexture}
            sizeAttenuation={true}
            size={0.16}
            depthWrite={false}
            color={0x777777}
            opacity={0.8}
          />
        )}
      </Points>
    </group>
  );
};

const Stars24 = (props) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(5), { radius: 1.2 })
  );
  const [earthTexture, setEarthTexture] = useState();

  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      "./world.png",
      (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        setEarthTexture(texture);
        console.log("Texture loaded successfully!");
      },
      (progress) => {
        console.log(`Loading progress: ${progress.loaded} / ${progress.total}`);
      },
      (error) => {
        console.log("Failed to load earth texture", error);
      }
    );
  }, []);

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 80;
    ref.current.rotation.y -= delta / 120;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        {earthTexture && (
          <PointMaterial
            transparent
            map={earthTexture}
            sizeAttenuation={true}
            size={0.1}
            depthWrite={false}
            color={0x888888}
            opacity={0.7}
          />
        )}
      </Points>
    </group>
  );
};

const Stars25 = (props) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(50), { radius: 1.2 })
  );

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          size={0.0007}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
};

const Stars26 = (props) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(50), { radius: 1.2 })
  );

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 25;
    ref.current.rotation.y -= delta / 25;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color={"#0000ff"}
          size={0.0007}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
};

const Stars27 = (props) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(100), { radius: 1.2 })
  );

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 50;
    ref.current.rotation.y -= delta / 75;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#cd05ff"
          size={0.0007}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
};

const Stars28 = (props) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(100), { radius: 1.2 })
  );

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 120;
    ref.current.rotation.y -= delta / 180;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#008800"
          size={0.0007}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
};

const Stars29 = (props) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(100), { radius: 1.2 })
  );

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 200;
    ref.current.rotation.y -= delta / 300;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#f272c8"
          size={0.0007}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
};

const Stars30 = (props) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(60), { radius: 1.2 })
  );

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#0000ff"
          size={0.0007}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
};

const Stars31 = (props) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(80), { radius: 1.2 })
  );

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 25;
    ref.current.rotation.y -= delta / 25;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#cd05ff"
          size={0.0007}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
};

const Stars32 = (props) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(180), { radius: 1.2 })
  );

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 50;
    ref.current.rotation.y -= delta / 75;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#008800"
          size={0.0007}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
};

const Stars33 = (props) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(100), { radius: 1.2 })
  );

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 120;
    ref.current.rotation.y -= delta / 180;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#f272c8"
          size={0.0007}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
};

const Stars34 = (props) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(100), { radius: 1.2 })
  );

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 200;
    ref.current.rotation.y -= delta / 300;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          size={0.0007}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
};

const Stars35 = (props) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(50), { radius: 1.2 })
  );

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#cd05ff"
          size={0.0007}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
};

const Stars36 = (props) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(100), { radius: 1.2 })
  );

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 25;
    ref.current.rotation.y -= delta / 25;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#008800"
          size={0.0007}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
};

const Stars37 = (props) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(100), { radius: 1.2 })
  );

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 50;
    ref.current.rotation.y -= delta / 75;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#f272c8"
          size={0.0007}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
};

const Stars38 = (props) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(100), { radius: 1.2 })
  );

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 120;
    ref.current.rotation.y -= delta / 180;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          size={0.0007}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
};

const Stars39 = (props) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(100), { radius: 1.2 })
  );

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 200;
    ref.current.rotation.y -= delta / 300;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#0000ff"
          size={0.0007}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
};

const Stars40 = (props) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(60), { radius: 1.2 })
  );

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#008800"
          size={0.0007}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
};

const Stars41 = (props) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(50), { radius: 1.2 })
  );

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 25;
    ref.current.rotation.y -= delta / 25;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#f272c8"
          size={0.0007}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
};

const Stars42 = (props) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(100), { radius: 1.2 })
  );

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 50;
    ref.current.rotation.y -= delta / 75;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          size={0.0007}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
};

const Stars43 = (props) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(100), { radius: 1.2 })
  );

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 120;
    ref.current.rotation.y -= delta / 180;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#0000ff"
          size={0.0007}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
};

const Stars44 = (props) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(100), { radius: 1.2 })
  );

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 200;
    ref.current.rotation.y -= delta / 300;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#cd05ff"
          size={0.0007}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
};

const Stars45 = (props) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(100), { radius: 1.2 })
  );
  const [earthTexture, setEarthTexture] = useState();

  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      "./stone.png",
      (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        setEarthTexture(texture);
        console.log("Texture loaded successfully!");
      },
      (progress) => {
        console.log(`Loading progress: ${progress.loaded} / ${progress.total}`);
      },
      (error) => {
        console.log("Failed to load earth texture", error);
      }
    );
  }, []);

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 150;
    ref.current.rotation.y -= delta / 240;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        {earthTexture && (
          <PointMaterial
            map={earthTexture}
            sizeAttenuation={true}
            size={0.025}
            depthWrite={false}
          />
        )}
      </Points>
    </group>
  );
};

const StarsCanvas = () => (
  <div className="w-full h-auto absolute inset-0 z-[-1]">
    <Canvas camera={{ position: [0, 0, 1] }} gl={{ depth: true }}>
      <Suspense fallback={null}>
        <Stars1 />
        <Stars2 />
        <Stars3 />
        <Stars4 />
        <Stars5 />
        <Stars12 />
        <Stars13 />
        <Stars14 />
        <Stars15 />
        <Stars17 />
        <Stars18 />
        <Stars19 />
        <Stars20 />
        <Stars21 />
        <Stars22 />
        <Stars23 />
        <Stars24 />
        <Stars25 />
        <Stars26 />
        <Stars27 />
        <Stars28 />
        <Stars29 />
        <Stars30 />
        <Stars31 />
        <Stars32 />
        <Stars33 />
        <Stars34 />
        <Stars35 />
        <Stars36 />
        <Stars37 />
        <Stars38 />
        <Stars39 />
        <Stars40 />
        <Stars41 />
        <Stars42 />
        <Stars43 />
        <Stars44 />
        <Stars45 />
      </Suspense>

      <Preload all />
    </Canvas>
  </div>
);

export default StarsCanvas;
