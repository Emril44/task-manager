import React from 'react';
import '../styles/EditBoardModal.css';

const EditBoardModal = ({ board, onClose, onSave }) => {
    const [formData, setFormData] = React.useState({
        name: board.name,
        description: board.description,
        archived: board.archived || false
    });

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    }

    const handleSubmit = () => {
        onSave(board.id, formData);
    }

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Edit Board</h2>
                <input
                    name="name"
                    text="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Board Name"
                    />
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Board Description"
                    />
                <label>
                    <input
                    type="checkbox"
                    name="archived"
                    checked={formData.archived}
                    onChange={handleChange}
                    />
                    Archived
                </label>
                <div className="modal-actions">
                    <button onClick={handleSubmit}>Save</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default EditBoardModal;