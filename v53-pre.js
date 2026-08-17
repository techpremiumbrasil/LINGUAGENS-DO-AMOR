(function(global){
'use strict';
if(!global)return;
if(!global.__LOVE_NATIVE_FETCH && typeof global.fetch==='function'){
  global.__LOVE_NATIVE_FETCH=global.fetch.bind(global);
}
global.__LOVE_PRE_VERSION='5.3-ab1';
})(typeof window!=='undefined'?window:null);
