import React from 'react';
import './App.css';
import ErrorBoundary from './ErrorBoundary';
import ChessBot from './ChessBot';

function App() {
    return (
        <div className="App">
            <h1>Welcome to chess bot game</h1>
            <ErrorBoundary>
                    <ChessBot />
                </ErrorBoundary>
        </div>
    );
}

export default App;
