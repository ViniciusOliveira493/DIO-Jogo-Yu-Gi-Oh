const state = {
    view : {
        score : document.getElementById("placar")
        ,selectedCardContainer : document.getElementById("selectedCard")
        ,selectedCardName : document.getElementById("cardName")
        ,selectedCardType : document.getElementById("cardType")
        
        ,computerHand : document.getElementById("computer-hand")
        ,playerHand : document.getElementById("player-hand")

        ,tableComputerSelectedCard :  document.getElementById("computerSelectedCard")
        ,tablePlayerSelectedCard :  document.getElementById("playerSelectedCard")

        ,buttonNextGame : document.getElementById("btnNext")        
    }
    ,value : {
        playerPoints : 0
        ,computerPoints : 0
        ,audio:null
    }
    ,actions : {
        nextBattle : 0
    }
}
const imagePath = "./src/assets/icons/"
const cards = [
    magician = {
        sprite : `${imagePath}magician.png`
        ,name : "Dark Magician"
        ,type:"scissors"
        ,wins : ["paper"]
        ,loses : ["rock"]
    }
    ,exodia = {
        sprite : `${imagePath}exodia.png`
        ,name : "Exodia The Forbidden One"
        ,type:"rock"
        ,wins : ["scissors"]
        ,loses : ["paper"]
    }
    ,dragon = {
        sprite : `${imagePath}dragon.png`
        ,name : "Blue-Eyes White Dragon"
        ,type:"paper"
        ,wins : ["rock"]
        ,loses : ["scissors"]
    }
];

state.view.playerHand.addEventListener("mouseover",(e)=>{
    if(e.target.attributes.class.value === "card"){
        let num = e.target.getAttribute("data-num");
        loadCardData(num);
    }
});

state.actions.clickListener = state.view.playerHand.addEventListener("click",function(e){cardClick(e)});

state.actions.nextBattle =  state.view.buttonNextGame.addEventListener("click",()=>resetBattle());

init();

function init() {
    state.view.buttonNextGame.style.display = "none";  

    drawCards(5,state.view.playerHand);
    drawCards(5,state.view.computerHand);
    
    playBgMusic();
}

function drawCards(qtd,container) {
    container.innerHTML = "";
    for (let i = 0; i < qtd; i++) {
        let card = document.createElement("div");        
        card.setAttribute("class","card");
        card.setAttribute("data-num",getRandomCardId());

        container.appendChild(card);
    }
}

function cardClick(e){
    if(e.target.attributes.class.value === "card"){
        let num = e.target.getAttribute("data-num");
        selectCard(num,state.view.tablePlayerSelectedCard);
        play(num);
    }
}

function getRandomCardId(){
    return Math.floor(Math.random() * cards.length);
}

function loadCardData(id) {
    let card = cards[id];
    let img = document.createElement("img");
    img.setAttribute("src",card.sprite);
    state.view.selectedCardContainer.innerHTML = "";
    state.view.selectedCardContainer.appendChild(img);
    state.view.selectedCardName.innerHTML = card.name;
    state.view.selectedCardType.innerHTML = "Attribute: "+card.type;
}

function selectCard(id,player) {
    lockDeck(true);

    let card = cards[id];

    let img = document.createElement("img");
    img.setAttribute("src",card.sprite);
    img.setAttribute("data-cardid",id);

    player.innerHTML = "";
    player.appendChild(img);
}

function play(playerCardId) {
    let computerCard = getRandomCardId();
    selectCard(computerCard,state.view.tableComputerSelectedCard);
    setTimeout(fight,300);
}

function fight() {
   let computerCard = 
    state.view.tableComputerSelectedCard.firstChild.getAttribute("data-cardid");
   let playerCard = 
    state.view.tablePlayerSelectedCard.firstChild.getAttribute("data-cardid");

    computerCard = cards[computerCard];
    playerCard = cards[playerCard];

    let resultado = "Draw"
    if(computerCard.wins.includes(playerCard.type)){
        resultado = "Defeat";
        state.value.computerPoints++;
        playSound("lose.wav");
    }

    if(computerCard.loses.includes(playerCard.type)){
        resultado = "Win";
        state.value.playerPoints++;
        playSound("win.wav");
    }

    state.view.buttonNextGame.style.display = "block";
    state.view.buttonNextGame.innerHTML = resultado;
    updateScore();
}

function updateScore() {
    state.view.score.innerHTML = "";

    let span = document.createElement("span");
    span.innerHTML = `Win: ${state.value.playerPoints} 
        | Lose: ${state.value.computerPoints}`;

        state.view.score.appendChild(span);
}

function clearBattle(){
    state.view.tablePlayerSelectedCard.innerHTML = "";
    state.view.tableComputerSelectedCard.innerHTML = "";
    state.view.playerHand.innerHTML = "";
    state.view.computerHand.innerHTML = "";
}

function playSound(soundName){
    let audio = new Audio("./src/assets/audios/"+soundName);
    audio.play();
    audio.volume = 0.5;    
}

function playBgMusic(){
    if(state.value.audio !== null){
        return 0;
    }

    state.value.audio = new Audio("./src/assets/audios/egyptian_duel.mp3"); 
    
    state.value.audio.play();
    state.value.audio.loop = true;
    state.value.audio.volume = 0.2;    
    state.value.audioOn = true;
    
    return 1;
}

function resetBattle(){   
    clearBattle();    
    lockDeck(false);
    init();
}

function lockDeck(bool) {
    if(bool){
        state.view.playerHand.style.userSelect = "none"
        state.view.playerHand.style.pointerEvents = "none"
    }else{
        state.view.playerHand.style.userSelect = "all"
        state.view.playerHand.style.pointerEvents = "all"
    }
}