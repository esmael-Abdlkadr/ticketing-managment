import Modal from "../components/ui/Modal";
import { FaUser, FaClock, FaTag, FaExclamationTriangle } from "react-icons/fa";
import Spinner from "../components/ui/Spinner";

const TicketDetailModal = ({ isOpen, onClose, ticket, isLoading }) => {
  if (isLoading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Ticket Details" size="lg">
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" center text="Loading ticket details..." />
        </div>
      </Modal>
    );
  }

  if (!ticket) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Ticket Details" size="lg">
        <div className="text-center text-red-600 py-8">
          <FaExclamationTriangle className="mx-auto mb-4 text-5xl" />
          <p>Failed to load ticket details.</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ticket Details" size="lg">
      <div className="space-y-6">
        {/* Header info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">{ticket.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center">
              <span
                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                ${
                  ticket.status === "Open"
                    ? "bg-blue-100 text-blue-800"
                    : ticket.status === "In Progress"
                    ? "bg-yellow-100 text-yellow-800"
                    : ticket.status === "Resolved"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {ticket.status}
              </span>
            </div>
            <div className="flex items-center">
              <span
                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                ${
                  ticket.priority === "High"
                    ? "bg-red-100 text-red-800"
                    : ticket.priority === "Medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {ticket.priority}
              </span>
            </div>
            <div className="flex items-center">
              <FaTag className="mr-2 text-gray-400" />
              <span>{ticket.category}</span>
            </div>
            <div className="flex items-center">
              <FaUser className="mr-2 text-gray-400" />
              <span>
                {ticket.createdBy?.firstName} {ticket.createdBy?.lastName}
              </span>
            </div>
            <div className="flex items-center">
              <FaClock className="mr-2 text-gray-400" />
              <span>{new Date(ticket.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">ID:</span>
              <span className="font-mono">{ticket._id}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-md font-medium mb-2">Description</h3>
          <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
            {ticket.description}
          </div>
        </div>

        {/* Comments section */}
        <div>
          <h3 className="text-md font-medium mb-2">
            Comments ({ticket.comments?.length || 0})
          </h3>
          {ticket.comments && ticket.comments.length > 0 ? (
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {ticket.comments.map((comment) => (
                <div key={comment._id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium text-sm">
                      {comment.createdBy?.firstName}{" "}
                      {comment.createdBy?.lastName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <p className="text-sm">{comment.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No comments yet.</p>
          )}
        </div>

        {/* Add comment form (optional) */}
        <div className="border-t border-gray-200 pt-4 mt-4">
          <h3 className="text-md font-medium mb-2">Add Comment</h3>
          <textarea
            className="w-full border rounded-lg p-2 min-h-[100px]"
            placeholder="Write your comment here..."
          ></textarea>
          <div className="mt-2 flex justify-end">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Submit Comment
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TicketDetailModal;
