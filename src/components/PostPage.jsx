import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase'; // Import Supabase client
import './PostPage.css';

const PostPage = ({ posts, setPosts }) => {
    const { id } = useParams();
    const postId = id ? parseInt(id) : null;
    const navigate = useNavigate(); // For navigation

    useEffect(() => {
        console.log('Post ID from URL:', postId);
    }, [postId]);

    // Find the post by ID
    const post = posts.find((post) => post.id === postId);

    if (!post) {
        return <div>Post not found!</div>;
    }

    const storedUpvotes = localStorage.getItem(`upvotes-${postId}`) || post.upvotes;
    const storedComments = JSON.parse(localStorage.getItem(`comments-${postId}`)) || post.comments;

    const [upvotes, setUpvotes] = useState(Number(storedUpvotes));
    const [comments, setComments] = useState(storedComments);
    const [newComment, setNewComment] = useState('');

    const handleUpvote = () => {
        const newUpvotes = upvotes + 1;
        setUpvotes(newUpvotes);
        localStorage.setItem(`upvotes-${postId}`, newUpvotes);
    };

    const handleCommentChange = (event) => {
        setNewComment(event.target.value);
    };

    const handleAddComment = (event) => {
        event.preventDefault();
        if (newComment.trim() !== '') {
            const newCommentObj = {
                id: Date.now(),
                text: newComment,
                time: new Date().toLocaleString(),
            };
            const updatedComments = [...comments, newCommentObj];
            setComments(updatedComments);
            setNewComment('');
            localStorage.setItem(`comments-${postId}`, JSON.stringify(updatedComments));
        }
    };

    const handleDeletePost = async () => {
        const { error } = await supabase.from('posts').delete().eq('id', postId);

        if (error) {
            console.error('Error deleting post:', error.message);
        } else {
            setPosts(posts.filter((post) => post.id !== postId));
            navigate('/'); // Redirect to homepage
        }
    };

    return (
        <div className="post-page">
            <h1>{post.title}</h1>
            <p>{post.content}</p>
            {post.imageUrl && <img src={post.imageUrl} alt={post.title} />}
            <p>{new Date(post.time).toLocaleString()}</p>

            <div>
                <button onClick={handleUpvote}>👍</button>
                <span>{upvotes} upvotes</span>
            </div>

            <div>
                <button onClick={handleDeletePost} className="delete-button">
                    Delete Post
                </button>
            </div>

            <div>
                <h3>Comments:</h3>
                <ul>
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <li key={comment.id}>
                                <p>{comment.text}</p>
                                <p>
                                    <small>{comment.time}</small>
                                </p>
                            </li>
                        ))
                    ) : (
                        <p>No comments yet. Be the first to comment!</p>
                    )}
                </ul>

                <form onSubmit={handleAddComment}>
                    <textarea
                        value={newComment}
                        onChange={handleCommentChange}
                        placeholder="Write a comment..."
                        rows="4"
                    />
                    <button type="submit">Add Comment</button>
                </form>
            </div>
        </div>
    );
};

export default PostPage;
