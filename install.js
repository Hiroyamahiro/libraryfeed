const picker=document.getElementById('guide-browser');
const variants=document.querySelectorAll('[data-browsers]');
function selectBrowser(){
 const selected=picker.querySelector('input:checked').value;
 for(const variant of variants)variant.hidden=!variant.dataset.browsers.split(' ').includes(selected);
 document.getElementById('guide-current').textContent=`${selected} の手順を表示しています。`;
}
picker.addEventListener('change',selectBrowser);
selectBrowser();

const viewer=document.getElementById('guide-image-viewer');
const enlarged=viewer.querySelector('img');
const caption=viewer.querySelector('p');
document.querySelectorAll('[data-guide-image]').forEach(link=>{
 link.addEventListener('click',event=>{
  if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||typeof viewer.showModal!=='function')return;
  event.preventDefault();
  enlarged.src=link.href;
  enlarged.alt=link.querySelector('img').alt;
  caption.textContent=link.closest('figure').querySelector('figcaption').textContent;
  viewer.showModal();
 });
});
viewer.querySelector('button').addEventListener('click',()=>viewer.close());
viewer.addEventListener('click',event=>{if(event.target===viewer)viewer.close();});
