import React, { useState } from 'react';

interface AuthFormProps {
  isLogin: boolean;
  onSubmit: (email: string, password: string, username?: string) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ isLogin, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password, username);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="emailInput" className="form-label">Email address</label>
        <input
          type="email"
          className="form-control"
          id="emailInput"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="passwordInput" className="form-label">Password</label>
        <input
          type="password"
          className="form-control"
          id="passwordInput"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {!isLogin && (
        <div className="mb-3">
          <label htmlFor="usernameInput" className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            id="usernameInput"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
      )}
      <button type="submit" className="btn btn-primary w-100">
        {isLogin ? 'Login' : 'Sign Up'}
      </button>
    </form>
  );
};