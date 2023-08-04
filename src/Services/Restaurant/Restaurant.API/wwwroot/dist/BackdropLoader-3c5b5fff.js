import{r as v,j as c,c as E}from"./index-6be2ba8b.js";import{B as z}from"./Backdrop-74dc6689.js";import{h as B,k as I,l as x,d as m,b as l,m as L,_ as N,g as F}from"./Grid-5dd4437f.js";import{k as _,c as j}from"./TransitionGroupContext-8bbe24ba.js";function U(r){return B("MuiCircularProgress",r)}I("MuiCircularProgress",["root","determinate","indeterminate","colorPrimary","colorSecondary","svg","circle","circleDeterminate","circleIndeterminate","circleDisableShrink"]);const A=["className","color","disableShrink","size","style","thickness","value","variant"];let h=r=>r,b,$,w,D;const t=44,K=_(b||(b=h`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`)),W=_($||($=h`
  0% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -15px;
  }

  100% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -125px;
  }
`)),G=r=>{const{classes:e,variant:s,color:o,disableShrink:i}=r,a={root:["root",s,`color${m(o)}`],svg:["svg"],circle:["circle",`circle${m(s)}`,i&&"circleDisableShrink"]};return F(a,U,e)},T=x("span",{name:"MuiCircularProgress",slot:"Root",overridesResolver:(r,e)=>{const{ownerState:s}=r;return[e.root,e[s.variant],e[`color${m(s.color)}`]]}})(({ownerState:r,theme:e})=>l({display:"inline-block"},r.variant==="determinate"&&{transition:e.transitions.create("transform")},r.color!=="inherit"&&{color:(e.vars||e).palette[r.color].main}),({ownerState:r})=>r.variant==="indeterminate"&&j(w||(w=h`
      animation: ${0} 1.4s linear infinite;
    `),K)),V=x("svg",{name:"MuiCircularProgress",slot:"Svg",overridesResolver:(r,e)=>e.svg})({display:"block"}),Z=x("circle",{name:"MuiCircularProgress",slot:"Circle",overridesResolver:(r,e)=>{const{ownerState:s}=r;return[e.circle,e[`circle${m(s.variant)}`],s.disableShrink&&e.circleDisableShrink]}})(({ownerState:r,theme:e})=>l({stroke:"currentColor"},r.variant==="determinate"&&{transition:e.transitions.create("stroke-dashoffset")},r.variant==="indeterminate"&&{strokeDasharray:"80px, 200px",strokeDashoffset:0}),({ownerState:r})=>r.variant==="indeterminate"&&!r.disableShrink&&j(D||(D=h`
      animation: ${0} 1.4s ease-in-out infinite;
    `),W)),q=v.forwardRef(function(e,s){const o=L({props:e,name:"MuiCircularProgress"}),{className:i,color:a="primary",disableShrink:d=!1,size:n=40,style:M,thickness:u=3.6,value:p=0,variant:y="indeterminate"}=o,R=N(o,A),f=l({},o,{color:a,disableShrink:d,size:n,thickness:u,value:p,variant:y}),g=G(f),k={},C={},P={};if(y==="determinate"){const S=2*Math.PI*((t-u)/2);k.strokeDasharray=S.toFixed(3),P["aria-valuenow"]=Math.round(p),k.strokeDashoffset=`${((100-p)/100*S).toFixed(3)}px`,C.transform="rotate(-90deg)"}return c.jsx(T,l({className:E(g.root,i),style:l({width:n,height:n},C,M),ownerState:f,ref:s,role:"progressbar"},P,R,{children:c.jsx(V,{className:g.svg,ownerState:f,viewBox:`${t/2} ${t/2} ${t} ${t}`,children:c.jsx(Z,{className:g.circle,style:k,ownerState:f,cx:t,cy:t,r:(t-u)/2,fill:"none",strokeWidth:u})})}))}),H=q,J=()=>{const[r,e]=v.useState(!1);let s;const o=async a=>{a.controller&&(s=a.controller),e(!0);let d={};try{d=await a.call}catch(n){throw e(!1),n}return e(!1),d},i=()=>{e(!1),s&&s.abort()};return v.useEffect(()=>()=>{i()},[]),{loading:r,callEndpoint:o}},rr=J;function er({open:r}){return c.jsx(z,{sx:{color:"#fff",zIndex:e=>e.zIndex.drawer+1},open:r,children:c.jsx(H,{color:"inherit"})})}export{er as B,rr as u};
