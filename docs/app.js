"use strict";
const clips = window.MOTION_CATALOG.clips;
const config = window.MOTION_CONFIG;
const $ = (id) => document.getElementById(id);
let source = "all", category = "all", query = "", selected = null, variantIndex = 0;
const filtered = () => clips.filter(c => (source === "all" || c.source === source) && (category === "all" || c.category === category) && `${c.name} ${c.id} ${c.source_name} ${c.category || ""}`.toLowerCase().includes(query));
const local = path => "../" + path.split("/").map(encodeURIComponent).join("/");
const github = path => `${config.repository}/blob/${encodeURIComponent(config.branch)}/${path.split("/").map(encodeURIComponent).join("/")}`;
function button(text, handler) { const b = document.createElement("button"); b.type = "button"; b.textContent = text; b.onclick = handler; return b; }
function renderSources() {
  $("sources").replaceChildren();
  const sources = [["all", "All sources"], ...new Map(clips.map(c => [c.source, c.source_name])).entries()];
  for (const [id, label] of sources) {
    const b = button(label, () => { source = id; category = "all"; renderCategories(); renderSources(); renderList(); });
    b.setAttribute("aria-pressed", String(source === id)); $("sources").append(b);
  }
}
function renderCategories() {
  const menu = $("category"); menu.replaceChildren();
  const categories = ["all", ...new Set(clips.filter(c => source === "all" || c.source === source).map(c => c.category).filter(Boolean))];
  for (const value of categories) { const option = document.createElement("option"); option.value = value; option.textContent = value === "all" ? "All motion types" : value; menu.append(option); }
  menu.value = category; $("category-filter").hidden = categories.length <= 1;
}
function renderList() {
  const visible = filtered();
  $("count").textContent = visible.length;
  $("empty").hidden = visible.length > 0;
  if (!visible.some(c => c.id === selected?.id)) selected = visible[0] || null;
  $("motion-list").replaceChildren();
  for (const c of visible) {
    const b = button("", () => select(c)); b.className = "motion"; b.dataset.id = c.id;
    const name = document.createElement("span"), info = document.createElement("small");
    name.textContent = c.name; info.textContent = `${c.source_name} · ${c.variants[0].duration.toFixed(2)} s`;
    b.append(name, info); b.setAttribute("aria-pressed", String(selected?.id === c.id)); $("motion-list").append(b);
  }
  if (selected) select(selected); else { $("video").pause(); document.querySelector(".viewer").hidden = true; }
}
function select(clip, index = 0) {
  selected = clip; variantIndex = index;
  document.querySelector(".viewer").hidden = false;
  const v = clip.variants[index], visible = filtered(), position = visible.findIndex(c => c.id === clip.id);
  $("source-name").textContent = clip.source_name;
  $("motion-name").textContent = clip.name;
  $("status").textContent = clip.preview_only ? "Motion candidate" : clip.local_only ? "Local preview" : clip.experimental ? "Experimental" : "Reference motion";
  $("status").className = "badge" + (clip.experimental ? " experimental" : "");
  $("duration").textContent = `${v.duration.toFixed(2)} s`;
  $("fps").textContent = `${v.fps} FPS`;
  const terrainLabel = ["hoi_retarget", "humanoidmimicgen"].includes(clip.source) ? "Floor" : ({mesh:"Triangle mesh",boxes:"Boxes",ground:"Ground",missing:"Obstacle not supplied"})[v.terrain];
  const objectLabel = ({large_shelving_cart:"wheeled cart + payload",largebox:"box",plasticbox:"plastic box",largetable:"table",suitcase:"suitcase"})[v.object] || v.object;
  $("terrain").textContent = terrainLabel + (v.object ? ` + moving ${objectLabel}` : "");
  const upstream = clip.local_only || clip.preview_only;
  $("npz-github").hidden = upstream && !clip.source_url;
  $("npz-github").href = upstream ? (clip.source_url || "#") : github(v.npz);
  $("npz-github").textContent = upstream ? "Upstream source ↗" : "View NPZ on GitHub ↗";
  $("npz-download").hidden = !v.npz;
  if (v.npz) $("npz-download").href = local(v.npz); else $("npz-download").removeAttribute("href");
  $("clip-description").textContent = clip.description || "";
  $("clip-description").hidden = !clip.description;
  $("npz-download").download = `${clip.id.replaceAll("/", "_")}_${index === 0 ? "motion" : "generated"}.npz`;
  const report = clip.reports.quality_review || clip.reports.terrain_validation || clip.reports.terrain_fit || clip.reports.validation || clip.reports.source_validation || clip.reports.provenance;
  $("report").hidden = !report; if (report) $("report").href = clip.local_only ? local(report) : github(report);
  $("video-error").hidden = true;
  $("video").pause(); $("video").src = local(v.video);
  if (clip.poster && index === 0) $("video").poster = local(clip.poster); else $("video").removeAttribute("poster");
  $("video").load();
  $("variants").replaceChildren();
  for (const [i, variant] of clip.variants.entries()) {
    const b = button(variant.name, () => select(clip, i)); b.setAttribute("aria-pressed", String(i === index)); $("variants").append(b);
  }
  $("position").textContent = `${position + 1} / ${visible.length}`;
  $("previous").disabled = position <= 0; $("next").disabled = position >= visible.length - 1;
  document.querySelectorAll(".motion").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.id === clip.id)));
  history.replaceState(null, "", "#" + encodeURIComponent(clip.id));
}
function step(delta) {
  const visible = filtered(), index = visible.findIndex(c => c.id === selected?.id) + delta;
  if (index >= 0 && index < visible.length) select(visible[index]);
}
$("category").onchange = e => { category = e.target.value; renderList(); };
$("search").addEventListener("input", e => { query = e.target.value.toLowerCase().trim(); renderList(); });
$("previous").onclick = () => step(-1); $("next").onclick = () => step(1);
$("loop").onchange = e => { $("video").loop = e.target.checked; };
$("video").onerror = () => { $("video-error").hidden = false; };
document.addEventListener("keydown", e => {
  if (["INPUT", "TEXTAREA", "VIDEO", "BUTTON", "SELECT"].includes(e.target.tagName) || e.ctrlKey || e.altKey || e.metaKey) return;
  if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); step(e.key === "ArrowRight" ? 1 : -1); }
});
$("repository").href = config.repository; $("total").textContent = clips.length;
try { selected = clips.find(c => c.id === decodeURIComponent(location.hash.slice(1))); } catch { selected = null; }
if (selected?.source) source = selected.source;
selected ||= clips.find(c => c.id === "humanoidmimicgen/large_cart_push") || clips.find(c => c.id === "hoi_retarget/box_push") || clips.find(c => c.id === "mixamo/crawling") || clips.find(c => c.id === "parc/jump_005") || clips[0];
renderCategories(); renderSources(); renderList();
