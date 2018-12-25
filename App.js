
import React from 'react';
import { AR, Asset } from 'expo';
import ExpoTHREE, { AR as ThreeAR } from 'expo-three'
import { View as GraphicsView } from 'expo-graphics'
import RibbonGroup from './RibbonGroup'
import * as THREE from 'three'
//import { Button } from './components';
require('./assets/components/GPUParticleSystem')

export default class App extends React.Component {

  constructor(props){
    super(props)
    this.onContextCreate = this.onContextCreate.bind(this)
    this.onRender = this.onRender.bind(this)
  }
  // options passed during each spawned
  options = {
    position: new THREE.Vector3(),
    positionRandomness: .3,
    velocity: new THREE.Vector3(),
    velocityRandomness: 1.5,
    color: 0xaa88ff,
    colorRandomness: .2,
    turbulence: .5,
    lifetime: 2,
    size: 50, //5
    sizeRandomness: 1
  }

  spawnerOptions = {
    spawnRate: 1500,
    horizontalSpeed: 1.0,
    verticalSpeed: 1.33,
    timeScale: 1
  }

  tick = 0
  clock = new THREE.Clock()

  componentDidMount() {
    // Turn off extra warnings
    //THREE.suppressExpoWarnings(true)
    ThreeAR.suppressWarnings()
  }
  
 
  render() {
    // You need to add the `isArEnabled` & `arTrackingConfiguration` props.
    // `isArRunningStateEnabled` Will show us the play/pause button in the corner.
    // `isArCameraStateEnabled` Will render the camera tracking information on the screen.
    // `arTrackingConfiguration` denotes which camera the AR Session will use. 
    // World for rear, Face for front (iPhone X only)
    return (
      <GraphicsView
        style={{ flex: 1 }}
        onContextCreate={this.onContextCreate}
        onRender={this.onRender}
        onResize={this.onResize}
        isArEnabled
        isArRunningStateEnabled
        isArCameraStateEnabled
        arTrackingConfiguration={AR.TrackingConfigurations.World}
      />
    );
  }

  onContextCreate = async ({ gl, scale: pixelRatio, width, height }) => {
    // This will allow ARKit to collect Horizontal surfaces
    AR.setPlaneDetection(AR.PlaneDetectionTypes.Horizontal)

    // Create a 3D renderer
    this.renderer = new ExpoTHREE.Renderer({
      gl,
      pixelRatio,
      width,
      height,
    });

    // We will add all of our meshes to this scene.
    this.scene = new THREE.Scene()
    // This will create a camera texture and use it as the background for our scene
    this.scene.background = new ThreeAR.BackgroundTexture(this.renderer)
    // Now we make a camera that matches the device orientation. 
    // Ex: When we look down this camera will rotate to look down too!
    this.camera = new ThreeAR.Camera(width, height, 0.01, 10000)
    this.camera.position.z = 150
    await this.configureParticles()
    THREE.ribbonGroup = new RibbonGroup(this.scene)
	  THREE.ribbonGroup.init()

}

  onRender = () => {
     // this._requestAnimationFrameID = requestAnimationFrame(thisrender);

      const now = 0.001 * global.nativePerformanceNow();
      const dt = typeof lastFrameTime !== 'undefined'
        ? now - lastFrameTime
        : 0.16666;



      let { spawnerOptions, clock } = this;
      var delta = dt * spawnerOptions.timeScale;
      this.tick += delta;


      if (this.tick < 0) this.tick = 0;

      if(this.particleSystem){
        if (delta > 0) {
          this.options.position.x = Math.sin(this.tick * spawnerOptions.horizontalSpeed) * 20;
          this.options.position.y = Math.sin(this.tick * spawnerOptions.verticalSpeed) * 10;
          this.options.position.z = Math.sin(this.tick * spawnerOptions.horizontalSpeed + spawnerOptions.verticalSpeed) * 5;
          for (var x = 0; x < spawnerOptions.spawnRate * delta; x++) {
            // Yep, that's really it.	Spawning particles is super cheap, and once you spawn them, the rest of
            // their lifecycle is handled entirely on the GPU, driven by a time uniform updated below
            this.particleSystem.spawnParticle(this.options);
          }
        }
       
       this.particleSystem.update(this.tick);
      }
      THREE.ribbonGroup.update()

      // stats.update();

      this.camera.lookAt(this.scene.position)

      
      this.renderer.render(this.scene, this.camera)
      lastFrameTime = now;
}



  configureParticles = async () => {
    var particleNoiseTex = await ExpoTHREE.createTextureAsync({
      asset: Expo.Asset.fromModule(require('./assets/images/perlin-512.png')),
    })
    var particleSpriteTex = await ExpoTHREE.createTextureAsync({
      asset: Expo.Asset.fromModule(require('./assets/images/particle2.png')),
    })
    // The GPU Particle system extends THREE.Object3D, and so you can use it
    // as you would any other scene graph component.	Particle positions will be
    // relative to the position of the particle system, but you will probably only need one
    // system for your whole scene
    
    this.particleSystem = new THREE.GPUParticleSystem({
      maxParticles: 500,
      particleNoiseTex,
      particleSpriteTex,
    })

    this.scene.add(this.particleSystem)
  }

  ///TODO: Build Options componnet
  configureStats = () => {
    // gui.add( options, "velocityRandomness", 0, 3 );
    // 	gui.add( options, "positionRandomness", 0, 3 );
    // 	gui.add( options, "size", 1, 20 );
    // 	gui.add( options, "sizeRandomness", 0, 25 );
    // 	gui.add( options, "colorRandomness", 0, 1 );
    // 	gui.add( options, "lifetime", .1, 10 );
    // 	gui.add( options, "turbulence", 0, 1 );
    // 	gui.add( spawnerOptions, "spawnRate", 10, 30000 );
    // 	gui.add( spawnerOptions, "timeScale", -1, 1 );

  }

  onResize = ({ width, height }) => {
    
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    
    if (this.renderer) {
      this.renderer.setSize(width, height);
    }
  }
}
