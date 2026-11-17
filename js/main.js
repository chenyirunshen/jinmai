/* Jinmai Floral catalogue and trade enquiries */
(() => {
  'use strict';
  const en = document.documentElement.lang === 'en';
  const text = (a,b) => en ? a : b;
  const menu=document.querySelector('.menu-toggle'), nav=document.querySelector('#navigation');
  function closeMenu(){menu?.setAttribute('aria-expanded','false');nav?.classList.remove('open');}
  menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?text('Close menu','收起菜单'):text('Open menu','展开菜单'));nav.classList.toggle('open',open);});
  nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
  matchMedia('(min-width:761px)').addEventListener('change',closeMenu);
  document.querySelectorAll('.language, .footer-grid a[href]').forEach(a=>{if(a.classList.contains('language')||a.getAttribute('href')===(en?'../':'en/')+(location.pathname.split('/').pop()||'index.html'))a.addEventListener('click',()=>{try{localStorage.setItem('jm_lang',en?'zh':'en');}catch(_){}});});
  const file=location.pathname.split('/').pop()||'index.html';
  if(!en && file==='index.html'){
    let preference='';try{preference=localStorage.getItem('jm_lang')||'';}catch(_){}
    if(preference==='en'||(!preference&&!/^zh/i.test(navigator.language||'en'))){location.replace('en/index.html'+location.search+location.hash);return;}
  }
  const filters=[...document.querySelectorAll('.filter')],cards=[...document.querySelectorAll('.product[data-category]')];
  let selectedCategory='all';
  const search=document.querySelector('#product-search');
  function filter(category,update){
    if(!filters.some(b=>b.dataset.filter===category))category='all';selectedCategory=category;let count=0;const query=(search?.value||'').toLowerCase().trim();
    filters.forEach(b=>{const selected=b.dataset.filter===category;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));});
    cards.forEach(c=>{c.hidden=(category!=='all'&&c.dataset.category!==category)||(query&&!((c.dataset.search||c.textContent).toLowerCase().includes(query)));if(!c.hidden)count++;});
    const result=document.querySelector('#result-count');if(result)result.textContent=text(count+' products',count+' 款产品');
    const empty=document.querySelector('#no-results');if(empty)empty.hidden=count!==0;
    if(update && location.protocol!=='file:'){const url=new URL(location.href);if(category==='all')url.searchParams.delete('collection');else url.searchParams.set('collection',category);history.replaceState(null,'',url);}
  }
  search?.addEventListener('input',()=>filter(selectedCategory,false));
  if(filters.length){filter(new URLSearchParams(location.search).get('collection')||'all',false);filters.forEach(b=>b.addEventListener('click',()=>filter(b.dataset.filter,true)));}
  const dialog=document.querySelector('#image-dialog');let lastPreview;
  document.querySelectorAll('[data-preview]').forEach(b=>b.addEventListener('click',()=>{lastPreview=b;dialog.querySelector('img').src=b.dataset.preview;dialog.querySelector('img').alt=b.dataset.caption;dialog.querySelector('p').textContent=b.dataset.caption;dialog.showModal();document.body.style.overflow='hidden';}));
  dialog?.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
  dialog?.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close();});
  dialog?.addEventListener('close',()=>{document.body.style.overflow='';lastPreview?.focus();});
  const form=document.querySelector('#enquiry-form');
  if(form){
    const product=new URLSearchParams(location.search).get('product');if(product)form.elements.requirements.value=product.slice(0,5000);
    form.addEventListener('submit',e=>{
      e.preventDefault();if(!form.reportValidity())return;
      const data=new FormData(form),v=k=>String(data.get(k)||'').trim();
      const subject='Jinmai trade enquiry'+(v('company')?' — '+v('company'):'');
      const body='Hello Jinmai team,\n\nI would like to discuss the following products:\n'+v('requirements')+'\n\nEstimated quantity: '+v('quantity')+'\nDestination / market: '+v('destination')+'\n\nName: '+v('name')+'\nCompany: '+v('company')+'\nEmail: '+v('email')+'\n\nPlease advise on specifications, samples, packaging, MOQ and lead time.\nThank you.';
      const status=document.querySelector('#draft-status');status.replaceChildren();
      const note=document.createElement('p');note.textContent=text('Your draft is ready. Review it below, then open your email app to send it.','草稿已生成，请先检查内容，再在邮件应用中自行发送。');
      const preview=document.createElement('div');preview.className='draft-preview';
      const title=document.createElement('strong');title.textContent=subject;
      const copy=document.createElement('pre');copy.textContent=body;
      const open=document.createElement('a');open.href='mailto:ljf1253261766@gmail.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);open.textContent=text('Open draft in email app ↗','在邮件应用中打开草稿 ↗');
      const fallback=document.createElement('p');fallback.textContent=text('No email app? Copy the text and email ljf1253261766@gmail.com.','未配置邮件应用时，可复制上方内容发送至 ljf1253261766@gmail.com。');
      preview.append(title,copy,open);status.append(note,preview,fallback);
    });
  }
})();
