'use client';

import { useState, useEffect } from 'react';
import styles from "./page.module.css";
import Header from "../components/Header";
import ProtectedRoute from "../components/ProtectedRoute";
import DeviceStatus from "../components/DeviceStatus";
import EmergencyContacts from "../components/EmergencyContacts";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?._id) {
      fetchEmergencyContacts();
    }
  }, [user]);

  const fetchEmergencyContacts = async () => {
    try {
      const response = await fetch(`/api/emergency-contacts?userId=${user._id}`);
      const data = await response.json();
      
      if (response.ok) {
        setEmergencyContacts(data.contacts);
      }
    } catch (error) {
      console.error('Failed to fetch emergency contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactAdded = (newContact) => {
    setEmergencyContacts(prev => [...prev, newContact]);
  };

  const handleContactDeleted = (contactId) => {
    setEmergencyContacts(prev => prev.filter(contact => contact._id !== contactId));
  };

  return (
    <ProtectedRoute>
      <Header />
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.welcomeSection}>
            <h1 className={styles.welcomeTitle}>
              Welcome to Fall Detection System
            </h1>
            <p className={styles.welcomeText}>
              User: <strong>{user?.email}</strong>
            </p>
          </div>

          <div className={styles.dashboardGrid}>
            <div className={styles.leftPanel}>
              {user?._id && (
                <DeviceStatus userId={user._id} />
              )}
            </div>
            
            <div className={styles.rightPanel}>
              {user?._id && (
                <EmergencyContacts
                  userId={user._id}
                  contacts={emergencyContacts}
                  onContactAdded={handleContactAdded}
                  onContactDeleted={handleContactDeleted}
                />
              )}
            </div>
          </div>

          <div className={styles.statusSection}>
            <h2>System Status</h2>
            <div className={styles.statusIndicator}>
              <span className={styles.statusDot}></span>
              <span>System Active - Monitoring Enabled</span>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
