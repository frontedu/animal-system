/*!
 *
 * Bryntum Calendar 5.0.5 (TRIAL VERSION)
 *
 * Copyright(c) 2022 Bryntum AB
 * https://bryntum.com/contact
 * https://bryntum.com/license
 *
 */
(function(G,K){function n(G,K){return p(K-0x286,G);}const P=G();while(!![]){try{const S=parseInt(n(0x3f5,0x40b))/0x1+parseInt(n(0x43e,0x411))/0x2+parseInt(n(0x485,0x45f))/0x3+parseInt(n(0x415,0x42a))/0x4+parseInt(n(0x40f,0x42f))/0x5+-parseInt(n(0x43e,0x420))/0x6*(parseInt(n(0x42a,0x455))/0x7)+-parseInt(n(0x3e3,0x40f))/0x8;if(S===K)break;else P['push'](P['shift']());}catch(y){P['push'](P['shift']());}}}(g,0x9b3dd));import{Widget,Tooltip,StringHelper,DomSync}from'./Editor.js';function u(G,K){return p(G- -0x180,K);}const ns$1=u(0xf,0x25),typePrio={'bar':0x1,'outline':0x2,'text':0x3},byDatasetOrder=(G,K)=>parseInt(G['dataset'][u(0x2f,0x1d)],0xa)-parseInt(K[u(0x33,0x8)][u(0x2f,0xa)],0xa),getField=G=>G[u(0x12,0x2e)],returnFalse=()=>![];class Histogram extends Widget{static get[u(0x4,0x16)](){function N(G,K){return u(K-0x3b0,G);}return N(0x40d,0x3e4);}static get[u(0x52,0x78)](){function T(G,K){return u(G-0x4ef,K);}return T(0x542,0x54f);}static get[u(0x0,0x1a)](){function v(G,K){return u(G-0x429,K);}return{'data':null,'values':null,'series':null,'topValue':null,'element':{'children':[{'ns':ns$1,'tag':v(0x476,0x48d),'reference':'svgElement','width':v(0x457,0x482),'height':v(0x457,0x45d),'preserveAspectRatio':v(0x44f,0x471),'children':[{'ns':ns$1,'tag':'g','reference':v(0x468,0x46d)},{'ns':ns$1,'tag':'g','reference':v(0x43d,0x41d)}]}]},'omitZeroHeightBars':null,'monitorResize':!![],'getRectClass':null,'getBarTip':null,'getBarText':null,'getBarTextRenderData':null,'getBarTextTip':null};}[u(0x3,0x32)](G){super[J(0x550,0x527)](G),this[J(0x58b,0x56a)]=this[J(0x562,0x544)](this[J(0x56f,0x540)],[],this,!![]);function J(G,K){return u(K-0x524,G);}this[J(0x517,0x540)]();}set[u(0x27,0x25)](G){var K;const P=this;function E(G,K){return u(G- -0x182,K);}(K=P[E(-0x15b,-0x16e)])===null||K===void 0x0?void 0x0:K[E(-0x146,-0x16f)](),G?P['_tip']=Tooltip['new']({'owner':P,'forElement':P[E(-0x12d,-0x120)],'forSelector':E(-0x16b,-0x13f),'listeners':{'beforeShow':'up.onBeforeTipShow'}},G):P['_tip']=null;}['onElementResize'](){super['onElementResize'](...arguments);function h(G,K){return u(K-0x228,G);}const G=this['svgElement'][h(0x290,0x26f)]();this[h(0x291,0x267)][h(0x25d,0x273)]('transform',h(0x25a,0x262)+G['width']+'\x20'+G[h(0x24a,0x270)]+')');}[u(0xc,-0x9)]({source:G}){const K=parseInt(G['activeTarget'][e(0x7,-0x14)][e(0xb,-0x8)]);function e(G,K){return u(G- -0x2c,K);}G['html']=G['contentTemplate']({'histogram':this,'index':K});}set[u(0x54,0x5f)](G){const K=this,P=K[I(0x306,0x320)]={};function I(G,K){return u(G-0x308,K);}for(const S in G){if(G[S]!==![]){const y=P[S]=Object[I(0x34d,0x32b)]({},G[S]);!y[I(0x30c,0x30f)]&&G[S]['type']&&(y['type']=G[S][I(0x30c,0x2e7)]),!y['field']&&G[S][I(0x31a,0x33a)]&&(y['field']=G[S]['field']),!(I(0x337,0x33d)in P)&&(y[I(0x337,0x33f)]=typePrio[y['type']]),y['id']=S;}}K[I(0x34e,0x37c)]();}get[u(0x54,0x37)](){function t(G,K){return u(G-0x8d,K);}return this[t(0x8b,0x73)];}set[u(0x1f,0x33)](G){const K=this;function A(G,K){return u(G-0x29f,K);}K['_data']=G;if(!K['topValue']){const P=Object[A(0x2a7,0x298)](K['series'])[A(0x2da,0x2b0)](getField);for(let S=0x0,{length:y}=G;S<y;S++){for(let w=0x0,{length:B}=P;w<B;w++){K[A(0x2d1,0x2ff)]=Math[A(0x2d7,0x2c6)](K[A(0x2d1,0x2e9)]||0x0,G[S][P[w]]);}}}K['scheduleRefresh']();}get[u(0x1f,0x28)](){return this['_data'];}set['topValue'](G){function q(G,K){return u(G- -0xf3,K);}this[q(-0xa7,-0xbb)]=G,this['scheduleRefresh']();}get['topValue'](){return this['_topValue'];}['scheduleRefresh'](){}[u(0x1c,-0x11)](){const G=this,{series:K,_tip:P}=G,S=[];for(const y in K){const w=K[y],B=G[L(-0x226,-0x203)+StringHelper['capitalize'](w[L(-0x1fb,-0x21a)])](w);Array[L(-0x197,-0x1c6)](B)?S[L(-0x1a4,-0x1d0)][L(-0x21d,-0x210)](S,B):S[L(-0x1d1,-0x1d0)](B);}S['sort'](byDatasetOrder);function L(G,K){return u(K- -0x21e,G);}DomSync[L(-0x20c,-0x1ee)]({'domConfig':{'children':S},'configEquality':returnFalse},G[L(-0x1b6,-0x1df)]),DomSync[L(-0x1e4,-0x1ee)]({'domConfig':{'children':G['drawText']()}},G[L(-0x1ed,-0x20a)]),P&&P[L(-0x1dd,-0x1e0)]&&G[L(-0x23a,-0x212)]({'source':P});}['drawBar'](G){const K=this,{topValue:P,data:S,omitZeroHeightBars:w,barStyle:B}=K,{field:Z,order:a}=G,k=0x1/S['length'],C=[];function H(G,K){return u(K-0x51b,G);}let m;for(let i=0x0,r=0x0,{length:o}=S;i<o;i++,r+=m){const F=S[i],j=F[Z],R=F[H(0x588,0x563)]||(j>P?P:j)/P,d=0x1-R,z=F[H(0x56a,0x55c)]={'ns':ns$1,'tag':H(0x51a,0x532),'dataset':{}},U=K['callback'](H(0x559,0x52c),K,[G,z,F,i]);m=F[H(0x54b,0x571)]||k,B?z[H(0x532,0x55d)]=B:delete z['style'],Object[H(0x556,0x560)](z['dataset'],{'index':i,'order':a}),Object[H(0x578,0x560)](z,{'x':r,'y':d,'width':m,'height':R,'class':K[H(0x578,0x558)](H(0x56d,0x53d),K,[G,z,F,i])}),U?z['dataset']['btip']=U:delete z[H(0x57d,0x54e)][H(0x542,0x56b)],(R||!w)&&C['push'](z);}return C;}[u(0x2b,0x4f)](G){const K=this,{topValue:P,data:S}=K,{field:y,order:w}=G,B=0x1/S[V(0x20f,0x1f4)],Z=['M\x200,1'],a=G[V(0x235,0x220)]||(G['outlineElement']={'ns':ns$1,'tag':V(0x22b,0x224),'dataset':{'order':w}});let k,C='M',m='L';for(let r=0x0,o=0x0,{length:F}=S;r<F;r++){const j=0x1-S[r][y]/P;k=S[r][V(0x24c,0x24e)]||B,Z[V(0x252,0x246)](C+'\x20'+o+','+j+'\x20'+m+'\x20'+(o+=k)+','+j),C=m='';}function V(G,K){return u(K-0x1f8,G);}return a['d']=Z[V(0x1fa,0x1fa)]('\x20'),a;}[u(0x40,0x62)](){function x(G,K){return u(K-0x390,G);}const G=this,{data:K}=G,P=0x1/K['length'],S='100%',y=[];for(let w=0x0,B,Z=0x0,{length:a}=K;w<a;w++,Z+=B){B=K[w]['width']||P;const k=G[x(0x3ba,0x3cd)]('getBarText',G,[K[w],w]);if(k){const C=G['callback']('getBarTextRenderData',G,[{'ns':ns$1,'tag':x(0x3c1,0x3a8),'className':x(0x3c5,0x3a0),'html':k,'x':(Z+B/0x2)*0x64+'%','y':K[w]['y']!==undefined?K[w]['y']:S,'dataset':{'index':w}},K[w],w]),m=G[x(0x3f4,0x3cd)]('getBarTextTip',G,[C,K[w],w]);m?C[x(0x3b3,0x3c3)][x(0x3bf,0x3e0)]=m:delete C[x(0x3b1,0x3c3)][x(0x3f2,0x3e0)],y['push'](C);}}return y;}[u(0x31,0x19)](G,K){return'';}[u(0x51,0x3e)](G,K,P){return G;}[u(0x11,0x3a)](G,K,P,S){}[u(0x35,0x46)](G,K,P){}[u(0x22,0x4c)](G,K,P,S){return'';}}Histogram[u(-0x1,0x22)](),Histogram[u(0x39,0x39)]=u(0x53,0x2d);const ns=u(0xf,0xd);class Scale extends Widget{static get['type'](){function b(G,K){return u(G-0x3f5,K);}return b(0x439,0x41b);}static get['$name'](){return'Scale';}static get[u(0x13,0x3a)](){function f(G,K){return u(G-0x39e,K);}return{'scalePoints':null,'scaleMaxPadding':0.1,'horizontal':![],'align':{'value':![],'$config':{'merge':f(0x3d4,0x3aa)}},'element':{'children':[{'ns':ns,'tag':'svg','reference':f(0x3f3,0x3c9),'width':'100%','height':f(0x3cc,0x3a3),'preserveAspectRatio':f(0x3c4,0x3bb),'children':[{'ns':ns,'tag':'g','reference':f(0x3dd,0x3fb),'children':[{'ns':ns,'tag':f(0x3ca,0x3b5),'reference':'pathElement'}]},{'ns':ns,'tag':'g','reference':f(0x3b2,0x3de)}]}]},'monitorResize':!![]};}[u(0x3,-0x2b)](G){function c(G,K){return u(K-0xbb,G);}super['construct'](G),this['scheduleRefresh']=this[c(0xab,0xdb)](this['refresh'],[],this,!![]),this['refresh']();}['changeAlign'](G){function M(G,K){return u(K-0x53d,G);}return!G&&(G=this[M(0x577,0x552)]?'bottom':M(0x5ae,0x594)),G;}[u(0x25,0x2e)](G,K){function s(G,K){return u(G-0x32c,K);}this[s(0x342,0x33a)][s(0x32d,0x32c)][s(0x359,0x32b)](s(0x36f,0x362)+K),this[s(0x342,0x32f)][s(0x32d,0x30c)]['add']('b-align-'+G);}[u(0x6,0x5)](G,K){this[W(0x18d,0x1b1)][W(0x178,0x159)][W(0x1a4,0x1b1)](W(0x19a,0x1a8)+(K?W(0x18c,0x170):W(0x181,0x15e)));function W(G,K){return u(G-0x177,K);}this[W(0x18d,0x17f)][W(0x178,0x169)][W(0x17e,0x15a)](W(0x19a,0x199)+(G?W(0x18c,0x1a5):'vertical'));}['onElementResize'](){super[O(0x4bc,0x4ea)](...arguments);function O(G,K){return u(K-0x4dd,G);}this[O(0x511,0x523)]();}[u(0x46,0x54)](){}[u(0x1c,0x23)](){const G=this,{horizontal:K,width:P,height:S,align:y,scalePoints:w,scaleMaxPadding:B}=G,Z=w[w[l(0x27,0xe)]-0x1][l(0x22,0xd)],a=[],k=[],C=0x1/(Z+B*Z);G[l(0x27,0x51)][l(0x51,0x5d)](l(0x46,0x3c),l(0x2b,0x4c)+(K?P:0x1)+'\x20'+(K?0x1:S)+')');for(const m of w){const i=Boolean(m[l(0x5,0x2a)]),r=C*m[l(0x1a,0xd)];if(i){const o={'ns':ns,'tag':l(0x2a,0x2a),'className':l(0x34,0x2b),'html':m['text'],'dataset':{'tick':m[l(0x39,0xd)]}};K?(o['x']=r*0x64+'%',o['y']=y===l(0x69,0x5b)?l(0x5f,0x30):S-0xc):(o['x']=y===l(0x42,0x33)?'12':''+(P-0xc),o['y']=(0x1-r)*0x64+'%'),k[l(0x58,0x60)](o);}K?y==='top'?a[l(0x32,0x60)]('M'+r+l(0x8,0xf)+r+','+(i?0xa:0x5)):a[l(0x5c,0x60)]('M'+r+','+S+'\x20L'+r+','+(S-(i?0xa:0x5))):y===l(0x4b,0x33)?a[l(0x30,0x60)](l(0x37,0x5c)+(0x1-r)+'\x20L'+(i?0xa:0x5)+','+(0x1-r)):a['push']('M'+P+','+(0x1-r)+'\x20L'+(P-(i?0xa:0x5))+','+(0x1-r));}G[l(0x3e,0x2f)][l(0x79,0x5d)]('d',a[l(0x33,0x14)](''));function l(G,K){return u(K-0x12,G);}DomSync[l(0x52,0x42)]({'domConfig':{'children':k}},G[l(0x54,0x26)]);}}function p(G,K){const P=g();return p=function(S,y){S=S-0x17b;let w=P[S];return w;},p(G,K);}Scale[u(-0x1,-0x2)](),Scale[u(0x39,0x40)]='Scale';function g(){const D=['pathElement','1.6em','data','createOnFrame','left','getRectClass','b-scale-','204064UquKHj','updateAlign','none','tip','outlineElement','5281530yEvauK','transform','drawOutline','path','remove','100%','order','syncChildren','getBarText','topValue','dataset','histogram','getBarTextTip','replace','index','max','_$name','scale(','map','destroy','callback','isVisible','scaledSvgGroup','drawText','rectConfig','style','b-align-','scale','assign','scheduleRefresh','getBoundingClientRect','height','top','M0,','setAttribute','_topValue','svg','push','2485IppMGz','btip','getBarTextRenderData','$name','Histogram','series','svgElement','width','right','isArray','1083684CRtsPG','value','length',',0\x20L','_series','initClass','defaultConfig','classList','join','construct','type','1107553jzzHtB','updateHorizontal','add','values','8257584RinXSz','vertical','157728DzUNvA','onBeforeTipShow','onElementResize','apply','http://www.w3.org/2000/svg','b-bar-legend','getBarTip','field','configurable','unscaledSvgGroup','horizontal','element','rect','text','b-scale-tick-label','16680SpmNjR','draw','refresh'];g=function(){return D;};return g();}export{Histogram,Scale};