"use client";
import { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const ParticlesBackground = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options: any = useMemo(
    () => ({
      background: {
        color: { value: "transparent" }, // Transparent so it sits on top of our black layer
      },
      fpsLimit: 300,
      interactivity: {
        events: {
          onHover: { enable: true, mode: "repulse" }, // MOUSE REPULSION ON
          onClick: { enable: true, mode: "push" },
        },
        modes: {
          repulse: { distance: 120, duration: 0.4 },
        },
      },
      particles: {
        color: { value: ["#3b82f6", "#8b5cf6", "#ec4899"] }, // Blue, Purple, Pink
        links: {
          color: "#ffffff",
          distance: 120,
          enable: true,
          opacity: 0.15, // Subtle connections
          width: 1,
        },
        move: {
          enable: true,
          speed: 1.5, // Moving reasonably fast
          direction: "none",
          random: true,
          straight: false,
          outModes: "bounce",
        },
        number: {
          value: 300, // Plenty of particles
          density: { enable: true, area: 800 },
        },
        opacity: { value: 0.8 },
        shape: { type: "circle" },
        size: { value: { min: 2, max: 4 } },
      },
      detectRetina: true,
    }),
    [],
  );

  if (!init) return null;

  return (
    <Particles id="tsparticles" className="w-full h-full" options={options} />
  );
};

export default ParticlesBackground;