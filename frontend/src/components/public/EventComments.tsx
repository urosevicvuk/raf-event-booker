import React, { useState, useEffect } from 'react';
import type {Comment, CommentFormData} from '../../types';
import CommentService from '../../services/commentService';
import './EventComments.css';

interface EventCommentsProps {
  eventId: number;
}

const EventComments: React.FC<EventCommentsProps> = ({ eventId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [interactionLoading, setInteractionLoading] = useState<number | null>(null);
  const [formData, setFormData] = useState<CommentFormData>({
    authorName: '',
    text: ''
  });
  // Track like/dislike status for each comment
  const [commentLikeStatus, setCommentLikeStatus] = useState<Record<number, { hasLiked: boolean; hasDisliked: boolean }>>({});

  const limit = 10;

  useEffect(() => {
    fetchComments(1, true);
  }, [eventId]);

  const fetchComments = async (pageNum: number, reset: boolean = false) => {
    try {
      setLoading(true);
      const response = await CommentService.getCommentsForEvent(eventId, pageNum, limit);
      const newComments = response.comments || [];
      
      if (reset) {
        setComments(newComments);
      } else {
        setComments(prev => [...prev, ...newComments]);
      }
      
      setHasMore(newComments.length === limit);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    fetchComments(page + 1, false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.authorName.trim() || !formData.text.trim()) {
      alert('Please fill in both name and comment fields');
      return;
    }

    try {
      setSubmitting(true);
      await CommentService.createComment(eventId, formData);
      setFormData({ authorName: '', text: '' });
      // Refresh comments
      await fetchComments(1, true);
      setPage(1);
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Error submitting comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: number) => {
    if (interactionLoading === commentId) return;

    try {
      setInteractionLoading(commentId);
      const response = await CommentService.likeComment(commentId);
      
      // Update like/dislike status from backend
      setCommentLikeStatus(prev => ({
        ...prev,
        [commentId]: {
          hasLiked: response.hasLiked,
          hasDisliked: response.hasDisliked
        }
      }));
      
      // Update local state with response from backend
      setComments(prev => prev.map(comment => {
        if (comment.id === commentId) {
          return { 
            ...comment, 
            likeCount: response.likeCount,
            dislikeCount: response.dislikeCount
          };
        }
        return comment;
      }));
    } catch (error) {
      console.error('Error liking comment:', error);
    } finally {
      setInteractionLoading(null);
    }
  };

  const handleDislikeComment = async (commentId: number) => {
    if (interactionLoading === commentId) return;

    try {
      setInteractionLoading(commentId);
      const response = await CommentService.dislikeComment(commentId);
      
      // Update like/dislike status from backend
      setCommentLikeStatus(prev => ({
        ...prev,
        [commentId]: {
          hasLiked: response.hasLiked,
          hasDisliked: response.hasDisliked
        }
      }));
      
      // Update local state with response from backend
      setComments(prev => prev.map(comment => {
        if (comment.id === commentId) {
          return { 
            ...comment, 
            likeCount: response.likeCount,
            dislikeCount: response.dislikeCount
          };
        }
        return comment;
      }));
    } catch (error) {
      console.error('Error disliking comment:', error);
    } finally {
      setInteractionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isCommentLiked = (commentId: number) => {
    return commentLikeStatus[commentId]?.hasLiked || false;
  };

  const isCommentDisliked = (commentId: number) => {
    return commentLikeStatus[commentId]?.hasDisliked || false;
  };

  return (
    <div className="event-comments">
      <div className="comments-header">
        <h3>Comments ({comments.length})</h3>
      </div>

      <div className="comment-form-section">
        <form onSubmit={handleSubmit} className="comment-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Your name"
              value={formData.authorName}
              onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
              className="comment-input"
              maxLength={100}
            />
          </div>
          <div className="form-group">
            <textarea
              placeholder="Write your comment..."
              value={formData.text}
              onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
              className="comment-textarea"
              rows={3}
              maxLength={1000}
            />
          </div>
          <button
            type="submit"
            className="submit-comment-btn"
            disabled={submitting}
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      </div>

      <div className="comments-list">
        {loading && comments.length === 0 ? (
          <div className="loading-message">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="no-comments">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <>
            {comments.map(comment => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <span className="comment-author">{comment.authorName}</span>
                  <span className="comment-date">{formatDate(comment.createdAt)}</span>
                </div>
                <div className="comment-text">
                  {comment.text}
                </div>
                <div className="comment-actions">
                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    className={`comment-reaction-btn like-btn ${isCommentLiked(comment.id) ? 'active' : ''}`}
                    disabled={interactionLoading === comment.id}
                    title={isCommentLiked(comment.id) ? 'Remove like' : 'Like this comment'}
                  >
                    👍 {comment.likeCount}
                  </button>
                  <button
                    onClick={() => handleDislikeComment(comment.id)}
                    className={`comment-reaction-btn dislike-btn ${isCommentDisliked(comment.id) ? 'active' : ''}`}
                    disabled={interactionLoading === comment.id}
                    title={isCommentDisliked(comment.id) ? 'Remove dislike' : 'Dislike this comment'}
                  >
                    👎 {comment.dislikeCount}
                  </button>
                </div>
              </div>
            ))}
            
            {hasMore && (
              <div className="load-more-section">
                <button
                  onClick={handleLoadMore}
                  className="load-more-btn"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Load More Comments'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EventComments;