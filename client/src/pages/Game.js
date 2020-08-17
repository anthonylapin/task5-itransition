import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Board from '../components/Board';

let socket;

const Game = ({ name, gameId, tags }) => {
    const [winner, setWinner] = useState(null);
    const [player, setPlayer] = useState({});
    const [game, setGame] = useState({});
    const [notification, setNotification] = useState([]);

    useEffect(() => {
        const event = gameId ? 'joinGame' : 'createGame';
        socket = new io();
        socket.emit(event, { name, gameId, tags });

        return () => {
            socket.emit('disconnect');
            socket.off();
        };
    }, [gameId, name, tags]);

    useEffect(() => {
        socket.on('notification', data => {
            const { message = '' } = data;
            notification.push(message);
            setNotification([...notification]);
        });
    }, [notification]);

    useEffect(() => {
        socket.on('playerCreated', data => {
            const { player } = data;
            setPlayer(player);
        });

        socket.on('gameUpdated', data => {
            const { game } = data;
            setGame(game);
        });

        socket.on('gameEnd', data => {
            const { winner } = data;
            setWinner(winner);
            setTimeout(() => { window.location.reload(); }, 5000);
        });
    });

    const onSquareClick = value => {
        socket.emit('moveMade', {
            square: value,
            player,
            gameId: game.id,
        });
    };

    const getWinnerMessage = () => {
        return winner.player.id === player.id ? 'You Win' : 'You Lose';
    };

    const turnMessage =
        game.playerTurn === player.id ? 'Your Move' : 'Opponent Turn';

    const winnerMessage = winner ? getWinnerMessage() : 'Draw';

    return (
        <div>
            {player && (
                <h5>
                    Welcome {player.name}.{' '}
                    <strong>You are playing {player.symbol}</strong>
                </h5>
            )}
            {game.status === 'playing' && <h5>{turnMessage}</h5>}
            {game && <h5>Game ID: {game.id}</h5>}

            {game.status === 'gameOver' && (
                <div className="popup">
                    <div className="popup_inner text-center">
                        <h1>{winnerMessage}</h1>
                        <h3>You will be redirected to main page in 5 seconds...</h3>
                    </div>
                </div>
            )}
            <hr />
            <Board
                player={player}
                game={game}
                onSquareClick={onSquareClick}
                winner={winner}
            />
            {notification.map((msg, index) => (
                <p key={index}>{msg}</p>
            ))}
        </div>
    );
};

export default Game;