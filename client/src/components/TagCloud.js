import React from 'react';

const TagCloud = ({ tags, sortGames }) => {
    return (
        <div className="card-body">
            {tags.length > 0 && <h4>Tags</h4>}
            <ul>
                {tags.map((tag, index) => (
                    <li onClick={() => sortGames(tag)} key={index}>
                        <p>{tag}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TagCloud;