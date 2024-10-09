// src/context/UserContext.tsx
import type { UserProps } from 'src/sections/user/user-table-row';

import React, { useMemo, useState, useEffect, useContext, createContext } from 'react';

import { fetchUserById } from 'src/sections/user/utils';

type UserContextType = {
  user: UserProps | null;
  setUser: React.Dispatch<React.SetStateAction<UserProps | null>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProps | null>(null);

  useEffect(() => {
    const _id = localStorage.getItem('_id'); // O cómo almacenes el ID del usuario
    if (_id) {
      const loadUserData = async () => {
        try {
          const userData = await fetchUserById(_id);
          setUser(userData); // Actualiza el estado con los datos del usuario
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      };
      loadUserData();
    }
  }, []);

  // Use useMemo to memoize the context value
  const value = useMemo(() => ({ user, setUser }), [user, setUser]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};