import { Navigate } from "react-router-dom";

function ProtectedRoute({ currentUser, children }) {
  if (!currentUser) {
    // If user is not logged in, redirect to main page
    return <Navigate to="/" replace />;
  }

  // Otherwise, render the children components (protected content)
  return children;
}

export default ProtectedRoute;
