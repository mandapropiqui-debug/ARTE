(()=>{
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const brl=v=>v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const IMG=n=>window.__A?window.__A[n]:'assets/img/'+n;
const WPP_PADRAO='5586988238951';
/* Centro e Sao Marcos: numeros confirmados. Riverside e Joquei usam o WhatsApp oficial ate a Artesani informar o proprio. */
const H5=[1,2,3,4,5];
const LOJAS=[
 {id:'centro',nome:'Centro',end:'Rua 7 de Setembro, 226, Centro (Sul)',lat:-5.0927993,lng:-42.8112795,wpp:'558632218576',tel:'558632218576',fone:'(86) 3221-8576',hr:'Seg a sex, 8h às 18h. Sáb, 8h às 12h',h:[[H5,8,18],[[6],8,12]],map:'https://maps.google.com/?q=Artesani+Farmacia+de+Manipulacao+Rua+Sete+de+Setembro+226+Teresina'},
 {id:'saomarcos',nome:'São Marcos',end:'Rua Gov. Artur de Vasconcelos, 389, sala 2, Ambulatório do Hospital São Marcos',lat:-5.0899551,lng:-42.8027231,wpp:'558632210677',tel:'558632210677',fone:'(86) 3221-0677',hr:'Seg a sex, 8h às 17h. Fecha para almoço e aos sábados',h:[[H5,8,17]],map:'https://maps.google.com/?q=Artesani+Rua+Governador+Raimundo+Artur+de+Vasconcelos+389+Teresina'},
 {id:'riverside',nome:'Riverside Shopping',end:'Praça do Caribe, Av. Ininga, 1201, loja V62, térreo, Jóquei',lat:-5.0785618,lng:-42.7950061,wpp:WPP_PADRAO,tel:'558632301248',fone:'(86) 3230-1248',hr:'Seg a sáb, 9h às 21h',h:[[[1,2,3,4,5,6],9,21]],map:'https://maps.google.com/?q=Artesani+Riverside+Shopping+Teresina'},
 {id:'joquei',nome:'Jóquei',end:'Av. Homero Castelo Branco, 1080, São Cristóvão',lat:-5.0748697,lng:-42.7816514,wpp:WPP_PADRAO,tel:'558632320849',fone:'(86) 3232-0849',hr:'Seg a sex, 8h às 18h. Sáb, 8h às 12h',h:[[H5,8,18],[[6],8,12]],map:'https://maps.google.com/?q=Artesani+Avenida+Homero+Castelo+Branco+1080+Teresina'}
];
/* [cat, nome, detalhe, de, por, arquivo] — itens que exigem receita ficam fora do carrinho */
const P=[
 ['sup','Mulungu','250mg, 30 cápsulas',55,35,'01'],
 ['sup','Passiflora','300mg, 60 cápsulas',48,31,'02'],
 ['sup','Pant-G','Complexo vitamínico, 90 cápsulas',90,68,'03'],
 ['sup','Ormona','Original 500mg, 30 cápsulas',160,125,'04'],
 ['sup','Nutremax','30 cápsulas',85,45,'06'],
 ['sup','Akkermat','150mg, 30 cápsulas',160,108.9,'07'],
 ['sup','Okralin','30 cápsulas',95,74.9,'08'],
 ['sup','Drenow C','500mg, 60 cápsulas',150,75,'09'],
 ['sup','Laranja Moro','500mg, 30 cápsulas',60,40,'10'],
 ['sup','Morosil','500mg, 30 cápsulas',130,104,'11'],
 ['cos','Sérum PDRN','Original, 30ml',160,110,'12'],
 ['cos','Sérum exossomas','30ml',180,130,'13'],
 ['cos','Sérum clareador','Facial, 30ml',88,65,'14'],
 ['cos','Eye cream','NAD+ retinol, 10ml',190,162.8,'15'],
 ['cos','Minoxhair 5%','Loção capilar, 100ml',98,65,'16'],
 ['sup','Protetor solar oral','30 cápsulas',85,54,'17'],
 ['sup','Licopeno de tomate','Premium, 60 cápsulas',210,175,'18'],
 ['cos','Body splash romã','120ml',98,50,'19']
].map((a,i)=>({i,cat:a[0],nome:a[1],det:a[2],de:a[3],por:a[4],img:IMG('p'+a[5]+'.jpg')}));
const cart={};let filtro='todos',unidade='centro',modo='Retirada na loja',pos=null,aberto=false;

/* ---------- catalogo ---------- */
function grid(){
  const all=P.filter(p=>filtro==='todos'||p.cat===filtro),l=aberto?all:all.slice(0,4);
  $('#grid').classList.toggle('fade',!aberto&&all.length>4);$('#more').hidden=all.length<=4;$('#moretx').textContent=aberto?'Mostrar menos':'Clique para abrir todos os produtos ('+all.length+')';$('#more').setAttribute('aria-expanded',aberto);
  $('#grid').innerHTML=l.map(p=>`<article class="pc ${cart[p.i]?'in':''}" data-i="${p.i}"><img src="${p.img}" alt="${p.nome}" loading="lazy" width="320" height="320"><div class="b"><h3>${p.nome}</h3><p class="d">${p.det}</p><span class="de">${brl(p.de)}</span><span class="por">${brl(p.por)}</span><button class="add" data-a="1"><i class="ph ph-plus"></i>Adicionar</button><div class="step"><button data-a="-" aria-label="Menos"><i class="ph ph-minus"></i></button><b>${cart[p.i]||0}</b><button data-a="+" aria-label="Mais"><i class="ph ph-plus"></i></button></div></div></article>`).join('');
}
$('#grid').addEventListener('click',e=>{
  const b=e.target.closest('button[data-a]');if(!b)return;
  const i=+b.closest('.pc').dataset.i,a=b.dataset.a;
  cart[i]=Math.max(0,(cart[i]||0)+(a==='-'?-1:1));if(!cart[i])delete cart[i];
  const c=$(`.pc[data-i="${i}"]`);c.classList.toggle('in',!!cart[i]);c.querySelector('.step b').textContent=cart[i]||0;
  refresh();
});
$('#more').addEventListener('click',()=>{aberto=!aberto;grid();if(!aberto)$('#produtos').scrollIntoView({behavior:'smooth'});});
$('#seg').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;filtro=b.dataset.f;$$('#seg button').forEach(x=>x.classList.toggle('on',x===b));grid();});

function totals(){let n=0,t=0;for(const k in cart){n+=cart[k];t+=cart[k]*P[k].por;}return{n,t};}
function refresh(){
  const{n,t}=totals();
  $('#cnt').textContent=n;$('#btot').textContent=brl(t);$('#bitems').textContent=n===1?'1 item no pedido':n+' itens no pedido';
  $('#bar').classList.toggle('show',n>0);document.body.classList.toggle('cart',n>0);
  if($('#sheet').classList.contains('open'))sheet();
}
/* ---------- geo ---------- */
function dist(a,b,c,d){const R=6371,r=x=>x*Math.PI/180,dl=r(c-a),dg=r(d-b);const h=Math.sin(dl/2)**2+Math.cos(r(a))*Math.cos(r(c))*Math.sin(dg/2)**2;return 2*R*Math.asin(Math.sqrt(h));}
function locate(cb){
  if(!navigator.geolocation){alert('Seu navegador não permite localização. Escolha a loja na lista.');return;}
  navigator.geolocation.getCurrentPosition(p=>{pos={lat:p.coords.latitude,lng:p.coords.longitude};
    LOJAS.forEach(l=>l.km=dist(pos.lat,pos.lng,l.lat,l.lng));
    const n=[...LOJAS].sort((a,b)=>a.km-b.km)[0];unidade=n.id;lojas();if($('#sheet').classList.contains('open'))sheet();if(cb)cb();},
    ()=>alert('Não consegui pegar sua localização. Escolha a loja na lista.'),{enableHighAccuracy:false,timeout:9000,maximumAge:300000});
}
function aberta(l){
  const f=new Intl.DateTimeFormat('en-US',{timeZone:'America/Fortaleza',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
  const g=t=>f.find(x=>x.type===t).value;const wd={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6}[g('weekday')];
  const h=(+g('hour')%24)+(+g('minute'))/60;
  return l.h.some(([d,o,c])=>d.includes(wd)&&h>=o&&h<c);
}
const nodes={};
function lojas(){
  const ord=[...LOJAS];if(pos)ord.sort((a,b)=>a.km-b.km);
  const fk=x=>x.km<10?x.km.toFixed(1).replace('.',','):Math.round(x.km);
  LOJAS.forEach(x=>{
    let n=nodes[x.id];
    if(!n){
      n=nodes[x.id]=document.createElement('div');n.className='u rv in';
      n.innerHTML=`<div class="top"><h3>${x.nome}</h3><span class="st"></span></div><div class="row"><div><p class="km" hidden></p><p>${x.end}</p><p class="hr">${x.hr}</p></div><a class="mp" href="${x.map}" target="_blank" rel="noopener" aria-label="Ver ${x.nome} no mapa"><i class="ph-fill ph-map-pin pin"></i><img src="${IMG('mapa-'+x.id+'.jpg')}" alt="Mapa da loja ${x.nome}" loading="lazy" width="116" height="116"></a></div><div class="act"><a class="w" href="${x.id==='centro'?'https://wa.me/'+x.wpp:'tel:+'+x.tel}" target="_blank" rel="noopener"><i class="ph-fill ph-${x.id==='centro'?'whatsapp-logo':'phone'}"></i>${x.fone}</a><a href="${x.map}" target="_blank" rel="noopener"><i class="ph-fill ph-navigation-arrow"></i>Como chegar</a></div>`;
      $('#ul').appendChild(n);
    }
    const ab=aberta(x),st=n.querySelector('.st');st.textContent=ab?'Aberta agora':'Fechada agora';st.classList.toggle('ok',ab);
    const km=n.querySelector('.km');km.hidden=!pos;if(pos){km.textContent=(ord[0]===x?'Mais perto de você, a ':'A ')+fk(x)+' km';}
    n.style.order=ord.indexOf(x);
  });
}
$('#geo').addEventListener('click',()=>locate());
/* ---------- carrinho / pedido ---------- */
function sheet(){
  const ks=Object.keys(cart);
  $('#items').innerHTML=ks.length?ks.map(k=>{const p=P[k];return `<div class="it"><img src="${p.img}" alt=""><div class="tx"><b>${p.nome}</b>${p.det}<br>${brl(p.por*cart[k])}</div><div class="q"><button data-q="-${k}" aria-label="Menos"><i class="ph ph-minus"></i></button><span>${cart[k]}</span><button data-q="+${k}" aria-label="Mais"><i class="ph ph-plus"></i></button></div></div>`}).join(''):'<p class="empty">Seu pedido está vazio. Escolha produtos para começar.</p>';
  $('#co').hidden=!ks.length;
  const l=[...LOJAS];if(pos)l.sort((a,b)=>a.km-b.km);
  $('#uopt').innerHTML=l.map(x=>`<button class="op ${x.id===unidade?'on':''}" data-u="${x.id}"><span><b>${x.nome}</b><small>${pos?'a '+(x.km<10?x.km.toFixed(1).replace('.',','):Math.round(x.km))+' km':x.end}</small></span>${pos&&x===l[0]?'<span class="k">Mais perto</span>':''}</button>`).join('');
  $('#tot').textContent=brl(totals().t);
}
$('#items').addEventListener('click',e=>{const b=e.target.closest('[data-q]');if(!b)return;const s=b.dataset.q[0],k=b.dataset.q.slice(1);cart[k]=Math.max(0,(cart[k]||0)+(s==='-'?-1:1));if(!cart[k])delete cart[k];grid();refresh();});
$('#uopt').addEventListener('click',e=>{const b=e.target.closest('[data-u]');if(!b)return;unidade=b.dataset.u;sheet();});
$('#mode').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;modo=b.dataset.m;$$('#mode button').forEach(x=>x.classList.toggle('on',x===b));$('#endw').hidden=!modo.startsWith('Entrega');});
$('#geo2').addEventListener('click',()=>locate());
$('#bar').addEventListener('click',()=>{sheet();$('#sheet').classList.add('open');});
$('#sheet').addEventListener('click',e=>{if(e.target.closest('[data-close]'))$('#sheet').classList.remove('open');});
$('#send').addEventListener('click',()=>{
  const u=LOJAS.find(x=>x.id===unidade)||LOJAS[0],nome=$('#nome').value.trim(),end=$('#end').value.trim();
  if(!nome){$('#nome').focus();$('#nome').style.borderColor='#b3261e';return;}
  if(modo.startsWith('Entrega')&&!end){$('#end').focus();$('#end').style.borderColor='#b3261e';return;}
  const ks=Object.keys(cart);if(!ks.length)return;
  const linhas=ks.map(k=>{const p=P[k];return `• ${cart[k]}x ${p.nome} (${p.det}) - ${brl(p.por*cart[k])}`}).join('\n');
  let m=`Olá, Artesani! Quero fazer um pedido pela unidade *${u.nome}*.\n\n${linhas}\n\n*Total: ${brl(totals().t)}*\n${modo}`;
  if(modo.startsWith('Entrega'))m+=`\nEndereço: ${end}`;
  m+=`\nMeu nome: ${nome}`;
  window.open(`https://wa.me/${u.wpp}?text=${encodeURIComponent(m)}`,'_blank','noopener');
});
/* ---------- abertura (2 toques) ---------- */
const op=$('#open');let step=0;
function reveal(){
  const t0=performance.now(),D=1000;
  const f=t=>{const k=Math.min(1,(t-t0)/D),e=1-Math.pow(1-k,3),r=e*150;
    const m=`radial-gradient(circle at 50% 46%,transparent ${r}%,#000 ${r+.5}%)`;op.style.webkitMaskImage=m;op.style.maskImage=m;
    if(k<1)requestAnimationFrame(f);else{op.remove();}};
  requestAnimationFrame(f);
  document.body.classList.remove('lock');document.body.classList.add('ready');setTimeout(mascLoop,1500);
  setTimeout(()=>$$('#capa .rv').forEach(x=>x.classList.add('in')),200);
}
function tap(){
  if(step>=2)return;step++;const d=$$('#open .dots s');
  if(step===1){op.classList.add('t1');d[1].classList.add('on');$('#oh').textContent='Falta a segunda cápsula';$('#op').textContent='Mais um toque para abrir.';}
  else{op.classList.add('t2');op.style.pointerEvents='none';$('#oh').textContent='Fórmula pronta';$('#op').textContent='Abrindo a Artesani...';setTimeout(reveal,1500);}
}
op.addEventListener('click',tap);
op.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();tap();}});
/* ---------- reveal, parallax, contadores ---------- */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.12,rootMargin:'0px 0px -6% 0px'});
const wio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target._w.classList.add('in');wio.unobserve(e.target);}}),{threshold:0,rootMargin:'0px 0px -12% 0px'});
$$('.rv').forEach(x=>{if(x.classList.contains('in'))return;if(x.dataset.a==='wipe'){x.parentElement._w=x;wio.observe(x.parentElement);}else io.observe(x);});
const co=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;co.unobserve(e.target);const to=+e.target.dataset.count,t0=performance.now();
  const f=t=>{const k=Math.min(1,(t-t0)/1500);e.target.textContent=Math.round(to*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(f);};requestAnimationFrame(f);}),{threshold:.6});
$$('[data-count]').forEach(x=>co.observe(x));
const px=$$('[data-px]');
/* ---------- mascote: anda so pelas bordas (baixo L>R, cima R>L, baixo R>L, cima L>R) ---------- */
const mascEl=$('#masc');
const LEGS=[{v:'mb',from:'l'},{v:'mt',from:'r'},{v:'mb',from:'r'},{v:'mt',from:'l'}];
let leg=0,mrun=false;
function falaAtual(){return FALAS[cur]||FALAS.capa;}
async function mascLoop(){
  if(mrun||matchMedia('(prefers-reduced-motion:reduce)').matches)return;mrun=true;
  while(true){
    const L=LEGS[leg%4];leg++;const W=innerWidth,S=46;
    const fromL=L.from==='l';
    const off0=fromL?-70:W+24, corner=fromL?W-S-12:12, off1=fromL?W+24:-70;
    mascEl.className=L.v+' '+(fromL?'pr':'pl')+(fromL?'':' fl');
    $('#bb').textContent=falaAtual();
    const D=11000;
    const an=mascEl.animate([{transform:`translateX(${off0}px)`,offset:0},{transform:`translateX(${corner}px)`,offset:.4,easing:'ease-out'},{transform:`translateX(${corner}px)`,offset:.78},{transform:`translateX(${off1}px)`,offset:1,easing:'ease-in'}],{duration:D,fill:'both'});
    setTimeout(()=>{$('#bb').textContent=falaAtual();mascEl.classList.add('say');},D*.42);
    setTimeout(()=>mascEl.classList.remove('say'),D*.76);
    await an.finished;
    await new Promise(r=>setTimeout(r,1200));
  }
}
/* ---------- scrollspy, menu, mascote ---------- */
const secs=$$('main section'),links=$$('#menu a'),menu=$('#menu');
const FALAS={capa:'Oi! Bem-vindo à Artesani.',produtos:'Escolha e eu monto o pedido!',campanhas:'Olha as novidades!',entrega:'A gente leva até você.',lojas:'Tem loja pertinho de você.',historia:'Desde 1995, com a sua cara.',contato:'Pode chamar, a gente responde!'};
let cur='',tick=false;
function spy(){
  tick=false;const vh=innerHeight;let at=secs[0],under=secs[0];
  for(const s of secs){const r=s.getBoundingClientRect();if(r.top<=vh*.4&&r.bottom>vh*.4)at=s;if(r.top<=40&&r.bottom>40)under=s;}
  menu.classList.toggle('lite',under.dataset.t==='l');
  if(at.id!==cur){cur=at.id;links.forEach(a=>a.classList.toggle('on',a.dataset.s.split(' ').includes(cur)));
    mascEl.querySelector('.m').src=IMG('simbolo-'+(at.dataset.t==='l'?'verde':'lima')+'.png');}
  for(const el of px){const r=el.parentElement.getBoundingClientRect();if(r.bottom<0||r.top>vh)continue;el.style.transform=`translate3d(0,${((r.top+r.height/2-vh/2)*parseFloat(el.dataset.px)).toFixed(1)}px,0)`;}
}
addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(spy);}},{passive:true});
addEventListener('resize',spy);
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=$(a.getAttribute('href'));if(t){e.preventDefault();t.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});}}));
grid();lojas();refresh();spy();
setInterval(lojas,60000);
})();
