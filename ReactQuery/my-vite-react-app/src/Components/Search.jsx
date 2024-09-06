// src/components/SearchUserPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '../hooks/useDebounce'; // Adjust the path if necessary

function SearchUserPage() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 900);

  const fetchUsers = async (query) => {
    try {
      const response = await axios.get('http://localhost:3000/api/searchUsers', {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'An error occurred');
    }
  };

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['searchUsers', debouncedQuery],
    queryFn: () => fetchUsers(debouncedQuery),
    enabled: debouncedQuery.length > 0,
  });

  return (
    <div>
      <h6>Search by debouncing</h6>
      <input
        type="text"
        placeholder="Search by name"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {users && users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              {user.name} - {user.email}
            </li>
          ))}
        </ul>
      ) : (
        debouncedQuery.length > 0 && <p>No users found</p>
      )}
    </div>
  );
}

export default SearchUserPage;
