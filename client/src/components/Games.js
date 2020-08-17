import React, { useState, useCallback, useEffect } from 'react';
import { useHttp } from '../hooks/http.hook';
import Loader from '../components/Loader';
import GameCard from '../components/GameCard';
import TagCloud from '../components/TagCloud';

const Games = ({ onFormSubmit }) => {
    const [username, setUsername] = useState('');
    const [games, setGames] = useState([]);
    const [gamesWithTags, setGamesWithTags] = useState([]);
    const [tags, setTags] = useState([]);

    const { loading, request } = useHttp();

    const fetchGamesAndTags = useCallback(async () => {
        try {
            const fetched = await request('/api/content/games');
            if (fetched.message !== 'No items') {
                setGames(fetched);
                setGamesWithTags(fetched);
                let fetchedTags = [];
                fetched.forEach(game => {
                    fetchedTags = [...fetchedTags, ...game.tags];
                });

                let uniqueFetchedTags = [...new Set(fetchedTags)];
                setTags([...uniqueFetchedTags, 'all']);
            }
        } catch (e) { }
    }, [request]);

    useEffect(() => {
        fetchGamesAndTags();
    }, [fetchGamesAndTags]);


    const sortGames = (tag) => {
        setGamesWithTags(games);
        if (tag === 'all') {
            setGamesWithTags(games);
        } else {
            setGamesWithTags(prevState => prevState.filter(game => game.tags.includes(tag)));
        }
    }

    const joinGame = (gameId) => {
        onFormSubmit(username, '', gameId);
    }

    return (
        <div>
            {!games.length && (
                <div className="text-center">
                    <div className="alert alert-danger" role="alert">
                        No available games.
                    </div>
                </div>
            )}
            {loading && <Loader />}
            {games.length > 0 && (
                <div className="row">
                    <div className="col">
                        <input
                            type="text"
                            placeholder="Enter your name"
                            className="form-control"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                </div>
            )}
            <div className="row">
                <div className="col-4">
                    {!loading && <TagCloud tags={tags} sortGames={sortGames} />}
                </div>
                <div className="col-8">
                    {!loading && gamesWithTags.map((game, index) => (
                        <GameCard
                            key={index}
                            name={game.name}
                            gameId={game.id}
                            isFull={game.isFull}
                            tags={game.tags}
                            joinGame={joinGame}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Games;