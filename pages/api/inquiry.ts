import type { NextApiRequest, NextApiResponse } from 'next';
import type { InquiryResult } from '../../libs';

interface ReqBody {
  payment_code: string;
}

const OMNI_URL = process.env.OMNI_URL;
const OMNI_TOKEN = process.env.OMNI_TOKEN;

export default async function handler(req: NextApiRequest, res: NextApiResponse<InquiryResult>) {
  const { payment_code } = req.body as ReqBody;

  try {
    if (!payment_code || payment_code === '') {
      throw new Error('incorrect payload');
    }

    const response = await fetch(OMNI_URL + '/api/v1/payment/inquiry/', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Token ' + OMNI_TOKEN,
      },
      body: JSON.stringify({
        payment_code,
      }),
    });

    if (response.status !== 200) {
      throw new Error('inquiry failed');
    }

    const data = (await response.json()) as InquiryResult;
    if (data.code !== 200) {
      throw new Error('inquiry failed');
    }
    res.status(200).json(data);
  } catch (error) {
    const data = {
      code: 400,
      result: {
        status: false,
        message: 'inquiry failed',
        data: {
          status: {
            code: 'RC99',
            message: 'inquiry failed',
          },
          product: {
            code: '',
            label: '',
            price: 0,
          },
          reference_no: '',
          account_no: payment_code,
        },
      },
    };
    res.status(400).json(data);
  }
}
