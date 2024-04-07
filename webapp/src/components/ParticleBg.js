import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import particles from "../data/particles.json";
import { loadSlim } from "@tsparticles/slim";

const ParticlesComponent = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  if (init) {
    return (
      <div data-testid="tsparticles" style={{ zIndex: -1 }}>
        <Particles
          id="tsparticles"
          options={particles}
        />
      </div>
    );
  }

  return <></>;
};

export default ParticlesComponent;