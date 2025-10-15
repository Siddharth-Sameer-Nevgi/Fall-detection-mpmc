'use client';

import styles from "./page.module.css";
import Header from "../components/Header";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { user } = useAuth();

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
              Device ID: <strong>{user?.deviceId}</strong>
            </p>
            <p className={styles.welcomeText}>
              User: <strong>{user?.email}</strong>
            </p>
          </div>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <h3>Real-time Monitoring</h3>
              <p>Continuous monitoring of device sensors for fall detection</p>
            </div>
            <div className={styles.featureCard}>
              <h3>Instant Alerts</h3>
              <p>Immediate notifications when a fall is detected</p>
            </div>
            <div className={styles.featureCard}>
              <h3>Data Analytics</h3>
              <p>View historical data and patterns</p>
            </div>
            <div className={styles.featureCard}>
              <h3>Emergency Contacts</h3>
              <p>Automatic emergency contact notifications</p>
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
