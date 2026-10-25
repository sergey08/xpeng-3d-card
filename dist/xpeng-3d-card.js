/* XPeng 3D Card — 0.1.0-dev, MIT. Requires a user-provided licensed GLB. */
const DEFAULTS = {
 model:'/local/xpeng-3d-card/xpeng-g6.glb', color:'#73787d', height:380,
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
const labels={door_fl:'Front left / Del. izq.',door_fr:'Front right / Del. der.',door_rl:'Rear left / Tras. izq.',door_rr:'Rear right / Tras. der.',trunk:'Trunk / Maletero',bonnet:'Hood / Capó',windows:'Windows / Ventanillas',charge_port:'Charge port / Toma carga'};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeColor=s=>/^#[\da-f]{6}$/i.test(String(s))?s:'#73787d';
class XPeng3DCard extends HTMLElement {
 static getStubConfig(){return {type:'custom:xpeng-3d-card'};}
 static getConfigElement(){return document.createElement('xpeng-3d-card-editor');}
 setConfig(cfg){this.cfg={...DEFAULTS,...cfg,entities:{...DEFAULTS.entities,...(cfg.entities||{})}};if(!this.shadowRoot)this.attachShadow({mode:'open'});this.render();}
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
 </style><ha-card><header><span>XPeng 3D <small>G6 · dev preview</small></span><span id="lock"></span></header>
 <div class="stage"><model-viewer id="viewer" camera-controls interaction-prompt="none" shadow-intensity=".7" environment-image="neutral" alt="XPeng vehicle"></model-viewer>
 <span class="hint">Drag to rotate / Arrastra para girar</span></div>
 <div class="metrics"><span id="battery"></span><span id="charge"></span><span id="power"></span></div>
 <div class="badges" id="badges"></div><div id="message"></div></ha-card>`;
  const viewer=this.shadowRoot.querySelector('#viewer');viewer.src=String(c.model||DEFAULTS.model);
  viewer.addEventListener('load',()=>{this.paint();this.animate();});
  viewer.addEventListener('error',()=>this.message('GLB not loaded / No se puede cargar el GLB. Supply your own model.'));
  this.ensureViewer().catch(()=>this.message('3D viewer unavailable / Visor no disponible. Check network/CSP.'));
  this.sync();
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
 }
}
class XPeng3DCardEditor extends HTMLElement {
 setConfig(config){this.cfg={...config};this.render();}
 set hass(value){this._hass=value;}
 render(){
  if(!this.shadowRoot)this.attachShadow({mode:'open'});
  this.shadowRoot.innerHTML=`<style>label{display:block;margin:10px 0;font-size:13px}input{display:block;width:100%;box-sizing:border-box;padding:9px;background:var(--card-background-color);color:var(--primary-text-color);border:1px solid var(--divider-color);border-radius:7px}</style>
  <label>3D GLB URL / Ruta del modelo<input id="model" type="text" value="${esc(this.cfg.model||DEFAULTS.model)}"></label>
  <label>Paint color / Color de carrocería<input id="color" type="color" value="${safeColor(this.cfg.color||DEFAULTS.color)}"></label>
  <label>Height / Altura (px)<input id="height" type="number" min="220" max="700" value="${Number(this.cfg.height)||380}"></label>`;
  for(const el of this.shadowRoot.querySelectorAll('input'))el.addEventListener('change',()=>{
   const value=el.id==='height'?Number(el.value):el.value;
   this.cfg={...this.cfg,[el.id]:value};
   this.dispatchEvent(new CustomEvent('config-changed',{detail:{config:this.cfg},bubbles:true,composed:true}));
  });
 }
}
if(!customElements.get('xpeng-3d-card'))customElements.define('xpeng-3d-card',XPeng3DCard);
if(!customElements.get('xpeng-3d-card-editor'))customElements.define('xpeng-3d-card-editor',XPeng3DCardEditor);
window.customCards=window.customCards||[];
if(!window.customCards.some(c=>c.type==='xpeng-3d-card'))window.customCards.push({type:'xpeng-3d-card',name:'XPeng 3D Card',description:'Interactive XPeng 3D dashboard card (requires GLB)'});
