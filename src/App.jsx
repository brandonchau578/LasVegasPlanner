import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomeFeed from './components/HomeFeed';
import CreatePost from './components/CreatePost';
import PostPage from './components/PostPage';
import { supabase } from './supabase'; // Supabase client
import './App.css';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // Manage search query state

  // Fetch posts from Supabase on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts') // Supabase table name
        .select('*')
        .order('time', { ascending: false }); // Order posts by time (most recent first)

      if (error) {
        console.error('Error fetching posts:', error.message);
      } else {
        setPosts(data);
      }
    };

    fetchPosts();
  }, []);

  return (
    <Router>
      <Navbar setSearchQuery={setSearchQuery} /> {/* Pass setSearchQuery to Navbar */}
      <div className="PageContainer">
        <Routes>
          <Route
            path="/"
            element={<HomeFeed posts={posts} searchQuery={searchQuery} />} // Pass searchQuery to HomeFeed
          />
          <Route
            path="/create"
            element={<CreatePost posts={posts} setPosts={setPosts} />}
          />
          <Route
            path="/post/:id"
            element={<PostPage posts={posts} setPosts={setPosts} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
