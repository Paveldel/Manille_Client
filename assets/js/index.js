import { SERVER } from "./config.js"; 

document.querySelector("#create-game").addEventListener('submit', createGame);
document.querySelector("#join-game").addEventListener('submit', joinGame);

const postHeaders = new Headers();
postHeaders.append("Content-Type", "text/plain");

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

        if (res.status != 201) setError();
    } catch (error) {
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

        if (res.status != 201) setError();
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