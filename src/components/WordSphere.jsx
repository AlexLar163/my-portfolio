import React, { useEffect } from "react";
import * as THREE from "three";
import wordsData from "@data/words.json";

const WordSphere = (props) => {
  const { width, height } = props;

  useEffect(() => {
    const mount = document.getElementById("word-sphere");
    const scene = createScene();
    const camera = createCamera(width, height);
    const renderer = createRenderer(width, height, mount);
    const spriteGroup = createSprites(scene);

    addMeridianSphere(scene);
    addWordsToSphere(spriteGroup);

    camera.position.z = 2.5;
    spriteGroup.rotation.x = 0.8;

    animate(renderer, scene, camera, spriteGroup);

    window.addEventListener("resize", () =>
      handleResize(camera, renderer, width, height)
    );

    return () => {
      window.removeEventListener("resize", () =>
        handleResize(camera, renderer, width, height)
      );
      mount.innerHTML = "";
    };
  }, [width, height]);

  return <div id="word-sphere" />;
};

const createScene = () => {
  return new THREE.Scene();
};

const createCamera = (width, height) => {
  return new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
};

const createRenderer = (width, height, mount) => {
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(width, height);
  mount.appendChild(renderer.domElement);
  return renderer;
};

const createSprites = (scene) => {
  const spriteGroup = new THREE.Group();
  scene.add(spriteGroup);
  return spriteGroup;
};

const addMeridianSphere = (scene) => {
  const radius = 1;
  const segments = 32;
  const material = new THREE.LineBasicMaterial({
    color: "#ffffff",
    transparent: true,
    opacity: 0.1,
  });

  // Crear meridianos
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    const geometry = new THREE.BufferGeometry();
    const points = [];

    for (let j = 0; j <= segments; j++) {
      const phi = (j / segments) * Math.PI;
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);
      points.push(new THREE.Vector3(x, y, z));
    }

    geometry.setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    scene.add(line);
  }

  // Crear paralelos
  for (let i = 0; i <= segments; i++) {
    const phi = (i / segments) * Math.PI;
    const geometry = new THREE.BufferGeometry();
    const points = [];

    for (let j = 0; j <= segments; j++) {
      const theta = (j / segments) * Math.PI * 2;
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);
      points.push(new THREE.Vector3(x, y, z));
    }

    geometry.setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    scene.add(line);
  }
};

const addWordsToSphere = (spriteGroup) => {
  const words = Object.values(wordsData).flat();
  const radius = 1.2; // Ajusta el radio para que los sprites estén fuera de la esfera

  words.forEach((item, i) => {
    const { word, color, icon } = item;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 200;
    canvas.height = 200;

    const drawText = () => {
      ctx.font = "600 24px 'Sora Variable'"; // Mejora la fuente
      ctx.fillStyle = color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.letterSpacing = "1px";

      // Dibuja el borde del texto
      ctx.strokeStyle = "white"; // Color del borde
      ctx.lineWidth = 1; // Ancho del borde
      ctx.strokeText(word, canvas.width / 2, canvas.height / 2);

      // Dibuja el texto relleno
      ctx.fillText(word, canvas.width / 2, canvas.height / 2);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMaterial);

      const phi = Math.acos(-1 + (2 * i) / words.length);
      const theta = Math.sqrt(words.length * Math.PI) * phi;

      sprite.position.set(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi)
      );
      spriteGroup.add(sprite);
    };

    drawText();
  });
};

const animate = (renderer, scene, camera, spriteGroup) => {
  const animateFrame = () => {
    requestAnimationFrame(animateFrame);
    // spriteGroup.rotation.y += 0.001;
    scene.rotation.y += 0.001; // Rotar la esfera de meridianos
    renderer.render(scene, camera);
    renderer.setClearColor(0x000000, 0);
  };
  animateFrame();
};

const handleResize = (camera, renderer, width, height) => {
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
};

export default WordSphere;
