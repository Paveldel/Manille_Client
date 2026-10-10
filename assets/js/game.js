import { SERVER } from "./config.js"; 

const POLL_DELAY = 10000;

const $waitingText = document.querySelector(".waiting");

const gameId = localStorage.getItem("gameId");
const playerId = localStorage.getItem("playerId");

$waitingText.querySelector("div ~ div").innerText = `Game ID: ${gameId}`;

document.querySelector(".trump-options").addEventListener('click', selectTrump);

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
        console.log("ready");
    }

    setTimeout(gameLoop, POLL_DELAY);
}

function checkGameReady(state) {
    if (state.gameState) {
        $waitingText.outerHTML = "";
    }

    return (state.gameState !== 0);
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

    return await res.json();
    //TODO handle error
}

gameLoop();