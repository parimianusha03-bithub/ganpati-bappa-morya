const menu=document.getElementById("menu");
const game=document.getElementById("game");
const gameOver=document.getElementById("gameOver");
const stageComplete=document.getElementById("stageComplete");
const playBtn=document.getElementById("playBtn");
const againBtn=document.getElementById("againBtn");
const nextBtn=document.getElementById("nextBtn");
const leftBtn=document.getElementById("leftBtn");
const rightBtn=document.getElementById("rightBtn");
const jumpBtn=document.getElementById("jumpBtn");
const player=document.getElementById("player");
const objects=document.getElementById("objects");
const livesEl=document.getElementById("lives");
const scoreEl=document.getElementById("score");
const finalScore=document.getElementById("finalScore");
const completeScore=document.getElementById("completeScore");
let lane=1,lives=3,score=0,running=false,jumping=false,gameTimer=null,spawnTimer=null;
const lanes=["33%","50%","67%"];
function updateHUD(){
  scoreEl.textContent=score;
  livesEl.innerHTML="";
  for(let i=0;i<3;i++){
    const heart=document.createElement("img");
    heart.src="LIFE.png";
    heart.className="life-heart";
    if(i>=lives)heart.style.opacity="0.25";
    livesEl.appendChild(heart);
  }
}
function setPlayerLane(){player.style.left=lanes[lane]}
function moveLeft(){if(running&&lane>0){lane--;setPlayerLane()}}
function moveRight(){if(running&&lane<2){lane++;setPlayerLane()}}
function jump(){
  if(!running||jumping)return;
  jumping=true;player.style.bottom="260px";
  setTimeout(()=>{player.style.bottom="110px";setTimeout(()=>{jumping=false},350)},450);
}
function createCollectible(type,emoji,points){
  const item=document.createElement("div");
  item.className="collectible";item.className="collectible";item.dataset.type=type;item.dataset.points=points;
 if(type==="flower"){
const img=document.createElement("img");
img.src="FLOWER.png";
img.alt="Flower";
item.appendChild(img);
}else{
item.textContent=emoji;
}
  item.style.left=lanes[Math.floor(Math.random()*3)];item.style.top="-70px";objects.appendChild(item);return item;
}
function createEnemy(){
  const enemy=document.createElement("div");enemy.className="enemy";
  const img=document.createElement("img");img.src="ENEMY (1).png";img.alt="Festival Mouse";enemy.appendChild(img);
  enemy.style.left=lanes[Math.floor(Math.random()*3)];enemy.style.top="-70px";objects.appendChild(enemy);return enemy;
}
function spawnObject(){
  if(!running)return;
  const choice=Math.random();
  if(choice<.28)createCollectible("flower","n",10);
  else if(choice<.50)createCollectible("diya","n",20);
  else if(choice<.70)createCollectible("garland","n",30);
  else createEnemy();
}
function objectHitPlayer(obj){
  const a=obj.getBoundingClientRect(),b=player.getBoundingClientRect();
  return !(a.right<b.left+15||a.left>b.right-15||a.bottom<b.top+15||a.top>b.bottom-15);
}
function loseLife(enemy){
  enemy.remove();lives--;updateHUD();if(lives<=0)endGame();
}
function collectItem(item){score+=Number(item.dataset.points);scoreEl.textContent=score;item.remove()}
function moveObjects(){
  [...objects.children].forEach(item=>{
    const newTop=parseFloat(item.style.top)+8;item.style.top=newTop+"px";
    if(objectHitPlayer(item)){
      if(item.classList.contains("enemy")){if(!jumping)loseLife(item)}
      else collectItem(item);return;
    }
    if(newTop>window.innerHeight)item.remove();
  });
}
function startGame(){
  menu.classList.add("hidden");gameOver.classList.add("hidden");stageComplete.classList.add("hidden");game.classList.remove("hidden");
  objects.innerHTML="";lane=1;lives=3;score=0;running=true;jumping=false;player.style.bottom="110px";
  setPlayerLane();updateHUD();
  spawnTimer=setInterval(spawnObject,850);gameTimer=setInterval(moveObjects,30);
}
function endGame(){
  running=false;clearInterval(spawnTimer);clearInterval(gameTimer);finalScore.textContent=score;
  game.classList.add("hidden");gameOver.classList.remove("hidden");
}
function restartGame(){startGame()}
playBtn.addEventListener("click",startGame);
againBtn.addEventListener("click",restartGame);
nextBtn.addEventListener("click",()=>alert("Stage 2 – Create Rangoli will be added next! n"));
leftBtn.addEventListener("click",moveLeft);rightBtn.addEventListener("click",moveRight);jumpBtn.addEventListener("click",jump);
document.addEventListener("keydown",event=>{
  if(event.key==="ArrowLeft")moveLeft();
  if(event.key==="ArrowRight")moveRight();
  if(event.key==="ArrowUp"||event.code==="Space")jump();
});
updateHUD();setPlayerLane()
