import React, { useState, useEffect } from 'react';
import { getUserById } from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getUserById(2)
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          setError('Error fetching user');
        });
  }, []);

  return (
      <div className="App">
        <h1>User Information</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {user ? (
            <div>
              <p>Username: {user.username}</p>
              <p>Email: {user.email}</p>
              <p>Role: {user.role}</p>
            </div>
        ) : (
            <p>Loading...</p>
        )}
      </div>
  );
}

export default App;
