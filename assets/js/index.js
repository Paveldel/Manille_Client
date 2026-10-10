import { SERVER, postHeaders } from "./config.js"; 

document.querySelector("#create-game").addEventListener('submit', createGame);
document.querySelector("#join-game").addEventListener('submit', joinGame);

const gameId = localStorage.getItem("gameId");
const playerId = localStorage.getItem("playerId");

if (gameId && playerId) NavigateToGame(gameId, playerId);

async function createGame(e) {
    e.preventDefault();
    resetError();

    const username = document.querySelector("#create-username").value;
    
    try {
        const res = await fetch(`${SERVER}/games`, {
            method: "POST",
            headers: postHeaders,
            body: JSON.stringify({username})
        });

        console.log(res.status !== 201);
        
        if (res.status !== 201) setError();

        const { gameId, playerId } = await res.json();

        NavigateToGame(gameId, playerId);
    } catch (error) {
        console.log(error);
        setError();
    }
}

async function joinGame(e) {
    e.preventDefault();
    resetError();

    const username = document.querySelector("#join-username").value;
    const gameId = document.querySelector("#game-id").value;
    
    try {
        const res = await fetch(`${SERVER}/games/${gameId}/join`, {
            method: "POST",
            headers: postHeaders,
            body: JSON.stringify({username})
        });

        if (res.status !== 201) setError();

        const { playerId } = await res.json();

        NavigateToGame(gameId, playerId);
    } catch (error) {
        setError();
    }
}

function setError() {
    document.querySelector(".error").innerText = "Could not connect to server";
}

function resetError() {
    document.querySelector(".error").innerText = "Could not connect to server";
}

function NavigateToGame(gameId, playerId) {
    localStorage.setItem("gameId", gameId);
    localStorage.setItem("playerId", playerId);
    window.location.href = "/game";
}