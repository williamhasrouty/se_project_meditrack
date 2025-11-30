// Update user profile (simulating backend API)
// TODO: Replace with actual API call when backend is ready
// This function simulates PATCH /users/me endpoint

function updateUser({ name, avatar, initials }, token) {
  return new Promise((resolve, reject) => {
    // Simulate API request delay
    setTimeout(() => {
      if (!token) {
        reject(new Error("No token provided"));
        return;
      }

      const profileKey = `userProfile_${token}`;
      const savedProfile = localStorage.getItem(profileKey);

      if (!savedProfile) {
        reject(new Error("User profile not found"));
        return;
      }

      const currentUser = JSON.parse(savedProfile);
      const updatedUser = {
        ...currentUser,
        name,
        avatar: avatar !== undefined ? avatar : currentUser.avatar,
        initials,
      };

      // Save to localStorage (simulating database update)
      localStorage.setItem(profileKey, JSON.stringify(updatedUser));
      resolve(updatedUser);
    }, 300);
  });
}

export default updateUser;
