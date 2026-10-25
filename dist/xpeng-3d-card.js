/* XPeng 3D Card — 0.3.4, MIT. Procedural G6-inspired 3D prototype; not an exact manufacturer model. */
const DEFAULTS = {
 model:'/local/xpeng-3d-card/xpeng-g6.glb', color:'#73787d', height:380, vehicle_model:'g6_2025', model_urls:{},
 entities:{
 door_fl:'binary_sensor.driver_door_xpeng_135818',door_fr:'binary_sensor.passenger_door_xpeng_135818',
 door_rl:'binary_sensor.rear_left_door_xpeng_135818',door_rr:'binary_sensor.rear_right_door_xpeng_135818',
 trunk:'cover.trunk_xpeng_135818',bonnet:'binary_sensor.bonnet_xpeng_135818',
 windows:'cover.windows_xpeng_135818',charge_port:'cover.charge_port_xpeng_135818',
 plugged:'binary_sensor.plugged_in_xpeng_135818',lock:'lock.door_lock_xpeng_135818',
 charging:'sensor.charging_state_xpeng_135818',charge_power:'sensor.charge_power_xpeng_135818',
 battery:'sensor.evconduit_battery_level'
 }
};
const VEHICLES={g6_2025:{label:'XPeng G6 2025 (facelift)',type:'g6',generation:'2025'},g6_2024:{label:'XPeng G6 2024 (prototype)',type:'g6',generation:'2024'}};
const labels={door_fl:'Front left / Del. izq.',door_fr:'Front right / Del. der.',door_rl:'Rear left / Tras. izq.',door_rr:'Rear right / Tras. der.',trunk:'Trunk / Maletero',bonnet:'Hood / Capó',windows:'Windows / Ventanillas',charge_port:'Charge port / Toma carga'};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeColor=s=>/^#[\da-f]{6}$/i.test(String(s))?s:'#73787d';
class XPeng3DCard extends HTMLElement {
 static getStubConfig(){return {type:'custom:xpeng-3d-card'};}
 static getConfigElement(){return document.createElement('xpeng-3d-card-editor');}
 setConfig(cfg){this.cleanup();this.cfg={...DEFAULTS,...cfg,entities:{...DEFAULTS.entities,...(cfg.entities||{})}};if(!this.shadowRoot)this.attachShadow({mode:'open'});this.render();}
 set hass(hass){this._hass=hass;this.sync();}
 getCardSize(){return 5;}
 state(key){const id=this.cfg?.entities?.[key];return id?this._hass?.states?.[id]?.state:null;}
 opened(key){return ['on','open','opening','true','1'].includes(String(this.state(key)).toLowerCase());}
 async ensureViewer(){
  if(customElements.get('model-viewer'))return;
  if(!window.__xpengViewerLoad){window.__xpengViewerLoad=new Promise((ok,fail)=>{
   const s=document.createElement('script');s.type='module';s.src='https://ajax.googleapis.com/ajax/libs/model-viewer/4.1.0/model-viewer.min.js';
   s.onload=ok;s.onerror=()=>fail(new Error('3D viewer failed to load'));document.head.appendChild(s);
  });}
  await window.__xpengViewerLoad;
 }
 render(){
  const c=this.cfg;this.shadowRoot.innerHTML=`<style>
 :host{display:block}ha-card{padding:16px;overflow:hidden}header{display:flex;justify-content:space-between;gap:10px;font-size:17px;font-weight:600}
 .stage{position:relative;border-radius:14px;background:var(--secondary-background-color,#eee);overflow:hidden;margin-top:12px}
 model-viewer{display:block;width:100%;height:${Math.max(220,Math.min(700,Number(c.height)||380))}px}
 .hint{position:absolute;bottom:8px;left:12px;font-size:11px;opacity:.65;pointer-events:none}
 .badges{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}.badge{padding:5px 9px;border:1px solid var(--divider-color,#aaa);border-radius:18px;font-size:12px}
 .open{border-color:var(--warning-color,#d80);color:var(--warning-color,#d80)}.metrics{display:flex;gap:14px;margin-top:12px;flex-wrap:wrap;font-size:14px}
 .error{color:var(--error-color,#c00);font-size:13px;padding:8px}
 </style><ha-card><header><span>XPeng 3D <small id="model-label">G6 2025 · dev preview</small></span><span id="lock"></span></header>
 <div class="stage"><model-viewer id="viewer" camera-controls interaction-prompt="none" shadow-intensity=".7" environment-image="neutral" alt="XPeng vehicle"></model-viewer>
 <span class="hint">Drag to rotate / Arrastra para girar</span></div>
 <div class="metrics"><span id="battery"></span><span id="charge"></span><span id="power"></span></div>
 <div class="badges" id="badges"></div><div id="message"></div></ha-card>`;
  const viewer=this.shadowRoot.querySelector('#viewer');const modelUrl=c.model_urls?.[c.vehicle_model]||(c.model!==DEFAULTS.model?c.model:null);if(modelUrl){viewer.src=String(modelUrl);}else{viewer.style.display='none';this.startProcedural();}
  viewer.addEventListener('load',()=>{this.paint();this.animate();});
  viewer.addEventListener('error',()=>this.message('GLB not loaded / No se puede cargar el GLB. Check the URL and file license.'));
  if(modelUrl) this.ensureViewer().catch(()=>this.message('3D viewer unavailable / Visor no disponible. Check network/CSP.'));
  this.sync();
  const label=this.shadowRoot.getElementById('model-label');if(label)label.textContent=(VEHICLES[c.vehicle_model]?.label||VEHICLES.g6_2025.label)+' · v0.3.4';
 }

 cleanup(){this._disposed=true;this._renderToken=(this._renderToken||0)+1;this._resizeObserver?.disconnect();this._resizeObserver=null;this._renderer?.dispose();this._renderer?.forceContextLoss?.();this._renderer?.domElement?.remove();this._renderer=null;this._hinges=null;this._paint=null;this._carRoot=null;this._windows=null;this._chargingCable=null;this._portOpenMaterial?.dispose();this._portOpenMaterial=null;this._materials?.forEach(m=>m.dispose());this._materials=null;this._geometry?.forEach(g=>g.dispose());this._geometry=null;}
 disconnectedCallback(){this.cleanup();}
 async startProcedural(){
  this._disposed=false;const token=this._renderToken;
  try{
   const T=await import('https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js');
   if(this._disposed||token!==this._renderToken||!this.shadowRoot)return;
   const stage=this.shadowRoot.querySelector('.stage');if(!stage)return;
   const height=Math.max(220,Math.min(700,Number(this.cfg.height)||380));
   const scene=new T.Scene();scene.background=new T.Color(0xe4e6e8);
   const camera=new T.PerspectiveCamera(38,1,.1,100);camera.position.set(6,3.2,7.5);camera.lookAt(0,.8,0);
   const renderer=new T.WebGLRenderer({antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.setSize(stage.clientWidth||340,height);renderer.outputColorSpace=T.SRGBColorSpace;
   stage.prepend(renderer.domElement);this._renderer=renderer;
   renderer.domElement.style.cssText='display:block;width:100%;height:'+height+'px;touch-action:none;cursor:grab';
   const ambient=new T.HemisphereLight(0xffffff,0x8e969c,2.6);scene.add(ambient);
   const sun=new T.DirectionalLight(0xffffff,2.5);sun.position.set(5,10,6);scene.add(sun);
   const root=new T.Group();scene.add(root);this._carRoot=root;
   const generation=VEHICLES[this.cfg.vehicle_model]?.generation||'2025';
   const paint=new T.MeshStandardMaterial({color:safeColor(this.cfg.color),metalness:.65,roughness:.35});this._paint=paint;
   const glass=new T.MeshStandardMaterial({color:0x1b2938,metalness:.25,roughness:.12});
   const dark=new T.MeshStandardMaterial({color:0x24262a,roughness:.8});
   const silver=new T.MeshStandardMaterial({color:0xb0b9bf,metalness:.85,roughness:.25});
   const red=new T.MeshStandardMaterial({color:0xb80f20,emissive:0x4d0710});
   const white=new T.MeshStandardMaterial({color:0xe5eef5,emissive:0x55606e});
   const addBox=(parent,w,h,d,x,y,z,material)=>{const g=new T.BoxGeometry(w,h,d);this._geometry.push(g);const m=new T.Mesh(g,material);m.position.set(x,y,z);parent.add(m);return m;};
   this._materials=[paint,glass,dark,silver,red,white];this._geometry=[];
   // X forward; stylized geometry, NOT an accurately licensed XPeng mesh.
   const rounded=(parent,w,h,d,x,y,z,mat,r=.11)=>{const shape=new T.Shape();const a=-w/2,b=-h/2;shape.moveTo(a+r,b);shape.lineTo(a+w-r,b);shape.quadraticCurveTo(a+w,b,a+w,b+r);shape.lineTo(a+w,b+h-r);shape.quadraticCurveTo(a+w,b+h,a+w-r,b+h);shape.lineTo(a+r,b+h);shape.quadraticCurveTo(a,b+h,a,b+h-r);shape.lineTo(a,b+r);shape.quadraticCurveTo(a,b,a+r,b);const g=new T.ExtrudeGeometry(shape,{depth:d-2*r,bevelEnabled:true,bevelThickness:r,bevelSize:r,bevelSegments:3,steps:1,curveSegments:6});g.translate(0,0,-(d-2*r)/2);this._geometry.push(g);const m=new T.Mesh(g,mat);m.position.set(x,y,z);parent.add(m);return m;};
   rounded(root,4.48,.72,1.78,0,.82,0,paint,.12);
   rounded(root,2.35,.66,1.54,-.25,1.47,0,glass,.10);
   rounded(root,2.05,.10,1.59,-.28,1.85,0,paint,.04);
   rounded(root,1.15,.13,1.68,1.72,1.18,0,paint,.045);
   addBox(root,.12,.17,1.68,2.26,.90,0,white);
   // 2025 facelift signature: thin continuous front LED light bar and cleaner nose.
   if(generation==='2025'){
    const strip=addBox(root,.06,.035,1.77,2.317,1.165,0,white);
    addBox(root,.045,.06,1.72,2.319,.82,0,dark);
    addBox(root,.07,.075,.21,2.32,.93,-.72,white);
    addBox(root,.07,.075,.21,2.32,.93,.72,white);
   }
   addBox(root,.1,.19,1.71,-2.25,.95,0,red);
   rounded(root,4.44,.20,1.70,0,.50,0,dark,.065);
   for(const x of [-1.45,1.45])for(const z of [-.98,.98]){
    const tg=new T.CylinderGeometry(.40,.40,.23,28);this._geometry.push(tg);const tire=new T.Mesh(tg,dark);tire.rotation.x=Math.PI/2;tire.position.set(x,.46,z);root.add(tire);
    const rg=new T.CylinderGeometry(.24,.24,.243,20);this._geometry.push(rg);const rim=new T.Mesh(rg,silver);rim.rotation.x=Math.PI/2;rim.position.set(x,.46,z);root.add(rim);
   }
   this._hinges={};this._windows=[];
   const recess=new T.MeshStandardMaterial({color:0x080f18,roughness:.9,side:T.DoubleSide});this._materials.push(recess);
   for(const rear of [false,true])for(const side of [-1,1]){
    const key=(rear?'door_r':'door_f')+(side===-1?'l':'r');
    addBox(root,1.13,.98,.017,rear?-1.43:.77,1.03,side*.913,recess);
    const hinge=new T.Group();hinge.position.set(rear?-.90:1.32,.84,side*1.025);root.add(hinge);
    const panel=rounded(hinge,1.12,.65,.065,-.54,0,0,paint,.02);
    addBox(hinge,1.07,.028,.084,-.54,-.30,side*.017,dark);
    addBox(hinge,.027,.60,.085,-1.075,0,side*.016,dark);
    if(generation==='2025')addBox(hinge,.92,.055,.071,-.54,.26,0,paint);
    const window=addBox(hinge,.89,.42,.035,-.54,.51,0,glass);this._windows.push(window);
    addBox(hinge,.17,.045,.10,-.27,.09,side*.055,silver);
    this._hinges[key]={group:hinge,side,rear,closedZ:side*1.025};
   }
   if(generation==='2025'){
     addBox(root,.10,.035,1.6,-2.27,1.55,0,red);
     addBox(root,1.0,.025,1.62,-1.76,1.82,0,dark);
   }
   const hatch=new T.Group();hatch.position.set(-2.22,1.39,0);root.add(hatch);
   addBox(hatch,.09,.72,1.7,0,-.45,0,paint);
   addBox(hatch,.10,.40,1.51,-.04,-.02,0,glass);
   this._hinges.trunk={group:hatch};
   const bonnet=new T.Group();bonnet.position.set(1.07,1.23,0);root.add(bonnet);addBox(bonnet,1.12,.06,1.73,.56,0,0,paint);this._hinges.bonnet={group:bonnet};
   const flap=new T.Group();flap.position.set(-1.50,1.08,1.05);root.add(flap);const port=addBox(flap,.14,.18,.05,0,0,0,paint);this._port=port;this._portFlap=flap;
   // Visual-only cable. The card never sends commands to the vehicle.
   const cableGroup=new T.Group();root.add(cableGroup);this._chargingCable=cableGroup;
   const cordMat=new T.MeshStandardMaterial({color:0x1e2730,roughness:.65});
   const plugMat=new T.MeshStandardMaterial({color:0x303b47,roughness:.45});
   const glowMat=new T.MeshStandardMaterial({color:0x23b9d6,emissive:0x0789a7,emissiveIntensity:0});
   this._materials.push(cordMat,plugMat,glowMat);this._chargeGlow=glowMat;
   const points=[new T.Vector3(-1.5,1.08,1.02),new T.Vector3(-1.5,1.05,1.28),new T.Vector3(-1.62,.55,1.67),new T.Vector3(-2.15,.26,2.02),new T.Vector3(-2.75,.20,2.25)];
   const cg=new T.TubeGeometry(new T.CatmullRomCurve3(points),48,.065,9,false);this._geometry.push(cg);
   cableGroup.add(new T.Mesh(cg,cordMat));
   addBox(cableGroup,.24,.15,.21,-1.50,1.08,1.10,plugMat);
   addBox(cableGroup,.025,.16,.22,-1.51,1.08,1.13,glowMat);
   this.syncProcedural();
   let az=.62,el=.22,zoom=8,drag=null;
   renderer.domElement.addEventListener('pointerdown',e=>{drag=[e.clientX,e.clientY];renderer.domElement.setPointerCapture(e.pointerId);});
   renderer.domElement.addEventListener('pointermove',e=>{if(!drag)return;az+=(e.clientX-drag[0])*.008;el=Math.max(-.05,Math.min(.95,el+(e.clientY-drag[1])*.005));drag=[e.clientX,e.clientY];});
   renderer.domElement.addEventListener('pointerup',()=>drag=null);
   renderer.domElement.addEventListener('pointercancel',()=>drag=null);
   renderer.domElement.addEventListener('lostpointercapture',()=>drag=null);
   renderer.domElement.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(4,Math.min(15,zoom+e.deltaY*.008));},{passive:false});
   this._resizeObserver=new ResizeObserver(()=>{if(!this._renderer)return;let w=stage.clientWidth||340;camera.aspect=w/height;camera.updateProjectionMatrix();renderer.setSize(w,height,false);});this._resizeObserver.observe(stage);
   const step=()=>{if(this._disposed||token!==this._renderToken||this._renderer!==renderer)return;camera.position.set(Math.cos(az)*zoom*Math.cos(el),2.0+Math.sin(el)*zoom,Math.sin(az)*zoom*Math.cos(el));camera.lookAt(0,.95,0);this.tickProcedural();renderer.render(scene,camera);requestAnimationFrame(step);};step();
   this.message('G6 '+generation+' concept / Prototipo 3D estilizado, NO es un modelo exacto XPeng.');
  }catch(err){this.message('3D rendering unavailable / Error del visor 3D: '+String(err.message||err));}
 }
 syncProcedural(){
  if(!this._hinges)return;
  for(const [key,h] of Object.entries(this._hinges)){
   const isOpen=this.opened(key);
   h.target=key==='trunk'?(isOpen?.85:0):key==='bonnet'?(isOpen?-.55:0):(isOpen?(-h.side)*1.40:0);
  }
  if(this._portFlap)this._portFlapTarget=this.opened('charge_port')?1.15:0;
  if(this._windows){const open=this.opened('windows');for(const w of this._windows)w.visible=!open;}
  if(this._chargingCable)this._chargingCable.visible=this.opened('plugged');
  if(this._chargeGlow)this._chargeGlow.emissiveIntensity=(Number(this.state('charge_power'))>50||/charging/i.test(String(this.state('charging'))))?.85:0;
  if(this._paint)this._paint.color.set(safeColor(this.cfg.color));
  if(this._port){
   this._port.material=this.opened('charge_port')?(this._portOpenMaterial||(this._portOpenMaterial=this._paint.clone(),this._portOpenMaterial.color.set(0x161a20))):this._paint;
  }
 }
 tickProcedural(){
  if(!this._hinges)return;
  if(this._portFlap)this._portFlap.rotation.y+=((this._portFlapTarget||0)-this._portFlap.rotation.y)*.12;
  for(const [key,h] of Object.entries(this._hinges)){
   const axis=(key==='trunk'||key==='bonnet')?'z':'y';
   const current=h.group.rotation[axis],target=h.target??0;
   if(Math.abs(target-current)>0.0005)h.group.rotation[axis]=current+(target-current)*.12;
   else h.group.rotation[axis]=target;
   if(h.closedZ!==undefined){const open=Math.min(1,Math.abs(h.group.rotation.y)/1.40);h.group.position.z=h.closedZ+h.side*.60*open;}
  }
 }

 message(s){const e=this.shadowRoot?.getElementById('message');if(e)e.textContent=s;}
 paint(){
  const model=this.shadowRoot?.getElementById('viewer')?.model;if(!model)return;
  const color=safeColor(this.cfg.color);const r=parseInt(color.slice(1,3),16)/255,g=parseInt(color.slice(3,5),16)/255,b=parseInt(color.slice(5,7),16)/255;
  for(const material of model.materials||[]){if(/paint|body|carrocer|exterior/i.test(material.name||'')){
   material.pbrMetallicRoughness?.setBaseColorFactor([r,g,b,1]);
  }}
 }
 animate(){
  // Optional experimental clip convention. Independent articulated animations need an appropriately rigged GLB.
  const viewer=this.shadowRoot?.getElementById('viewer');if(!viewer?.availableAnimations?.length)return;
  // Avoid claiming stateful articulation until the GLB's clip names and poses are verified.
 }
 sync(){
  if(!this.shadowRoot||!this.cfg||!this._hass)return;
  const put=(id,s)=>{const e=this.shadowRoot.getElementById(id);if(e)e.textContent=s;};
  const battery=this.state('battery'),charge=this.state('charging'),power=this.state('charge_power');
  put('battery',battery&&!['unknown','unavailable'].includes(battery)?'🔋 '+battery+'%':'');
  put('charge',charge&&!['unknown','unavailable'].includes(charge)?'⚡ '+charge:'');
  put('power',power&&!['unknown','unavailable'].includes(power)?power+' W':'');
  put('lock',this.state('lock')==='locked'?'🔒':this.state('lock')==='unlocked'?'🔓':'');
  const badges=this.shadowRoot.getElementById('badges');if(badges){
   badges.replaceChildren();
   for(const key of Object.keys(labels)){
    const val=this.state(key);if(val==null)continue;
    const el=document.createElement('span');el.className='badge'+(this.opened(key)?' open':'');
    el.textContent=labels[key]+': '+(this.opened(key)?'OPEN':'closed');badges.appendChild(el);
   }
   if(this.opened('plugged')){const el=document.createElement('span');el.className='badge open';el.textContent='🔌 Plugged in / Conectado';badges.appendChild(el);}
  }
  this.syncProcedural();
 }
}
class XPeng3DCardEditor extends HTMLElement {
 setConfig(config){this.cfg={...config};this.render();}
 set hass(value){this._hass=value;}
 render(){
  if(!this.shadowRoot)this.attachShadow({mode:'open'});
  this.shadowRoot.innerHTML=`<style>label{display:block;margin:10px 0;font-size:13px}input,select{display:block;width:100%;box-sizing:border-box;padding:9px;background:var(--card-background-color);color:var(--primary-text-color);border:1px solid var(--divider-color);border-radius:7px}</style>
  <label>Vehicle model / Modelo de vehículo<select id="vehicle_model"><option value="g6_2025">XPeng G6 2025</option><option value="g6_2024">XPeng G6 2024 (prototype)</option></select></label>
  <label>3D GLB URL / Ruta del modelo<input id="model" type="text" value="${esc(this.cfg.model||DEFAULTS.model)}"></label>
  <label>Paint color / Color de carrocería<input id="color" type="color" value="${safeColor(this.cfg.color||DEFAULTS.color)}"></label>
  <label>Height / Altura (px)<input id="height" type="number" min="220" max="700" value="${Number(this.cfg.height)||380}"></label>`;
  this.shadowRoot.getElementById('vehicle_model').value=VEHICLES[this.cfg.vehicle_model]?this.cfg.vehicle_model:'g6_2025';
  for(const el of this.shadowRoot.querySelectorAll('input,select'))el.addEventListener('change',()=>{
   const value=el.id==='height'?Number(el.value):el.value;
   this.cfg={...this.cfg,[el.id]:value};
   this.dispatchEvent(new CustomEvent('config-changed',{detail:{config:this.cfg},bubbles:true,composed:true}));
  });
 }
}
if(!customElements.get('xpeng-3d-card'))customElements.define('xpeng-3d-card',XPeng3DCard);
if(!customElements.get('xpeng-3d-card-editor'))customElements.define('xpeng-3d-card-editor',XPeng3DCardEditor);
window.customCards=window.customCards||[];
if(!window.customCards.some(c=>c.type==='xpeng-3d-card'))window.customCards.push({type:'xpeng-3d-card',name:'XPeng 3D Card',description:'Interactive XPeng 3D dashboard card with selectable vehicle profiles'});
