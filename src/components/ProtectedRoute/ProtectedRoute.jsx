import { Navigate } from "react-router-dom";

function ProtectedRoute({ isLoggedIn, isCheckingAuth, children }) {
  // Show nothing while checking authentication status
  if (isCheckingAuth) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <p>Loading...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default ProtectedRoute;
