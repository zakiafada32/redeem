import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Layout, Unexpected } from '../component';
import { auth, inquiry, checkout, ResponseCode as RC } from '../libs';

import type { FormEventHandler } from 'react';
import type { GetStaticProps, NextPage } from 'next';
import type { Token, Summary, CheckoutParams } from '../libs';

import styles from '../styles/Redeem.module.css';

const Redeem: NextPage<{ token: Token }> = ({ token }) => {
  const [paymentCode, setPaymentCode] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const [summary, setSummary] = useState<Summary>();
  const [step, setStep] = useState(0);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault();
    const toastId = toast.info('tunggu sebentar . . .');
    try {
      const inquiryResult = await inquiry(token, paymentCode);
      if (inquiryResult.code !== 200) {
        throw new Error('Terjadi kesalahan, tolong dicoba lagi');
      }

      switch (inquiryResult.result.data.status.code) {
        case RC.RC00:
          const checkoutParams: CheckoutParams = {
            payment_code: paymentCode,
            reference_no: inquiryResult.result.data.reference_no,
            sender_name: name,
            amount: inquiryResult.result.data.product.price,
            email: email,
            phone_number: inquiryResult.result.data.data?.phone!,
            expiration: inquiryResult.result.data.data?.expiry_time!,
          };

          const checkoutResult = await checkout(token, checkoutParams);

          if (checkoutResult.code !== 200) {
            throw new Error('Terjadi kesalahan, tolong dicoba lagi');
          }

          if (!checkoutResult.result?.payment_link || checkoutResult.result.payment_link === '') {
            throw new Error(checkoutResult.result?.message);
          }

          setSummary({
            name: name,
            email: email,
            paymentLink: checkoutResult.result?.payment_link!,
            description: inquiryResult.result.data.data?.description!,
            phone: inquiryResult.result.data.data?.phone!,
            expiration: inquiryResult.result.data.data?.expiry_time!,
          });
          setStep(1);

          toast.update(toastId, { autoClose: 2000, type: 'success', render: 'Sukses' });
          break;

        case RC.RC50:
          throw new Error('Kode bayar sudah terpakai');

        case RC.RC51:
          throw new Error('Kode bayar sudah tidak berlaku');

        case RC.RC52:
          throw new Error('Kode bayar tidak ditemukan');

        default:
          throw new Error(
            'Terjadi kesalahan saat pengecekan kode bayar, tolong dicoba lagi dan pastikan kode bayar sudah sesuai'
          );
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.update(toastId, { autoClose: 5000, type: 'error', render: error.message });
        return;
      }
      toast.update(toastId, { autoClose: 5000, type: 'error', render: 'Terjadi kesalahan, tolong dicoba lagi' });
    }
  };

  if (!token || token === '') {
    return <Unexpected />;
  }

  return (
    <Layout>
      <header style={{ marginBottom: '40px' }}>
        <Image src="/gamefinity.png" alt="gamefinity" width={350} height={62} />
      </header>

      <section style={{ marginBottom: '20px' }}>
        <Image src="/telkomsel.png" alt="telkomsel" width={140} height={41} />
      </section>

      <section>
        {step === 0 ? (
          <form onSubmit={handleSubmit} className={styles.form}>
            <label>Masukkan Kode Bayar</label>
            <input type="number" value={paymentCode} onChange={e => setPaymentCode(e.target.value)} required />

            <label>Alamat Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />

            <label>Nama (optional)</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} />
            <code>Masukkan nama untuk menjadi bagian dari komunitas gaming Gamefinity</code>

            <button type="submit">Lanjutkan</button>
          </form>
        ) : (
          <article className={styles.summary}>
            <h1>Selamat, anda akan menerima:</h1>
            <div className={styles.desc} dangerouslySetInnerHTML={{ __html: summary?.description ?? '' }} />
            <code>Kode bayar akan hangus pada {summary?.expiration}</code>
            <table>
              <tbody>
                <tr>
                  <td>Nama</td>
                  <td>:</td>
                  <td>{summary?.name}</td>
                </tr>
                <tr>
                  <td>Alamat Email</td>
                  <td>:</td>
                  <td>{summary?.email}</td>
                </tr>
                <tr>
                  <td>Nomor Handphone</td>
                  <td>:</td>
                  <td>{summary?.phone}</td>
                </tr>
              </tbody>
            </table>
            <a href={summary?.paymentLink} target="_blank" rel="noopener noreferrer">
              Lanjutkan
            </a>
          </article>
        )}
      </section>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<{ token: Token }> = async context => {
  const token = await auth();

  return {
    props: {
      token,
    },
  };
};

export default Redeem;
