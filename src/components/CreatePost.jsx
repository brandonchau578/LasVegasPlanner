import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase'; // Import the supabase client
import './CreatePost.css';

const CreatePost = ({ posts, setPosts }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    // Create a new post object
    const newPost = {
      title,
      content,
      imageUrl, // Ensure the name matches the column in Supabase (case-sensitive)
      time: new Date().toISOString(), // Store the current time as an ISO string
      upvotes: 0, // Default upvotes
      comments: [], // Initialize with an empty comments array
    };

    try {
      // Insert the new post into Supabase database
      const { data, error } = await supabase
        .from('posts') // Target the 'posts' table
        .insert([newPost]);

      if (error) {
        console.error('Error inserting post:', error.message);
        alert('Failed to create post');
      } else {
        console.log('Post created successfully:', data);
        // Add the new post to the local state as well
        setPosts([newPost, ...posts]);
        navigate('/'); // Navigate back to the home feed
      }
    } catch (error) {
      console.error('Error inserting post:', error);
      alert('Something went wrong while creating the post');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Create a New Post</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Content (optional)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <input
        type="text"
        placeholder="Image URL (optional)"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  );
};

export default CreatePost;
