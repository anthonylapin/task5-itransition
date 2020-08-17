import React, { useState } from 'react';
import CreateGame from './components/CreateGame';
import Games from './components/Games';
import Game from './pages/Game';

function App() {
  const [showGame, setShowGame] = useState(false);
  const [name, setName] = useState('');
  const [gameId, setGameId] = useState('');
  const [tags, setTags] = useState('');

  const onFormSubmit = (name, tags = '', gameId = '') => {
    setName(name);
    setTags(tags);
    setGameId(gameId);
    setShowGame(true);
  };

  return (
    <div className="container">
      <h3>Tic-Tac-Toe</h3>
      {!showGame && (
        <>
          <CreateGame onFormSubmit={onFormSubmit} />
          <Games onFormSubmit={onFormSubmit} />
        </>
      )}
      {showGame && <Game name={name} gameId={gameId} tags={tags} />}
    </div>
  );
}

export default App;
