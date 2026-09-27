import { SERVER } from "./config.js"; 

const POLL_DELAY = 1000;

const $waitingText = document.querySelector(".waiting");

const gameId = localStorage.getItem("gameId");
const playerId = localStorage.getItem("playerId");

$waitingText.querySelector("div ~ div").innerText = `Game ID: ${gameId}`;

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
        $waitingText.innerHTML = "";
    }

    return (state.gameState !== 0);
}

gameLoop();