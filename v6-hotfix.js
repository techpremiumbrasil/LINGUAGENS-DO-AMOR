(function(){
'use strict';
const btn=document.querySelector('#btn-avancar');
if(btn){
  btn.addEventListener('click',function(ev){
    if(!document.body.classList.contains('v6-active'))return;
    ev.preventDefault();
    ev.stopImmediatePropagation();
    if(typeof avancar==='function')avancar();
  },true);
}
})();
