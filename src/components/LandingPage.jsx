import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div style={{ backgroundImage: "url(matrix-356024_1280.webp)", 
      backgroundSize: 'cover', 
      backgroundPosition: 'center', 
      flexDirection: 'column', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      textAlign: 'center',
      color: "#fbffe3",
    }}>

      <h1 style={{fontSize: '3em'}}>Welcome to Our Online Code Editor!</h1>
      <p style={{fontSize: '2em'}}>
        Our online code editor lets you write, compile, and run your code all in one place.<br />
        It supports multiple programming languages and provides a simple and intuitive interface.
      </p>
      <Link to="/login">
        <button type="button" style={{width: '150px', height: '50px', fontSize: '1em'}}>
          Start Coding
        </button>
      </Link>
    </div>
  );
};