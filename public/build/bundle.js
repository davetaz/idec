var app=function(){"use strict";function t(){}const e=t=>t;function n(t,e){for(const n in e)t[n]=e[n];return t}function o(t){return t()}function r(){return Object.create(null)}function s(t){t.forEach(o)}function i(t){return"function"==typeof t}function c(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function l(e,n,o){e.$$.on_destroy.push(function(e,...n){if(null==e)return t;const o=e.subscribe(...n);return o.unsubscribe?()=>o.unsubscribe():o}(n,o))}function u(t){return null==t?"":t}function a(t,e,n=e){return t.set(n),e}const f="undefined"!=typeof window;let d=f?()=>window.performance.now():()=>Date.now(),p=f?t=>requestAnimationFrame(t):t;const g=new Set;function h(t){g.forEach((e=>{e.c(t)||(g.delete(e),e.f())})),0!==g.size&&p(h)}function m(t){let e;return 0===g.size&&p(h),{promise:new Promise((n=>{g.add(e={c:t,f:n})})),abort(){g.delete(e)}}}function $(t,e){t.appendChild(e)}function v(t,e,n){t.insertBefore(e,n||null)}function y(t){t.parentNode.removeChild(t)}function b(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function w(t){return document.createElement(t)}function x(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function T(t){return document.createTextNode(t)}function K(){return T(" ")}function _(t,e,n,o){return t.addEventListener(e,n,o),()=>t.removeEventListener(e,n,o)}function E(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function k(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function z(t,e,n){t.classList[n?"add":"remove"](e)}const C=new Set;let j,A=0;function H(t,e,n,o,r,s,i,c=0){const l=16.666/o;let u="{\n";for(let t=0;t<=1;t+=l){const o=e+(n-e)*s(t);u+=100*t+`%{${i(o,1-o)}}\n`}const a=u+`100% {${i(n,1-n)}}\n}`,f=`__svelte_${function(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}(a)}_${c}`,d=t.ownerDocument;C.add(d);const p=d.__svelte_stylesheet||(d.__svelte_stylesheet=d.head.appendChild(w("style")).sheet),g=d.__svelte_rules||(d.__svelte_rules={});g[f]||(g[f]=!0,p.insertRule(`@keyframes ${f} ${a}`,p.cssRules.length));const h=t.style.animation||"";return t.style.animation=`${h?`${h}, `:""}${f} ${o}ms linear ${r}ms 1 both`,A+=1,f}function O(t,e){const n=(t.style.animation||"").split(", "),o=n.filter(e?t=>t.indexOf(e)<0:t=>-1===t.indexOf("__svelte")),r=n.length-o.length;r&&(t.style.animation=o.join(", "),A-=r,A||p((()=>{A||(C.forEach((t=>{const e=t.__svelte_stylesheet;let n=e.cssRules.length;for(;n--;)e.deleteRule(n);t.__svelte_rules={}})),C.clear())})))}function S(t){j=t}const R=[],D=[],F=[],L=[],M=Promise.resolve();let P=!1;function N(t){F.push(t)}let V=!1;const q=new Set;function B(){if(!V){V=!0;do{for(let t=0;t<R.length;t+=1){const e=R[t];S(e),I(e.$$)}for(S(null),R.length=0;D.length;)D.pop()();for(let t=0;t<F.length;t+=1){const e=F[t];q.has(e)||(q.add(e),e())}F.length=0}while(R.length);for(;L.length;)L.pop()();P=!1,V=!1,q.clear()}}function I(t){if(null!==t.fragment){t.update(),s(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(N)}}let U;function Y(t,e,n){t.dispatchEvent(function(t,e){const n=document.createEvent("CustomEvent");return n.initCustomEvent(t,!1,!1,e),n}(`${e?"intro":"outro"}${n}`))}const G=new Set;let J;function Q(){J={r:0,c:[],p:J}}function W(){J.r||s(J.c),J=J.p}function X(t,e){t&&t.i&&(G.delete(t),t.i(e))}function Z(t,e,n,o){if(t&&t.o){if(G.has(t))return;G.add(t),J.c.push((()=>{G.delete(t),o&&(n&&t.d(1),o())})),t.o(e)}}const tt={duration:0};function et(n,o,r,c){let l=o(n,r),u=c?0:1,a=null,f=null,p=null;function g(){p&&O(n,p)}function h(t,e){const n=t.b-u;return e*=Math.abs(n),{a:u,b:t.b,d:n,duration:e,start:t.start,end:t.start+e,group:t.group}}function $(o){const{delay:r=0,duration:i=300,easing:c=e,tick:$=t,css:v}=l||tt,y={start:d()+r,b:o};o||(y.group=J,J.r+=1),a||f?f=y:(v&&(g(),p=H(n,u,o,i,r,c,v)),o&&$(0,1),a=h(y,i),N((()=>Y(n,o,"start"))),m((t=>{if(f&&t>f.start&&(a=h(f,i),f=null,Y(n,a.b,"start"),v&&(g(),p=H(n,u,a.b,a.duration,0,c,l.css))),a)if(t>=a.end)$(u=a.b,1-u),Y(n,a.b,"end"),f||(a.b?g():--a.group.r||s(a.group.c)),a=null;else if(t>=a.start){const e=t-a.start;u=a.a+a.d*c(e/a.duration),$(u,1-u)}return!(!a&&!f)})))}return{run(t){i(l)?(U||(U=Promise.resolve(),U.then((()=>{U=null}))),U).then((()=>{l=l(),$(t)})):$(t)},end(){g(),a=f=null}}}function nt(t,e){const n={},o={},r={$$scope:1};let s=t.length;for(;s--;){const i=t[s],c=e[s];if(c){for(const t in i)t in c||(o[t]=1);for(const t in c)r[t]||(n[t]=c[t],r[t]=1);t[s]=c}else for(const t in i)r[t]=1}for(const t in o)t in n||(n[t]=void 0);return n}function ot(t){return"object"==typeof t&&null!==t?t:{}}function rt(t){t&&t.c()}function st(t,e,n){const{fragment:r,on_mount:c,on_destroy:l,after_update:u}=t.$$;r&&r.m(e,n),N((()=>{const e=c.map(o).filter(i);l?l.push(...e):s(e),t.$$.on_mount=[]})),u.forEach(N)}function it(t,e){const n=t.$$;null!==n.fragment&&(s(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function ct(t,e){-1===t.$$.dirty[0]&&(R.push(t),P||(P=!0,M.then(B)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function lt(e,n,o,i,c,l,u=[-1]){const a=j;S(e);const f=n.props||{},d=e.$$={fragment:null,ctx:null,props:l,update:t,not_equal:c,bound:r(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(a?a.$$.context:[]),callbacks:r(),dirty:u,skip_bound:!1};let p=!1;if(d.ctx=o?o(e,f,((t,n,...o)=>{const r=o.length?o[0]:n;return d.ctx&&c(d.ctx[t],d.ctx[t]=r)&&(!d.skip_bound&&d.bound[t]&&d.bound[t](r),p&&ct(e,t)),n})):[],d.update(),p=!0,s(d.before_update),d.fragment=!!i&&i(d.ctx),n.target){if(n.hydrate){const t=function(t){return Array.from(t.childNodes)}(n.target);d.fragment&&d.fragment.l(t),t.forEach(y)}else d.fragment&&d.fragment.c();n.intro&&X(e.$$.fragment),st(e,n.target,n.anchor),B()}S(a)}class ut{$destroy(){it(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}const at=[];function ft(e,n=t){let o;const r=[];function s(t){if(c(e,t)&&(e=t,o)){const t=!at.length;for(let t=0;t<r.length;t+=1){const n=r[t];n[1](),at.push(n,e)}if(t){for(let t=0;t<at.length;t+=2)at[t][0](at[t+1]);at.length=0}}}return{set:s,update:function(t){s(t(e))},subscribe:function(i,c=t){const l=[i,c];return r.push(l),1===r.length&&(o=n(s)||t),i(e),()=>{const t=r.indexOf(l);-1!==t&&r.splice(t,1),0===r.length&&(o(),o=null)}}}}function dt(t){return"[object Date]"===Object.prototype.toString.call(t)}function pt(t,e){if(t===e||t!=t)return()=>t;const n=typeof t;if(n!==typeof e||Array.isArray(t)!==Array.isArray(e))throw new Error("Cannot interpolate values of different type");if(Array.isArray(t)){const n=e.map(((e,n)=>pt(t[n],e)));return t=>n.map((e=>e(t)))}if("object"===n){if(!t||!e)throw new Error("Object cannot be null");if(dt(t)&&dt(e)){t=t.getTime();const n=(e=e.getTime())-t;return e=>new Date(t+e*n)}const n=Object.keys(e),o={};return n.forEach((n=>{o[n]=pt(t[n],e[n])})),t=>{const e={};return n.forEach((n=>{e[n]=o[n](t)})),e}}if("number"===n){const n=e-t;return e=>t+e*n}throw new Error(`Cannot interpolate ${n} values`)}function gt(t,o={}){const r=ft(t);let s,i=t;function c(c,l){if(null==t)return r.set(t=c),Promise.resolve();i=c;let u=s,a=!1,{delay:f=0,duration:p=400,easing:g=e,interpolate:h=pt}=n(n({},o),l);if(0===p)return u&&(u.abort(),u=null),r.set(t=i),Promise.resolve();const $=d()+f;let v;return s=m((e=>{if(e<$)return!0;a||(v=h(t,c),"function"==typeof p&&(p=p(t,c)),a=!0),u&&(u.abort(),u=null);const n=e-$;return n>p?(r.set(t=c),!1):(r.set(t=v(g(n/p))),!0)})),s.promise}return{set:c,update:(e,n)=>c(e(i,t),n),subscribe:r.subscribe}}function ht(e){let n,o,r,i,c,l,a,f,d,p,g,h,m,b,C,j,A,H,O;return{c(){n=x("g"),o=x("ellipse"),c=x("rect"),g=x("foreignObject"),h=w("h1"),m=T(e[0]),b=K(),C=w("p"),j=T(e[1]),E(o,"class",r=u(e[2])+" svelte-1lod594"),E(o,"rx",i=Math.round(e[5]*(.5+e[6]))),z(o,"hovered",e[4]),z(o,"focussed",e[3]),E(c,"class","rect svelte-1lod594"),E(c,"transform",l="translate("+-e[5]/2+" "+-e[5]/2+")"),E(c,"x",a=.115*e[5]),E(c,"y",f=.115*e[5]),E(c,"width",d=.77*e[5]),E(c,"height",p=.77*e[5]),E(h,"class","svelte-1lod594"),E(C,"class","svelte-1lod594"),E(g,"class","node svelte-1lod594"),E(g,"x",e[17]),E(g,"y",e[17]),E(g,"width",e[16]),E(g,"height",e[16]),z(g,"focussed",e[3]),E(n,"transform",A="translate("+e[7]+" "+e[8]+") scale("+e[9]+")")},m(t,r){v(t,n,r),$(n,o),$(n,c),$(n,g),$(g,h),$(h,m),$(h,b),$(g,C),$(C,j),H||(O=[_(n,"mouseover",e[23]),_(n,"mouseout",e[24]),_(n,"click",e[25])],H=!0)},p(t,[e]){4&e&&r!==(r=u(t[2])+" svelte-1lod594")&&E(o,"class",r),96&e&&i!==(i=Math.round(t[5]*(.5+t[6])))&&E(o,"rx",i),20&e&&z(o,"hovered",t[4]),12&e&&z(o,"focussed",t[3]),32&e&&l!==(l="translate("+-t[5]/2+" "+-t[5]/2+")")&&E(c,"transform",l),32&e&&a!==(a=.115*t[5])&&E(c,"x",a),32&e&&f!==(f=.115*t[5])&&E(c,"y",f),32&e&&d!==(d=.77*t[5])&&E(c,"width",d),32&e&&p!==(p=.77*t[5])&&E(c,"height",p),1&e&&k(m,t[0]),2&e&&k(j,t[1]),8&e&&z(g,"focussed",t[3]),896&e&&A!==(A="translate("+t[7]+" "+t[8]+") scale("+t[9]+")")&&E(n,"transform",A)},i:t,o:t,d(t){t&&y(n),H=!1,s(O)}}}function mt(t,e,n){let o,r,s,{title:i}=e,{description:c}=e,{group:u}=e,{row:a}=e,{column:f}=e,{focussed:d=!1}=e,{hovered:p=!1}=e,{setHover:g=(()=>{})}=e,{setFocus:h=(()=>{})}=e,{size:m}=e,{overlap:$}=e,{canvasHeight:v=100}=e,y=gt(1,{duration:250});l(t,y,(t=>n(9,s=t)));let b=gt((f+.5)*m,{duration:250});l(t,b,(t=>n(7,o=t)));let w=gt((a+.5)*m,{duration:250});l(t,w,(t=>n(8,r=t)));const x=()=>g(!0),T=()=>g(!1),K=()=>h(!0),_=.7*m,E=-_/2;return t.$$set=t=>{"title"in t&&n(0,i=t.title),"description"in t&&n(1,c=t.description),"group"in t&&n(2,u=t.group),"row"in t&&n(18,a=t.row),"column"in t&&n(19,f=t.column),"focussed"in t&&n(3,d=t.focussed),"hovered"in t&&n(4,p=t.hovered),"setHover"in t&&n(20,g=t.setHover),"setFocus"in t&&n(21,h=t.setFocus),"size"in t&&n(5,m=t.size),"overlap"in t&&n(6,$=t.overlap),"canvasHeight"in t&&n(22,v=t.canvasHeight)},t.$$.update=()=>{4980792&t.$$.dirty&&(d?(y.set(4),b.set(v/2),w.set(v/2)):(y.set(p?1.05:1),b.set((f+.5)*m),w.set((a+.5)*m)))},[i,c,u,d,p,m,$,o,r,s,y,b,w,x,T,K,_,E,a,f,g,h,v,()=>x(),()=>T(),()=>K()]}class $t extends ut{constructor(t){super(),lt(this,t,mt,ht,c,{title:0,description:1,group:2,row:18,column:19,focussed:3,hovered:4,setHover:20,setFocus:21,size:5,overlap:6,canvasHeight:22})}}function vt(t){let e,n,o,r,s,c,l;var u=t[3];return u&&(o=new u({})),{c(){e=x("g"),n=x("rect"),o&&rt(o.$$.fragment),E(n,"x","0"),E(n,"y","0"),E(n,"width","50"),E(n,"height","50"),E(n,"class","svelte-103ckom"),E(e,"transform",r="translate("+t[1]+" "+t[2]+")")},m(r,u){v(r,e,u),$(e,n),o&&st(o,e,null),s=!0,c||(l=_(e,"click",(function(){i(t[0])&&t[0].apply(this,arguments)})),c=!0)},p(n,[i]){if(u!==(u=(t=n)[3])){if(o){Q();const t=o;Z(t.$$.fragment,1,0,(()=>{it(t,1)})),W()}u?(o=new u({}),rt(o.$$.fragment),X(o.$$.fragment,1),st(o,e,null)):o=null}(!s||6&i&&r!==(r="translate("+t[1]+" "+t[2]+")"))&&E(e,"transform",r)},i(t){s||(o&&X(o.$$.fragment,t),s=!0)},o(t){o&&Z(o.$$.fragment,t),s=!1},d(t){t&&y(e),o&&it(o),c=!1,l()}}}function yt(t,e,n){let{action:o}=e,{x:r}=e,{y:s}=e,{icon:i}=e;return t.$$set=t=>{"action"in t&&n(0,o=t.action),"x"in t&&n(1,r=t.x),"y"in t&&n(2,s=t.y),"icon"in t&&n(3,i=t.icon)},[o,r,s,i]}class bt extends ut{constructor(t){super(),lt(this,t,yt,vt,c,{action:0,x:1,y:2,icon:3})}}function wt(e){let n,o,r;return{c(){n=x("line"),o=K(),r=x("line"),E(n,"x1","10"),E(n,"y1","10"),E(n,"x2","40"),E(n,"y2","40"),E(n,"class","svelte-zqvjwe"),E(r,"x1","10"),E(r,"y1","40"),E(r,"x2","40"),E(r,"y2","10"),E(r,"class","svelte-zqvjwe")},m(t,e){v(t,n,e),v(t,o,e),v(t,r,e)},p:t,i:t,o:t,d(t){t&&y(n),t&&y(o),t&&y(r)}}}class xt extends ut{constructor(t){super(),lt(this,t,null,wt,c,{})}}const Tt=[{group:"know",title:"Data Sources",description:"TKTKTK",row:0,column:0},{group:"know",title:"Rights around data sources",description:"TKTKTK",row:0,column:1},{group:"know",title:"Limitations in data sources",description:"TKTKTK",row:0,column:2},{group:"know",title:"Ethical and legislative context",description:"TKTKTK",row:0,column:3},{group:"explore",title:"Your reason for using data",description:"TKTKTK",row:1,column:0},{group:"explore",title:"Positive effects on people",description:"TKTKTK",row:1,column:1},{group:"explore",title:"Negative effects on people",description:"TKTKTK",row:1,column:2},{group:"explore",title:"Minimising negative effects",description:"TKTKTK",row:1,column:3},{group:"plan",title:"Engaging with people",description:"TKTKTK",row:2,column:0},{group:"plan",title:"Communicating your purpose",description:"TKTKTK",row:2,column:1},{group:"plan",title:"Openness and transparency",description:"TKTKTK",row:2,column:2},{group:"plan",title:"Sharing data with others",description:"TKTKTK",row:2,column:3},{group:"integrate",title:"Ongoing implementation",description:"TKTKTK",row:0,column:4},{group:"integrate",title:"Reviews and iterations",description:"TKTKTK",row:1,column:4},{group:"integrate",title:"Your actions",description:"TKTKTK",row:2,column:4}];var Kt,_t=new Uint8Array(16);function Et(){if(!Kt&&!(Kt="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return Kt(_t)}var kt=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;function zt(t){return"string"==typeof t&&kt.test(t)}for(var Ct=[],jt=0;jt<256;++jt)Ct.push((jt+256).toString(16).substr(1));function At(t,e,n){var o=(t=t||{}).random||(t.rng||Et)();if(o[6]=15&o[6]|64,o[8]=63&o[8]|128,e){n=n||0;for(var r=0;r<16;++r)e[n+r]=o[r];return e}return function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=(Ct[t[e+0]]+Ct[t[e+1]]+Ct[t[e+2]]+Ct[t[e+3]]+"-"+Ct[t[e+4]]+Ct[t[e+5]]+"-"+Ct[t[e+6]]+Ct[t[e+7]]+"-"+Ct[t[e+8]]+Ct[t[e+9]]+"-"+Ct[t[e+10]]+Ct[t[e+11]]+Ct[t[e+12]]+Ct[t[e+13]]+Ct[t[e+14]]+Ct[t[e+15]]).toLowerCase();if(!zt(n))throw TypeError("Stringified UUID is invalid");return n}(o)}const Ht=(()=>{const{subscribe:t,set:e,update:n}=ft({blobs:Tt});return((t=At())=>{n((e=>(e.uuid=t,e)))})(),{subscribe:t,set:e,update:n}})();function Ot(t,{delay:n=0,duration:o=400,easing:r=e}){const s=+getComputedStyle(t).opacity;return{delay:n,duration:o,easing:r,css:t=>"opacity: "+t*s}}function St(t,e,n){const o=t.slice();return o[8]=e[n],o[9]=e,o[10]=n,o}function Rt(t,e,n){const o=t.slice();return o[11]=e[n],o}function Dt(e){let n;return{c(){n=x("ellipse"),E(n,"cy",Math.floor(e[11]/5)),E(n,"cx",e[11]%5),E(n,"rx",.5+3*e[2].overlap)},m(t,e){v(t,n,e)},p:t,d(t){t&&y(n)}}}function Ft(t){let e,o;function r(...e){return t[5](t[8],t[9],t[10],...e)}function s(...e){return t[6](t[8],t[9],t[10],...e)}const i=[t[8],{setHover:r},{setFocus:s},t[2],{canvasHeight:t[4]}];let c={};for(let t=0;t<i.length;t+=1)c=n(c,i[t]);return e=new $t({props:c}),{c(){rt(e.$$.fragment)},m(t,n){st(e,t,n),o=!0},p(n,o){t=n;const c=21&o?nt(i,[1&o&&ot(t[8]),1&o&&{setHover:r},1&o&&{setFocus:s},4&o&&ot(t[2]),16&o&&{canvasHeight:t[4]}]):{};e.$set(c)},i(t){o||(X(e.$$.fragment,t),o=!0)},o(t){Z(e.$$.fragment,t),o=!1},d(t){it(e,t)}}}function Lt(t){let e,o,r,s,i,c;const l=[t[0].blobs[t[1]],t[2],{canvasHeight:t[4]}];let u={};for(let t=0;t<l.length;t+=1)u=n(u,l[t]);return r=new $t({props:u}),s=new bt({props:{x:Pt*t[2].size-50,y:"0",action:t[7],icon:xt}}),{c(){e=x("g"),o=x("rect"),rt(r.$$.fragment),rt(s.$$.fragment),E(o,"class","blank svelte-zbxuet"),E(o,"x",-t[3]),E(o,"y",-t[3]),E(o,"width",Pt*t[2].size+2*t[3]),E(o,"height",t[4]+2*t[3]),E(e,"class","editor")},m(t,n){v(t,e,n),$(e,o),st(r,e,null),st(s,e,null),c=!0},p(t,e){const n=23&e?nt(l,[3&e&&ot(t[0].blobs[t[1]]),4&e&&ot(t[2]),16&e&&{canvasHeight:t[4]}]):{};r.$set(n);const o={};3&e&&(o.action=t[7]),s.$set(o)},i(t){c||(X(r.$$.fragment,t),X(s.$$.fragment,t),N((()=>{i||(i=et(e,Ot,{duration:100},!0)),i.run(1)})),c=!0)},o(t){Z(r.$$.fragment,t),Z(s.$$.fragment,t),i||(i=et(e,Ot,{duration:100},!1)),i.run(0),c=!1},d(t){t&&y(e),it(r),it(s),t&&i&&i.end()}}}function Mt(t){let e,n,o,r,s,i=Array(Pt*Nt).fill().map(Vt),c=[];for(let e=0;e<i.length;e+=1)c[e]=Dt(Rt(t,i,e));let l=t[0].blobs,u=[];for(let e=0;e<l.length;e+=1)u[e]=Ft(St(t,l,e));const a=t=>Z(u[t],1,1,(()=>{u[t]=null}));let f=t[1]>-1&&Lt(t);return{c(){e=x("svg"),n=x("g");for(let t=0;t<c.length;t+=1)c[t].c();o=x("rect");for(let t=0;t<u.length;t+=1)u[t].c();r=T(""),f&&f.c(),E(o,"width",Pt-1),E(o,"height",Nt-1),E(n,"class","cloud svelte-zbxuet"),E(n,"transform","scale("+t[2].size+") translate(0.5 0.5)"),E(e,"viewBox","-"+t[3]+" -"+t[3]+" "+(Pt*t[2].size+2*t[3])+" "+(t[4]+2*t[3])),E(e,"class","svelte-zbxuet")},m(t,i){v(t,e,i),$(e,n);for(let t=0;t<c.length;t+=1)c[t].m(n,null);$(n,o);for(let t=0;t<u.length;t+=1)u[t].m(e,null);$(e,r),f&&f.m(e,null),s=!0},p(t,[s]){if(4&s){let e;for(i=Array(Pt*Nt).fill().map(Vt),e=0;e<i.length;e+=1){const r=Rt(t,i,e);c[e]?c[e].p(r,s):(c[e]=Dt(r),c[e].c(),c[e].m(n,o))}for(;e<c.length;e+=1)c[e].d(1);c.length=i.length}if(21&s){let n;for(l=t[0].blobs,n=0;n<l.length;n+=1){const o=St(t,l,n);u[n]?(u[n].p(o,s),X(u[n],1)):(u[n]=Ft(o),u[n].c(),X(u[n],1),u[n].m(e,r))}for(Q(),n=l.length;n<u.length;n+=1)a(n);W()}t[1]>-1?f?(f.p(t,s),2&s&&X(f,1)):(f=Lt(t),f.c(),X(f,1),f.m(e,null)):f&&(Q(),Z(f,1,1,(()=>{f=null})),W())},i(t){if(!s){for(let t=0;t<l.length;t+=1)X(u[t]);X(f),s=!0}},o(t){u=u.filter(Boolean);for(let t=0;t<u.length;t+=1)Z(u[t]);Z(f),s=!1},d(t){t&&y(e),b(c,t),b(u,t),f&&f.d()}}}const Pt=5,Nt=3,Vt=(t,e)=>e;function qt(t,e,n){let o,r;l(t,Ht,(t=>n(0,r=t)));const s={size:200,overlap:.05},i=s.size*s.overlap*5,c=Nt*s.size;return t.$$.update=()=>{1&t.$$.dirty&&n(1,o=r.blobs.findIndex((t=>!0===t.focussed)))},[r,o,s,i,c,(t,e,n,o)=>a(Ht,e[n].hovered=o,r),(t,e,n,o)=>a(Ht,e[n].focussed=o,r),()=>a(Ht,r.blobs[o].focussed=!1,r)]}class Bt extends ut{constructor(t){super(),lt(this,t,qt,Mt,c,{})}}function It(e){let n,o,r,s,i;return s=new Bt({}),{c(){n=w("main"),o=w("h1"),o.textContent="ODI Learning Data Ethics Canvas",r=K(),rt(s.$$.fragment),E(n,"class","svelte-cg2kj3")},m(t,e){v(t,n,e),$(n,o),$(n,r),st(s,n,null),i=!0},p:t,i(t){i||(X(s.$$.fragment,t),i=!0)},o(t){Z(s.$$.fragment,t),i=!1},d(t){t&&y(n),it(s)}}}return new class extends ut{constructor(t){super(),lt(this,t,null,It,c,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
