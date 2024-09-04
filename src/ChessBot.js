import React, { useState } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';

const ChessBot = () => {
    const [game] = useState(new Chess());
    const [fen, setFen] = useState('start');
   
    const onDrop = ({ sourceSquare, targetSquare }) => {
        const move = game.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q' // Promote to queen if a pawn reaches the 8th rank
            
        });
    
        if (move === null) {
            // Check if the move was a pawn promotion attempt
            const piece = game.get(sourceSquare);
            if (piece && piece.type === 'p' && (targetSquare[1] === '8' || targetSquare[1] === '1')) {
                // If it's a pawn promotion, we need to handle it separately
                const promotionMove = game.move({
                    from: sourceSquare,
                    to: targetSquare,
                    promotion: 'q' // Specify the promotion piece
                });
                if (promotionMove === null) {
                    return false; // Invalid move
                }
            } else {
                return false; // Invalid move
            }
        }
        
        setFen(game.fen());
    
        setTimeout(() => {
            makeBestMove();
        }, 250);
    
        return true;
    };

    const makeBestMove = () => {
        const bestMove = getBestMove();
        if (bestMove) {
            game.move(bestMove);
            setFen(game.fen());
        }

        if (game.game_over()) {
            alert('Game Over');
        }
    };

    const getBestMove = () => {
        let bestMove = null;
        let bestValue = -Infinity;

        game.moves().forEach(move => {
            game.move(move);
            const boardValue = minimax(2, false);
            game.undo();
            if (boardValue > bestValue) {
                bestValue = boardValue;
                bestMove = move;
            }
        });

        return bestMove;
    };

    const minimax = (depth, isMaximizingPlayer) => {
        if (depth === 0 || game.game_over()) {
            return evaluateBoard();
        }

        if (isMaximizingPlayer) {
            let bestValue = -Infinity;
            game.moves().forEach(move => {
                game.move(move);
                bestValue = Math.max(bestValue, minimax(depth - 1, false));
                game.undo();
            });
            return bestValue;
        } else {
            let bestValue = Infinity;
            game.moves().forEach(move => {
                game.move(move);
                bestValue = Math.min(bestValue, minimax(depth - 1, true));
                game.undo();
            });
            return bestValue;
        }
    };

    const evaluateBoard = () => {
        const board = game.board();
        let value = 0;

        board.forEach(row => {
            row.forEach(piece => {
                if (piece) {
                    value += getPieceValue(piece);
                }
            });
        });

        return value;
    };

    const getPieceValue = (piece) => {
        const values = {
            'p': 1,
            'n': 3,
            'b': 3,
            'r': 5,
            'q': 9,
            'k': 0
        };

        return piece.color === 'w' ? values[piece.type] : -values[piece.type];
    };

    return (
        <div>
            <h1>Chess Playing Bot</h1>
            <Chessboard
                position={fen}
                onPieceDrop={onDrop}
                boardOrientation="white"
                 className="chessboard"
                
            />
        </div>
    );
};

export default ChessBot;