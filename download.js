// Include published pre-releases; GitHub's /latest excludes them.
const link=document.getElementById('download');
const status=document.getElementById('download-status');
const repository='Hiroyamahiro/libraryfeed';
async function latestDownload(){
 try{
  const response=await fetch(`https://api.github.com/repos/${repository}/releases?per_page=100`,{credentials:'omit',cache:'no-store',signal:AbortSignal.timeout(10000),headers:{Accept:'application/vnd.github+json'}});
  if(!response.ok)throw Error('Release list unavailable');
  const releases=await response.json();if(!Array.isArray(releases))throw Error('Invalid release list');
  const candidates=releases.filter(r=>r&&r.draft===false&&typeof r.published_at==='string'&&Number.isFinite(Date.parse(r.published_at))&&Array.isArray(r.assets))
   .flatMap(r=>r.assets.filter(a=>a&&a.state==='uploaded'&&typeof a.name==='string'&&/^LibraryFeed-\d+\.\d+\.\d+(?:-[\w.-]+)?\.zip$/.test(a.name)&&typeof a.browser_download_url==='string').map(a=>({release:r,asset:a})))
   .filter(({asset})=>{try{const u=new URL(asset.browser_download_url);return u.origin==='https://github.com'&&!u.username&&!u.password&&u.pathname.startsWith(`/${repository}/releases/download/`);}catch{return false;}})
   .sort((a,b)=>Date.parse(b.release.published_at)-Date.parse(a.release.published_at));
  const latest=candidates[0];if(!latest){status.textContent='公開準備中';return;}
  link.href=latest.asset.browser_download_url;link.textContent='最新版をダウンロード';
  const version=latest.asset.name.replace(/^LibraryFeed-/,'').replace(/\.zip$/,'');
  status.textContent=`v${version} · ${latest.release.prerelease?'テスト版':'公開版'} · 無料`;
 }catch{status.textContent='配布ページで「LibraryFeed-…zip」を選んでください。';}
}
void latestDownload();
