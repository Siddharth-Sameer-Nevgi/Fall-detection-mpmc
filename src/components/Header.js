'use client';

import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './Header.module.css';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) return null;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <h1 className={styles.logo}>Fall Detection System</h1>
        <div className={styles.userInfo}>
          <span className={styles.welcome}>
            Welcome, {user.email}
          </span>
          <span className={styles.deviceId}>
            Device: {user.deviceId}
          </span>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}