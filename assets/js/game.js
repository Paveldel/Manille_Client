import { SERVER } from "./config.js"; 

const suitOrder = ['♠', '♥', '♣', '♦'];
const rankOrder = ["10", "A", "K", "Q", "J", "9", "8", "7"];

const POLL_DELAY = 10000;

const $waitingText = document.querySelector(".waiting");
const $hand = document.querySelector(".hand");
const $trick = document.querySelector(".trick");

const gameId = localStorage.getItem("gameId");
const playerId = localStorage.getItem("playerId");

$waitingText.querySelector("div ~ div").innerText = `Game ID: ${gameId}`;

document.querySelector(".trump-options").addEventListener('click', selectTrump);
$hand.addEventListener('click', playCard);

function authorizedHeaders(playerId) {
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${playerId}`);
    return headers;
}

async function getGameState() {
    const headers = authorizedHeaders(playerId);
    
    const res = await fetch(`${SERVER}/games/${gameId}`, {
        method: "GET",
        headers: headers
    });

    return await res.json();
}

async function gameLoop() {
    const state = await getGameState();
    console.log(state);

    if (checkGameReady(state)) {
        trump(state);
        setHand(state);
        showTrick(state);
    }

    setTimeout(gameLoop, POLL_DELAY);
}

function showTrick(state) {
    $trick.innerHTML = "";
    const offset = state.trick.length - state.nextPlayer + 4;
    state.players.forEach((player, i) => {
        $trick.insertAdjacentHTML('beforeend', `<div>
                ${createCard(state.trick[(i + offset) % 4], 0)}
                <p class="${state.players[state.nextPlayer] === player ? "next" : ""}">${player}</p>
            </div>`)
    });
}

function createCard(card, id) {
    if (!card) return `<div class="card empty">
                <span>/</span>
                <span>/</span>
            </div>`;
    return `<div data-id="${id}" class="card ${["♥", "♦"].includes(card._suit) ? "red" : "black"}">
                <span>${card._rank}</span>
                <span>${card._suit}</span>
            </div>`;
}

function setHand(state) {
    const hand = sortCards(state.hand);
    $hand.innerHTML = "";
    hand.forEach(card => {
        const id = state.hand.indexOf(card);
        $hand.insertAdjacentHTML("beforeend", createCard(card, id));
    });
}

function trump(state) {
    const $selector = document.querySelector(".select-trump");
    const $wait = document.querySelector(".wait-for-trump");
    if (state.gameState === 1) { // select trump
        if (yourTurn(state)) {
            $selector.classList.remove("hidden");
        } else {
            $wait.classList.remove("hidden");
        }
    } else {
        $selector.classList.add("hidden");
        $wait.classList.add("hidden");
    }
}

function checkGameReady(state) {
    if (state.gameState) {
        $waitingText.outerHTML = "";
    }

    return (state.gameState !== 0);
}

function yourTurn(state) {
    return state.players[state.nextPlayer] === state.localPlayer;
}

async function selectTrump(e) {
    const trump = e.target.dataset.trump;
    if (!trump) return;

    const headers = authorizedHeaders(playerId);
    
    const res = await fetch(`${SERVER}/games/${gameId}/trump`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({"suit": trump})
    });

    document.querySelector("select-trump").classList.add("hidden");
    return await res.json();
    //TODO handle error
}

function sortCards(cards) {
  return [...cards].sort((cardA, cardB) => {
    const suitDiff = suitOrder.indexOf(cardA._suit) - suitOrder.indexOf(cardB._suit);
    
    if (suitDiff !== 0) {
      return suitDiff;
    }
    
    return rankOrder.indexOf(cardA._rank) - rankOrder.indexOf(cardB._rank);
  });
}

async function playCard(e) {
    const headers = authorizedHeaders(playerId);
    
    console.log(e.target.dataset.id, e.target.closest('.card'));

    const res = await fetch(`${SERVER}/games/${gameId}`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({"card": e.target.closest('.card').dataset.id})
    });

    return await res.json();
}

gameLoop();