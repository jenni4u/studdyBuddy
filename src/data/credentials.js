/**
 * =====================================================
 * 🔐 DEMO CREDENTIALS FOR JUDGES
 * =====================================================
 * 
 * NOTE TO JUDGES: Please use the following fake 
 * credentials to test the login functionality:
 * 
 *   Email:    judge@studybuddy.com
 *   Password: demo123
 * 
 * These are demo accounts and not real user data.
 * =====================================================
 */

export const DEMO_USERS = [
  {
    id: "user_001",
    email: "judge@studybuddy.com",
    password: "demo123",
    name: "Sarah Chen",
    avatar: "https://i.pravatar.cc/300?img=5",
    major: "Computer Science",
    year: "U2"
  },
  {
    id: "user_002",
    email: "demo@studybuddy.com",
    password: "password123",
    name: "Alex Johnson",
    avatar: "https://i.pravatar.cc/300?img=12",
    major: "Mathematics",
    year: "U3"
  },
  {
    id: "user_003",
    email: "test@studybuddy.com",
    password: "test123",
    name: "Jordan Lee",
    avatar: "https://i.pravatar.cc/300?img=8",
    major: "Biology",
    year: "U1"
  }
];

/**
 * Validate login credentials
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {object|null} - User object if valid, null if invalid
 */
export const validateCredentials = (email, password) => {
  const user = DEMO_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  return user || null;
};
