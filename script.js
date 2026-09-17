const header=document.querySelector(".header"),menu=document.querySelector(".menu"),nav=document.querySelector(".header nav"),progress=document.querySelector(".progress");function onScroll(){const y=scrollY,max=document.documentElement.scrollHeight-innerHeight;header.classList.toggle("compact",y>30);progress.style.setProperty("--progress",(max?y/max*100:0)+"%")}addEventListener("scroll",onScroll,{passive:true});onScroll();menu.addEventListener("click",()=>{const open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",open);document.body.style.overflow=open?"hidden":""});nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");document.body.style.overflow=""}));const reveal=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("show");reveal.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll(".reveal").forEach((el,i)=>{el.style.transitionDelay=Math.min(i%4,3)*70+"ms";reveal.observe(el)});function count(el){const target=+el.dataset.count,start=performance.now(),duration=1200;function frame(now){const p=Math.min((now-start)/duration,1),v=1-Math.pow(1-p,3);el.textContent=Math.floor(target*v).toLocaleString("ja-JP");if(p<1)requestAnimationFrame(frame)}requestAnimationFrame(frame)}const counter=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){count(e.target);counter.unobserve(e.target)}}),{threshold:.6});document.querySelectorAll("[data-count]").forEach(el=>counter.observe(el));document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener("click",e=>{const target=document.querySelector(a.getAttribute("href"));if(target){e.preventDefault();target.scrollIntoView({behavior:"smooth"})}}));const form=document.querySelector("#contactForm");if(form){const rules={type:v=>v?"":"お問い合わせ種別を選択してください。",name:v=>v.trim().length>1?"":"お名前を2文字以上で入力してください。",phone:v=>/^[0-9\-+() ]{10,}$/.test(v)?"":"正しい電話番号を入力してください。",email:v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)?"":"正しいメールアドレスを入力してください。",message:v=>v.trim().length>=10?"":"お問い合わせ内容を10文字以上で入力してください。"};function validate(el){const msg=rules[el.id](el.value),field=el.closest(".field"),small=field.querySelector("small");field.classList.toggle("invalid",!!msg);small.textContent=msg;return!msg}Object.keys(rules).forEach(id=>{const el=document.querySelector("#"+id);el.addEventListener("blur",()=>validate(el));el.addEventListener("input",()=>{if(el.closest(".field").classList.contains("invalid"))validate(el)})});form.addEventListener("submit",e=>{e.preventDefault();const valid=Object.keys(rules).map(id=>validate(document.querySelector("#"+id))).every(Boolean),privacy=document.querySelector("#privacy"),status=form.querySelector(".form-status");if(!privacy.checked){status.textContent="プライバシーポリシーへの同意が必要です。";return}if(!valid){status.textContent="入力内容をご確認ください。";form.querySelector(".invalid input,.invalid select,.invalid textarea")?.focus();return}status.textContent="入力内容を確認しました。※ポートフォリオのため実際には送信されません。";form.querySelector(".submit").textContent="確認完了 ✓"})}addEventListener("keydown",e=>{if(e.key==="Escape"&&nav.classList.contains("open"))menu.click()});
/* Keep industry terms intact on narrow screens without fixing whole sentences. */
(() => {
  const terms = [
    "高圧受変電設備", "自動火災報知設備", "非常用発電設備", "給排水衛生設備工事",
    "業務用空調設備工事", "換気・排煙設備工事", "ウレタン塗膜防水", "フレキシブルダクト",
    "パッケージエアコン", "給排水衛生設備", "受変電・幹線設備", "非常用電源・防災設備",
    "ダクト製作・取付", "空調・換気設備工事", "空調・換気ダクト", "冷媒・ドレン配管工事",
    "アスファルト防水", "ベランダ・廊下防水", "漏水調査・部分補修", "古民家再生",
    "給水ポンプ設備", "給水ポンプ更新", "給水設備工事", "排水設備", "通気設備",
    "衛生設備工事", "衛生器具", "給湯設備", "給水方式", "受水槽", "排水ポンプ",
    "受変電設備", "幹線・分電盤設備", "LED照明設備", "照明・動力設備", "弱電・通信設備",
    "防犯カメラ設備", "コンセント設備", "電気設備工事", "電気設備", "分電盤",
    "シート防水", "屋上防水", "防水工事", "防水工法", "防水性能", "防水層",
    "劣化状況調査", "散水調査", "現地調査", "施工計画", "改修工事",
    "給排気設備", "排煙ダクト工事", "厨房排気・フード工事", "保温・防露工事",
    "ドレン配管", "冷媒配管", "空調設備", "換気設備", "既存設備", "設備改修",
    "注文住宅", "外壁塗装", "耐震基準", "修繕計画", "定期点検"
  ].sort((a, b) => b.length - a.length);
  const escape = term => term.replace(/[.*+?^$()|[\]\\{}]/g, "\\$&");
  const pattern = new RegExp(terms.map(escape).join("|"), "g");
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      pattern.lastIndex = 0;
      return parent && !parent.closest("script,style,textarea,.term-keep,.phrase-heading") && pattern.test(node.data)
        ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => {
    pattern.lastIndex = 0;
    const fragment = document.createDocumentFragment();
    let last = 0;
    for (const match of node.data.matchAll(pattern)) {
      fragment.append(node.data.slice(last, match.index));
      const span = document.createElement("span");
      span.className = "term-keep";
      span.textContent = match[0];
      fragment.append(span);
      last = match.index + match[0].length;
    }
    fragment.append(node.data.slice(last));
    node.replaceWith(fragment);
  });
})();
