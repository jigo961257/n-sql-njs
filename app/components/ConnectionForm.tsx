'use client';

import React, { useEffect } from 'react';
import { useConnectionStore } from '@/app/zustand/config';
import { closePool } from '../libs/db';

const ConnectionForm: React.FC = () => {
  useEffect(() => {
      // Clean up resources when the app unmounts (e.g., when the user navigates away)
      return () => {
        closePool();
      };
    }, [])
  const { host, port, username, database, password, setHost, setPort, setUsername, setDatabase, setPassword, submitConnection } = useConnectionStore();
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, setter: (value: string) => void) => {
    setter(event.target.value);
  };

  const handlePortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsedPort = parseInt(e.target.value, 10);
    setPort(isNaN(parsedPort) ? 0 : parsedPort);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    submitConnection();
    try {
      const response = await fetch('/api/sqlconnect', { // Call your API route
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          host,
          port,
          username,
          password,
          database,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('success');
        // console.log("query result\n",data.result); // Set the query result.
        console.log("Query Result:", data.result); // Log the result
      } else {
        const errorData = await response.json(); // Get error details from API
        console.log('error');
        // setErrorMessage(errorData.error);  // Set the error message from the API.
        console.error("API Error:", errorData.error);
      }
    } catch (error) {
      console.log(' catch error');
      // setErrorMessage('An error occurred: ' + error.message); // Set a general error message.
      console.error("Fetch Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mx-auto p-4">
      {/* Host */}
      <div className="mb-4">
        <label htmlFor="host" className="block text-gray-700 dark:text-white font-bold mb-2">Host</label>
        <input type="text" id="host" value={host} onChange={(e) => handleInputChange(e, setHost)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter host" required />
      </div>

      {/* Port */}
      <div className="mb-4">
        <label htmlFor="port" className="block text-gray-700 dark:text-white font-bold mb-2">Port</label>
        <input type="number" id="port" value={port === 0 ? "" : port} onChange={handlePortChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter port" required />
      </div>

      {/* Username */}
      <div className="mb-4">
        <label htmlFor="username" className="block text-gray-700 dark:text-white font-bold mb-2">Username</label>
        <input type="text" id="username" value={username} onChange={(e) => handleInputChange(e, setUsername)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter username" required />
      </div>

      {/* Database */}
      <div className="mb-4">
        <label htmlFor="database" className="block text-gray-700 dark:text-white font-bold mb-2">Database</label>
        <input type="text" id="database" value={database} onChange={(e) => handleInputChange(e, setDatabase)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter database name" required />
      </div>

      {/* Password */}
      <div className="mb-6">
        <label htmlFor="password" className="block text-gray-700 dark:text-white font-bold mb-2">Password</label>
        <input type="password" id="password" value={password} onChange={(e) => handleInputChange(e, setPassword)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter password" required />
      </div>

      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Connect</button>
    </form>
  );
};

export default ConnectionForm;