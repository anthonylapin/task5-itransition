const games = [];

const createGame = (id, player1, player2, tags) => {
    const newGame = {
        id,
        player1,
        player2,
        tags,
        playerTurn: player1,
        playBoard: Array(9).fill(null),
        status: 'waiting',
        winner: null,
    };
    games.push(newGame);
    return newGame;
};

const updateGame = game => {
    const index = games.findIndex(g => g.id === game.id);
    if (index !== -1) {
        games[index] = game;
    }
};

const getGames = () => games;

const getGamesByTags = tag => games.filter(game => game.tags.includes(tag));

const getGame = id => games.find(game => game.id === id);

module.exports = { createGame, updateGame, getGame, getGamesByTags, getGames };