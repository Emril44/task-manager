import React from 'react';
import '../styles/CreateBoardModal.css';

const CreateBoardModal = ({ board, onClose, onSave }) => {
    const [formData, setFormData] = React.useState({
        name: '',
        description: '',
        archived: false
    });

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    }

    const handleSubmit = () => {
        onSave(formData);
        onClose();
    }

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Create Board</h2>
                <input
                    name="name"
                    type="text"
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

export default CreateBoardModal;