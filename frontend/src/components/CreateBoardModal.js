import React from 'react';
import '../styles/CreateBoardModal.css';
import { useTranslation } from 'react-i18next';

const CreateBoardModal = ({ board, onClose, onSave }) => {
    const [formData, setFormData] = React.useState({
        name: '',
        description: '',
        archived: false
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
        onSave(formData);
        onClose();
    }

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>{t('create_board.title')}</h2>
                <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t('create_board.board_name')}
                />
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder={t('create_board.board_description')}
                />
                <label>
                    <input
                        type="checkbox"
                        name="archived"
                        checked={formData.archived}
                        onChange={handleChange}
                    />
                    {t('create_board.archived')}
                </label>
                <div className="modal-actions">
                    <button className="save-button" onClick={handleSubmit}>{t('create_board.save')}</button>
                    <button className="cancel-button" onClick={onClose}>{t('create_board.cancel')}</button>
                </div>
            </div>
        </div>
    )
}

export default CreateBoardModal;