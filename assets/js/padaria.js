/* Régua do dia: posição do marcador "agora" pelo horário local do navegador.
   Horários (fonte: Google Maps e bio do Instagram): seg–sex 6h30–20h, sáb 7h–18h, dom fechado. */
(function(){
  var INICIO=6*60+30, FIM=20*60; // limites da régua: 6h30 a 20h
  var HOR={1:[390,1200],2:[390,1200],3:[390,1200],4:[390,1200],5:[390,1200],6:[420,1080]};
  var DIAS=['domingo','segunda','terça','quarta','quinta','sexta','sábado'];
  function hm(m){var h=Math.floor(m/60),mi=m%60;return h+'h'+(mi?String(mi).padStart(2,'0'):'');}
  function pct(m){return Math.max(0,Math.min(100,(m-INICIO)/(FIM-INICIO)*100));}
  function proxima(d){ // próximo dia de abertura a partir de amanhã
    for(var i=1;i<=7;i++){var dia=(d+i)%7;if(HOR[dia])return {i:i,dia:dia};}
  }
  function calcula(agora){
    var d=agora.getDay(), m=agora.getHours()*60+agora.getMinutes(), h=HOR[d];
    var r={dia:d,min:m,aberto:false,estado:'fechado',texto:'',pos:null,faixa:[0,0]};
    if(h){r.faixa=[pct(h[0]),pct(h[1])];}
    if(h && m>=h[0] && m<h[1]){r.aberto=true;r.estado='aberto';r.pos=pct(m);r.texto='Aberto agora · até '+hm(h[1]);}
    else if(h && m<h[0]){r.texto='Fechado agora · abre hoje às '+hm(h[0]);}
    else{var p=proxima(d);r.estado=h?'fechado':'domingo';
      r.texto=(h?'Fechado agora':'Domingo: fechado')+' · abre '+(p.i===1?'amanhã':DIAS[p.dia])+' às '+hm(HOR[p.dia][0]);}
    if(agora.getMonth()===9 && agora.getDate()===12){r.texto='Feriado de 12/10: horário a confirmar';r.estado='fechado';r.pos=null;r.aberto=false;}
    return r;
  }
  window.calculaDiaPadaria=calcula;
  var regua=document.getElementById('regua'); if(!regua) return;
  var mk=document.getElementById('marcador'), mh=document.getElementById('marcador-hora'),
      faixa=document.getElementById('regua-aberto'), st=document.getElementById('status');
  function atualiza(){
    var agora=new Date(), r=calcula(agora);
    regua.setAttribute('data-estado',r.estado);
    faixa.style.left=r.faixa[0]+'%'; faixa.style.width=(r.faixa[1]-r.faixa[0])+'%';
    if(r.pos!==null){mk.style.left=r.pos+'%';mh.textContent='agora '+hm(r.min);mk.classList.toggle('vira',r.pos>62);}
    regua.setAttribute('data-posicao',r.pos===null?'':r.pos.toFixed(1));
    st.innerHTML='<span class="ponto" aria-hidden="true"></span>'+r.texto;
  }
  atualiza(); setInterval(atualiza,60000);
})();
