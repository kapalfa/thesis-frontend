import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Welcome to Our Online Code Editor!</h1>
      <p>
        Our online code editor lets you write, compile, and run your code all in one place.
        It supports multiple programming languages and provides a simple and intuitive interface.
      </p>
      <Link to="/login">
        <button type="button">
          Start Coding
        </button>
      </Link>
    </div>
  );
};

export default LandingPage;