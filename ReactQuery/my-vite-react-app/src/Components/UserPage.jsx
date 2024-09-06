import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import SearchUserPage from './Search';
import SearchUser from './Searchbytrottling';

async function fetchUsers(page, limit) {
  const res = await axios.get('http://localhost:3000/api/users', {
    params: { page, limit },
  });
  return res.data;
}

function UsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10); // Number of items per page

  const { data, isFetching, isError, error, refetch,isLoading } = useQuery({
    queryKey: ['users', currentPage, limit],
    queryFn: () => fetchUsers(currentPage, limit),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 10000,
    keepPreviousData: true, // Keep previous data while fetching new data
  });

  const handleNextPage = () => {
    if (data && currentPage < data.totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  return (
    <div>
      <h2>Users List</h2>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <SearchUserPage />
        
        <SearchUser/>
      </div>
    
      
      <div>
        {isLoading && <p>Initial Loading...</p>}
        {isFetching &&  <p>Loading from cache</p>}

        {isError && <p>Error: {error.message}</p>}
        {data && data.users.length > 0 ? (
          data.users.map(user => (
            <p key={user._id}>{user.name}</p>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </div>
      <button className="btn btn-primary mb-3" onClick={() => refetch()}>Refresh Users</button>

      <br/>
      <div>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span> Page {currentPage} of {data ? data.totalPages : 0} </span>
        <button
          onClick={handleNextPage}
          disabled={data && currentPage === data.totalPages}
        >
          Next
        </button>
        
      </div>
    </div>
  );
}

export default UsersPage;



// import React from 'react';
// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';

// function fetchUsers() {
//   return axios.get('http://localhost:3000/api/users').then(res => res.data);
// }

// function UsersPage() {
//   const { data, isFetching, isError, error, refetch } = useQuery({
//     queryKey: ['users'],
//     queryFn: fetchUsers,
//     refetchOnWindowFocus: true, // Refetch when window is refocused
//     refetchOnReconnect: true, // Refetch when network reconnects
//     staleTime: 60000, // Data is considered fresh for 1 minute
//   });

//   return (
//     <div>
//       <h1>Users Page</h1>
//       <button onClick={() => refetch()}>Refresh Users</button>
//       <div>
//         {isFetching && <p>Loading...</p>}
//         {isError && <p>Error: {error.message}</p>}
//         {data && data.length > 0 ? (
//           data.map(user => (
//             <p key={user.id}>{user.name}</p>
//           ))
//         ) : (
//           <p>No users found.</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default UsersPage;
