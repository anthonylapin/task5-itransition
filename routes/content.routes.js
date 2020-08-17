const { Router } = require('express');
const { getGames } = require('../data/games');
const { getPlayer } = require('../data/players');

const router = Router();

router.get('/games', (req, res) => {
    try {
        let games = getGames();

        if (!games.length) {
            return res.json({
                message: "No items"
            });
        }

        gamesInfo = games.map(game => {
            return {
                id: game.id,
                name: getPlayer(game.player1).name,
                isFull: game.player2,
                tags: game.tags
            };
        });

        res.json(gamesInfo);
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong...'
        });
    }
});

module.exports = router;