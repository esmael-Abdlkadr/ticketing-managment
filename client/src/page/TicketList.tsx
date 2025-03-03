import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  FaPlus, 
  FaTrash, 
  FaPencilAlt, 
  FaComment, 
  FaSearch, 
  FaExclamationCircle, 
  FaSortAmountDown,
  FaSortAmountUp,
  FaSpinner
} from "react-icons/fa";
import { useGetTickets, useUpdateTicket, useDeleteTicket, useAddComment } from "../hooks/tickets"
import SystemInfo from "../components/common/SystemInfo";
import { Ticket } from "../services/ticket/type";

type SortField = "createdAt" | "updatedAt" | "priority" | "status";
type SortDirection = "asc" | "desc";

const TicketsListPage: React.FC = () => {

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editValues, setEditValues] = useState({ title: "", description: "" });
  const [commentText, setCommentText] = useState("");

  // Query params for API
  const queryParams = {
    sort: sortField,
    order: sortDirection,
    search: searchTerm || undefined,
  };

  // Fetch tickets using the hook
  const { 
    data: ticketsData, 
    isLoading, 
    error 
  } = useGetTickets(queryParams);

  const tickets: Array<Ticket> = Array.isArray(ticketsData) ? ticketsData : [];

  // Get selected ticket
  const selectedTicket = selectedTicketId 
    ? tickets.find(ticket => ticket._id === selectedTicketId) 
    : null;

  // Hooks for operations
  const { updateTicket, updateTicketLoading } = useUpdateTicket(selectedTicketId || '');
  const { deleteTicket, deleteTicketLoading } = useDeleteTicket(selectedTicketId || '');
  const { addComment, addCommentLoading } = useAddComment(selectedTicketId || '');

  // Handle sort toggle
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Handle ticket edit
  const handleEdit = (ticketId: string) => {
    const ticket = tickets.find(t => t._id === ticketId);
    if (ticket) {
      setSelectedTicketId(ticketId);
      setEditValues({
        title: ticket.title,
        description: ticket.description
      });
      setIsEditModalOpen(true);
    }
  };

  // Handle ticket deletion confirmation
  const handleDeleteConfirm = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setIsDeleteModalOpen(true);
  };

  // Delete the ticket
  const handleDelete = async () => {
    if (!selectedTicketId) return;
    
    try {
      await deleteTicket(selectedTicketId);
      setIsDeleteModalOpen(false);
      setSelectedTicketId(null);
    } catch (err) {
      console.error("Error deleting ticket:", err);
    }
  };

  // Open comment modal
  const openCommentModal = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setCommentText("");
    setIsCommentModalOpen(true);
  };

  // Submit updated ticket
  const handleUpdateTicket = async () => {
    if (!selectedTicketId) return;
    
    try {
      await updateTicket({
        title: editValues.title,
        description: editValues.description
      });
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Error updating ticket:", err);
    }
  };

  // Add comment to ticket
  const handleAddComment = async () => {
    if (!selectedTicketId || !commentText.trim()) return;
    
    try {
      await addComment({
        text: commentText
      });
      setIsCommentModalOpen(false);
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Get status color class
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
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
    switch (priority.toLowerCase()) {
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

  return (
    <div className="container mx-auto px-4 py-6">
      <SystemInfo />
      
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between my-6">
        <h1 className="text-2xl font-bold text-gray-900">My Tickets</h1>
        
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <Link
            to="/tickets/new"
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            <FaPlus className="mr-2" />
            Create Ticket
          </Link>
        </div>
      </div>
      
      {/* Error display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 flex items-center">
          <FaExclamationCircle className="mr-2" />
          <span>Failed to load tickets. Please try again later.</span>
        </div>
      )}
      
      {/* Tickets list */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12">
            <FaSpinner className="animate-spin h-10 w-10 text-blue-600 mx-auto" />
            <p className="mt-4 text-gray-600">Loading tickets...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No tickets found</h3>
            <p className="mt-1 text-gray-500">
              {searchTerm ? "Try a different search term." : "Create a new ticket to get started."}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-3 text-blue-600 hover:text-blue-800"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      onClick={() => toggleSort("status")}
                      className="flex items-center focus:outline-none"
                    >
                      Status
                      {sortField === "status" && (
                        sortDirection === "asc" ? 
                        <FaSortAmountUp className="ml-1" /> : 
                        <FaSortAmountDown className="ml-1" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      onClick={() => toggleSort("priority")}
                      className="flex items-center focus:outline-none"
                    >
                      Priority
                      {sortField === "priority" && (
                        sortDirection === "asc" ? 
                        <FaSortAmountUp className="ml-1" /> : 
                        <FaSortAmountDown className="ml-1" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      onClick={() => toggleSort("createdAt")}
                      className="flex items-center focus:outline-none"
                    >
                      Created
                      {sortField === "createdAt" && (
                        sortDirection === "asc" ? 
                        <FaSortAmountUp className="ml-1" /> : 
                        <FaSortAmountDown className="ml-1" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      onClick={() => toggleSort("updatedAt")}
                      className="flex items-center focus:outline-none"
                    >
                      Updated
                      {sortField === "updatedAt" && (
                        sortDirection === "asc" ? 
                        <FaSortAmountUp className="ml-1" /> : 
                        <FaSortAmountDown className="ml-1" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comments
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tickets.map((ticket) => (
                  <tr key={ticket._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{ticket.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {ticket.description}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">{ticket._id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityBadgeClass(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(ticket.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(ticket.updatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticket.comments?.length || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openCommentModal(ticket._id)}
                          className="text-blue-600 hover:text-blue-900 p-1.5 bg-blue-50 rounded-md"
                          title="Add comment"
                        >
                          <FaComment size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(ticket._id)}
                          className="text-green-600 hover:text-green-900 p-1.5 bg-green-50 rounded-md"
                          title="Edit ticket"
                        >
                          <FaPencilAlt size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteConfirm(ticket._id)}
                          className="text-red-600 hover:text-red-900 p-1.5 bg-red-50 rounded-md"
                          title="Delete ticket"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Edit Modal */}
      {isEditModalOpen && selectedTicket && (
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
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedTicket && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-bold mb-4">Delete Ticket</h2>
            <p className="text-gray-700">
              Are you sure you want to delete ticket <span className="font-medium">{selectedTicket._id}</span>?
              This action cannot be undone.
            </p>
            
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 flex items-center"
                disabled={deleteTicketLoading}
              >
                {deleteTicketLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Comment Modal */}
      {isCommentModalOpen && selectedTicket && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-bold mb-2">Add Comment</h2>
            <p className="text-sm text-gray-600 mb-4">
              Adding comment to ticket: {selectedTicket._id} - {selectedTicket.title}
            </p>
            
            {/* Previous comments */}
            {selectedTicket.comments && selectedTicket.comments.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Previous comments:</h3>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {selectedTicket.comments.map(comment => (
                    <div key={comment._id} className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm">{comment.text}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(comment.createdAt)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Enter your comment..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsCommentModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddComment}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center"
                disabled={addCommentLoading || !commentText.trim()}
              >
                {addCommentLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Adding...
                  </>
                ) : (
                  "Add Comment"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketsListPage;