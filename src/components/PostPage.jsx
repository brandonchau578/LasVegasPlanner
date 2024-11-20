import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase'; // Import Supabase client

const PostPage = ({ posts, setPosts }) => {
  const { id } = useParams();
  const postId = id ? parseInt(id) : null;
  const navigate = useNavigate(); // For redirecting after deletion

  useEffect(() => {
    console.log('Post ID from URL:', postId);
  }, [postId]);

  // Find the post based on the postId
  const post = posts.find((post) => post.id === postId);

  if (!post) {
    return <div>Post not found!</div>;
  }

  // Get upvotes and comments from localStorage or default to initial values
  const storedUpvotes = localStorage.getItem(`upvotes-${postId}`) || post.upvotes;
  const storedComments = JSON.parse(localStorage.getItem(`comments-${postId}`)) || post.comments;

  // State for upvotes and comments
  const [upvotes, setUpvotes] = useState(Number(storedUpvotes));
  const [comments, setComments] = useState(storedComments);
  const [newComment, setNewComment] = useState('');

  // Handle upvote click
  const handleUpvote = () => {
    const newUpvotes = upvotes + 1;
    setUpvotes(newUpvotes);
    localStorage.setItem(`upvotes-${postId}`, newUpvotes);  // Save to localStorage
  };

  // Handle new comment input change
  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  // Handle adding new comment
  const handleAddComment = (event) => {
    event.preventDefault();  // Prevent page reload on form submit
    if (newComment.trim() !== '') {
      const newCommentObj = {
        id: Date.now(),  // Use timestamp as a unique ID for simplicity
        text: newComment,
        time: new Date().toLocaleString(),
      };
      const updatedComments = [...comments, newCommentObj];
      setComments(updatedComments);
      setNewComment('');  // Clear the input field after submission
      localStorage.setItem(`comments-${postId}`, JSON.stringify(updatedComments));  // Save to localStorage
    }
  };

  // Handle deleting the post
  const handleDeletePost = async () => {
    // Call Supabase to delete the post from the database
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) {
      console.error('Error deleting post:', error.message);
    } else {
      // Update the state to remove the post
      setPosts(posts.filter((post) => post.id !== postId));
      navigate('/'); // Redirect to the homepage after deletion
    }
  };

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      {post.imageUrl && <img src={post.imageUrl} alt={post.title} />}
      <p>{new Date(post.time).toLocaleString()}</p>

      {/* Upvote Button */}
      <div>
        <button onClick={handleUpvote}>Upvote</button>
        <span>{upvotes} upvotes</span>
      </div>

      {/* Delete Post Button */}
      <div>
        <button onClick={handleDeletePost} style={{ color: 'red' }}>
          Delete Post
        </button>
      </div>

      {/* Comment Section */}
      <div>
        <h3>Comments:</h3>
        <ul>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <li key={comment.id}>
                <p>{comment.text}</p>
                <p><small>{comment.time}</small></p>
              </li>
            ))
          ) : (
            <p>No comments yet. Be the first to comment!</p>
          )}
        </ul>

        {/* Comment Input Form */}
        <form onSubmit={handleAddComment}>
          <textarea
            value={newComment}
            onChange={handleCommentChange}
            placeholder="Write a comment..."
            rows="4"
            cols="50"
          />
          <br />
          <button type="submit">Add Comment</button>
        </form>
      </div>
    </div>
  );
};

export default PostPage;
