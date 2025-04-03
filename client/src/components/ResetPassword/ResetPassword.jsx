import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [email, setEmail] = useState("");

  // Check for verification token in URL
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");
    if (token) {
      axios
        .get(`${server}/user/verify-email/${token}`)
        .then((res) => {
          setIsVerified(true);
          setEmail(res.data.email); // Assuming backend returns the email
          toast.success("Email verified! Please set your new password.");
        })
        .catch((err) => {
          toast.error(err.response?.data?.message || "Invalid or expired link");
        });
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    setLoading(true);

    try {
      await axios.post(`${server}/user/set-new-password`, { email, newPassword });
      toast.success("Password updated successfully!");
      setTimeout(() => navigate("/login"), 2000); // Navigate to login after 2s
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Reset Your Password
          </h2>
          {!isVerified && (
            <p className="mt-2 text-sm text-gray-600">
              Please check your email and click the activation link to proceed
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg rounded-xl sm:px-10 border border-gray-200">
          {isVerified ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 sm:text-sm transition duration-150 ease-in-out"
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 sm:text-sm transition duration-150 ease-in-out"
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out ${
                    loading ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </div>
            </form>
          ) : (
            <p className="text-center text-gray-600">
              Waiting for email verification...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;