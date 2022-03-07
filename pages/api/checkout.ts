import type { NextApiRequest, NextApiResponse } from 'next';
import type { CheckoutResult, CheckoutParams } from '../../libs';

const OMNI_URL = process.env.OMNI_URL;
const OMNI_TOKEN = process.env.OMNI_TOKEN;

export default async function handler(req: NextApiRequest, res: NextApiResponse<CheckoutResult>) {
  const checkoutParams = req.body as CheckoutParams;

  try {
    const response = await fetch(OMNI_URL + '/api/v1/payment/checkout/', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Token ' + OMNI_TOKEN,
      },
      body: JSON.stringify(checkoutParams),
    });

    if (response.status !== 200) {
      throw new Error('checkout failed');
    }

    const result = (await response.json()) as CheckoutResult;
    if (result.code !== 200) {
      throw new Error('checkout failed');
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ code: 400 });
  }
}
