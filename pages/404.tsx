import Image from 'next/image';
import Link from 'next/link';
import { Layout } from '../component';

import styles from '../styles/Unexpected.module.css';

const Custom404: React.FC = () => (
  <Layout>
    <section className={styles.error}>
      <Image src="/pandemic.png" alt="Oops!" width={800} height={600} />
      <h1>Oops!</h1>
      <h3>Something Unexpected happen.</h3>
      <h3>We&apos;re working on it</h3>
      <Link href="/">
        <a>Please Try Again</a>
      </Link>
    </section>
  </Layout>
);

export default Custom404;
