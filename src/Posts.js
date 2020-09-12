import React from 'react';
import { Route, Link } from 'react-router-dom';

const Posts = ({posts, loading}) => {
    if(loading) {
        return <h2>Loading...</h2>
    }

    return (
        <ul style={{display: "flex", alignItems: 'center', flexDirection: 'column'}}>
            {posts.map(post => (
                <p style={{height: 22}} key={post.id}>
                    <Link style={{color: 'whitesmoke', fontSize: 25, fontFamily: 'inherit'}} to={`/pokemon/${post.id}`}>
                        {post.name[0].toUpperCase() + post.name.slice(1).toLowerCase()}
                    </Link>
                </p>
            ))}
        </ul>
    )
}

export default Posts; 