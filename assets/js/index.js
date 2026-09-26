document.querySelector("#create-game").addEventListener('submit', createGame);
document.querySelector("#join-game").addEventListener('submit', joinGame);

function createGame(e) {
    e.preventDefault();
    const username = document.querySelector("#create-username").value;
    console.log("create game", username);
}

function joinGame(e) {
    e.preventDefault();
    const username = document.querySelector("#join-username").value;
    const gameId = document.querySelector("#game-id").value;
    console.log("join game", username, gameId);
}