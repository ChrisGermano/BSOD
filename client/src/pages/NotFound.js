import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

const NotFound = () => {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const animationFrameIdRef = useRef(null);
    const monitorRef = useRef(null);

    useEffect(() => {
        // Clean up any existing Three.js canvas
        const cleanupExistingCanvas = () => {
            const existingCanvas = document.querySelector('canvas');
            if (existingCanvas && existingCanvas.parentNode) {
                try {
                    existingCanvas.parentNode.removeChild(existingCanvas);
                } catch (e) {
                    console.warn('Error removing existing canvas:', e);
                }
            }
        };

        cleanupExistingCanvas();

        // Scene setup
        const scene = new THREE.Scene();
        sceneRef.current = scene;
        
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        rendererRef.current = renderer;
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Only append if mountRef exists
        if (mountRef.current) {
            mountRef.current.appendChild(renderer.domElement);
        }

        // Add blue floor
        const floorSize = 20;
        const floorGeometry = new THREE.PlaneGeometry(floorSize, floorSize);
        const floorMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x0000FF,
            side: THREE.DoubleSide,
            metalness: 0.3,
            roughness: 0.4
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = Math.PI / 2;
        floor.position.y = -5;
        scene.add(floor);

        // Add blue walls
        const wallMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x0000FF,
            side: THREE.DoubleSide,
            metalness: 0.3,
            roughness: 0.4
        });

        // Create walls
        const wallHeight = 50;
        const wallDepth = 0.1;

        // Back wall
        const backWall = new THREE.Mesh(
            new THREE.PlaneGeometry(floorSize, wallHeight),
            wallMaterial
        );
        backWall.position.z = -floorSize/2;
        scene.add(backWall);

        // Left wall
        const leftWall = new THREE.Mesh(
            new THREE.PlaneGeometry(floorSize, wallHeight),
            wallMaterial
        );
        leftWall.rotation.y = Math.PI/2;
        leftWall.position.x = -floorSize/2;
        scene.add(leftWall);

        // Right wall
        const rightWall = new THREE.Mesh(
            new THREE.PlaneGeometry(floorSize, wallHeight),
            wallMaterial
        );
        rightWall.rotation.y = -Math.PI/2;
        rightWall.position.x = floorSize/2;
        scene.add(rightWall);

        // Add white point light
        const pointLight = new THREE.PointLight(0xFFFFFF, 1000, 100);
        pointLight.position.set(0, 20, 10);
        scene.add(pointLight);

        // Add a visible light helper
        const lightHelper = new THREE.PointLightHelper(pointLight, 1);
        scene.add(lightHelper);

        // Load monitor model and add text
        const loader = new FBXLoader();
        const fontLoader = new FontLoader();
        
        // Load the font
        fontLoader.load(
            'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
            (font) => {
                // Create text geometry
                const textGeometry = new TextGeometry('404', {
                    font: font,
                    size: 5,
                    height: 0.2,
                });
                
                const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
                const text = new THREE.Mesh(textGeometry, textMaterial);
                
                // Center the text
                textGeometry.computeBoundingBox();
                const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
                text.position.x = 0;
                text.position.y = 0;
                text.position.z = -1; // Slightly in front of the monitor screen
                
                // Create a container for text
                const container = new THREE.Group();
                container.add(text);
                container.scale.set(0.2,0.2,0.02)
                container.position.set(2.3, -1.1, 0); // Same as monitor position
                container.rotation.y = 6; // Same as monitor rotation
                scene.add(container);
                
                // Load monitor
                loader.load(
                    '/monitor.fbx',
                    (object) => {
                        monitorRef.current = object;
                        object.scale.set(0.04, 0.04, 0.04);
                        object.rotation.y = -2;
                        object.position.set(5, -1, -5);
                        scene.add(object);
                    },
                    (xhr) => {
                        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                    },
                    (error) => {
                        console.error('An error happened loading the model:', error);
                    }
                );
            }
        );

        // Position camera further back
        camera.position.set(0, 0, 15);
        camera.lookAt(0, 0, 0);

        // Animation loop
        const animate = () => {
            animationFrameIdRef.current = requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();

        // Handle window resize
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };

        // Initial setup
        handleResize();
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            // Remove event listeners
            window.removeEventListener('resize', handleResize);

            // Cancel animation frame
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }

            // Clean up Three.js resources
            if (rendererRef.current) {
                rendererRef.current.dispose();
            }

            // Remove canvas from DOM if it exists
            if (mountRef.current && rendererRef.current && rendererRef.current.domElement) {
                try {
                    mountRef.current.removeChild(rendererRef.current.domElement);
                } catch (e) {
                    console.warn('Error removing canvas:', e);
                }
            }

            // Clear refs
            sceneRef.current = null;
            rendererRef.current = null;
            animationFrameIdRef.current = null;
            monitorRef.current = null;
        };
    }, []);

    return (
        <div 
            ref={mountRef} 
            style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                overflow: 'hidden'
            }} 
        />
    );
};

export default NotFound; 