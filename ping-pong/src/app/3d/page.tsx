'use client'

import React, { useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export default function ThreeD() {
  useEffect(() => {


    const scene = new THREE.Scene();
    //create a new camera with positions and angles
    const camera = new THREE.PerspectiveCamera(50, 1.8, 0.1);

    //Keep track of the mouse position, so we can make the eye move
    // let mouseX = window.innerWidth / 2;
    // let mouseY = window.innerHeight / 2;

    //Keep the 3D object on a global variable so we can access it later
    let object: any;

    //Set which object to render
    let objToRender = 'eye';

    //Instantiate a loader for the .gltf file
    const loader = new GLTFLoader();

    //Load the file]
    console.log("HERE");
    loader.load(
      // `models/${objToRender}/scene.gltf`,
      "Render Image/arcade.gltf",
      function (gltf) {
        //If the file is loaded, add it to the scene
        object = gltf.scene;

        // Set properties of the loaded object
        // object.receiveShadow = true;

        scene.add(object);
      },
      function (xhr) {
        //While it is loading, log the progress
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      function (error) {
        //If there is an error, log it
        console.error(error);
      }
    );

    //Instantiate a new renderer and set its size
    const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true allows for the transparent background
    renderer.setSize(window.innerWidth, window.innerHeight);


    //Add the renderer to the DOM
    // Add the renderer to the DOM
    const container = document.getElementById("container3D");
    container.innerHTML = '';
    document.getElementById("container3D").appendChild(renderer.domElement);

    //Set how far the camera will be from the 3D model
    camera.position.z = 12;

    //Add lights to the scene, so we can actually see the 3D model
    const topLight = new THREE.DirectionalLight(0x9B33BC, 1); // (color, intensity)
    // const ambientLight = new THREE.AmbientLight(0x333333, 10);
    // topLight.position.set(0, 0, 0) //top-left-ish
    topLight.position.set(-1, 0, 1);
    // topLight.castShadow = true;
    // renderer.shadowMap.enabled = true;
    // topLight.castShadow = true;
    // object.receiveShadow = true;

    const ambientLight = new THREE.AmbientLight(0x333333, 12);
    scene.add(ambientLight);

    // const ambientLight = new THREE.AmbientLight(0x333333, objToRender === "dino" ? 5 : 1);
    scene.add(topLight);
    scene.add(ambientLight);

    //Render the scene
    function animate() {
      requestAnimationFrame(animate);
      //Here we could add some code to update the scene, adding some automatic movement

      //Make the eye move
      if (object && objToRender === "eye") {
        //I've played with the constants here until it looked good 
        // object.rotation.y = -3 + mouseX / window.innerWidth * 3;
        // object.rotation.x = -1.2 + mouseY * 2.5 / window.innerHeight;
        // object.rotation.y = 30
        // object.rotation.x = 19
        object.rotation.y = 36.2
        object.rotation.x = 20
        object.rotation.z = 0.3
      }
      renderer.setClearColor(0x444444); // Set a light gray background color

      renderer.render(scene, camera);
    }

    //Add a listener to the window, so we can resize the window and the camera
    // window.addEventListener("resize", function () {
    //   // camera.aspect = (window.innerWidth / window.innerHeight - (window.innerHeight * 2)) * -1;
    //   camera.updateProjectionMatrix();
    //   // renderer.setSize(window.innerWidth, window.innerHeight);

    // });

    //add mouse position listener, so we can make the eye move
    // document.onmousemove = (e) => {
    //   mouseX = e.clientX;
    //   mouseY = e.clientY;
    // }

    //Start the 3D rendering
    animate();

  }, []);
  return <div id="container3D" />;
}