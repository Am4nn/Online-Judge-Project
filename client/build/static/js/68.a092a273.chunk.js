(self.webpackChunkclient=self.webpackChunkclient||[]).push([[68],{69098:function(e,t,n){"use strict";n.d(t,{Z:function(){return a}});n(72791);var o={btn:"Button_btn__bCOnh",skyblue:"Button_skyblue__rNZpw",blue:"Button_blue__uFsUF",green:"Button_green__rEjag",yellow:"Button_yellow__fkuwo"},r=n(20501),i=n(80184),a=function(e){var t=e.onClick?e.onClick:function(){};return(0,i.jsx)(r.rU,{onClick:t,to:e.to,className:"".concat(o.btn," ").concat(o[e.color]),children:(0,i.jsx)("span",{children:e.children})})}},96068:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return w}});var o=n(70885),r=n(72791),i=n(20501),a=n(88446),c=n(33449),l=n(69098),s=n(88478),u="Codes_container__zKOAw",p="Codes_contain__-Thim",d="Codes_back__kOV3u",f="Codes_codeSnippet__j2PXd",h=n(76189),y=n(80184),b=(0,h.Z)((0,y.jsx)("path",{d:"M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"}),"ArrowBack"),m=(0,h.Z)((0,y.jsx)("path",{d:"M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"}),"Check"),g=(0,h.Z)((0,y.jsx)("path",{d:"M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"}),"ContentCopy"),v=n(20068),j=n(48980),x=n(13400),C=n(78029),w=function(){var e=(0,r.useState)(""),t=(0,o.Z)(e,2),n=t[0],h=t[1],w=(0,r.useState)(15),_=(0,o.Z)(w,2),O=_[0],S=_[1],k=(0,i.lr)(),Z=(0,o.Z)(k,1)[0],P=null,z=null;Z.get("filepath")&&Z.get("language")&&(P=Z.get("filepath"),z=Z.get("language")),(0,r.useEffect)((function(){P&&fetch("".concat(a.p,"/api/explore/getcode"),{headers:{"Content-Type":"application/json"},method:"POST",body:JSON.stringify({filepath:P})}).then((function(e){return e.json()})).then((function(e){return h(e)})).catch((function(e){return h({error:"server side error, check your network\n".concat(e)})}))}),[P]);var E=(0,r.useState)(!1),D=(0,o.Z)(E,2),R=D[0],T=D[1];return!0===R&&setTimeout((function(){return T(!1)}),2e3),(0,y.jsxs)(r.Fragment,{children:[!P&&(0,y.jsxs)("div",{className:"errorTemplate",children:[(0,y.jsx)("span",{children:"Error : "}),"You should come to this page by clicking button on leader board / or might be possible that code for this query was never written/saved."]}),n.error&&(0,y.jsxs)("div",{className:"errorTemplate",children:[(0,y.jsx)("span",{children:"Error : "}),n.error]}),P&&!n.error&&(0,y.jsx)("div",{className:u,children:(0,y.jsxs)("div",{className:p,children:[(0,y.jsxs)("div",{className:d,children:[(0,y.jsx)("div",{className:f,children:"< go back to leaderboard />"}),(0,y.jsxs)(l.Z,{to:"/leaderboard",color:"yellow",children:[(0,y.jsx)(b,{style:{marginRight:"0.3em",transform:"translateX(-12px)",fontSize:"1.2em"}}),"Back"]})]}),(0,y.jsx)(C.CopyToClipboard,{text:n.code,onCopy:function(){},children:(0,y.jsx)("div",{style:{position:"absolute"},children:(0,y.jsx)(v.Z,{TransitionComponent:j.Z,title:R?"Copied":"Copy",placement:"right",children:(0,y.jsx)(x.Z,{"aria-label":R?"Copied":"Copy",children:R?(0,y.jsx)(m,{}):(0,y.jsx)(g,{})})})})}),(0,y.jsx)(s.Z,{favStyle:{zIndex:"899",position:"relative",left:"33%",bottom:"1rem"},codeFontSize:O,setcodeFontSize:S}),(0,y.jsx)(c.Z,{code:n.code,setCode:null,language:z,fontSize:O,isReadOnly:!0})]})})]})}},33449:function(e,t,n){"use strict";n(72791);var o=n(38399),r=(n(25351),n(56339),n(25502),n(90262),n(73905),n(41941),n(30027),n(80184));t.Z=function(e){var t=e.code,n=e.setCode,i=e.language,a=e.fontSize,c=e.isReadOnly,l=void 0!==c&&c,s="c_cpp";switch(i){case"cpp":default:s="c_cpp";break;case"java":s="java";break;case"py":s="python";break;case"js":s="javascript"}return(0,r.jsx)(o.ZP,{placeholder:"Enter your code here",mode:s,theme:"monokai",name:"editorv3",onLoad:function(){},onChange:function(e){return n(e)},fontSize:parseInt(a),showPrintMargin:!1,showGutter:!0,readOnly:l,highlightActiveLine:!0,value:t,width:"100%",setOptions:{enableBasicAutocompletion:!0,enableLiveAutocompletion:!0,enableSnippets:!1,showLineNumbers:!0,tabSize:4}})}},88478:function(e,t,n){"use strict";n.d(t,{Z:function(){return S}});var o,r=n(70885),i=n(87122),a=n(49877),c=n(73974),l=n(68096),s=n(30829),u=n(99321),p=n(84638),d=n(36151),f=n(72791),h=n(30168),y=n(47630),b=n(68870),m=n(61889),g=n(9329),v=n(37078),j=n(57005),x=n(80184),C=(0,y.ZP)(v.Z)(o||(o=(0,h.Z)(["\n  width: 42px;\n"]))),w=function(e){var t=e.codeFontSize,n=e.setcodeFontSize;return(0,x.jsx)(b.Z,{sx:{width:250,marginRight:"1rem"},children:(0,x.jsxs)(m.ZP,{container:!0,spacing:2,alignItems:"center",children:[(0,x.jsx)(m.ZP,{item:!0,children:(0,x.jsx)(j.Z,{})}),(0,x.jsx)(m.ZP,{item:!0,xs:!0,children:(0,x.jsx)(g.ZP,{value:t,onChange:function(e,t){n(t)},"aria-labelledby":"input-slider",min:5,max:50})}),(0,x.jsx)(m.ZP,{item:!0,children:(0,x.jsx)(C,{value:t,size:"small",onChange:function(e){n(""===e.target.value?"":Number(e.target.value))},onBlur:function(){t<5?n(5):t>50&&n(50)},inputProps:{step:10,min:5,max:50,type:"number","aria-labelledby":"input-slider"}})})]})})},_=n(86753),O={optionHeading:"Options_optionHeading__fdusp",optionSnippet:"Options_optionSnippet__N0l+l",fontSnippet:"Options_fontSnippet__fL-Vn",changeFont:"Options_changeFont__gkV59",resetCode:"Options_resetCode__dGw-D"},S=function(e){var t=e.favStyle,n=e.resetCode,o=e.codeFontSize,h=e.selectedLang,y=e.codeEditable,b=e.setcodeFontSize,m=e.setSelectedLang,g=(0,f.useState)(!1),v=(0,r.Z)(g,2),j=v[0],C=v[1];return(0,x.jsxs)(f.Fragment,{children:[(0,x.jsxs)(a.Z,{style:t,onClick:function(){return C((function(e){return!e}))},color:"secondary","aria-label":"add",children:[(0,x.jsx)("div",{className:O.optionSnippet,style:{top:"-1.5rem",whiteSpace:"nowrap",textTransform:"lowercase"},children:"< change lang, font size, ... />"}),(0,x.jsx)(i.Z,{})]}),(0,x.jsx)(c.ZP,{anchor:"right",open:j,onClose:function(){return C((function(e){return!e}))},children:(0,x.jsxs)("div",{style:{width:"15rem",margin:"1rem"},children:[(0,x.jsx)("h1",{className:O.optionHeading,children:"Options"}),(0,x.jsx)("div",{className:O.fontSnippet,children:"< Font Size />"}),(0,x.jsx)("div",{className:O.changeFont,children:(0,x.jsx)(w,{codeFontSize:o,setcodeFontSize:b})}),y&&(0,x.jsxs)(f.Fragment,{children:[(0,x.jsx)("div",{className:O.changeLang,children:(0,x.jsxs)(l.Z,{children:[(0,x.jsx)(s.Z,{id:"changeLang-select-label",children:"Language"}),(0,x.jsxs)(u.Z,{labelId:"changeLang-select-label",id:"changeLang-select",value:h,label:"Language",style:{width:"8em",height:"2.8em"},onChange:function(e){return m(e.target.value)},children:[(0,x.jsx)(p.Z,{value:"cpp",children:"Cpp"}),(0,x.jsx)(p.Z,{value:"py",children:"Python"})]})]})}),(0,x.jsx)("div",{className:O.resetCode,children:(0,x.jsx)(d.Z,{color:"error",onClick:n,variant:"contained",startIcon:(0,x.jsx)(_.Z,{fontSize:"large",style:{marginRight:"0.5em",fontSize:"2em"}}),style:{textTransform:"capitalize"},children:"ResetCode"})})]})]})})]})}},76998:function(e,t,n){"use strict";var o=n(42458),r={"text/plain":"Text","text/html":"Url",default:"Text"};e.exports=function(e,t){var n,i,a,c,l,s,u=!1;t||(t={}),n=t.debug||!1;try{if(a=o(),c=document.createRange(),l=document.getSelection(),(s=document.createElement("span")).textContent=e,s.ariaHidden="true",s.style.all="unset",s.style.position="fixed",s.style.top=0,s.style.clip="rect(0, 0, 0, 0)",s.style.whiteSpace="pre",s.style.webkitUserSelect="text",s.style.MozUserSelect="text",s.style.msUserSelect="text",s.style.userSelect="text",s.addEventListener("copy",(function(o){if(o.stopPropagation(),t.format)if(o.preventDefault(),"undefined"===typeof o.clipboardData){n&&console.warn("unable to use e.clipboardData"),n&&console.warn("trying IE specific stuff"),window.clipboardData.clearData();var i=r[t.format]||r.default;window.clipboardData.setData(i,e)}else o.clipboardData.clearData(),o.clipboardData.setData(t.format,e);t.onCopy&&(o.preventDefault(),t.onCopy(o.clipboardData))})),document.body.appendChild(s),c.selectNodeContents(s),l.addRange(c),!document.execCommand("copy"))throw new Error("copy command was unsuccessful");u=!0}catch(p){n&&console.error("unable to copy using execCommand: ",p),n&&console.warn("trying IE specific stuff");try{window.clipboardData.setData(t.format||"text",e),t.onCopy&&t.onCopy(window.clipboardData),u=!0}catch(p){n&&console.error("unable to copy using clipboardData: ",p),n&&console.error("falling back to prompt"),i=function(e){var t=(/mac os x/i.test(navigator.userAgent)?"\u2318":"Ctrl")+"+C";return e.replace(/#{\s*key\s*}/g,t)}("message"in t?t.message:"Copy to clipboard: #{key}, Enter"),window.prompt(i,e)}}finally{l&&("function"==typeof l.removeRange?l.removeRange(c):l.removeAllRanges()),s&&document.body.removeChild(s),a()}return u}},568:function(e,t,n){"use strict";function o(e){return o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},o(e)}Object.defineProperty(t,"__esModule",{value:!0}),t.CopyToClipboard=void 0;var r=c(n(72791)),i=c(n(76998)),a=["text","onCopy","options","children"];function c(e){return e&&e.__esModule?e:{default:e}}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){g(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function u(e,t){if(null==e)return{};var n,o,r=function(e,t){if(null==e)return{};var n,o,r={},i=Object.keys(e);for(o=0;o<i.length;o++)n=i[o],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(o=0;o<i.length;o++)n=i[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}function p(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function d(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function f(e,t){return f=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},f(e,t)}function h(e){var t=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,o=m(e);if(t){var r=m(this).constructor;n=Reflect.construct(o,arguments,r)}else n=o.apply(this,arguments);return y(this,n)}}function y(e,t){if(t&&("object"===o(t)||"function"===typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return b(e)}function b(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function m(e){return m=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},m(e)}function g(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var v=function(e){!function(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&f(e,t)}(l,e);var t,n,o,c=h(l);function l(){var e;p(this,l);for(var t=arguments.length,n=new Array(t),o=0;o<t;o++)n[o]=arguments[o];return g(b(e=c.call.apply(c,[this].concat(n))),"onClick",(function(t){var n=e.props,o=n.text,a=n.onCopy,c=n.children,l=n.options,s=r.default.Children.only(c),u=(0,i.default)(o,l);a&&a(o,u),s&&s.props&&"function"===typeof s.props.onClick&&s.props.onClick(t)})),e}return t=l,(n=[{key:"render",value:function(){var e=this.props,t=(e.text,e.onCopy,e.options,e.children),n=u(e,a),o=r.default.Children.only(t);return r.default.cloneElement(o,s(s({},n),{},{onClick:this.onClick}))}}])&&d(t.prototype,n),o&&d(t,o),Object.defineProperty(t,"prototype",{writable:!1}),l}(r.default.PureComponent);t.CopyToClipboard=v,g(v,"defaultProps",{onCopy:void 0,options:void 0})},78029:function(e,t,n){"use strict";var o=n(568).CopyToClipboard;o.CopyToClipboard=o,e.exports=o},42458:function(e){e.exports=function(){var e=document.getSelection();if(!e.rangeCount)return function(){};for(var t=document.activeElement,n=[],o=0;o<e.rangeCount;o++)n.push(e.getRangeAt(o));switch(t.tagName.toUpperCase()){case"INPUT":case"TEXTAREA":t.blur();break;default:t=null}return e.removeAllRanges(),function(){"Caret"===e.type&&e.removeAllRanges(),e.rangeCount||n.forEach((function(t){e.addRange(t)})),t&&t.focus()}}}}]);
//# sourceMappingURL=68.a092a273.chunk.js.map