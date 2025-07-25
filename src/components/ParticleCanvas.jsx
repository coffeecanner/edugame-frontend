import { useEffect, useRef } from "react";

export default function ParticleCanvas() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/gh/JulianLaval/canvas-particle-network/particle-network.min.js";
    script.async = true;

    script.onload = () => {
      if (window.ParticleNetwork && canvasRef.current) {
        new window.ParticleNetwork(canvasRef.current, {
          particleColor: "#eeeeee",
          background: "#1a252f",
          interactive: true,
          speed: "medium",
          density: 8000,
        });
      }
    };

    document.body.appendChild(script);
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ overflow: "hidden" }}
    >
      <div
        id="particle-canvas"
        ref={canvasRef}
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
}
