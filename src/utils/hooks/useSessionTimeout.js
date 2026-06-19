import { useEffect, useRef } from "react";

/**
 * Custom hook to handle session timeout and auto-logout
 * @param {Function} onTimeout - Callback function to execute when session times out
 * @param {number} timeout - Timeout duration in milliseconds (default: 30 minutes)
 * @param {boolean} isEnabled - Whether the timeout is enabled (should be true when logged in)
 */
function useSessionTimeout(
  onTimeout,
  timeout = 30 * 60 * 1000,
  isEnabled = true,
) {
  const timeoutRef = useRef(null);

  const resetTimeout = () => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout only if enabled
    if (isEnabled) {
      timeoutRef.current = setTimeout(() => {
        onTimeout();
      }, timeout);
    }
  };

  useEffect(() => {
    if (!isEnabled) {
      // Clear timeout if disabled (user logged out)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      return;
    }

    // Events that indicate user activity
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    // Reset timeout on any user activity
    const handleActivity = () => {
      resetTimeout();
    };

    // Set initial timeout
    resetTimeout();

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    // Cleanup
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isEnabled, timeout, onTimeout]);

  return resetTimeout;
}

export default useSessionTimeout;
