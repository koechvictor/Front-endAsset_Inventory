import axios from "axios";

const API_URL = "https://asset-inventory-3.onrender.com/";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const handleApiCall = async (method, url, data = null) => {
  try {
    const response = await api[method](url, data);
    return response.data;
  } catch (error) {
    console.error("API error:", error);

    return error.response
      ? error.response.data
      : { message: "An error occurred. Please try again later." };
  }
};

export const registerUser = (userData) =>
  handleApiCall("post", "/register", userData);

export const loginUser = (credentials) =>
  handleApiCall("post", "/login", credentials);
export const logoutUser = () => handleApiCall("get", "/logout");

// Check authentication status (returns user data if authenticated)
export const checkAuth = async () => {
  try {
    const response = await api.get("/profile");
    return response.data.user;
  } catch (error) {
    console.error("Authentication error:", error);
    return null; // Return null if not authenticated
  }
};

// Fetch assets (protected route, requires authentication)
export const fetchAssets = () => handleApiCall("get", "/assets");
export const fetchDepartments = () => handleApiCall("get", "/departments");
export const fetchCategories = () => handleApiCall("get", "/categories");
export const fetchProfile = () => handleApiCall("get", "/my_profile");
export const fetchRequests = () => handleApiCall("get", "/requests");
export const fetchMyRequests = () => handleApiCall("get", "/my_requests");
export const submitNewRequest = (newRequest) =>
  handleApiCall("post", "/new_request", newRequest);
export const submitNewUser = (newUser) =>
  handleApiCall("post", "/register", newUser);
export const submitReview = (review) => {
  return handleApiCall("post", `/request/${review.id}/review`, review);
};

export default api;
