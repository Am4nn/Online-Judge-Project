"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[941],{78941:function(e,r,a){a.r(r),a.d(r,{default:function(){return ie}});var n=a(70885),o=a(72791),t=a(20501),s=a(16871),l=a(59434),i="Customform_bgImg__Ddjvo",d="Customform_Auth-form-container__m-f+Z",c="Customform_Auth-form__saddl",u="Customform_Auth-form-content__-xpDf",m="Customform_Auth-form-title__iOTCc",h="Customform_errormsg__lAE9B",v="Customform_validError__tA1du",f={value:"",isTouched:!1},p=function e(r,a){return"INPUT"===a.type?{value:a.value,isTouched:r.isTouched}:"BLUR"===a.type?{isTouched:!0,value:r.value}:"RESET"===a.type?{isTouched:!1,value:""}:e},g=function(e){var r=(0,o.useReducer)(p,f),a=(0,n.Z)(r,2),t=a[0],s=a[1],l=e(t.value),i=!l&&t.isTouched,d=(0,o.useCallback)((function(){s({type:"RESET"})}),[]);return{value:t.value,isValid:l,hasError:i,valueChangeHandler:function(e){s({type:"INPUT",value:e.target.value})},inputBlurHandler:function(e){s({type:"BLUR"})},reset:d}},x=a(27391),Z=a(36151),w=a(21593),C=a(21156),j=a(87462),b=a(63366),y=a(79012),N=a(42071),k=a(98278);var S=o.createContext(void 0),E=a(67384),z=a(80184),P=["actions","children","defaultValue","name","onChange","value"],R=o.forwardRef((function(e,r){var a=e.actions,t=e.children,s=e.defaultValue,l=e.name,i=e.onChange,d=e.value,c=(0,b.Z)(e,P),u=o.useRef(null),m=(0,k.Z)({controlled:d,default:s,name:"RadioGroup"}),h=(0,n.Z)(m,2),v=h[0],f=h[1];o.useImperativeHandle(a,(function(){return{focus:function(){var e=u.current.querySelector("input:not(:disabled):checked");e||(e=u.current.querySelector("input:not(:disabled)")),e&&e.focus()}}}),[]);var p=(0,N.Z)(r,u),g=(0,E.Z)(l);return(0,z.jsx)(S.Provider,{value:{name:g,onChange:function(e){f(e.target.value),i&&i(e,e.target.value)},value:v},children:(0,z.jsx)(y.Z,(0,j.Z)({role:"radiogroup",ref:p},c,{children:t}))})})),T=a(4942),_=a(94419),B=a(12065),H=a(97278),U=a(93736),I=a(76189),M=(0,I.Z)((0,z.jsx)("path",{d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"}),"RadioButtonUnchecked"),q=(0,I.Z)((0,z.jsx)("path",{d:"M8.465 8.465C9.37 7.56 10.62 7 12 7C14.76 7 17 9.24 17 12C17 13.38 16.44 14.63 15.535 15.535C14.63 16.44 13.38 17 12 17C9.24 17 7 14.76 7 12C7 10.62 7.56 9.37 8.465 8.465Z"}),"RadioButtonChecked"),V=a(47630),F=(0,V.ZP)("span")({position:"relative",display:"flex"}),A=(0,V.ZP)(M)({transform:"scale(1)"}),L=(0,V.ZP)(q)((function(e){var r=e.theme,a=e.ownerState;return(0,j.Z)({left:0,position:"absolute",transform:"scale(0)",transition:r.transitions.create("transform",{easing:r.transitions.easing.easeIn,duration:r.transitions.duration.shortest})},a.checked&&{transform:"scale(1)",transition:r.transitions.create("transform",{easing:r.transitions.easing.easeOut,duration:r.transitions.duration.shortest})})}));var D=function(e){var r=e.checked,a=void 0!==r&&r,n=e.classes,o=void 0===n?{}:n,t=e.fontSize,s=(0,j.Z)({},e,{checked:a});return(0,z.jsxs)(F,{className:o.root,ownerState:s,children:[(0,z.jsx)(A,{fontSize:t,className:o.background,ownerState:s}),(0,z.jsx)(L,{fontSize:t,className:o.dot,ownerState:s})]})},O=a(14036),G=a(31260);var Y=a(21217);function W(e){return(0,Y.Z)("MuiRadio",e)}var $=(0,a(75878).Z)("MuiRadio",["root","checked","disabled","colorPrimary","colorSecondary"]),J=["checked","checkedIcon","color","icon","name","onChange","size"],K=(0,V.ZP)(H.Z,{shouldForwardProp:function(e){return(0,V.FO)(e)||"classes"===e},name:"MuiRadio",slot:"Root",overridesResolver:function(e,r){var a=e.ownerState;return[r.root,r["color".concat((0,O.Z)(a.color))]]}})((function(e){var r=e.theme,a=e.ownerState;return(0,j.Z)({color:(r.vars||r).palette.text.secondary,"&:hover":{backgroundColor:r.vars?"rgba(".concat("default"===a.color?r.vars.palette.action.activeChannel:r.vars.palette[a.color].mainChannel," / ").concat(r.vars.palette.action.hoverOpacity,")"):(0,B.Fq)("default"===a.color?r.palette.action.active:r.palette[a.color].main,r.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"}}},"default"!==a.color&&(0,T.Z)({},"&.".concat($.checked),{color:(r.vars||r).palette[a.color].main}),(0,T.Z)({},"&.".concat($.disabled),{color:(r.vars||r).palette.action.disabled}))}));var Q=(0,z.jsx)(D,{checked:!0}),X=(0,z.jsx)(D,{}),ee=o.forwardRef((function(e,r){var a,n,t,s,l=(0,U.Z)({props:e,name:"MuiRadio"}),i=l.checked,d=l.checkedIcon,c=void 0===d?Q:d,u=l.color,m=void 0===u?"primary":u,h=l.icon,v=void 0===h?X:h,f=l.name,p=l.onChange,g=l.size,x=void 0===g?"medium":g,Z=(0,b.Z)(l,J),w=(0,j.Z)({},l,{color:m,size:x}),C=function(e){var r=e.classes,a=e.color,n={root:["root","color".concat((0,O.Z)(a))]};return(0,j.Z)({},r,(0,_.Z)(n,W,r))}(w),y=o.useContext(S),N=i,k=(0,G.Z)(p,y&&y.onChange),E=f;return y&&("undefined"===typeof N&&(t=y.value,N="object"===typeof(s=l.value)&&null!==s?t===s:String(t)===String(s)),"undefined"===typeof E&&(E=y.name)),(0,z.jsx)(K,(0,j.Z)({type:"radio",icon:o.cloneElement(v,{fontSize:null!=(a=X.props.fontSize)?a:x}),checkedIcon:o.cloneElement(c,{fontSize:null!=(n=Q.props.fontSize)?n:x}),ownerState:w,classes:C,name:E,checked:N,onChange:k,ref:r},Z))})),re=a(20068),ae=a(48980),ne=a(68096),oe=a(17133),te=a(85523),se=a(95193),le=a(67095),ie=function(e){var r=e.pageType,a=(0,se.Z)("(max-width:1000px)"),f="right",p=(0,l.I0)(),j=(0,s.s0)(),b=(0,l.v9)((function(e){return e.auth}));b.loggedIn&&(p(C.Y.setError({error:void 0})),j("/questions")),(0,o.useEffect)((function(){return function(){return p(C.Y.setError({error:void 0}))}}),[p,r]);var y=g((function(e){return""!==e.trim()&&e.length<10})),N=y.value,k=y.isValid,S=y.hasError,E=y.valueChangeHandler,P=y.inputBlurHandler,T=y.reset,_="Name is necessary and should be less than 10 characters",B=g((function(e){return""!==e.trim()&&e.length>=4&&e.length<10})),H=B.value,U=B.isValid,I=B.hasError,M=B.valueChangeHandler,q=B.inputBlurHandler,V=B.reset,F="Username is necessary and should be Unique and less than 10 characters and greater than or equal to 4 characters",A=g((function(e){return/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(e)})),L=A.value,D=A.isValid,O=A.hasError,G=A.valueChangeHandler,Y=A.inputBlurHandler,W=A.reset,$="Email is necessary and should be an valid Email and Unique",J=g((function(e){return e.length>=6})),K=J.value,Q=J.isValid,X=J.hasError,ie=J.valueChangeHandler,de=J.inputBlurHandler,ce=J.reset,ue="Password is necessary and should be greater than or equal to 6 characters",me=g((function(e){return e.length>=6})),he=me.value,ve=me.isValid,fe=me.hasError,pe=me.valueChangeHandler,ge=me.inputBlurHandler,xe=me.reset,Ze="Password is necessary and should be greater than or equal to 6 characters",we=g((function(e){return e.length>=6&&e===K})),Ce=we.value,je=we.isValid,be=we.hasError,ye=we.valueChangeHandler,Ne=we.inputBlurHandler,ke=we.reset,Se="Verify Password is necessary and should be same as Password",Ee=(0,o.useState)("username"),ze=(0,n.Z)(Ee,2),Pe=ze[0],Re=ze[1];(0,o.useEffect)((function(){T(),V(),W(),ce(),ke(),xe()}),[r,T,V,W,ce,ke,xe]);var Te,_e=k&&U&&D&&Q&&je,Be=Q&&("username"===Pe?U:D),He=U&&D&&ve&&Q&&je;switch(r){case le.Nz:Te=_e;break;case le.ym:Te=Be;break;case le.f5:Te=He}return(0,z.jsxs)(o.Fragment,{children:[(0,z.jsx)("div",{className:i}),(0,z.jsx)("div",{className:d,children:(0,z.jsx)("form",{className:c,onSubmit:function(e){if(e.preventDefault(),Te){switch(r){case le.Nz:Te=p((0,w.z2)(N,H,L,K,Ce));break;case le.ym:"username"===Pe&&p((0,w.x4)(H,void 0,K)),Te=void("email"===Pe&&p((0,w.x4)(void 0,L,K)));break;case le.f5:Te=p((0,w.Cp)(H,L,he,K))}ce(),ke(),xe()}},children:(0,z.jsxs)("div",{className:u,children:[(0,z.jsx)("h3",{className:m,children:(r===le.ym?"Sign In":r===le.Nz&&"Sign Up")||r===le.f5&&"Change Password"}),(r===le.ym||r===le.Nz)&&(0,z.jsxs)("div",{className:"text-center",children:[r===le.ym?"Don't have an account? ":r===le.Nz&&"Already have an account ",(0,z.jsx)(t.rU,{to:r===le.ym?"/register":r===le.Nz&&"/login",className:"link-primary",children:r===le.ym?"Sign Up":r===le.Nz&&"Sign In"})]}),r===le.Nz&&(0,z.jsxs)("div",{className:"form-group mt-4",children:[(0,z.jsx)(re.Z,{arrow:!0,placement:f,TransitionComponent:ae.Z,title:_,open:!a&&S,children:(0,z.jsx)(x.Z,{id:"name",type:"text",label:"Name",variant:"filled",placeholder:"Less than 10 characters",onChange:E,onBlur:P,value:N,sx:S?{backgroundColor:"#fddddd"}:{}})}),a&&S&&(0,z.jsx)("div",{className:v,children:_})]}),r===le.ym&&(0,z.jsxs)(ne.Z,{sx:{borderTop:"2px solid rgb(0,0,0,0.08)",borderBottom:"2px solid rgb(0,0,0,0.08)",marginTop:"0.5rem",padding:"0 0.7rem"},children:[(0,z.jsx)(oe.Z,{id:"login-mode",children:"Choose with what you want to login"}),(0,z.jsxs)(R,{row:!0,"aria-labelledby":"login-mode",name:"login-mode",value:Pe,onChange:function(e){return Re(e.target.value)},children:[(0,z.jsx)(te.Z,{value:"username",control:(0,z.jsx)(ee,{}),label:"Username"}),(0,z.jsx)(te.Z,{value:"email",control:(0,z.jsx)(ee,{}),label:"Email"})]})]}),(r===le.Nz||r===le.f5||"username"===Pe)&&(0,z.jsxs)("div",{className:"form-group mt-4",children:[(0,z.jsx)(re.Z,{arrow:!0,placement:f,TransitionComponent:ae.Z,title:F,open:!a&&I,children:(0,z.jsx)(x.Z,{id:"username",type:"text",label:"Username",variant:"filled",placeholder:"4 <= username < 10",onChange:M,onBlur:q,value:H,sx:I?{backgroundColor:"#fddddd"}:{}})}),a&&I&&(0,z.jsx)("div",{className:v,children:F})]}),(r===le.Nz||r===le.f5||"email"===Pe)&&(0,z.jsxs)("div",{className:"form-group mt-4",children:[(0,z.jsx)(re.Z,{arrow:!0,placement:f,TransitionComponent:ae.Z,title:$,open:!a&&O,children:(0,z.jsx)(x.Z,{id:"email",type:"email",label:"Email",placeholder:"Enter valid Email",variant:"filled",onBlur:Y,onChange:G,value:L,sx:O?{backgroundColor:"#fddddd"}:{}})}),a&&O&&(0,z.jsx)("div",{className:v,children:$})]}),r===le.f5&&(0,z.jsxs)("div",{className:"form-group mt-3",children:[(0,z.jsx)(re.Z,{arrow:!0,placement:f,TransitionComponent:ae.Z,title:Ze,open:!a&&fe,children:(0,z.jsx)(x.Z,{id:"oldPassword",type:"password",label:"Old Password",placeholder:"Minimum Length 6",variant:"filled",onBlur:ge,onChange:pe,value:he,sx:fe?{backgroundColor:"#fddddd"}:{}})}),a&&fe&&(0,z.jsx)("div",{className:v,children:Ze})]}),(0,z.jsxs)("div",{className:"form-group mt-3",children:[(0,z.jsx)(re.Z,{arrow:!0,placement:f,TransitionComponent:ae.Z,title:ue,open:!a&&X,children:(0,z.jsx)(x.Z,{id:"password",type:"password",label:"".concat(r===le.f5?"New ":"","Password"),placeholder:"Minimum Length 6",variant:"filled",onBlur:de,onChange:ie,value:K,sx:X?{backgroundColor:"#fddddd"}:{}})}),a&&X&&(0,z.jsx)("div",{className:v,children:ue})]}),(r===le.Nz||r===le.f5)&&(0,z.jsxs)("div",{className:"form-group mt-3",children:[(0,z.jsx)(re.Z,{arrow:!0,placement:f,TransitionComponent:ae.Z,title:Se,open:!a&&be,children:(0,z.jsx)(x.Z,{id:"passwordVerify",type:"password",label:"Re-Enter ".concat(r===le.f5?"New ":"","Password"),placeholder:"Same as ".concat(r===le.f5?"New ":"","Password"),variant:"filled",onBlur:Ne,onChange:ye,value:Ce,sx:be?{backgroundColor:"#fddddd"}:{}})}),a&&be&&(0,z.jsx)("div",{className:v,children:Se})]}),(0,z.jsx)("div",{className:"d-grid gap-2 mt-4 mb-3",children:(0,z.jsxs)(Z.Z,{type:"submit",color:"info",variant:"contained",disabled:!Te||b.isLoading,style:{textTransform:"capitalize",letterSpacing:"0.15rem",fontSize:"1rem"},children:[r,b&&(b.isLoading||b.loggedIn)&&(0,z.jsx)("div",{className:"spin"})]})}),b&&b.error&&(0,z.jsx)("div",{className:h,children:b.error}),(0,z.jsx)("div",{className:"text-muted",children:"Email/Username must be valid/Unique and Password length must be greater than or equal to 6 to submit."})]})})})]})}},79012:function(e,r,a){a.d(r,{Z:function(){return g}});var n=a(63366),o=a(87462),t=a(72791),s=a(28182),l=a(94419),i=a(47630),d=a(93736),c=a(21217);function u(e){return(0,c.Z)("MuiFormGroup",e)}(0,a(75878).Z)("MuiFormGroup",["root","row","error"]);var m=a(52930),h=a(76147),v=a(80184),f=["className","row"],p=(0,i.ZP)("div",{name:"MuiFormGroup",slot:"Root",overridesResolver:function(e,r){var a=e.ownerState;return[r.root,a.row&&r.row]}})((function(e){var r=e.ownerState;return(0,o.Z)({display:"flex",flexDirection:"column",flexWrap:"wrap"},r.row&&{flexDirection:"row"})})),g=t.forwardRef((function(e,r){var a=(0,d.Z)({props:e,name:"MuiFormGroup"}),t=a.className,i=a.row,c=void 0!==i&&i,g=(0,n.Z)(a,f),x=(0,m.Z)(),Z=(0,h.Z)({props:a,muiFormControl:x,states:["error"]}),w=(0,o.Z)({},a,{row:c,error:Z.error}),C=function(e){var r=e.classes,a={root:["root",e.row&&"row",e.error&&"error"]};return(0,l.Z)(a,u,r)}(w);return(0,v.jsx)(p,(0,o.Z)({className:(0,s.Z)(C.root,t),ownerState:w,ref:r},g))}))}}]);
//# sourceMappingURL=941.d8379589.chunk.js.map