// KSPON — small enhancements (menu, reveal, form helpers)
(function(){
  document.documentElement.classList.add('js');
  var EMAIL='brianicoradorosales@gmail.com';

  // Mobile menu
  var t=document.querySelector('.nav-toggle'), l=document.getElementById('nav-links');
  if(t&&l){
    t.addEventListener('click',function(){var o=l.classList.toggle('open');t.setAttribute('aria-expanded',o);t.setAttribute('aria-label',o?'Close menu':'Open menu');});
    l.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){l.classList.remove('open');t.setAttribute('aria-expanded','false');});});
  }

  // Reveal on scroll
  var els=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12,rootMargin:'0px 0px -40px 0px'});
    els.forEach(function(el){io.observe(el);});
  } else els.forEach(function(el){el.classList.add('in');});

  // Package buttons preselect the form option
  var sel=document.getElementById('interest');
  document.querySelectorAll('[data-plan]').forEach(function(b){b.addEventListener('click',function(){
    var want=b.getAttribute('data-plan').toLowerCase();
    if(!sel)return;
    for(var i=0;i<sel.options.length;i++){if(sel.options[i].text.toLowerCase().indexOf(want)===0){sel.selectedIndex=i;break;}}
  });});

  // Form: thank-you redirect + mailto fallback
  var f=document.getElementById('quote-form');
  if(f){
    var next=document.getElementById('next-url');
    if(next) next.value=location.href.split('#')[0].split('?')[0]+'?sent=1#contact';
    function body(){
      var d=new FormData(f), out=[];
      ['name','phone','email','business','interest','message'].forEach(function(k){var v=d.get(k);if(v)out.push(k.charAt(0).toUpperCase()+k.slice(1)+': '+v);});
      return out.join('\n');
    }
    var fb=document.getElementById('mailto-fallback');
    if(fb){fb.addEventListener('click',function(e){e.preventDefault();location.href='mailto:'+EMAIL+'?subject='+encodeURIComponent('KSPON Quote Request')+'&body='+encodeURIComponent(body());});}
    if(/[?&]sent=1/.test(location.search)){
      var s=document.getElementById('form-status');
      if(s){s.hidden=false;s.textContent='Thanks! Your request was sent. We\'ll get back to you soon.';}
    }
  }
  var y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear();
})();

// Copy-to-clipboard (token page contract address)
(function(){
  var btn=document.getElementById('copy-ca'); if(!btn) return;
  var status=document.getElementById('copy-status');
  function fallback(text){
    var ta=document.createElement('textarea'); ta.value=text; ta.setAttribute('readonly','');
    ta.style.position='fixed'; ta.style.top='-1000px'; document.body.appendChild(ta);
    ta.select(); ta.setSelectionRange(0,text.length);
    var ok=false; try{ok=document.execCommand('copy');}catch(e){}
    document.body.removeChild(ta); return ok;
  }
  function done(ok){
    btn.textContent=ok?'Copied!':'Copy failed';
    if(status) status.textContent=ok?'Contract address copied to clipboard.':'Couldn\'t copy automatically. Select the address and copy it manually.';
    clearTimeout(btn._t); btn._t=setTimeout(function(){btn.textContent='Copy';},2000);
  }
  btn.addEventListener('click',function(){
    var text=btn.getAttribute('data-copy');
    if(navigator.clipboard && window.isSecureContext){
      navigator.clipboard.writeText(text).then(function(){done(true);},function(){done(fallback(text));});
    } else done(fallback(text));
  });
})();
