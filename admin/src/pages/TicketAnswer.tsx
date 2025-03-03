import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaLock, 
  FaUserCircle, 
  FaInfoCircle, 
  FaExclamationCircle 
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { useGetTicketById } from "../hooks/tickets"; 
import { useAddComment } from "../hooks/tickets";
import useAuth from "../store/useAuth"; 
import Spinner from "../components/ui/Spinner";

const TicketAnswerPage: React.FC = () => {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  
  const { data: ticketResponse, isLoading, isError, error } = useGetTicketById(id);
  const { addComment, addCommentLoading } = useAddComment(id);

  console.log("ticketResponse", ticketResponse);
  
  const ticket = ticketResponse;
  const comments = ticket?.comments || [];
  
  const isStaff = user?.role && ["admin", "manager", "support_agent"].includes(user.role);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    try {
      await addComment({
        text: commentText,
        isInternal: isInternal && isStaff ? true : undefined,
      });
      
      setCommentText("");
      setIsInternal(false);
      
      // Optional: Show success message or navigate back to tickets list
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  
  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Spinner center size="lg" text="Loading ticket..." />
      </div>
    );
  }
  
  if (isError || !ticket) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <FaExclamationCircle className="mx-auto text-red-500 text-3xl mb-3" />
        <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Ticket</h2>
        <p className="text-gray-700 mb-4">
          {error?.message || "Failed to load ticket details."}
        </p>
        <Link
          to="/tickets"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <FaArrowLeft className="mr-2" /> Back to Tickets
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header with navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/tickets"
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <FaArrowLeft className="mr-1" /> Back to Tickets
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 mt-2">
            Answer Ticket #{id.slice(-5)}
          </h1>
        </div>
        <div className="mt-3 sm:mt-0">
          <span className={`px-3 py-1 rounded-full text-sm font-medium 
            ${
              ticket.status === "Open"
                ? "bg-blue-100 text-blue-800"
                : ticket.status === "In Progress"
                ? "bg-yellow-100 text-yellow-800"
                : ticket.status === "Resolved"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }
          `}>
            {ticket.status}
          </span>
          <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium
            ${
              ticket.priority === "High"
                ? "bg-red-100 text-red-800"
                : ticket.priority === "Medium"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-green-100 text-green-800"
            }
          `}>
            {ticket.priority}
          </span>
        </div>
      </div>

      {/* Ticket details card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-medium text-gray-900 mb-4">{ticket.title}</h2>
        
        <div className="mb-6 flex flex-wrap gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium">Category:</span> {ticket.category}
          </div>
          <div>
            <span className="font-medium">Created by:</span> {ticket.createdBy?.firstName} {ticket.createdBy?.lastName}
          </div>
          <div>
            <span className="font-medium">Date:</span> {new Date(ticket.createdAt).toLocaleString()}
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4 mt-4">
          <h3 className="font-medium text-gray-800 mb-3">Description</h3>
          <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap text-gray-700">
            {ticket.description}
          </div>
        </div>
      </div>

      {/* Comment history */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Response History</h3>
        
        <div className="space-y-4 mb-6">
          {comments.length === 0 ? (
            <div className="text-gray-500 italic py-4">No responses yet</div>
          ) : (
            comments.map((comment) => {
              // Skip internal comments for non-staff users
              if (comment.isInternal && !isStaff) return null;
              
              return (
                <div 
                  key={comment._id} 
                  className={`p-4 rounded-lg border ${
                    comment.isInternal 
                      ? "bg-yellow-50 border-yellow-200" 
                      : comment.createdBy?._id === user?._id
                      ? "bg-blue-50 border-blue-200"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <FaUserCircle className="text-gray-400 text-xl mr-2" />
                      <span className="font-medium">
                        {comment.createdBy?.firstName} {comment.createdBy?.lastName}
                      </span>
                      <span className="text-xs ml-2 text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {comment.createdBy?.role?.replace('_', ' ')}
                      </span>
                      {comment.isInternal && (
                        <span className="flex items-center text-xs ml-2 text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
                          <FaLock className="mr-1" /> Internal Note
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {comment.createdAt
                        ? formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                          })
                        : "Just now"}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{comment.text}</p>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Response form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Your Response</h3>
        
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full border rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
            rows={6}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Type your response here..."
            disabled={addCommentLoading}
            required
          ></textarea>
          
          {isStaff && (
            <div className="flex items-center mt-3 mb-4">
              <input
                type="checkbox"
                id="internalNote"
                checked={isInternal}
                onChange={() => setIsInternal(!isInternal)}
                className="mr-2"
              />
              <label htmlFor="internalNote" className="flex items-center text-sm text-gray-700 cursor-pointer">
                <FaLock className="mr-1 text-yellow-600" />
                Make this an internal note (only visible to staff)
              </label>
              
              {isInternal && (
                <div className="ml-2 text-xs text-yellow-600 flex items-center">
                  <FaInfoCircle className="mr-1" />
                  Customer won't see this comment
                </div>
              )}
            </div>
          )}
          
          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={!commentText.trim() || addCommentLoading}
              className={`px-4 py-2 rounded-md text-white ${
                !commentText.trim() || addCommentLoading
                  ? "bg-gray-300 cursor-not-allowed"
                  : isInternal
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {addCommentLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : isInternal ? (
                "Add Internal Note"
              ) : (
                "Submit Response"
              )}
            </button>
            
            <button
              type="button"
              onClick={() => navigate("/tickets")}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketAnswerPage;