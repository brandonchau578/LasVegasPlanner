import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HomeFeed.css';

const HomeFeed = ({ posts, searchQuery }) => {
  const [sortOption, setSortOption] = useState('newest');

  // Sort posts based on the sortOption
  const sortedPosts = [...posts]; // Copy the posts to avoid mutating state directly
  if (sortOption === 'newest') {
    sortedPosts.sort((a, b) => new Date(b.time) - new Date(a.time)); // Sort by time
  } else if (sortOption === 'popular') {
    sortedPosts.sort((a, b) => b.upvotes - a.upvotes); // Sort by upvotes
  }

  // Filter posts based on search query
  const filteredPosts = sortedPosts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="home-feed">
      <div className="ContentContainer">
        {/* Sort by buttons */}
        <div className="filters">
          <h1>Order By:</h1>
          <button
            className={sortOption === 'newest' ? 'active' : ''}
            onClick={() => setSortOption('newest')}
          >
            Newest
          </button>
          <button
            className={sortOption === 'popular' ? 'active' : ''}
            onClick={() => setSortOption('popular')}
          >
            Most Popular
          </button>
        </div>

        {/* Posts list */}
        <ul className="post-list">
          {filteredPosts.length === 0 ? (
            <p>No posts available. Be the first to create one!</p>
          ) : (
            filteredPosts.map((post) => (
              <li key={post.id}>
                <Link to={`/post/${post.id}`} className="post-link">
                  <h3>{post.title}</h3>
                </Link>
                <p>{post.content}</p>
                <span>{new Date(post.time).toLocaleString()}</span>
                <span>{post.upvotes} Upvotes</span>
                {post.imageUrl && <img src={post.imageUrl} alt={post.title} />}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default HomeFeed;
