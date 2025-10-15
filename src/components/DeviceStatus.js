'use client';

import { useState, useEffect } from 'react';
import styles from './DeviceStatus.module.css';

export default function DeviceStatus({ userId }) {
  const [deviceData, setDeviceData] = useState({
    deviceId: 'Loading...',
    deviceStatus: 'Loading...',
    simNumber: 'Loading...',
    lastKnownLocation: 'Loading...',
    altitude: 'Loading...',
    networkStrength: 'Loading...'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDeviceData();
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchDeviceData, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  const fetchDeviceData = async () => {
    try {
      const response = await fetch(`/api/device?userId=${userId}`);
      const data = await response.json();
      
      if (response.ok) {
        setDeviceData(data);
        setError('');
      } else {
        setError(data.error || 'Failed to fetch device data');
      }
    } catch (err) {
      setError('Failed to fetch device data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'online':
      case 'active':
        return '#28a745';
      case 'offline':
        return '#dc3545';
      case 'idle':
        return '#ffc107';
      default:
        return '#6c757d';
    }
  };

  const getNetworkStrengthBars = (strength) => {
    const strengthValue = strength?.toLowerCase();
    if (strengthValue === 'excellent' || strengthValue === 'strong') return 4;
    if (strengthValue === 'good') return 3;
    if (strengthValue === 'fair') return 2;
    if (strengthValue === 'weak') return 1;
    return 0;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading device information...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Device Information</h3>
        <button onClick={fetchDeviceData} className={styles.refreshButton}>
          Refresh
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.icon}>📱</span>
            <h4>Device ID</h4>
          </div>
          <p className={styles.value}>{deviceData.deviceId}</p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.icon}>🔄</span>
            <h4>Status</h4>
          </div>
          <div className={styles.statusValue}>
            <span 
              className={styles.statusDot} 
              style={{ backgroundColor: getStatusColor(deviceData.deviceStatus) }}
            ></span>
            <p className={styles.value}>{deviceData.deviceStatus}</p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.icon}>📞</span>
            <h4>SIM Number</h4>
          </div>
          <p className={styles.value}>{deviceData.simNumber}</p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.icon}>📍</span>
            <h4>Last Known Location</h4>
          </div>
          <p className={styles.value}>{deviceData.lastKnownLocation}</p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.icon}>⛰️</span>
            <h4>Altitude</h4>
          </div>
          <p className={styles.value}>{deviceData.altitude}</p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.icon}>📶</span>
            <h4>Network Strength</h4>
          </div>
          <div className={styles.networkValue}>
            <div className={styles.signalBars}>
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={`${styles.bar} ${
                    bar <= getNetworkStrengthBars(deviceData.networkStrength) 
                      ? styles.active 
                      : ''
                  }`}
                />
              ))}
            </div>
            <p className={styles.value}>{deviceData.networkStrength}</p>
          </div>
        </div>
      </div>
    </div>
  );
}