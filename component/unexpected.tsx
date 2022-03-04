import Image from 'next/image';
import { Layout } from './index';

import styles from '../styles/Unexpected.module.css';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const Unexpected: React.FC = () => (
  <Layout>
    <section className={styles.error}>
      <Image src="/pandemic.png" alt="Oops!" width={800} height={600} />
      <h1>Oops!</h1>
      <h3>Something Unexpected happen.</h3>
      <h3>We&apos;re working on it</h3>
      <a href={BASE_URL}>Please Try Again</a>
    </section>
  </Layout>
);
