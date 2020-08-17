import React, { useState } from 'react';

const JoinGame = ({ onFormSubmit }) => {
    const [name, setName] = useState('');
    const [gameId, setGameId] = useState('');

    const nameHandler = (e) => {
        setName(e.target.value)
    }

    const gameIdHandler = (e) => {
        setGameId(e.target.value)
    }

    return (
        <div className="join-game">
            <div className="form-group row">
                <div className="col">
                    <input
                        type="text"
                        placeholder="Enter your name"
                        className="form-control"
                        onChange={nameHandler}
                    />
                </div>
                <div className="col">
                    <input
                        type="text"
                        placeholder="Enter game id"
                        className="form-control"
                        onChange={gameIdHandler}
                    />
                </div>
                <div className="col">
                    <button onClick={() => onFormSubmit(name, '', gameId)} className="btn btn-warning">
                        Join
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JoinGame;