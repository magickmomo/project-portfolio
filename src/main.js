import './style.css';
import projects from './projects.json';

const icons = {
  folder: '<path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="m10 11-2 2 2 2m4-4 2 2-2 2"/>',
  activity: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="m3 13 5-2 3 4 4-8 3 4h3"/>',
  pound: '<path d="M18 5a5 5 0 0 0-9 3c0 4 2 5 0 9-1 2-2 2-4 2h14M5 12h11"/>',
  trees: '<path d="m7 20 0-4m10 4v-4M7 4c-2 0-3 2-3 4-2 1-2 5 0 6-1 3 2 5 4 4 2 1 4-1 4-4 2-2 1-5-1-6C11 5 9 4 7 4Zm10 4c-1.5 0-3 1.5-3 3-2 2-1 4 0 5-1 2 1 4 3 3 2 1 4-1 3-3 2-2 1-4-1-5 0-2-1-3-2-3Z"/>',
  book: '<path d="M12 7C9 5 6 5 3 6v13c3-1 6-1 9 1 3-2 6-2 9-1V6c-3-1-6-1-9 1Zm0 0v13"/>',
  shirt: '<path d="m8 4 4 2 4-2 5 4-3 5-2-1v8H8v-8l-2 1-3-5z"/>',
  file: '<path d="M6 3h8l5 5v13H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm8 0v6h5M8 14h8m-8 4h6"/>',
  sparkles: '<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 17l.7 2.3L22 20l-2.3.7L19 23l-.7-2.3L16 20l2.3-.7z"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  external: '<path d="M13 5h6v6m0-6-9 9"/><path d="M19 13v6H5V5h6"/>'
};
const icon = (name, className = '') => '<svg class="' + className + '" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (icons[name] || icons.folder) + '</svg>';
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dateLabel = value => value ? new Date((value.length === 7 ? value + '-01' : value) + 'T12:00:00').toLocaleDateString('en-GB',{month:'short',year:'numeric',...(value.length > 7 ? {day:'numeric'} : {})}) : 'Not recorded';
const count = value => value == null ? 'Not tracked' : Intl.NumberFormat('en-GB').format(value);
const money = value => value == null ? 'Not tracked' : new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP',maximumFractionDigits:2}).format(value);
const safeUrl = value => { try { const url = new URL(value); return ['https:','http:'].includes(url.protocol) ? url.href : null; } catch { return null; } };
const statuses = {active:'Active',prototype:'Prototype',paused:'Paused',abandoned:'Abandoned',completed:'Completed'};
const ordered = [...projects].sort((a,b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
const totalRevenue = projects.every(p=>p.metrics.revenueGBP == null) ? null : projects.reduce((sum,p)=>sum+(p.metrics.revenueGBP ?? 0),0);
const numberActive = projects.filter(p=>p.status === 'active').length;

function detailLink(url,label) {
 const safe = safeUrl(url);
 return safe ? '<a href="' + escapeHtml(safe) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(label) + ' ' + icon('external','small-icon') + '</a>' : '';
}
function details(project) {
 const m=project.metrics;
 const metric=(title,value)=>'<div class="detail-metric"><span>'+title+'</span><strong>'+value+'</strong></div>';
 return '<div class="details-inner">' +
 '<p class="description">'+escapeHtml(project.description)+'</p>' +
 '<div class="detail-metrics">'+
 metric('Registered users',count(m.registeredUsers))+
 metric('Visitors',count(m.visitors))+
 metric('Peak active users',count(m.peakActiveUsers)+(m.peakPeriod ? ' ('+escapeHtml(m.peakPeriod)+')' : ''))+
 metric('Revenue',money(m.revenueGBP))+
 metric('Costs',money(m.costGBP))+
 metric('Launched',dateLabel(project.launchedAt))+
 '</div>'+
 (project.milestones?.length ? '<section class="detail-section"><h3>History</h3><ul class="timeline">'+project.milestones.map(item=>'<li><span>'+escapeHtml(dateLabel(item.date))+'</span><span>'+escapeHtml(item.title)+'</span></li>').join('')+'</ul></section>' : '')+
 (project.outcome ? '<section class="detail-section"><h3>What happened</h3><p>'+escapeHtml(project.outcome)+'</p></section>' : '')+
 (project.lesson ? '<section class="detail-section"><h3>What I learned</h3><p>'+escapeHtml(project.lesson)+'</p></section>' : '')+
 (project.website || project.repository ? '<div class="links">'+detailLink(project.website,'Visit website')+detailLink(project.repository,'View code')+'</div>' : '')+
 '</div>';
}
const app=document.querySelector('#app');
app.innerHTML='<main class="page">'+
 '<header class="heading"><p class="eyebrow">A living record</p><h1>Project Graveyard</h1><p>Things I’ve built, launched, paused, and left behind.</p></header>'+
 '<section class="stats" aria-label="Project statistics">'+
 '<div class="stat">'+icon('folder')+'<span>Total projects</span><strong>'+projects.length+'</strong></div>'+
 '<div class="stat">'+icon('activity','active-stat')+'<span>Active</span><strong>'+numberActive+'</strong></div>'+
 '<div class="stat">'+icon('pound')+'<span>Total revenue</span><strong>'+(totalRevenue == null ? '—' : money(totalRevenue))+'</strong></div></section>'+
 '<section class="projects" aria-label="Projects">'+ordered.map(project=>'<article class="project"><h2><button class="project-toggle" type="button" aria-expanded="false" aria-controls="details-'+escapeHtml(project.id)+'">'+
 '<span class="project-icon">'+icon(project.icon)+'</span>'+
 '<span class="project-summary"><span class="project-name">'+escapeHtml(project.name)+'</span><span class="project-subtitle">'+escapeHtml(project.subtitle)+'</span></span>'+
 '<span class="status status-'+escapeHtml(project.status)+'">'+escapeHtml(statuses[project.status]||project.status)+'</span>'+
 icon('chevron','chevron')+'</button></h2>'+
 '<div class="project-details" id="details-'+escapeHtml(project.id)+'" hidden>'+details(project)+'</div></article>').join('')+
 '</section><footer>Not tracked means unknown, not zero. <span>Update projects in <code>src/projects.json</code>.</span></footer></main>';
document.querySelectorAll('.project-toggle').forEach(button=>button.addEventListener('click',()=>{
 const expanded=button.getAttribute('aria-expanded')==='true';
 button.setAttribute('aria-expanded',String(!expanded));
 document.getElementById(button.getAttribute('aria-controls')).hidden=expanded;
}));
