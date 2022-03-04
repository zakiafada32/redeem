import Head from 'next/head';
import Image from 'next/image';
import { ToastContainer } from 'react-toastify';

import styles from '../styles/Layout.module.css';
import 'react-toastify/dist/ReactToastify.css';

export const Layout: React.FC = ({ children }) => (
  <div className={styles.container}>
    <Head>
      <title>Gamefinity - Redeem Code</title>
      <meta name="description" content="Redeem your code with Gamefinity" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main className={styles.main}>{children}</main>

    <footer className={styles.footer}>
      <a href="https://gamefinity.id/" target="_blank" rel="noopener noreferrer">
        <span className={styles.logo}>
          <Image src="/gamefinity.png" alt="Gamefinity Logo" width={100} height={18} />
        </span>
        <p>Copyright © 2022 Gamefinity. All rights reserved.</p>
      </a>
    </footer>

    <ToastContainer
      position="top-center"
      autoClose={10000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  </div>
);
