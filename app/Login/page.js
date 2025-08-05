"use client";

import { useState } from "react";
import axios from "axios";
import { FaEnvelope, FaLock } from "react-icons/fa"; // Import icons
import { useRouter } from "next/navigation";
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { messaging} from '@/firebase-config';



export default function Login() {
  // State to store email and password input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [vendor, setVendor] = useState(null); // Store vendor response data

  // Router for redirection
  const router = useRouter(); // Now useRouter is correctly imported

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      // Make POST request to login API
      const response = await axios.post(
        "https://api.worldtriplink.com/vendors/vendorLogin",
        {
          email,
          password,
        }
      );

      // Get vendor data from response and store it
      const data = response.data;
      setVendor(data);

      // Store vendor data in localStorage
      localStorage.setItem("vendor", JSON.stringify(data));

       if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);

          // Get token
          getToken(messaging, {
            vapidKey: "BFeBBpUyxnCf54AL_Z16F357mX3oYFetAsdoMNhMrBmd1rPSFbpfFidAmq4Ho2NKNeSLe_7ogKudgk6lx8w5mts",
            serviceWorkerRegistration: registration,
          })
            .then((currentToken) => {
              if (currentToken) {
                console.log("FCM Token:", currentToken);
                // Send to backend if needed
               const user = JSON.parse(localStorage.getItem("vendor"));
const userId = user?.vendorId; // or get from Redux/context
                 console.log("userId", userId);

            fetch("https://api.worldtriplink.com/register-vendor-token", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                fcmToken: currentToken,
                userId: userId
              })
            });
              } else {
                console.log("No registration token available.");
              }
            })
            .catch((err) => {
              console.error("An error occurred while retrieving token.", err);
            });
        });
    }

      // Redirect to the home page (or any page of your choice)
      router.push("/"); // Redirect to the home page, you can change the route here

      // Optionally, log the response data
      console.log("Vendor login successful:", data);
    } catch (error) {
      console.error("Login failed:", error);
      // Handle login error (e.g., show an error message)
    }
  };

  useEffect(() => {
  onMessage(messaging, (payload) => {
    console.log('Message received:', payload);
    // You can show in-app toast/notification here
  });
}, []);
  // Render the login form

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      {/* Larger Container with enhanced glass effect */}
      <div className="w-full max-w-lg p-4 rounded-3xl  bg-gray-200 bg-opacity-60 backdrop-blur-md border-spacing-3 border-gray-700 shadow-2xl">
        {/* Gradient Header with more spacing */}
        <div className="text-center mb-6">
          <h2 className=" text-4xl p-4  font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
            Login Vendor
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 ">
          {/* Email Field - enlarged */}
          <div className="relative ">
            <div className="absolute inset-y-0  left-5 flex items-center pl-3">
              <FaEnvelope className="h-5 w-5 mr-3 text-gray-400" />
              <span className="text-lg bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                Email
              </span>
            </div>
            <input
              type="email"
              className="w-full pl-32 pr-6 py-4 text-lg bg-gray-800 text-white border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter Your Mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Field - enlarged */}
          <div className="relative">
            <div className="absolute inset-y-0 left-5 flex items-center pl-3">
              <FaLock className="h-5 w-5 mr-3 text-gray-400" />
              <span className="text-lg bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                Password
              </span>
            </div>
            <input
              type="password"
              className="w-full pl-40 pr-6  py-4 text-lg bg-gray-800 text-white border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button - enlarged */}
          <button
            type="submit"
            className="w-full py-4 text-xl font-semibold text-white bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 hover:from-purple-500 hover:via-pink-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-full shadow-xl transition-all duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
