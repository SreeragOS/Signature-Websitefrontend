import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadAll } from "tsparticles-all";

function ParticleBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadAll(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: false },
        background: { color: "#bfbfbf" },  // White background
        particles: {
          number: { value: 20 },
          color: { value: "#2b2b2b" },     // Dark particles
          size: { value: 5 },
          move: { enable: true, speed: 1 },
          links: {
            enable: true,
            color: "#2b2b2b",              // Dark links
            distance: 200
          },
        },
      }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none"
      }}
    />
  );
}

export default ParticleBackground;
