"use server";

// lib/db.js  (Create a separate file for your database connection)
import mssql from 'mssql';

// Store the connection pool in a module-level scope (not truly global, but persists within the module)
let pool: mssql.ConnectionPool | null = null;

export async function getConnectionPool(config: mssql.config) {
  if (!pool) { // Create the pool only once
    pool = new mssql.ConnectionPool(config);
    try {
      await pool.connect();
      console.log("Database pool connected."); // Log when the pool is created
    } catch (err) {
      console.error("Database pool connection error:", err);
      throw err; // Re-throw the error to be handled in the API route
    }
  }

  return pool;
}

// Optionally, add a function to close the pool when your application shuts down (if needed)
export async function closePool() {
    if (pool) {
        try {
            await pool.close();
            pool = null; // Reset the pool after closing
            console.log("Database pool closed.");
        } catch (err) {
            console.error("Database pool close error:", err);
        }
    }
}

