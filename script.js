const header=document.querySelector(".header"),menu=document.querySelector(".menu"),nav=document.querySelector(".header nav"),progress=document.querySelector(".progress");function onScroll(){const y=scrollY,max=document.documentElement.scrollHeight-innerHeight;header.classList.toggle("compact",y>30);progress.style.setProperty("--progress",(max?y/max*100:0)+"%")}addEventListener("scroll",onScroll,{passive:true});onScroll();menu.addEventListener("click",()=>{const open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",open);document.body.style.overflow=open?"hidden":""});nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");document.body.style.overflow=""}));const reveal=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("show");reveal.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll(".reveal").forEach((el,i)=>{el.style.transitionDelay=Math.min(i%4,3)*70+"ms";reveal.observe(el)});function count(el){const target=+el.dataset.count,start=performance.now(),duration=1200;function frame(now){const p=Math.min((now-start)/duration,1),v=1-Math.pow(1-p,3);el.textContent=Math.floor(target*v).toLocaleString("ja-JP");if(p<1)requestAnimationFrame(frame)}requestAnimationFrame(frame)}const counter=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){count(e.target);counter.unobserve(e.target)}}),{threshold:.6});document.querySelectorAll("[data-count]").forEach(el=>counter.observe(el));document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener("click",e=>{const target=document.querySelector(a.getAttribute("href"));if(target){e.preventDefault();target.scrollIntoView({behavior:"smooth"})}}));const form=document.querySelector("#contactForm");if(form){const rules={type:v=>v?"":"お問い合わせ種別を選択してください。",name:v=>v.trim().length>1?"":"お名前を2文字以上で入力してください。",phone:v=>/^[0-9\-+() ]{10,}$/.test(v)?"":"正しい電話番号を入力してください。",email:v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)?"":"正しいメールアドレスを入力してください。",message:v=>v.trim().length>=10?"":"お問い合わせ内容を10文字以上で入力してください。"};function validate(el){const msg=rules[el.id](el.value),field=el.closest(".field"),small=field.querySelector("small");field.classList.toggle("invalid",!!msg);small.textContent=msg;return!msg}Object.keys(rules).forEach(id=>{const el=document.querySelector("#"+id);el.addEventListener("blur",()=>validate(el));el.addEventListener("input",()=>{if(el.closest(".field").classList.contains("invalid"))validate(el)})});form.addEventListener("submit",e=>{e.preventDefault();const valid=Object.keys(rules).map(id=>validate(document.querySelector("#"+id))).every(Boolean),privacy=document.querySelector("#privacy"),status=form.querySelector(".form-status");if(!privacy.checked){status.textContent="プライバシーポリシーへの同意が必要です。";return}if(!valid){status.textContent="入力内容をご確認ください。";form.querySelector(".invalid input,.invalid select,.invalid textarea")?.focus();return}status.textContent="入力内容を確認しました。※ポートフォリオのため実際には送信されません。";form.querySelector(".submit").textContent="確認完了 ✓"})}addEventListener("keydown",e=>{if(e.key==="Escape"&&nav.classList.contains("open"))menu.click()});

/* Keep intentional headline breaks intact on phones, then fit each line. */
(() => {
  const phone = window.matchMedia('(max-width: 600px)');
  const targets = () => document.querySelectorAll('h1:has(br), h2:has(br), h3:has(br)');

  function fitHeadline(el) {
    el.style.removeProperty('font-size');
    el.style.removeProperty('white-space');
    if (!phone.matches) return;

    el.style.whiteSpace = 'nowrap';
    const available = el.clientWidth;
    const required = el.scrollWidth;
    if (!available || required <= available) return;

    const current = parseFloat(getComputedStyle(el).fontSize);
    el.style.fontSize = Math.max(20, current * available / required * 0.97) + 'px';
  }

  function fitAllHeadlines() {
    targets().forEach(fitHeadline);
  }

  let resizeFrame;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(fitAllHeadlines);
  });
  window.addEventListener('DOMContentLoaded', fitAllHeadlines);
  window.addEventListener('load', fitAllHeadlines);
  document.fonts?.ready.then(fitAllHeadlines);
})();
