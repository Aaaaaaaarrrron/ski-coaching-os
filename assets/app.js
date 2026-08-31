
const STUDENTS=[
{id:'s1',name:'김민준',program:'주니어 시즌강습',level:'베이직 패러렐'},
{id:'s2',name:'이서윤',program:'주니어 시즌강습',level:'슈템턴'},
{id:'s3',name:'박지훈',program:'1:1 개인강습',level:'카빙 입문'},
{id:'s4',name:'정하윤',program:'주니어 시즌강습',level:'스노우플라우'}
];
let role='admin',userName='최대표',currentView='adminHome';
let lessons=JSON.parse(localStorage.getItem('yusimi_v2_lessons')||'[]');
if(!lessons.length){
 lessons=[
 {id:'a1',studentId:'s1',date:'2026-08-15',skill:'베이직 패러렐',good:'바깥발 하중이 안정되고 턴 후반 자세가 좋아졌습니다.',improve:'좌턴에서 상체 선행이 남아 있습니다.',next:'폴체킹과 턴 리듬 연결',media:8,coach:'최대표',createdAt:1},
 {id:'a2',studentId:'s2',date:'2026-08-15',skill:'슈템턴',good:'턴 초반 중심 이동이 좋아졌습니다.',improve:'턴 후반 속도 조절을 더 정리해야 합니다.',next:'베이직 패러렐 진입',media:6,coach:'김강사',createdAt:2}
 ]; localStorage.setItem('yusimi_v2_lessons',JSON.stringify(lessons));
}
const STOCK_PHOTOS=[
'https://images.pexels.com/photos/11156951/pexels-photo-11156951.jpeg?auto=compress&cs=tinysrgb&w=900',
'https://images.pexels.com/photos/20159352/pexels-photo-20159352.jpeg?auto=compress&cs=tinysrgb&w=900',
'https://images.pexels.com/photos/8627423/pexels-photo-8627423.jpeg?auto=compress&cs=tinysrgb&w=900'
];
const STOCK_VIDEO='https://www.pexels.com/download/video/4568014/';
const STOCK_VIDEO_PAGE='https://www.pexels.com/video/a-person-skiing-on-a-mountain-4568014/';
let media=Array.from({length:30},(_,i)=>({
 id:i+1,
 type:(i%5===0?'video':'photo'),
 selected:i<8,
 time:i<10?'10:08':i<20?'10:46':'11:31',
 src:STOCK_PHOTOS[i%STOCK_PHOTOS.length]
}));
function pickRole(r,el){role=r;document.querySelectorAll('.rolecard').forEach(x=>x.classList.remove('active'));el.classList.add('active')}
function login(){userName=document.getElementById('loginName').value.trim()||'최대표';document.getElementById('loginScreen').classList.add('hidden');document.getElementById('mainApp').classList.remove('hidden');switchRole(role)}
function switchRole(r){role=r;document.querySelectorAll('.rolebtn').forEach(x=>x.classList.toggle('active',x.dataset.role===r));go(r==='admin'?'adminHome':r==='coach'?'coachHome':'parentHome')}
function go(id){document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));document.getElementById(id).classList.add('active');currentView=id;renderAll();window.scrollTo({top:0,behavior:'smooth'})}
let toastTimer=null;
function toast(t){const e=document.getElementById('toast');e.textContent=t;e.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>e.classList.remove('show'),1400)}
const DEMO_DATE='2026-08-15';
function today(){return DEMO_DATE}
function renderAll(){renderAdmin();renderCoach();renderMedia();renderParent();renderExtraViews();fillStudents()}
function fillStudents(){const s=document.getElementById('batchStudent');if(!s)return;const old=s.value;s.innerHTML=STUDENTS.map(x=>`<option value="${x.id}">${x.name} · ${x.program}</option>`).join('');if(old)s.value=old}
function renderAdmin(){
 const todaySet=new Set(lessons.filter(l=>l.date===today()).map(l=>l.studentId));
 const done=Math.min(12,9+todaySet.size),missing=Math.max(0,12-done);
 document.getElementById('adminDone').textContent=done;
 document.getElementById('adminMissing').textContent=missing;
 document.getElementById('coachStatus').innerHTML=`
 <tr><td><b>최대표</b><div class="sub">주니어/개인</div></td><td>3</td><td>${Math.min(3,1+todaySet.size)}/3</td><td>86%</td><td><span class="pill ${todaySet.size>=2?'':'warn'}">${todaySet.size>=2?'완료':'작성 중'}</span></td></tr>
 <tr><td><b>김강사</b><div class="sub">주니어</div></td><td>4</td><td>4/4</td><td>91%</td><td><span class="pill">완료</span></td></tr>
 <tr><td><b>이강사</b><div class="sub">성인/주니어</div></td><td>5</td><td>5/5</td><td>78%</td><td><span class="pill">완료</span></td></tr>`;
 document.getElementById('adminActivity').innerHTML=[...lessons].sort((a,b)=>b.createdAt-a.createdAt).slice(0,5).map(l=>{const s=STUDENTS.find(x=>x.id===l.studentId);return `<div class="activity"><span class="dot"></span><div><b>${s?.name}</b> 리포트 발행<div class="sub">${l.coach} · ${l.skill} · 미디어 ${l.media}개</div></div></div>`}).join('');
}
function renderCoach(){
 const doneToday=new Set(lessons.filter(l=>l.date===today()).map(l=>l.studentId));
 document.getElementById('coachToday').innerHTML=[
  ['s1','10:00','24'],['s2','13:30','14'],['s3','16:30','8']
 ].map(([id,t,m])=>{const s=STUDENTS.find(x=>x.id===id),d=doneToday.has(id);return `<div class="listrow"><div class="person"><div class="avatar">${s.name[0]}</div><div><div class="name">${s.name}</div><div class="sub">${t} · 미디어 ${m} · ${s.level}</div></div></div><div class="actionline"><span class="pill ${d?'':'warn'}">${d?'완료':'미작성'}</span><button class="btn ghost small" onclick="document.getElementById('batchStudent').value='${id}';go('coachBatch')">열기</button></div></div>`}).join('');
 document.getElementById('coachCount').textContent=lessons.length;
}
function renderMedia(){
 const g=document.getElementById('mediaGrid'); if(!g)return;
 g.innerHTML=media.map(m=>`<button class="media ${m.type} ${m.selected?'selected':''}" onclick="toggleMedia(${m.id});previewMedia(${m.id})">
   <span class="check">${m.selected?'✓':''}</span>
   ${m.type==='video'?'<span class="video-badge">VIDEO</span>':''}
   <img src="${m.src}" alt="ski lesson demo media">
   <span class="media-meta"><b>${m.type==='video'?'주행 영상':'강습 사진'} ${String(m.id).padStart(2,'0')}</b><span class="small">${m.time}</span></span>
 </button>`).join('');
 document.getElementById('mediaCount').textContent=media.filter(m=>m.selected).length;
}
function toggleMedia(id){const m=media.find(x=>x.id===id);m.selected=!m.selected;renderMedia()}
function selectAll(){const all=media.every(m=>m.selected);media.forEach(m=>m.selected=!all);renderMedia()}
function append(id,t){const e=document.getElementById(id);e.value+=(e.value?' · ':'')+t}
function saveLesson(){
 const sid=document.getElementById('batchStudent').value, s=STUDENTS.find(x=>x.id===sid);
 const l={id:'l'+Date.now(),studentId:sid,date:today(),skill:document.getElementById('skill').value,good:document.getElementById('good').value,improve:document.getElementById('improve').value,next:document.getElementById('nextGoal').value,media:media.filter(m=>m.selected).length,coach:userName,createdAt:Date.now()};
 lessons.push(l);localStorage.setItem('yusimi_v2_lessons',JSON.stringify(lessons));renderAll();toast(`${s.name} 발행 완료`);setTimeout(()=>switchRole('parent'),700)
}
function renderParent(){
 const ls=lessons.filter(l=>l.studentId==='s1').sort((a,b)=>b.createdAt-a.createdAt),l=ls[0];
 document.getElementById('parentLatest').innerHTML=l?`<div class="report"><div class="reporthead"><div class="small" style="color:rgba(255,255,255,.65)">LATEST REPORT</div><h2 style="margin:5px 0">${l.date} · ${l.coach}</h2><div>${l.skill}</div></div><div class="reportbody"><div class="rblock"><div class="rlabel">잘한 점</div>${l.good}</div><div class="rblock"><div class="rlabel">보완할 점</div>${l.improve}</div><div class="rblock"><div class="rlabel">다음 목표</div><b>${l.next}</b></div><div class="rblock"><div class="rlabel">미디어</div>${l.media}개 연결</div></div></div>`:'';
 document.getElementById('parentTimeline').innerHTML=ls.map(l=>`<div class="activity"><span class="dot"></span><div><b>${l.skill}</b><div class="sub">${l.date} · ${l.good}<br>다음 목표: ${l.next}</div></div></div>`).join('');
 document.getElementById('parentGallery').innerHTML=media.slice(0,12).map(m=>`<button class="thumb" onclick="${m.type==='video'?`window.open('${STOCK_VIDEO_PAGE}','_blank')`:`toast('강습 사진 ${String(m.id).padStart(2,'0')}')`}">${m.type==='video'?'<span class="video-badge">VIDEO</span>':''}<img src="${m.src}" alt="ski lesson media" style="width:100%;height:100%;object-fit:cover"></button>`).join('');
}

function previewMedia(id){
 const m=media.find(x=>x.id===id);if(!m)return;
 const p=document.querySelector('#coachBatch .preview');
 if(!p)return;
 p.classList.add('real');
 if(m.type==='video'){
   p.innerHTML=`<video controls poster="${m.src}"><source src="${STOCK_VIDEO}" type="video/mp4"></video><div class="preview-caption"><b>주행 영상 ${String(m.id).padStart(2,'0')}</b><span class="small">Pexels free stock video · 재생이 차단되면 <a href="${STOCK_VIDEO_PAGE}" target="_blank" style="color:#A8E8E9">원본 열기</a></span></div>`;
 }else{
   p.innerHTML=`<img src="${m.src}" alt="ski demo"><div class="preview-caption"><b>강습 사진 ${String(m.id).padStart(2,'0')}</b><span class="small">${m.time} · 학생별 Lesson Record에 연결</span></div>`;
 }
}
function renderExtraViews(){
 const adminStudents=document.getElementById('adminStudentList');
 if(adminStudents)adminStudents.innerHTML=STUDENTS.map(s=>`<div class="listrow"><div class="person"><div class="avatar">${s.name[0]}</div><div><div class="name">${s.name}</div><div class="sub">${s.program} · ${s.level}</div></div></div><span class="pill">활성</span></div>`).join('');
 const ar=document.getElementById('adminRecordRows');
 if(ar)ar.innerHTML=[...lessons].sort((a,b)=>b.createdAt-a.createdAt).map(l=>{const s=STUDENTS.find(x=>x.id===l.studentId);return `<tr><td><b>${s?.name||'-'}</b><div class="sub">${l.date}</div></td><td>${l.coach}</td><td>${l.skill}</td><td>${l.media}개</td><td><span class="pill">발행</span></td></tr>`}).join('')+`<tr><td><b>박지훈</b><div class="sub">${today()}</div></td><td>${userName}</td><td>카빙 입문</td><td>8개</td><td><span class="pill warn">미작성</span></td></tr>`;
 const cs=document.getElementById('coachStudentCards');
 if(cs)cs.innerHTML=STUDENTS.map((s,i)=>{const ls=lessons.filter(l=>l.studentId===s.id).sort((a,b)=>b.createdAt-a.createdAt),l=ls[0];return `<div class="studentcard"><div class="student-head"><div class="person"><div class="avatar">${s.name[0]}</div><div><div class="name">${s.name}</div><div class="sub">${s.program}</div></div></div><span class="pill">${s.level}</span></div><p>${l?`최근: ${l.skill}<br>다음 목표: ${l.next}`:'아직 누적 기록 없음'}</p><div class="actionline"><button class="btn ghost small" onclick="document.getElementById('batchStudent').value='${s.id}';go('coachBatch')">새 기록</button></div></div>`}).join('');
 const cr=document.getElementById('coachRecordList');
 if(cr)cr.innerHTML=[...lessons].sort((a,b)=>b.createdAt-a.createdAt).map(l=>{const s=STUDENTS.find(x=>x.id===l.studentId);return `<div class="record-card"><div class="record-top"><div><b>${s?.name} · ${l.skill}</b><div class="sub">${l.date} · ${l.coach}</div></div><span class="pill">${l.media} media</span></div><p>${l.good}<br><b>다음:</b> ${l.next}</p></div>`}).join('');
 const pr=document.getElementById('parentReportArchive');
 if(pr){const ls=lessons.filter(l=>l.studentId==='s1').sort((a,b)=>b.createdAt-a.createdAt);pr.innerHTML=ls.map((l,i)=>`<div class="card ${i===0?'em':''}"><div class="section"><div><h2>${l.date}</h2><div class="small">${l.coach} · ${l.skill}</div></div>${i===0?'<span class="pill">NEW</span>':''}</div><div class="rblock"><div class="rlabel">잘한 점</div>${l.good}</div><div class="rblock"><div class="rlabel">보완할 점</div>${l.improve}</div><div class="rblock"><div class="rlabel">다음 목표</div><b>${l.next}</b></div><div class="rblock"><div class="rlabel">미디어</div>${l.media}개 연결</div></div>`).join('')}
 const pm=document.getElementById('parentMediaArchive');
 if(pm)pm.innerHTML=media.slice(0,8).map(m=>`<button class="thumb" onclick="${m.type==='video'?`window.open('${STOCK_VIDEO_PAGE}','_blank')`:`toast('강습 사진 ${String(m.id).padStart(2,'0')} 확대 보기')`}">${m.type==='video'?'<span class="video-badge">VIDEO</span>':''}<img src="${m.src}" alt="ski lesson media"></button>`).join('');
}


const RUN_VIDEOS=[
 {title:'주행 A · 주니어 기본 주행',desc:'턴 연결 · 상체 안정 · 엣지 전환',src:'https://www.pexels.com/download/video/4568014/',page:'https://www.pexels.com/video/a-person-skiing-on-a-mountain-4568014/'},
 {title:'주행 B · 다이내믹 주행',desc:'리듬 · 스피드 컨트롤 · 외향/외경',src:'https://www.pexels.com/download/video/11246371/',page:'https://www.pexels.com/video/skiing-down-slope-11246371/'},
 {title:'주행 C · 정면 주행',desc:'상체 안정 · 좌우 대칭 · 폴체킹',src:'https://www.pexels.com/download/video/11297785/',page:'https://www.pexels.com/video/skier-skiing-towards-camera-11297785/'}
];
let currentRunVideo=0;
function selectRunVideo(i){
 currentRunVideo=i;
 const d=RUN_VIDEOS[i],v=document.getElementById('runVideoPlayer');
 if(!v)return;
 v.pause();v.src=d.src;v.load();
 document.getElementById('runVideoTitle').textContent=d.title;
 document.getElementById('runVideoDesc').textContent=d.desc;
 document.querySelectorAll('[data-runvideo]').forEach((b,idx)=>b.classList.toggle('active',idx===i));
}
function rewindRunVideo(){const v=document.getElementById('runVideoPlayer');if(v)v.currentTime=Math.max(0,v.currentTime-5)}
function forwardRunVideo(){const v=document.getElementById('runVideoPlayer');if(v)v.currentTime=Math.min(Number.isFinite(v.duration)?v.duration:9999,v.currentTime+5)}
function toggleRunVideoSpeed(){const v=document.getElementById('runVideoPlayer');if(!v)return;v.playbackRate=v.playbackRate===1?.5:1;toast(`재생 속도 ${v.playbackRate}×`)}
function openCurrentVideoSource(){window.open(RUN_VIDEOS[currentRunVideo].page,'_blank')}

renderAll();
