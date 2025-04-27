import React from 'react';
import '../styles/EditBoardModal.css';
import api from "../services/api";
import { useTranslation } from 'react-i18next';

const EditBoardModal = ({ board, onClose, onSave }) => {
    const [formData, setFormData] = React.useState({
        name: board.name,
        description: board.description,
        archived: board.archived || false
    });
    const { t } = useTranslation();

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

    function handleArchiveBoard(id) {
        api.archiveBoard(id, true)
            .then(() => {
                onSave(id, { ...formData, archived: true }); // Optional: reflect in UI
                onClose();
            })
            .catch((err) => {
                console.error("Archiving failed:", err);
            });
    }

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>{t('edit_board.title')}</h2>
                <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t('edit_board.board_name')}
                    />
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder={t('edit_board.board_description')}
                    />
                <button className="archive-button" onClick={() => handleArchiveBoard(board.id)}>{t('edit_board.archive')}</button>
                <div className="modal-actions">
                    <button className="save-button" onClick={handleSubmit}>{t('edit_board.save')}</button>
                    <button className="cancel-button" onClick={onClose}>{t('edit_board.cancel')}</button>
                </div>
            </div>
        </div>
    )
}

export default EditBoardModal;