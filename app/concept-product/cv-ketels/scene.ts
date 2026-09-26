import * as T from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import studio from './jutsu-motion.json';

export type ProductScene = { progress: (n:number,heating?:number,gas?:number)=>void; visible:(v:boolean)=>void; dispose:()=>void };
// Committed Jutsu revision 2: one continuous film camera and animated lights.
// Convert Blender Z-up into the unchanged installation GLB's Y-up coordinates.
const toThree = ([x,y,z]:number[]) => [x,z,-y];
const track = studio.track.map(pose => ({
  camera:new T.Vector3().fromArray(toThree(pose.camera)),
  target:new T.Vector3().fromArray(toThree(pose.target)),
  key:new T.Vector3().fromArray(toThree(pose.key_position)),
  keyPower:pose.key_power, rimPower:pose.rim_power,
}));

/** Imported geometry/materials stay fixed. Only camera and scene lights follow scroll. */
export function createProductScene(host:HTMLElement, ready:()=>void, fail:()=>void):ProductScene {
  const theme=getComputedStyle(host);
  const color=(token:string)=>theme.getPropertyValue(token).trim();
  const renderer=new T.WebGLRenderer({alpha:false,antialias:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<700?1.25:1.5));
  renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.95;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
  host.appendChild(renderer.domElement);
  const scene=new T.Scene();scene.background=new T.Color(color('--story-background'));scene.fog=new T.Fog(color('--story-background'),15,35);
  const camera=new T.PerspectiveCamera(studio.vertical_fov,1,.05,60);
  const room=new RoomEnvironment(), pm=new T.PMREMGenerator(renderer),env=pm.fromScene(room,.025);
  room.dispose();pm.dispose();scene.environment=env.texture;scene.environmentIntensity=.5;
  const ambient=new T.HemisphereLight('#ffffff','#b5c4d5',.65);scene.add(ambient);
  RectAreaLightUniformsLib.init();
  const lightColor=(index:number)=>new T.Color().fromArray(studio.lights[index].color_linear);
  const lightTarget=new T.Vector3().fromArray(toThree(studio.lights[0].target_blender));
  // Jutsu wattage is adapted to realtime photometric intensities. Positions,
  // colors, source dimensions and moving-light ratios retain the authored rig.
  const key=new T.SpotLight(lightColor(0),studio.lights[0].power*.14,30,T.MathUtils.degToRad(44),1,2);
  key.position.fromArray(toThree(studio.lights[0].position_blender));key.target.position.copy(lightTarget);key.castShadow=true;
  const shadowSize=2048;
  key.shadow.focus=.65;key.shadow.mapSize.set(shadowSize,shadowSize);key.shadow.camera.near=.1;key.shadow.camera.far=30;key.shadow.bias=-.0001;key.shadow.normalBias=.001;key.shadow.radius=5;key.shadow.blurSamples=8;
  scene.add(key,key.target);
  const fill=new T.RectAreaLight(lightColor(1),2.1,studio.lights[1].size,studio.lights[1].size_y);
  fill.position.fromArray(toThree(studio.lights[1].position_blender));fill.lookAt(lightTarget);scene.add(fill);
  const rim=new T.RectAreaLight(lightColor(2),16,studio.lights[2].size,studio.lights[2].size_y);
  rim.position.fromArray(toThree(studio.lights[2].position_blender));rim.lookAt(lightTarget);scene.add(rim);
  const stageMat=new T.MeshStandardMaterial({color:color('--story-floor'),roughness:.62,metalness:.08});
  // Quiet studio background for the existing product model.
  const wallMat=new T.MeshBasicMaterial({color:color('--story-background'),toneMapped:false});
  const wall=new T.Mesh(new T.PlaneGeometry(14,6.4),wallMat);wall.position.set(.5,6.1,.21);wall.rotation.y=Math.PI;scene.add(wall);
  const contact=new T.Mesh(new T.PlaneGeometry(14,6.4),new T.ShadowMaterial({opacity:.12}));contact.position.set(.5,6.1,.20);contact.rotation.y=Math.PI;contact.receiveShadow=true;scene.add(contact);
  const floor=new T.Mesh(new T.PlaneGeometry(40,40),stageMat);floor.rotation.x=-Math.PI/2;floor.position.y=2.90;floor.receiveShadow=true;scene.add(floor);
  let target=0,current=0,raf=0,last=0,loaded=false,visible=true,disposed=false;
  let heatingTarget=0,heatingCurrent=0,gasTarget=0,radiator:T.Group|undefined;
  const radiatorPoint=new T.Vector3(2.25,3.68,-.16);
  const radiatorCamera=new T.Vector3(2.65,3.98,-3.75);
  const radiatorView=new T.Vector3();
  const abort=new AbortController(), point=new T.Vector3(),position=new T.Vector3();
  const gasMarker=host.parentElement?.querySelector<HTMLElement>('[data-gas-marker]');
  const radiatorKey=host.parentElement?.querySelector<HTMLElement>('[data-radiator-key]');
  // Also clear old inline values during hot reloads on an already open page.
  gasMarker?.style.removeProperty('opacity');
  gasMarker?.style.setProperty('--ps-gas-opacity','0');
  if(radiatorKey)radiatorKey.style.opacity='0';
  const gasAnchor=new T.Vector3(.63,3.276094,-.339676),projectedGas=new T.Vector3();
  function frame(time:number){
    raf=0;if(disposed||!visible||!loaded)return;
    const dt=last?Math.min(time-last,40):16;last=time;
    current+=(target-current)*(1-Math.exp(-dt/145));if(Math.abs(current-target)<.0001)current=target;
    const heat=radiator?heatingTarget:0;
    heatingCurrent+=(heat-heatingCurrent)*(1-Math.exp(-dt/190));if(Math.abs(heatingCurrent-heat)<.0001)heatingCurrent=heat;
    if(radiator)radiator.visible=heatingCurrent>.001;
    const step=current*(track.length-1),index=Math.min(track.length-2,Math.floor(step)),t=step-index;
    const a=track[index],b=track[index+1];
    const w=host.clientWidth,h=host.clientHeight,mobile=w<700;
    point.copy(a.target).lerp(b.target,t);
    position.copy(a.camera).lerp(b.camera,t);
    point.lerp(radiatorPoint,heatingCurrent);
    radiatorView.copy(radiatorCamera);
    if(mobile)radiatorView.sub(radiatorPoint).multiplyScalar(.72).add(radiatorPoint);
    position.lerp(radiatorView,heatingCurrent);
    if(mobile)position.sub(point).multiplyScalar(1.10).add(point);
    camera.position.copy(position);camera.lookAt(point);camera.aspect=w/Math.max(h,1);
    camera.setViewOffset(w,h,mobile?0:-w*.22,0,w,h);camera.updateProjectionMatrix();
    key.position.copy(a.key).lerp(b.key,t);
    key.intensity=T.MathUtils.lerp(a.keyPower,b.keyPower,t)*.14;
    rim.intensity=T.MathUtils.lerp(a.rimPower,b.rimPower,t)*16/520;
    renderer.render(scene,camera);
    if(radiatorKey)radiatorKey.style.opacity=String(T.MathUtils.smoothstep(heatingCurrent,.6,1));
    if(gasMarker){
      projectedGas.copy(gasAnchor).project(camera);
      const x=(projectedGas.x+1)*w/2,y=(1-projectedGas.y)*h/2;
      gasMarker.style.left=`${x}px`;gasMarker.style.top=`${y}px`;
      gasMarker.style.setProperty('--ps-gas-opacity',String(gasTarget*(1-T.MathUtils.smoothstep(heatingCurrent,.02,.15))));
      gasMarker.dataset.side=x+145>w-12?'left':'right';
      gasMarker.dataset.onscreen=String(Math.abs(projectedGas.x)<.96&&Math.abs(projectedGas.y)<.9&&Math.abs(projectedGas.z)<1);
    }
    if(current!==target||heatingCurrent!==heat)wake();
  }
  function wake(){if(!raf&&!disposed&&visible&&loaded)raf=requestAnimationFrame(frame);}
  const resize=new ResizeObserver(()=>{if(!disposed){renderer.setSize(host.clientWidth,host.clientHeight);wake();}});resize.observe(host);
  const lost=(e:Event)=>{e.preventDefault();fail();};renderer.domElement.addEventListener('webglcontextlost',lost);
  fetch('/concept-3d/cv-ketels/installatie.glb',{signal:abort.signal}).then(r=>{if(!r.ok)throw Error('Model unavailable');return r.arrayBuffer();}).then(b=>new GLTFLoader().parseAsync(b,'')).then(g=>{
    if(disposed){clean(g.scene);return;}g.scene.traverse(o=>{if(o instanceof T.Mesh){o.castShadow=true;o.receiveShadow=true;}});
    g.scene.updateMatrixWorld(true);
    // Register the wall against the actual rear casing, with 3 mm clearance.
    // The original GLB is unchanged; only the presentation's mounting fit adapts.
    const casing=g.scene.getObjectByName('behuizing-vereenvoudigde-achterkant');
    const plate=g.scene.getObjectByName('Wall_bracket_plate')??g.scene.getObjectByName('Wall bracket plate');
    const arm=g.scene.getObjectByName('Wall_bracket_arm')??g.scene.getObjectByName('Wall bracket arm');
    const clamp=g.scene.getObjectByName('Wall_bracket_clamp')??g.scene.getObjectByName('Wall bracket clamp');
    // Matte galvanized mounting steel: avoid sharp environment reflections and
    // self-shadow aliasing on this very small assembly during the camera move.
    const mountingMaterials=new Map<T.Material,T.Material>();
    for(const part of [plate,arm,clamp])part?.traverse(object=>{
      if(!(object instanceof T.Mesh))return;
      object.receiveShadow=false;
      if(part===plate)object.castShadow=false; // Flush with the wall, no detached patch.
      const matte=(source:T.Material)=>{
        let material=mountingMaterials.get(source);
        if(!material){
          material=source.clone();
          if(material instanceof T.MeshStandardMaterial){material.roughness=.72;material.metalness=.25;material.envMapIntensity=.3;}
          mountingMaterials.set(source,material);
        }
        return material;
      };
      object.material=Array.isArray(object.material)?object.material.map(matte):matte(object.material);
    });
    if(casing){
      const wallZ=new T.Box3().setFromObject(casing).max.z+.003;
      wall.position.z=wallZ;contact.position.z=wallZ-.0002;
      const transformWorld=(object:T.Object3D,matrix:T.Matrix4)=>{
        const parent=object.parent?.matrixWorld??new T.Matrix4();
        object.applyMatrix4(parent.clone().invert().multiply(matrix).multiply(parent));
        object.updateMatrixWorld(true);
      };
      if(plate){
        const bounds=new T.Box3().setFromObject(plate);
        transformWorld(plate,new T.Matrix4().makeTranslation(0,0,wallZ-.0005-bounds.max.z));
        if(arm){
          const armBounds=new T.Box3().setFromObject(arm);
          const end=new T.Box3().setFromObject(plate).min.z+.002;
          const ratio=(end-armBounds.min.z)/(armBounds.max.z-armBounds.min.z);
          if(ratio>0){transformWorld(arm,new T.Matrix4().makeTranslation(0,0,armBounds.min.z).multiply(new T.Matrix4().makeScale(1,1,ratio)).multiply(new T.Matrix4().makeTranslation(0,0,-armBounds.min.z)));}
        }
      }
    }
    scene.add(g.scene);loaded=true;renderer.setSize(host.clientWidth,host.clientHeight);wake();ready();
    // Reuse the original radiator, mounted beside the boiler in the same world.
    // Its local camera excursion blends back into the unchanged Jutsu track.
    fetch('/models/cv-fotoreferentie/radiator-fotoreferentie.glb',{signal:abort.signal})
      .then(r=>{if(!r.ok)throw Error('Radiator unavailable');return r.arrayBuffer();})
      .then(b=>new GLTFLoader().parseAsync(b,''))
      .then(r=>{
        if(disposed){clean(r.scene);return;}
        const center=new T.Box3().setFromObject(r.scene).getCenter(new T.Vector3());
        r.scene.position.sub(center);
        radiator=new T.Group();radiator.add(r.scene);radiator.rotation.y=Math.PI;
        radiator.position.copy(radiatorPoint);radiator.visible=false;
        radiator.traverse(o=>{if(o instanceof T.Mesh){o.castShadow=true;o.receiveShadow=true;}});
        scene.add(radiator);wake();
      }).catch(()=>{/* Keep the original connection camera if this extra asset fails. */});
  }).catch(e=>{if(!disposed&&e.name!=='AbortError')fail();});
  return {progress(n,heating=0,gas=0){target=Math.max(0,Math.min(1,n));heatingTarget=T.MathUtils.clamp(heating,0,1);gasTarget=T.MathUtils.clamp(gas,0,1);if(!loaded)current=target;wake();},visible(v){visible=v;if(v){last=0;wake();}else{cancelAnimationFrame(raf);raf=0;}},dispose(){disposed=true;abort.abort();resize.disconnect();cancelAnimationFrame(raf);renderer.domElement.removeEventListener('webglcontextlost',lost);clean(scene);env.dispose();renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();}};
}
function clean(root:T.Object3D){const geometries=new Set<T.BufferGeometry>(),materials=new Set<T.Material>(),textures=new Set<T.Texture>();root.traverse(o=>{if(o instanceof T.Mesh){geometries.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material]){materials.add(m);for(const v of Object.values(m))if(v instanceof T.Texture)textures.add(v);}}});textures.forEach(v=>v.dispose());materials.forEach(v=>v.dispose());geometries.forEach(v=>v.dispose());}
