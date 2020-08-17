const { makeKey, checkWinner } = require('./util');
const { createGame, getGame, updateGame } = require('./data/games');
const { createPlayer, getPlayer, removePlayer } = require('./data/players');
const { createTag } = require('./data/tags');

function handleSocketConnection(io) {
    io.on('connection', socket => {
        socket.on('disconnect', () => {
            disconnectHandler(socket);
        });

        // Player create new game
        socket.on('createGame', ({ name, tags }) => {
            createGameHandler(socket, name, tags);
        });

        socket.on('joinGame', ({ name, gameId }) => {
            joinGameHandler(socket, name, gameId);
        });

        socket.on('moveMade', data => {
            moveMadeHandler(io, data);
        });
    });
}

function disconnectHandler(socket) {
    const player = getPlayer(socket.id);
    if (player) {
        removePlayer(player.id);
    }
}

function createGameHandler(socket, name, tags) {
    const gameId = `game-${makeKey()}`;
    const player = createPlayer(socket.id, name, gameId, 'X');

    let tagsUniqueArray = makeUniqueArray(tags.split(' '));
    createTag(tagsUniqueArray);
    const game = createGame(gameId, player.id, null, tagsUniqueArray);

    socket.join(gameId);
    socket.emit('playerCreated', { player });
    socket.emit('gameUpdated', { game });

    socket.emit('notification', {
        message: `The game has been created. Game id: ${gameId}.`
    });
    socket.emit('notification', {
        message: 'Waiting for opponent ...'
    });
}

function joinGameHandler(socket, name, gameId) {
    const game = getGame(gameId);
    if (!game) {
        socket.emit('notification', {
            message: 'Invalid game id',
        });
        return;
    }

    if (game.player2) {
        socket.emit('notification', {
            message: 'Game is full',
        });
        return;
    }

    const player = createPlayer(socket.id, name, game.id, 'O');
    updateGameAfterJoinOfPlayer2(player, game);

    socket.join(gameId);
    socket.emit('playerCreated', { player });
    socket.emit('gameUpdated', { game });

    socket.broadcast.emit('gameUpdated', { game });
    socket.broadcast.emit('notification', {
        message: `${name} has joined the game.`,
    });
}

function moveMadeHandler(io, data) {
    const { player, square, gameId } = data;

    let game = getGame(gameId);

    const { playBoard = [], playerTurn, player1, player2 } = game;
    playBoard[square] = updateBoard(player.symbol);

    const nextTurnId = updatePlayerTurn(playerTurn, player1, player2);

    game = updateGameObject(game, nextTurnId, playBoard);

    io.in(gameId).emit('gameUpdated', { game });

    // Check winning status or Draw
    const hasWon = checkWinner(playBoard);

    if (hasWon) {
        const winner = { ...hasWon, player };
        game.status = 'gameOver';
        updateGame(game);
        io.in(gameId).emit('gameUpdated', { game });
        io.in(gameId).emit('gameEnd', { winner });
        return;
    }

    const emptySquareIndex = playBoard.findIndex(item => item === null);
    if (emptySquareIndex === -1) {
        game.status = 'gameOver';
        updateGame(game);
        io.in(gameId).emit('gameUpdated', { game });
        io.in(gameId).emit('gameEnd', { winner: null });
        return;
    }
}

function makeUniqueArray(arr) {
    let UniqueArray = [...new Set(arr)]
    return UniqueArray;
}

function updateGameAfterJoinOfPlayer2(player2, game) {
    game.player2 = player2.id;
    game.status = 'playing';
    updateGame(game);
}

function updatePlayerTurn(playerTurn, player1, player2) {
    return playerTurn === player1 ? player2 : player1;
}

function updateBoard(symbol) {
    return symbol;
}

function updateGameObject(game, nextTurnId, playBoard) {
    game.playerTurn = nextTurnId;
    game.playBoard = playBoard;
    updateGame(game);

    return game;
}

module.exports = { handleSocketConnection };