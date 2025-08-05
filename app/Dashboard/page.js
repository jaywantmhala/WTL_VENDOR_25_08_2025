// "use client";
// import React, { useEffect, useState } from "react";
// import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
// import { IndianRupee, Car, CalendarCheck, Users } from "lucide-react";
// import Sidebar from "../components/Sidebar";
// import Navbar from "../components/Navbar";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// const Dashboard = () => {
//   const [bookings, setBookings] = useState([]);
//   const [notification, setNotification] = useState(false);
//   const [todaysBookings, setTodaysBookings] = useState([]);

//   const router = useRouter();

//   const vendor = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("vendor")) : null;

//   if (!vendor) {
//     console.error("Vendor not found in localStorage");
//   }

//   const vendorId = vendor ? vendor.vendorId : null;

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:8085/${vendorId}/vendorByBookings`
//         );
//         setBookings(response.data);
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     fetchBookings();
//   }, [vendorId]);

//   // Calculate Total Revenue
//   const totalRevenue = bookings.reduce((sum, booking) => {
//     if (booking.status === 2) {
//       return sum + (booking.amount || 0);
//     }
//     return sum;
//   }, 0);

//   // Booking Status Counts
//   const statusCounts = {
//     pending: 0,
//     ongoing: 0,
//     completed: 0,
//     cancelled: 0,
//   };

//   bookings.forEach((booking) => {
//     if (booking.status === 0) statusCounts.pending++;
//     else if (booking.status === 1) statusCounts.ongoing++;
//     else if (booking.status === 2) statusCounts.completed++;
//     else if (booking.status === 3 || 5) statusCounts.cancelled++;
//   });

//   // Dynamic Pie Chart Data
//   const dataPie = [
//     { name: "Pending", value: statusCounts.pending, color: "#FFC107" }, // Yellow
//     { name: "Ongoing", value: statusCounts.ongoing, color: "#007BFF" }, // Blue
//     { name: "Completed", value: statusCounts.completed, color: "#28A745" }, // Green
//     { name: "Cancelled", value: statusCounts.cancelled, color: "#DC3545" }, // Red
//   ].filter((entry) => entry.value > 0); // Remove categories with zero value

//   // Check for today's bookings when the component mounts
//   useEffect(() => {
//     const currentDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
//     const todaysBookings = bookings.filter((booking) => booking.date === currentDate);

//     if (todaysBookings.length > 0) {
//       setTodaysBookings(todaysBookings);
//       setNotification(true);

//       // Play notification sound
//       const audio = new Audio("/img/notify-6-313751.mp3"); // Ensure the path is correct
//       audio.play().catch((error) => {
//         console.error("Failed to play sound:", error);
//       });
//     }
//   }, [bookings]); // Run only when bookings are fetched

//   return (
//     <div className="flex">
//       <Sidebar />
//       <div className="flex-1">
//         <Navbar />
//         <div className="p-6">
//           {/* Top Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
//             <div className="bg-white shadow-lg p-6 rounded-lg flex items-center dark:text-black">
//               <IndianRupee className="w-10 h-10 text-green-500 mr-4" />
//               <div>
//                 <p className="text-xl font-bold">₹ {totalRevenue} /-</p>
//                 <p className="text-gray-500">Total Revenue</p>
//               </div>
//             </div>

//             <div className="bg-white shadow-lg p-6 rounded-lg flex items-center  dark:text-black">
//               <Car className="w-10 h-10 text-blue-500 mr-4" />
//               <div>
//                 <p className="text-xl font-bold">{bookings.length}</p>
//                 <p className="text-gray-500">Total Trips</p>
//               </div>
//             </div>

//             <div className="bg-white shadow-lg p-6 rounded-lg flex items-center  dark:text-black">
//               <CalendarCheck className="w-10 h-10 text-yellow-500 mr-4" />
//               <div>
//                 <p className="text-xl font-bold">{bookings.length}</p>
//                 <p className="text-gray-500">All Booking Details</p>
//               </div>
//             </div>

//             <div className="bg-white shadow-lg p-6 rounded-lg flex items-center  dark:text-black ">
//               <Users className="w-10 h-10 text-purple-500 mr-4" />
//               <div>
//                 <p className="text-xl font-bold">{bookings.length}</p>
//                 <p className="text-gray-500">Clients</p>
//               </div>
//             </div>
//           </div>

//           {/* Notification Modal */}
//           {notification && (
//             <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//               <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//                 <h2 className="text-xl font-bold mb-4">Booking Reminder</h2>
//                 <p className="text-gray-600 mb-4">
//                   You have {todaysBookings.length} booking(s) today:
//                 </p>
//                 <ul className="mb-4">
//                   {todaysBookings.map((booking) => (
//                     <li key={booking.bookingId} className="text-gray-700">
//                       Booking ID: {booking.bookingId}
//                     </li>
//                   ))}
//                 </ul>
//                 <div className="flex justify-end gap-2">
//                   <button
//                     className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
//                     onClick={() => setNotification(false)}
//                   >
//                     Close
//                   </button>
//                   <button
//                     className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
//                     onClick={() => {
//                       router.push("/Notification");
//                       setNotification(false);
//                     }}
//                   >
//                     View Bookings
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Graphs Section */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
//             {/* Dynamic Pie Chart */}
//             <div className="bg-white shadow-lg p-6 rounded-lg">
//               <h3 className="text-center text-lg font-semibold mb-2">Booking Status</h3>
//               <ResponsiveContainer width="100%" height={250}>
//                 <PieChart>
//                   <Pie data={dataPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
//                     {dataPie.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Pie>
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;



"use client";
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import { IndianRupee, Car, CalendarCheck, Users } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useRouter } from "next/navigation";
import NotificationClient from './NotificationClient';

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [notification, setNotification] = useState(false);
  const [todaysBookings, setTodaysBookings] = useState([]);

  const router = useRouter();

  const vendor = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("vendor")) : null;

  if (!vendor) {
    console.error("Vendor not found in localStorage");
  }

  const vendorId = vendor ? vendor.vendorId : null;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8085/${vendorId}/vendorByBookings`
        );
        setBookings(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBookings();
  }, [vendorId]);

  // Calculate Total Revenue
  const totalRevenue = bookings.
  reduce((sum, booking) => {
    if (booking.status === 2) {
      return sum + (booking.amount || 0);          
    }
    return sum;
  }, 0);

  // Booking Status Counts
  const statusCounts = {
    pending: 0,
    ongoing: 0,
    completed: 0,
    cancelled: 0,
  };

  bookings.forEach((booking) => {
    if (booking.status === 0) statusCounts.pending++;
    else if (booking.status === 1) statusCounts.ongoing++;
    else if (booking.status === 2) statusCounts.completed++;
    else if (booking.status === 3 || 5) statusCounts.cancelled++;
  });

        
  // Dynamic Pie Chart Data
  const dataPie = [
    { name: "Pending", value: statusCounts.pending, color: "#F59E0B" }, // Amber
    { name: "Ongoing", value: statusCounts.ongoing, color: "#3B82F6" }, // Blue
    { name: "Completed", value: statusCounts.completed, color: "#10B981" }, // Emerald
    { name: "Cancelled", value: statusCounts.cancelled, color: "#EF4444" }, // Red
  ].filter((entry) => entry.value > 0); // Remove categories with zero value

  // Check for today's bookings when the component mounts
  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
    const todaysBookings = bookings.filter((booking) => booking.date === currentDate);

    if (todaysBookings.length > 0) {
      setTodaysBookings(todaysBookings);
      setNotification(true);

       
      // Play notification sound
      const audio = new Audio("/img/notify-6-313751.mp3"); // Ensure the path is correct
      audio.play().catch((error) => {
        console.error("Failed to play sound:", error);
      });
    }
  }, [bookings]); // Run only when bookings are fetched

  return (
    <>
     <NotificationClient />
   
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Sidebar />
      <div className="flex-1 overflow-x-hidden">
        <Navbar />
        <div className="p-6">
          {/* Top Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Revenue Card */}
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 mr-4">
                  <IndianRupee className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    ₹ {totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">Total Revenue</p>
                </div>
              </div>
            </div>

            {/* Trips Card */}
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 mr-4">
                  <Car className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {bookings.length}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">Total Trips</p>
                </div>
              </div>
            </div>

            {/* Bookings Card */}
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30 mr-4">
                  <CalendarCheck className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {bookings.length}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">All Bookings</p>
                </div>
              </div>
            </div>

            {/* Clients Card */}
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 mr-4">
                  <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {bookings.length}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">Clients</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Modal */}
          {notification && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
              <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    Booking Reminder
                  </h2>
                  <button
                    onClick={() => setNotification(false)}
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  You have {todaysBookings.length} booking(s) today:
                </p>
                <ul className="mb-6 space-y-2 max-h-60 overflow-y-auto">
                  {todaysBookings.map((booking) => (
                    <li 
                      key={booking.bookingId} 
                      className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300"
                    >
                      <span className="font-medium">Booking ID:</span> {booking.bookingId}
                    </li>
                  ))}
                </ul>
                <div className="flex justify-end gap-3">
                  <button
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    onClick={() => setNotification(false)}
                  >
                    Close
                  </button>
                  <button
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all"
                    onClick={() => {
                      router.push("/Notification");
                      setNotification(false);
                    }}
                  >
                    View Bookings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Graphs Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dynamic Pie Chart */}
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Booking Status
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dataPie}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {dataPie.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend 
                      layout="horizontal" 
                      verticalAlign="bottom" 
                      align="center"
                      formatter={(value, entry, index) => (
                        <span className="text-gray-700 dark:text-gray-300">
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Additional Chart Placeholder */}
            {/* <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Recent Activity
              </h3>
              <div className="h-64 flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">
                  Additional charts or data can be added here
                </p>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
     </>
  );
};

export default Dashboard;