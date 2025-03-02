import { Link } from "react-router-dom";

const NotFound = () => {
  const formattedTime = new Date().toISOString().replace("T", " ").slice(0, 19);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
        >
          Back to Home
        </Link>

        <div className="mt-8 pt-4 border-t text-xs text-gray-500">
          <p>Time: {formattedTime} UTC</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
