import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaPaperPlane, 
  FaReply,
  FaSpinner, 
  FaExclamationCircle, 
  FaEyeSlash,
  FaUserLock,
  FaEdit,
  FaClock,
  FaTag,
  FaExclamation,
  FaUserCircle,
  FaTimes
} from "react-icons/fa";
import { useGetTicketById, useAddComment, useUpdateTicket }  from "../hooks/tickets"
import useAuth from "../store/useAuth";
import SystemInfo from "../components/common/SystemInfo";
import { Comment } from "../services/ticket/type";

const TicketDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [isInternalComment, setIsInternalComment] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editValues, setEditValues] = useState({ title: "", description: "" });

  // Get ticket data
  const { 
    data: ticketData, 
    isLoading, 
    error,
    refetch
  } = useGetTicketById(id || '');

  // Get ticket operations
  const { addComment, addCommentLoading } = useAddComment(id || '');
  const { updateTicket, updateTicketLoading } = useUpdateTicket(id || '');

  const ticket = ticketData;
  // Check if user is staff (for internal comments)
  const isStaffUser = ["admin", "manager", "support_agent"].includes(user?.role || "");
  // Check if the user is the creator of this ticket
  const isTicketCreator = ticket && (ticket.createdBy?._id === user?._id || ticket.createdBy === user?._id);

  // Load ticket data into edit form when available
  useEffect(() => {
    if (ticket) {
      setEditValues({
        title: ticket.title || '',
        description: ticket.description || ''
      });
    }
  }, [ticket]);

  // Start replying to a comment
  const handleStartReply = (comment: Comment) => {
    setReplyingTo(comment);
    setIsInternalComment(false);
    setCommentText("");
  };

  // Cancel replying
  const cancelReply = () => {
    setReplyingTo(null);
    setCommentText("");
  };

  // Handle adding a new comment or reply
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !id) return;
    
    try {
      await addComment({
        text: commentText,
        isInternal: isStaffUser && isInternalComment,
        parentCommentId: replyingTo?._id
      });
      setCommentText("");
      setReplyingTo(null);
      setIsInternalComment(false);
      refetch(); // Refresh ticket data to show new comment
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  // Submit updated ticket
  const handleUpdateTicket = async () => {
    if (!id) return;
    
    try {
      await updateTicket({
        title: editValues.title,
        description: editValues.description
      });
      setIsEditModalOpen(false);
      refetch(); // Refresh ticket data
    } catch (err) {
      console.error("Error updating ticket:", err);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Get short time ago
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.round(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.round(diffHours / 24);
    if (diffDays < 30) return `${diffDays}d ago`;
    
    const diffMonths = Math.round(diffDays / 30);
    return `${diffMonths}mo ago`;
  };

  // Get status color class
  const getStatusBadgeClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "bg-blue-100 text-blue-800";
      case "in progress":
        return "bg-yellow-100 text-yellow-800";
      case "closed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get priority color class
  const getPriorityBadgeClass = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Check if user can comment (must be ticket creator or staff)
  const canAddComment = isTicketCreator || isStaffUser;
  
  // Check if user is the author of a comment
  const isCommentAuthor = (comment: Comment) => {
    return comment.createdBy?._id === user?._id;
  };
  
  // Check if comment is from support staff
  const isStaffComment = (comment: Comment) => {
    const role = comment.createdBy?.role || "";
    return ["admin", "manager", "support_agent"].includes(role);
  };

  // Organize comments into threads (top-level comments with replies)
  const getTopLevelComments = () => {
    if (!ticket?.comments) return [];
    
    return ticket.comments.filter(comment => !comment.parentComment);
  };

  // Get replies for a particular comment
  const getRepliesForComment = (commentId: string) => {
    if (!ticket?.comments) return [];
    
    return ticket.comments.filter(
      comment => comment.parentComment === commentId || 
                 (comment.parentComment && comment.parentComment._id === commentId)
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <FaSpinner className="animate-spin h-12 w-12 text-blue-600" />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="container mx-auto px-4 py-8">
        <SystemInfo />
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 flex items-center">
          <FaExclamationCircle className="mr-2" />
          <span>Failed to load ticket. Please try again later.</span>
        </div>
        <div className="mt-4">
          <Link to="/tickets" className="text-blue-600 hover:text-blue-800 flex items-center">
            <FaArrowLeft className="mr-2" /> Back to Tickets
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <SystemInfo />
      
      {/* Back button */}
      <div className="mb-6">
        <Link to="/tickets" className="text-blue-600 hover:text-blue-800 flex items-center">
          <FaArrowLeft className="mr-2" /> Back to Tickets
        </Link>
      </div>
      
      {/* Ticket header */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{ticket.title}</h1>
              <p className="text-sm text-gray-500 mt-1">Ticket ID: {ticket._id}</p>
            </div>
            
            {isTicketCreator && (
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <FaEdit className="mr-1" /> Edit
              </button>
            )}
          </div>
          
          <div className="mt-4 flex flex-wrap gap-3">
            <div className={`px-3 py-1 rounded-full text-sm ${getStatusBadgeClass(ticket.status)}`}>
              {ticket.status}
            </div>
            <div className={`px-3 py-1 rounded-full text-sm ${getPriorityBadgeClass(ticket.priority)}`}>
              {ticket.priority} Priority
            </div>
            <div className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 flex items-center">
              <FaTag className="mr-1" /> {ticket.category || "General"}
            </div>
          </div>
          
          <div className="mt-6">
            <h2 className="text-sm font-medium text-gray-700 mb-2">Description:</h2>
            <p className="text-gray-800 whitespace-pre-wrap">{ticket.description}</p>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap text-sm text-gray-500 gap-x-6 gap-y-2">
            <div className="flex items-center">
              <FaUserCircle className="mr-1" />
              Created by: {ticket.createdBy?.firstName} {ticket.createdBy?.lastName}
            </div>
            <div className="flex items-center">
              <FaClock className="mr-1" />
              Created: {formatDate(ticket.createdAt)}
            </div>
            <div className="flex items-center">
              <FaClock className="mr-1" />
              Last updated: {formatDate(ticket.updatedAt)}
            </div>
          </div>
        </div>
      </div>
      
      {/* Comments section */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Conversation</h2>
          
          {/* Comment list with replies */}
          <div className="space-y-6 mb-8">
            {getTopLevelComments().length > 0 ? (
              getTopLevelComments().map(comment => {
                const isInternal = comment.isInternal;
                const isOwnComment = isCommentAuthor(comment);
                const isFromStaff = isStaffComment(comment);
                const replies = getRepliesForComment(comment._id);
                
                // Show internal comments only to staff
                if (isInternal && !isStaffUser) return null;
                
                return (
                  <div key={comment._id} className="comment-thread">
                    {/* Main comment */}
                    <div 
                      className={`rounded-lg ${
                        isInternal 
                          ? 'bg-purple-50 border border-purple-100' 
                          : isFromStaff
                          ? 'bg-blue-50 border border-blue-100'
                          : 'bg-gray-50 border border-gray-100'
                      }`}
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 
                              ${isFromStaff ? 'bg-blue-200' : 'bg-gray-200'}`}>
                              <FaUserCircle className={`${isFromStaff ? 'text-blue-600' : 'text-gray-600'}`} />
                            </div>
                            <div>
                              <span className="font-medium">
                                {isOwnComment ? 'You' : `${comment.createdBy?.firstName || ''} ${comment.createdBy?.lastName || ''}`}
                                {isFromStaff && !isOwnComment && <span className="ml-1 text-xs text-blue-600">(Support Team)</span>}
                              </span>
                              <div className="text-xs text-gray-500 mt-0.5">
                                {getTimeAgo(comment.createdAt)}
                                {isInternal && (
                                  <span className="ml-2 inline-flex items-center text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full">
                                    <FaEyeSlash className="mr-1" size={10} /> Internal
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 text-gray-800 whitespace-pre-wrap">{comment.text}</div>
                        
                        {/* Reply button */}
                        {canAddComment && ticket.status.toLowerCase() !== "closed" && (
                          <div className="mt-3 flex justify-end">
                            <button
                              onClick={() => handleStartReply(comment)}
                              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                            >
                              <FaReply className="mr-1" /> Reply
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Reply form for this comment */}
                    {replyingTo && replyingTo._id === comment._id && (
                      <div className="ml-8 mt-3">
                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600 flex items-center">
                              <FaReply className="mr-1" /> 
                              Replying to {isCommentAuthor(comment) ? 'yourself' : 
                                `${comment.createdBy?.firstName || ''} ${comment.createdBy?.lastName || ''}`}
                            </span>
                            <button onClick={cancelReply} className="text-gray-400 hover:text-gray-600">
                              <FaTimes />
                            </button>
                          </div>
                          
                          <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write your reply..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          />
                          
                          {/* Internal comment option for staff */}
                          {isStaffUser && (
                            <div className="flex items-center mt-2">
                              <input
                                type="checkbox"
                                id="internal-reply"
                                checked={isInternalComment}
                                onChange={() => setIsInternalComment(!isInternalComment)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="internal-reply" className="ml-2 flex items-center text-sm text-gray-700">
                                <FaUserLock className="mr-1 text-gray-500" size={12} />
                                Make this an internal note
                              </label>
                            </div>
                          )}
                          
                          <div className="flex justify-end mt-2">
                            <button 
                              onClick={handleAddComment} 
                              disabled={addCommentLoading || !commentText.trim()}
                              className={`px-3 py-1 text-white rounded flex items-center text-sm ${
                                isInternalComment ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'
                              }`}
                            >
                              {addCommentLoading ? (
                                <>
                                  <FaSpinner className="animate-spin mr-1" size={12} />
                                  Sending...
                                </>
                              ) : (
                                <>
                                  <FaPaperPlane className="mr-1" size={12} />
                                  {isInternalComment ? "Add Internal Note" : "Reply"}
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Replies to this comment */}
                    {replies.length > 0 && (
                      <div className="ml-8 mt-2 space-y-3">
                        {replies.map(reply => {
                          const isReplyInternal = reply.isInternal;
                          const isOwnReply = isCommentAuthor(reply);
                          const isReplyFromStaff = isStaffComment(reply);
                          
                          // Show internal replies only to staff
                          if (isReplyInternal && !isStaffUser) return null;
                          
                          return (
                            <div 
                              key={reply._id} 
                              className={`rounded-lg ${
                                isReplyInternal 
                                  ? 'bg-purple-50 border border-purple-100' 
                                  : isReplyFromStaff
                                  ? 'bg-blue-50 border border-blue-100'
                                  : 'bg-gray-50 border border-gray-100'
                              }`}
                            >
                              <div className="p-3">
                                <div className="flex justify-between items-start">
                                  <div className="flex items-center">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 
                                      ${isReplyFromStaff ? 'bg-blue-200' : 'bg-gray-200'}`}>
                                      <FaUserCircle className={`${isReplyFromStaff ? 'text-blue-600' : 'text-gray-600'}`} size={12} />
                                    </div>
                                    <div>
                                      <span className="font-medium text-sm">
                                        {isOwnReply ? 'You' : `${reply.createdBy?.firstName || ''} ${reply.createdBy?.lastName || ''}`}
                                        {isReplyFromStaff && !isOwnReply && <span className="ml-1 text-xs text-blue-600">(Support Team)</span>}
                                      </span>
                                      <div className="text-xs text-gray-500 mt-0.5">
                                        {getTimeAgo(reply.createdAt)}
                                        {isReplyInternal && (
                                          <span className="ml-2 inline-flex items-center text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full text-xs">
                                            <FaEyeSlash className="mr-1" size={8} /> Internal
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-1 text-gray-800 text-sm whitespace-pre-wrap">{reply.text}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">No comments yet</div>
            )}
          </div>
          
          {/* Add comment form - only if not already replying */}
          {canAddComment && !replyingTo && ticket.status.toLowerCase() !== "closed" && (
            <form onSubmit={handleAddComment} className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Add Response</h3>
              <div className="space-y-3">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={`Type your message here...`}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                
                {/* Internal comment option - only for staff */}
                {isStaffUser && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="internal-comment"
                      checked={isInternalComment}
                      onChange={() => setIsInternalComment(!isInternalComment)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="internal-comment" className="ml-2 flex items-center text-sm text-gray-700">
                      <FaUserLock className="mr-1 text-gray-500" />
                      Make this an internal note (only visible to staff)
                    </label>
                  </div>
                )}
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className={`px-4 py-2 text-white rounded-lg flex items-center ${
                      isInternalComment ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    disabled={addCommentLoading || !commentText.trim()}
                  >
                    {addCommentLoading ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="mr-2" />
                        {isInternalComment ? "Add Internal Note" : "Send Response"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}

          {ticket.status.toLowerCase() === "closed" && (
            <div className="border-t border-gray-200 pt-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-700 flex items-center">
                <FaExclamation className="mr-2 text-yellow-500" />
                This ticket is closed. No further responses can be added.
              </div>
            </div>
          )}
          
          {!canAddComment && ticket.status.toLowerCase() !== "closed" && (
            <div className="border-t border-gray-200 pt-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-700 flex items-center">
                <FaExclamation className="mr-2 text-yellow-500" />
                You don't have permission to comment on this ticket.
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-bold mb-4">Edit Ticket</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editValues.title}
                  onChange={(e) => setEditValues({...editValues, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editValues.description}
                  onChange={(e) => setEditValues({...editValues, description: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateTicket}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center"
                disabled={updateTicketLoading || !editValues.title.trim() || !editValues.description.trim()}
              >
                {updateTicketLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  "Update Ticket"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketDetailPage;