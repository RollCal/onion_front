import React, { useState, useCallback } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

const VotingModal = ({ isOpenOrange, isOpenPurple, onRequestClose, orangeOnion, purpleOnion, onVoteSuccess }) => {
    const handleVote = (onionId, onionTitle) => {
        axios.post(`http://127.0.0.1:8000/api/votes/`, { onion_id: onionId })
            .then((response) => {
                onVoteSuccess(onionTitle);
            })
            .catch((error) => {
                console.error('Error voting:', error);
            });
    };

    return (
        <>
            {/* Orange Onion Modal */}
            <Modal isOpen={isOpenOrange} onRequestClose={onRequestClose}>
                <h2>Vote for your favorite Onion</h2>
                <button onClick={() => handleVote(orangeOnion.id, orangeOnion.title)}>{orangeOnion.title}</button>
            </Modal>

            {/* Purple Onion Modal */}
            <Modal isOpen={isOpenPurple} onRequestClose={onRequestClose}>
                <h2>Vote for your favorite Onion</h2>
                <button onClick={() => handleVote(purpleOnion.id, purpleOnion.title)}>{purpleOnion.title}</button>
            </Modal>
        </>
    );
};

export default VotingModal;
