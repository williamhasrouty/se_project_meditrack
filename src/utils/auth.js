// Authentication functions using localStorage (simulating backend API)
// TODO: Replace with actual API calls when backend is ready
// These functions simulate network requests using Promises and localStorage

// Simulates POST /signup - Register a new user
function signup({ name, email, password }) {
  return new Promise((resolve, reject) => {
    // Simulate API validation delay
    setTimeout(() => {
      const username = email.split("@")[0];
      const authKey = `auth_${username}`;
      const existingAuth = localStorage.getItem(authKey);

      if (existingAuth) {
        reject(new Error("User already registered. Please log in instead."));
        return;
      }

      // Store authentication data (simulating database)
      const authData = { email, password };
      localStorage.setItem(authKey, JSON.stringify(authData));

      // Create and store user profile (simulating database)
      const newUser = { username, name };
      const profileKey = `userProfile_${username}`;
      localStorage.setItem(profileKey, JSON.stringify(newUser));

      resolve({ username, name });
    }, 300);
  });
}

// Simulates POST /signin - Login an existing user
function signin({ email, password }) {
  return new Promise((resolve, reject) => {
    // Simulate API request delay
    setTimeout(() => {
      const username = email.split("@")[0];
      const authKey = `auth_${username}`;
      const storedAuth = localStorage.getItem(authKey);

      if (!storedAuth) {
        reject(new Error("User not found. Please register first."));
        return;
      }

      const authData = JSON.parse(storedAuth);
      if (authData.password !== password) {
        reject(new Error("Incorrect password. Please try again."));
        return;
      }

      // Return token (simulating JWT token from backend)
      resolve({ token: username });
    }, 300);
  });
}

// Simulates GET /users/me - Verify token and get current user
function getUser(token) {
  return new Promise((resolve, reject) => {
    // Simulate API request delay
    setTimeout(() => {
      const profileKey = `userProfile_${token}`;
      const savedProfile = localStorage.getItem(profileKey);

      if (!savedProfile) {
        reject(new Error("User profile not found"));
        return;
      }

      const user = JSON.parse(savedProfile);
      resolve(user);
    }, 200);
  });
}

export { signup, signin, getUser };
