(self.webpackChunk_segment_analytics_next=self.webpackChunk_segment_analytics_next||[]).push([[870],{2870:function(t,r,e){"use strict";var n=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(r,"__esModule",{value:!0}),r.Store=r.matches=r.transform=void 0;var o=e(4303);Object.defineProperty(r,"transform",{enumerable:!0,get:function(){return n(o).default}});var i=e(2370);Object.defineProperty(r,"matches",{enumerable:!0,get:function(){return n(i).default}});var u=e(1444);Object.defineProperty(r,"Store",{enumerable:!0,get:function(){return n(u).default}})},2370:function(t,r,e){"use strict";var n=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(r,"__esModule",{value:!0});var o=n(e(7843));function i(t,r){if(!Array.isArray(t))return!0===u(t,r);var e=t[0];switch(e){case"!":return!i(t[1],r);case"or":for(var n=1;n<t.length;n++)if(i(t[n],r))return!0;return!1;case"and":for(n=1;n<t.length;n++)if(!i(t[n],r))return!1;return!0;case"=":case"!=":return function(t,r,e,n){s(t)&&(t=i(t,n));s(r)&&(r=i(r,n));"object"==typeof t&&"object"==typeof r&&(t=JSON.stringify(t),r=JSON.stringify(r));switch(e){case"=":return t===r;case"!=":return t!==r;default:throw new Error("Invalid operator in compareItems: ".concat(e))}}(u(t[1],r),u(t[2],r),e,r);case"<=":case"<":case">":case">=":return function(t,r,e,n){s(t)&&(t=i(t,n));s(r)&&(r=i(r,n));if("number"!=typeof t||"number"!=typeof r)return!1;switch(e){case"<=":return t<=r;case">=":return t>=r;case"<":return t<r;case">":return t>r;default:throw new Error("Invalid operator in compareNumbers: ".concat(e))}}(u(t[1],r),u(t[2],r),e,r);case"contains":return function(t,r){if("string"!=typeof t||"string"!=typeof r)return!1;return-1!==t.indexOf(r)}(u(t[1],r),u(t[2],r));case"match":return function(t,r){if("string"!=typeof t||"string"!=typeof r)return!1;return function(t,r){var e,n;t:for(;t.length>0;){var o=void 0,i=void 0;if(o=(e=c(t)).star,i=e.chunk,t=e.pattern,o&&""===i)return!0;var u=a(i,r),s=u.t,f=u.ok,p=u.err;if(p)return!1;if(!f||!(0===s.length||t.length>0)){if(o)for(var l=0;l<r.length;l++){if(s=(n=a(i,r.slice(l+1))).t,f=n.ok,p=n.err,f){if(0===t.length&&s.length>0)continue;r=s;continue t}if(p)return!1}return!1}r=s}return 0===r.length}(r,t)}(u(t[1],r),u(t[2],r));case"lowercase":var o=u(t[1],r);return"string"!=typeof o?null:o.toLowerCase();case"typeof":return typeof u(t[1],r);case"length":return function(t){if(null===t)return 0;if(!Array.isArray(t)&&"string"!=typeof t)return NaN;return t.length}(u(t[1],r));default:throw new Error("FQL IR could not evaluate for token: ".concat(e))}}function u(t,r){return Array.isArray(t)?t:"object"==typeof t?t.value:(0,o.default)(r,t)}function s(t){return!!Array.isArray(t)&&(("lowercase"===t[0]||"length"===t[0]||"typeof"===t[0])&&2===t.length||("contains"===t[0]||"match"===t[0])&&3===t.length)}function c(t){for(var r={star:!1,chunk:"",pattern:""};t.length>0&&"*"===t[0];)t=t.slice(1),r.star=!0;var e,n=!1;t:for(e=0;e<t.length;e++)switch(t[e]){case"\\":e+1<t.length&&e++;break;case"[":n=!0;break;case"]":n=!1;break;case"*":if(!n)break t}return r.chunk=t.slice(0,e),r.pattern=t.slice(e),r}function a(t,r){for(var e,n,o={t:"",ok:!1,err:!1};t.length>0;){if(0===r.length)return o;switch(t[0]){case"[":var i=r[0];r=r.slice(1);var u=!0;(t=t.slice(1)).length>0&&"^"===t[0]&&(u=!1,t=t.slice(1));for(var s=!1,c=0;;){if(t.length>0&&"]"===t[0]&&c>0){t=t.slice(1);break}var a,p="";if(a=(e=f(t)).char,t=e.newChunk,e.err)return o;if(p=a,"-"===t[0]&&(p=(n=f(t.slice(1))).char,t=n.newChunk,n.err))return o;a<=i&&i<=p&&(s=!0),c++}if(s!==u)return o;break;case"?":r=r.slice(1),t=t.slice(1);break;case"\\":if(0===(t=t.slice(1)).length)return o.err=!0,o;default:if(t[0]!==r[0])return o;r=r.slice(1),t=t.slice(1)}}return o.t=r,o.ok=!0,o.err=!1,o}function f(t){var r={char:"",newChunk:"",err:!1};return 0===t.length||"-"===t[0]||"]"===t[0]||"\\"===t[0]&&0===(t=t.slice(1)).length?(r.err=!0,r):(r.char=t[0],r.newChunk=t.slice(1),0===r.newChunk.length&&(r.err=!0),r)}r.default=function(t,r){if(!r)throw new Error("No matcher supplied!");switch(r.type){case"all":return!0;case"fql":return function(t,r){if(!t)return!1;try{t=JSON.parse(t)}catch(r){throw new Error('Failed to JSON.parse FQL intermediate representation "'.concat(t,'": ').concat(r))}var e=i(t,r);if("boolean"!=typeof e)return!1;return e}(r.ir,t);default:throw new Error("Matcher of type ".concat(r.type," unsupported."))}}},1444:function(t,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var e=function(){function t(t){this.rules=[],this.rules=t||[]}return t.prototype.getRulesByDestinationName=function(t){for(var r=[],e=0,n=this.rules;e<n.length;e++){var o=n[e];o.destinationName!==t&&void 0!==o.destinationName||r.push(o)}return r},t}();r.default=e},4303:function(t,r,e){"use strict";var n=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(r,"__esModule",{value:!0});var o=n(e(2263)),i=n(e(7843)),u=n(e(5500)),s=e(2341),c=e(4966);function a(t,r){for(var e in r.drop)if(r.drop.hasOwnProperty(e)){var n=""===e?t:(0,i.default)(t,e);if("object"==typeof n&&null!==n)for(var o=0,u=r.drop[e];o<u.length;o++){delete n[u[o]]}}}function f(t,r){for(var e in r.allow)if(r.allow.hasOwnProperty(e)){var n=""===e?t:(0,i.default)(t,e);if("object"==typeof n&&null!==n)for(var o in n)n.hasOwnProperty(o)&&-1===r.allow[e].indexOf(o)&&delete n[o]}}function p(t,r){var e=JSON.parse(JSON.stringify(t));for(var n in r.map)if(r.map.hasOwnProperty(n)){var o=r.map[n],u=n.split("."),a=void 0;if(u.length>1?(u.pop(),a=(0,i.default)(e,u.join("."))):a=t,"object"==typeof a){if(o.copy){var f=(0,i.default)(e,o.copy);void 0!==f&&(0,s.dset)(t,n,f)}else if(o.move){var p=(0,i.default)(e,o.move);void 0!==p&&(0,s.dset)(t,n,p),(0,c.unset)(t,o.move)}else o.hasOwnProperty("set")&&(0,s.dset)(t,n,o.set);if(o.to_string){var l=(0,i.default)(t,n);if("string"==typeof l||"object"==typeof l&&null!==l)continue;void 0!==l?(0,s.dset)(t,n,JSON.stringify(l)):(0,s.dset)(t,n,"undefined")}}}}function l(t,r){return!(r.sample.percent<=0)&&(r.sample.percent>=1||(r.sample.path?function(t,r){var e=(0,i.default)(t,r.sample.path),n=(0,o.default)(JSON.stringify(e)),s=-64,c=[];v(n.slice(0,8),c);for(var a=0,f=0;f<64&&1!==c[f];f++)a++;if(0!==a){var p=[];v(n.slice(9,16),p),s-=a,c.splice(0,a),p.splice(64-a),c=c.concat(p)}return c[63]=0===c[63]?1:0,(0,u.default)(parseInt(c.join(""),2),s)<r.sample.percent}(t,r):(e=r.sample.percent,Math.random()<=e)));var e}function v(t,r){for(var e=0;e<8;e++)for(var n=t[e],o=128;o>=1;o/=2)n-o>=0?(n-=o,r.push(1)):r.push(0)}r.default=function(t,r){for(var e=t,n=0,o=r;n<o.length;n++){var i=o[n];switch(i.type){case"drop":return null;case"drop_properties":a(e,i.config);break;case"allow_properties":f(e,i.config);break;case"sample_event":if(l(e,i.config))break;return null;case"map_properties":p(e,i.config);break;case"hash_properties":break;default:throw new Error('Transformer of type "'.concat(i.type,'" is unsupported.'))}}return e}},4966:function(t,r,e){"use strict";var n=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(r,"__esModule",{value:!0}),r.unset=void 0;var o=n(e(7843));r.unset=function(t,r){if((0,o.default)(t,r)){for(var e=r.split("."),n=e.pop();e.length&&"\\"===e[e.length-1].slice(-1);)n=e.pop().slice(0,-1)+"."+n;for(;e.length;)t=t[r=e.shift()];return delete t[n]}return!0}},3304:function(t){"use strict";var r="function"==typeof Float64Array?Float64Array:void 0;t.exports=r},7382:function(t,r,e){"use strict";var n,o=e(5569),i=e(3304),u=e(8482);n=o()?i:u,t.exports=n},8482:function(t){"use strict";t.exports=function(){throw new Error("not implemented")}},6322:function(t,r,e){"use strict";var n,o=e(2508),i=e(5679),u=e(882);n=o()?i:u,t.exports=n},882:function(t){"use strict";t.exports=function(){throw new Error("not implemented")}},5679:function(t){"use strict";var r="function"==typeof Uint16Array?Uint16Array:void 0;t.exports=r},4773:function(t,r,e){"use strict";var n,o=e(9773),i=e(3004),u=e(3078);n=o()?i:u,t.exports=n},3078:function(t){"use strict";t.exports=function(){throw new Error("not implemented")}},3004:function(t){"use strict";var r="function"==typeof Uint32Array?Uint32Array:void 0;t.exports=r},7980:function(t,r,e){"use strict";var n,o=e(8114),i=e(6737),u=e(3357);n=o()?i:u,t.exports=n},3357:function(t){"use strict";t.exports=function(){throw new Error("not implemented")}},6737:function(t){"use strict";var r="function"==typeof Uint8Array?Uint8Array:void 0;t.exports=r},2684:function(t){"use strict";var r="function"==typeof Float64Array?Float64Array:null;t.exports=r},5569:function(t,r,e){"use strict";var n=e(3876);t.exports=n},3876:function(t,r,e){"use strict";var n=e(1448),o=e(2684);t.exports=function(){var t,r;if("function"!=typeof o)return!1;try{r=new o([1,3.14,-3.14,NaN]),t=n(r)&&1===r[0]&&3.14===r[1]&&-3.14===r[2]&&r[3]!=r[3]}catch(r){t=!1}return t}},9048:function(t,r,e){"use strict";var n=e(3763);t.exports=n},3763:function(t){"use strict";var r=Object.prototype.hasOwnProperty;t.exports=function(t,e){return null!=t&&r.call(t,e)}},7009:function(t,r,e){"use strict";var n=e(6784);t.exports=n},6784:function(t){"use strict";t.exports=function(){return"function"==typeof Symbol&&"symbol"==typeof Symbol("foo")}},3123:function(t,r,e){"use strict";var n=e(8481);t.exports=n},8481:function(t,r,e){"use strict";var n=e(7009)();t.exports=function(){return n&&"symbol"==typeof Symbol.toStringTag}},2508:function(t,r,e){"use strict";var n=e(3403);t.exports=n},3403:function(t,r,e){"use strict";var n=e(768),o=e(9668),i=e(187);t.exports=function(){var t,r;if("function"!=typeof i)return!1;try{r=new i(r=[1,3.14,-3.14,o+1,o+2]),t=n(r)&&1===r[0]&&3===r[1]&&r[2]===o-2&&0===r[3]&&1===r[4]}catch(r){t=!1}return t}},187:function(t){"use strict";var r="function"==typeof Uint16Array?Uint16Array:null;t.exports=r},9773:function(t,r,e){"use strict";var n=e(2822);t.exports=n},2822:function(t,r,e){"use strict";var n=e(2744),o=e(3899),i=e(746);t.exports=function(){var t,r;if("function"!=typeof i)return!1;try{r=new i(r=[1,3.14,-3.14,o+1,o+2]),t=n(r)&&1===r[0]&&3===r[1]&&r[2]===o-2&&0===r[3]&&1===r[4]}catch(r){t=!1}return t}},746:function(t){"use strict";var r="function"==typeof Uint32Array?Uint32Array:null;t.exports=r},8114:function(t,r,e){"use strict";var n=e(8066);t.exports=n},8066:function(t,r,e){"use strict";var n=e(8279),o=e(3443),i=e(2731);t.exports=function(){var t,r;if("function"!=typeof i)return!1;try{r=new i(r=[1,3.14,-3.14,o+1,o+2]),t=n(r)&&1===r[0]&&3===r[1]&&r[2]===o-2&&0===r[3]&&1===r[4]}catch(r){t=!1}return t}},2731:function(t){"use strict";var r="function"==typeof Uint8Array?Uint8Array:null;t.exports=r},1448:function(t,r,e){"use strict";var n=e(1453);t.exports=n},1453:function(t,r,e){"use strict";var n=e(6208),o="function"==typeof Float64Array;t.exports=function(t){return o&&t instanceof Float64Array||"[object Float64Array]"===n(t)}},9331:function(t,r,e){"use strict";var n=e(7980),o={uint16:e(6322),uint8:n};t.exports=o},5902:function(t,r,e){"use strict";var n=e(4106);t.exports=n},4106:function(t,r,e){"use strict";var n,o,i=e(9331);(o=new i.uint16(1))[0]=4660,n=52===new i.uint8(o.buffer)[0],t.exports=n},768:function(t,r,e){"use strict";var n=e(3823);t.exports=n},3823:function(t,r,e){"use strict";var n=e(6208),o="function"==typeof Uint16Array;t.exports=function(t){return o&&t instanceof Uint16Array||"[object Uint16Array]"===n(t)}},2744:function(t,r,e){"use strict";var n=e(2326);t.exports=n},2326:function(t,r,e){"use strict";var n=e(6208),o="function"==typeof Uint32Array;t.exports=function(t){return o&&t instanceof Uint32Array||"[object Uint32Array]"===n(t)}},8279:function(t,r,e){"use strict";var n=e(208);t.exports=n},208:function(t,r,e){"use strict";var n=e(6208),o="function"==typeof Uint8Array;t.exports=function(t){return o&&t instanceof Uint8Array||"[object Uint8Array]"===n(t)}},6315:function(t){"use strict";t.exports=1023},3105:function(t){"use strict";t.exports=2146435072},6988:function(t){"use strict";t.exports=-1023},9777:function(t){"use strict";t.exports=1023},3690:function(t){"use strict";t.exports=-1074},2918:function(t,r,e){"use strict";var n=e(4772).NEGATIVE_INFINITY;t.exports=n},4165:function(t){"use strict";var r=Number.POSITIVE_INFINITY;t.exports=r},6488:function(t){"use strict";t.exports=22250738585072014e-324},9668:function(t){"use strict";t.exports=65535},3899:function(t){"use strict";t.exports=4294967295},3443:function(t){"use strict";t.exports=255},7011:function(t,r,e){"use strict";var n=e(812);t.exports=n},812:function(t,r,e){"use strict";var n=e(4165),o=e(2918);t.exports=function(t){return t===n||t===o}},1883:function(t,r,e){"use strict";var n=e(1797);t.exports=n},1797:function(t){"use strict";t.exports=function(t){return t!=t}},513:function(t,r,e){"use strict";var n=e(5760);t.exports=n},5760:function(t){"use strict";t.exports=function(t){return Math.abs(t)}},6871:function(t,r,e){"use strict";var n=e(7838),o=e(1921),i=e(2490),u=[0,0];t.exports=function(t,r){var e,s;return n(u,t),e=u[0],e&=2147483647,s=o(r),i(e|=s&=2147483648,u[1])}},5848:function(t,r,e){"use strict";var n=e(6871);t.exports=n},5500:function(t,r,e){"use strict";var n=e(8397);t.exports=n},8397:function(t,r,e){"use strict";var n=e(4165),o=e(2918),i=e(6315),u=e(9777),s=e(6988),c=e(3690),a=e(1883),f=e(7011),p=e(5848),l=e(4948),v=e(8478),y=e(7838),h=e(2490),d=[0,0],x=[0,0];t.exports=function(t,r){var e,g;return 0===t||a(t)||f(t)?t:(l(d,t),r+=d[1],(r+=v(t=d[0]))<c?p(0,t):r>u?t<0?o:n:(r<=s?(r+=52,g=2220446049250313e-31):g=1,y(x,t),e=x[0],e&=2148532223,g*h(e|=r+i<<20,x[1])))}},4772:function(t,r,e){"use strict";var n=e(7548);t.exports=n},7548:function(t){"use strict";t.exports=Number},8478:function(t,r,e){"use strict";var n=e(4500);t.exports=n},4500:function(t,r,e){"use strict";var n=e(1921),o=e(3105),i=e(6315);t.exports=function(t){var r=n(t);return(r=(r&o)>>>20)-i|0}},2490:function(t,r,e){"use strict";var n=e(9639);t.exports=n},4445:function(t,r,e){"use strict";var n,o,i;!0===e(5902)?(o=1,i=0):(o=0,i=1),n={HIGH:o,LOW:i},t.exports=n},9639:function(t,r,e){"use strict";var n=e(4773),o=e(7382),i=e(4445),u=new o(1),s=new n(u.buffer),c=i.HIGH,a=i.LOW;t.exports=function(t,r){return s[c]=t,s[a]=r,u[0]}},5646:function(t,r,e){"use strict";var n;n=!0===e(5902)?1:0,t.exports=n},1921:function(t,r,e){"use strict";var n=e(6285);t.exports=n},6285:function(t,r,e){"use strict";var n=e(4773),o=e(7382),i=e(5646),u=new o(1),s=new n(u.buffer);t.exports=function(t){return u[0]=t,s[i]}},4948:function(t,r,e){"use strict";var n=e(9422);t.exports=n},9422:function(t,r,e){"use strict";var n=e(8857);t.exports=function(t,r){return 1===arguments.length?n([0,0],t):n(t,r)}},8857:function(t,r,e){"use strict";var n=e(6488),o=e(7011),i=e(1883),u=e(513);t.exports=function(t,r){return i(r)||o(r)?(t[0]=r,t[1]=0,t):0!==r&&u(r)<n?(t[0]=4503599627370496*r,t[1]=-52,t):(t[0]=r,t[1]=0,t)}},7838:function(t,r,e){"use strict";var n=e(4010);t.exports=n},5782:function(t,r,e){"use strict";var n,o,i;!0===e(5902)?(o=1,i=0):(o=0,i=1),n={HIGH:o,LOW:i},t.exports=n},4010:function(t,r,e){"use strict";var n=e(4903);t.exports=function(t,r){return 1===arguments.length?n([0,0],t):n(t,r)}},4903:function(t,r,e){"use strict";var n=e(4773),o=e(7382),i=e(5782),u=new o(1),s=new n(u.buffer),c=i.HIGH,a=i.LOW;t.exports=function(t,r){return u[0]=r,t[0]=s[c],t[1]=s[a],t}},6208:function(t,r,e){"use strict";var n,o=e(3123),i=e(7407),u=e(4210);n=o()?u:i,t.exports=n},7407:function(t,r,e){"use strict";var n=e(173);t.exports=function(t){return n.call(t)}},4210:function(t,r,e){"use strict";var n=e(9048),o=e(1403),i=e(173);t.exports=function(t){var r,e,u;if(null==t)return i.call(t);e=t[o],r=n(t,o);try{t[o]=void 0}catch(r){return i.call(t)}return u=i.call(t),r?t[o]=e:delete t[o],u}},173:function(t){"use strict";var r=Object.prototype.toString;t.exports=r},1403:function(t){"use strict";var r="function"==typeof Symbol?Symbol.toStringTag:"";t.exports=r},7843:function(t){t.exports=function(t,r,e,n,o){for(r=r.split?r.split("."):r,n=0;n<r.length;n++)t=t?t[r[n]]:o;return t===o?e:t}},2341:function(t,r){r.dset=function(t,r,e){r.split&&(r=r.split("."));for(var n,o,i=0,u=r.length,s=t;i<u&&"__proto__"!==(o=r[i++])&&"constructor"!==o&&"prototype"!==o;)s=s[o]=i===u?e:typeof(n=s[o])==typeof r?n:0*r[i]!=0||~(""+r[i]).indexOf(".")?{}:[]}},2263:function(t,r,e){"use strict";e.r(r),e.d(r,{default:function(){return i}});for(var n=[],o=0;o<64;)n[o]=0|4294967296*Math.sin(++o%Math.PI);function i(t){var r,e,i,u=[r=1732584193,e=4023233417,~r,~e],s=[],c=unescape(encodeURI(t))+"",a=c.length;for(t=--a/4+2|15,s[--t]=8*a;~a;)s[a>>2]|=c.charCodeAt(a)<<8*a--;for(o=c=0;o<t;o+=16){for(a=u;c<64;a=[i=a[3],r+((i=a[0]+[r&e|~r&i,i&r|~i&e,r^e^i,e^(r|~i)][a=c>>4]+n[c]+~~s[o|15&[c,5*c+1,3*c+5,7*c][a]])<<(a=[7,12,17,22,5,9,14,20,4,11,16,23,6,10,15,21][4*a+c++%4])|i>>>-a),r,e])r=0|a[1],e=a[2];for(c=4;c;)u[--c]+=a[c]}for(t="";c<32;)t+=(u[c>>3]>>4*(1^c++)&15).toString(16);return t}}}]);
//# sourceMappingURL=870.bundle.323974846b6d45afb45e.js.map