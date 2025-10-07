// Basic front-end logic for the Equil airdrop landing page.
// NOTE: This file uses simulated testnet transaction fetching logic as a placeholder.
// Replace `fetchTestnetTxCount` with actual Monad block explorer / RPC calls on production.

const checkBtn = document.getElementById('checkBtn');
const walletInput = document.getElementById('walletInput');
const rewardModal = document.getElementById('rewardModal');
const rewardMsg = document.getElementById('rewardMsg');
const modalClose = document.getElementById('modalClose');
const joinTwitter = document.getElementById('joinTwitter');

// Simple modal control
function openModal(){ rewardModal.classList.remove('hidden'); }
function closeModal(){ rewardModal.classList.add('hidden'); }
modalClose.onclick = closeModal;

// Simulated fetch: return transaction count for a wallet.
// In production, replace this with real API request to Monad testnet explorer / node.
async function fetchTestnetTxCount(address){
  // quick validation
  if(!address || !address.startsWith('0x')) return 0;
  // create a deterministic pseudo-random count from address (so repeated calls same result)
  let hash = 0;
  for(let i=2;i<Math.min(address.length, 42);i++){ hash = (hash*31 + address.charCodeAt(i))|0; }
  hash = Math.abs(hash);
  // map to ranges: 0-29,30-79,80-299,300-999 (simulate variability)
  const buckets = [10, 60, 200, 700];
  const idx = hash % buckets.length;
  // scale a bit
  const base = buckets[idx];
  // jitter
  const jitter = (hash % 100);
  return base + jitter; // example transaction count
}

function computeReward(txCount){
  if(txCount >= 500) return 50000;
  if(txCount >= 100) return 10000;
  if(txCount >= 50) return 5000;
  return 0;
}

checkBtn.addEventListener('click', async ()=>{
  const addr = walletInput.value.trim();
  if(!addr){ alert('Enter wallet address'); return; }
  rewardMsg.textContent = 'Checking testnet transactions...';
  openModal();
  // in real app: call your backend that queries Monad testnet and returns count
  const txCount = await fetchTestnetTxCount(addr);
  const reward = computeReward(txCount);
  if(reward === 0){
    rewardMsg.innerHTML = `Transactions found: <b>${txCount}</b>. You need at least 50 testnet transactions to qualify.`;
  } else {
    rewardMsg.innerHTML = `Transactions found: <b>${txCount}</b>.<br><strong>Eligible reward: ${reward.toLocaleString()} EQL</strong>`;
  }
});

// Simulated Twitter signup flow
joinTwitter.addEventListener('click', ()=>{
  // In production you'll redirect to your backend OAuth endpoint which handles Twitter OAuth2
  // Here we simulate signup by prompting for handle and storing claim in localStorage
  const handle = prompt('Enter your Twitter handle (e.g. @yourname) to claim reward');
  if(!handle) return alert('Twitter handle required to claim.');
  // Save a simple claim record
  const addr = walletInput.value.trim();
  const tx = {wallet: addr, twitter: handle, claimedAt: new Date().toISOString()};
  const claims = JSON.parse(localStorage.getItem('equil_claims')||'[]');
  claims.push(tx);
  localStorage.setItem('equil_claims', JSON.stringify(claims));
  alert('Thanks! Your reward has been reserved. (This is a simulated flow.)');
  closeModal();
});

// Task buttons: simulate verifies (front-end) — replace with backend verification on production
document.querySelectorAll('.task-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const task = btn.dataset.task;
    // simple toggle for demo
    if(btn.classList.contains('done')){
      btn.classList.remove('done'); btn.textContent='Start';
    } else {
      btn.classList.add('done'); btn.textContent='Completed';
      // store task done in localStorage
      const tasks = JSON.parse(localStorage.getItem('equil_tasks')||'{}');
      tasks[task] = true;
      localStorage.setItem('equil_tasks', JSON.stringify(tasks));
    }
  })
});

// ---- Sine wave animation for header canvas ----
const canvas = document.getElementById('sineCanvas');
const ctx = canvas.getContext('2d');
const w = canvas.width; const h = canvas.height;
let t = 0;
function drawSine(){
  ctx.clearRect(0,0,w,h);
  // background
  ctx.fillStyle = '#07060a';
  ctx.fillRect(0,0,w,h);
  // sine wave
  ctx.lineWidth = 6;
  for(let layer=0;layer<3;layer++){
    const amp = 10 + layer*8;
    const freq = 0.008 + layer*0.002;
    ctx.beginPath();
    ctx.strokeStyle = layer===0? 'rgba(139,92,246,0.95)' : layer===1? 'rgba(124,58,237,0.6)' : 'rgba(99,102,241,0.35)';
    for(let x=0;x<w;x++){
      const y = h/2 + Math.sin((x*t)*freq + t*0.02 + layer)*amp;
      layer===0?ctx.lineTo(x,y):ctx.lineTo(x,y);
    }
    ctx.stroke();
  }
  t += 1;
  requestAnimationFrame(drawSine);
}
requestAnimationFrame(drawSine);

// end of script
