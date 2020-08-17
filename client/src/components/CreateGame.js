import React, { useState } from 'react';

const CreateGame = ({ onFormSubmit }) => {
    const [name, setName] = useState('');
    const [tags, setTags] = useState('');

    const nameHandler = (e) => {
        setName(e.target.value)
    }

    const tagsHandler = (e) => {
        setTags(e.target.value)
    }

    return (
        <div className="create-game">
            <h4>Create new game</h4>
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
                        placeholder="Enter tags for the game"
                        className="form-control"
                        onChange={tagsHandler}
                    />
                </div>
                <div className="col">
                    <button onClick={() => onFormSubmit(name, tags)} className="btn btn-info">
                        Create Game
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateGame;