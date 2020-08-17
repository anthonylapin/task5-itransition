import React from 'react';

const GameCard = ({ name, gameId, isFull, tags, joinGame }) => {
    return (
        <div className="col">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">{name}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">{gameId}</h6>
                    <p className="card-text">{tags.toString()}</p>
                    <div className="col">
                        <button
                            className="btn btn-primary"
                            disabled={isFull}
                            onClick={() => joinGame(gameId)}
                        >
                            {isFull ? "Not available" : "Join"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameCard;