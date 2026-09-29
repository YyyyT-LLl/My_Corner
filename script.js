/* =====================================================
   内容数据区：以后只需要改这里，不用动下面的渲染代码
   ===================================================== */

// 经历：新增一段经历 = 复制一个 {...} 加到最前面
const EXPERIENCE = [
  { org:"南星梦想计划", role:"Team Leader", period:"2025.12 — Present", summary:"Led a team for school-visit talks and student outreach.",
    details:["团队统筹","任务分工","行前培训","母校回校宣讲","活动现场协调","学生沟通"], images:[], links:[] },
  { org:"行知书院经管五班团支部", role:"宣传委员", period:"2025.09 — Present", summary:"Planned and produced content for class activities.",
    details:["参与近 10 次团日活动","活动策划","PPT 制作","现场执行","微信公众号推文制作"], images:[], links:[] },
  { org:"行知书院团学联", role:"宣传部成员", period:"Dates to be added", summary:"Details will be added.", details:[], images:[], links:[] },
  { org:"南大羽毛球协会", role:"宣传部部长", period:"Dates to be added", summary:"Ran publicity for association events.",
    details:["专家讲座宣传","体育节宣传","活动现场摄影","微信公众号内容素材"], images:[], links:[] },
  { org:"南京大学招生小蓝鲸全媒体中心", role:"摄影部成员", period:"Dates to be added", summary:"Photography and content for admissions outreach.",
    details:["招生宣传内容制作","微信公众号 / 小红书内容","活动及校园摄影","累计参与宣传素材拍摄 10+ 次"], images:[], links:[] },
  { org:"行知书院羽毛球队", role:"队长", period:"2025", summary:"Details will be added.", details:[], images:[], links:[] },
  { org:"商学院羽毛球队", role:"队长", period:"2026", summary:"Details will be added.", details:[], images:[], links:[] },
];

// 项目：category 只能是 AI & TECH / BUSINESS / CAMPUS / CONTENT / RESEARCH
// 详情页：复制 projects/_template.html 改名（如 my-project.html），link 填 "projects/my-project.html"
const PROJECTS = [
  { title:"Project coming soon", category:"AI & TECH", date:"—", summary:"Project details will be added.", image:"images/projects/project-01.jpg", link:"" },
  { title:"Project coming soon", category:"BUSINESS", date:"—", summary:"Project details will be added.", image:"images/projects/project-02.jpg", link:"" },
];
const PROJECT_CATS = ["ALL","AI & TECH","BUSINESS","CAMPUS","CONTENT","RESEARCH"];

// 摄影：category 为 Event 或 Landscape；ratio 控制高矮，制造错落感
const PHOTOS = [
  { src:"images/photography/event-01.jpg", alt:"Event photo 1", category:"Event", ratio:"3/4" },
  { src:"images/photography/event-02.jpg", alt:"Event photo 2", category:"Event", ratio:"4/3" },
  { src:"images/photography/event-03.jpg", alt:"Event photo 3", category:"Event", ratio:"1/1" },
  { src:"images/photography/landscape-01.jpg", alt:"Landscape photo 1", category:"Landscape", ratio:"4/5" },
  { src:"images/photography/landscape-02.jpg", alt:"Landscape photo 2", category:"Landscape", ratio:"16/10" },
  { src:"images/photography/landscape-03.jpg", alt:"Landscape photo 3", category:"Landscape", ratio:"3/4" },
];
const PHOTO_CATS = ["ALL","Event","Landscape"];

// 羽毛球记录
const SPORTS = [
  { year:"2025", title:"Xingzhi College Badminton Team", result:"Captain" },
  { year:"2025", title:"Freshman Cup", result:"Quarterfinalist" },
  { year:"2025", title:"Xingzhi College Faculty-Student Badminton Tournament", result:"Women's Singles Champion" },
  { year:"2026", title:"Business School Badminton Team", result:"Captain" },
];
const STATS = [ { value:"2", label:"Teams captained" }, { value:"—", label:"Team activities (to be added)" } ];

// 文章：新增文章 = 加一个对象
const NOTES = [
  { title:"First note coming soon", date:"—", category:"LIFE", summary:"Articles will be added.", cover:"images/notes/note-01.jpg", link:"" },
];
const NOTE_CATS = ["ALL","AI","BUSINESS","CAMPUS","TRAVEL","LIFE","PHOTOGRAPHY"];

// 联系方式：没有链接的写 href:""，会显示 Coming Soon
const CONTACTS = [
  { label:"Email", href:"" }, { label:"Phone", href:"" }, { label:"LinkedIn", href:"" },
  { label:"GitHub", href:"" }, { label:"小红书", href:"" },
];

/* =====================================================
   渲染代码（一般不用改）
   ===================================================== */
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const bg = src => src ? `style="background-image:url('${src}')"` : "";

// 通用筛选按钮
function chips(el, cats, onPick){
  el.innerHTML = cats.map((c,i)=>`<button class="${i?'':'on'}">${esc(c)}</button>`).join("");
  el.onclick = e => { if(e.target.tagName!=="BUTTON") return;
    el.querySelectorAll("button").forEach(b=>b.classList.remove("on")); e.target.classList.add("on"); onPick(e.target.textContent); };
}

// Experience：点击展开
$("timeline").innerHTML = EXPERIENCE.map(x => `
  <details class="item"><summary><small>${esc(x.period)}</small><strong>${esc(x.org)}</strong> · ${esc(x.role)}
  <small>${esc(x.summary)}</small></summary>
  <div class="more">${x.details.length ? `<ul>${x.details.map(d=>`<li>${esc(d)}</li>`).join("")}</ul>` : "<p class='muted'>More details, photos and files will be added.</p>"}
  ${x.links.map(l=>`<p><a href="${l.href}">${esc(l.text)}</a></p>`).join("")}</div></details>`).join("");

// Projects
const card = (img,cat,title,date,sum,link,cta) => `<article class="card"><div class="ph" ${bg(img)}></div><div class="b">
  <small>${esc(cat)} · ${esc(date)}</small><h3 style="margin:4px 0">${esc(title)}</h3><p class="muted">${esc(sum)}</p>
  ${link ? `<a href="${link}">${cta}</a>` : `<span class="muted">Coming Soon</span>`}</div></article>`;
function showProjects(c="ALL"){ $("projects").innerHTML = PROJECTS.filter(p=>c==="ALL"||p.category===c)
  .map(p=>card(p.image,p.category,p.title,p.date,p.summary,p.link,"View Project →")).join("") || "<p class='muted'>Nothing here yet.</p>"; }
chips($("filters"), PROJECT_CATS, showProjects); showProjects();

// Photography + Lightbox
function showPhotos(c="ALL"){ $("photos").innerHTML = PHOTOS.filter(p=>c==="ALL"||p.category===c)
  .map(p=>`<div class="ph" role="img" aria-label="${esc(p.alt)}" data-src="${p.src}" style="aspect-ratio:${p.ratio};background-image:url('${p.src}')" tabindex="0"></div>`).join(""); }
chips($("photo-filters"), PHOTO_CATS, showPhotos); showPhotos();
const lb = $("lightbox");
$("photos").addEventListener("click", e => { const t = e.target.closest(".ph"); if(!t) return;
  lb.querySelector("img").src = t.dataset.src; lb.hidden = false; });
lb.addEventListener("click", () => lb.hidden = true);
document.addEventListener("keydown", e => { if(e.key==="Escape") lb.hidden = true; });

// Hero 图片
const hero = document.querySelector(".hero-img"); hero.style.backgroundImage = `url('${hero.dataset.src}')`;

// Sports
$("stats").innerHTML = STATS.map(s=>`<div><b>${s.value}</b><span class="muted">${esc(s.label)}</span></div>`).join("");
$("sports-list").innerHTML = SPORTS.map(s=>`<div><span><b>${s.year}</b> &nbsp; ${esc(s.title)}</span><span>${esc(s.result)}</span></div>`).join("");

// Notes
function showNotes(c="ALL"){ $("notes-list").innerHTML = NOTES.filter(n=>c==="ALL"||n.category===c)
  .map(n=>card(n.cover,n.category,n.title,n.date,n.summary,n.link,"Read More →")).join("") || "<p class='muted'>No notes in this category yet.</p>"; }
chips($("note-filters"), NOTE_CATS, showNotes); showNotes();

// Contact
$("contacts").innerHTML = CONTACTS.map(c=>`<div><span>${esc(c.label)}</span>${c.href?`<a href="${c.href}">${esc(c.href.replace(/^mailto:|^tel:/,""))}</a>`:`<span class="muted">Coming Soon</span>`}</div>`).join("");

// 手机菜单
const burger = document.querySelector(".burger"), menu = $("menu");
burger.onclick = () => burger.setAttribute("aria-expanded", menu.classList.toggle("open"));
menu.onclick = () => menu.classList.remove("open");
$("year").textContent = new Date().getFullYear();
