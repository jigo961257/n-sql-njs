import { create } from 'zustand';

interface ConnectionState {
    host: string;
    port: number;
    username: string;
    database: string;
    password: string;
    setHost: (host: string) => void;
    setPort: (port: number) => void;
    setUsername: (username: string) => void;
    setDatabase: (database: string) => void;
    setPassword: (password: string) => void;
    submitConnection: () => void;
  }
  
  export const useConnectionStore = create<ConnectionState>((set, get) => ({
    host: '',
    port: 0,
    username: '',
    database: '',
    password: '',
    setHost: (host) => set({ host }),
    setPort: (port) => set({ port }),
    setUsername: (username) => set({ username }),
    setDatabase: (database) => set({ database }),
    setPassword: (password) => set({ password }),
    submitConnection: () => {
      const { host, port, username, database, password } = get();
      console.log("Connecting to:", host, port, username, database, password); // Placeholder
      // Replace with your actual connection/API call logic
    },
  }));