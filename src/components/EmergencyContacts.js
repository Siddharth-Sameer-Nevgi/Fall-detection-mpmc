'use client';

import { useState } from 'react';
import styles from './EmergencyContacts.module.css';

export default function EmergencyContacts({ userId, contacts, onContactAdded, onContactDeleted }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/emergency-contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          name: formData.name,
          phoneNumber: formData.phoneNumber
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add contact');
      }

      setFormData({ name: '', phoneNumber: '' });
      setShowForm(false);
      onContactAdded(data.contact);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (contactId) => {
    if (!confirm('Are you sure you want to delete this emergency contact?')) {
      return;
    }

    try {
      const response = await fetch(`/api/emergency-contacts?contactId=${contactId}&userId=${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete contact');
      }

      onContactDeleted(contactId);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Emergency Contacts</h3>
        <button 
          onClick={() => setShowForm(!showForm)}
          className={styles.addButton}
        >
          {showForm ? 'Cancel' : 'Add Contact'}
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              placeholder="Enter contact name"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              required
              placeholder="Enter phone number"
            />
          </div>
          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? 'Adding...' : 'Add Contact'}
          </button>
        </form>
      )}

      <div className={styles.contactsList}>
        {contacts.length === 0 ? (
          <p className={styles.noContacts}>No emergency contacts added yet.</p>
        ) : (
          contacts.map((contact) => (
            <div key={contact._id} className={styles.contactCard}>
              <div className={styles.contactInfo}>
                <h4>{contact.name}</h4>
                <p>{contact.phoneNumber}</p>
              </div>
              <button 
                onClick={() => handleDelete(contact._id)}
                className={styles.deleteButton}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}