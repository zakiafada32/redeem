import type { NextApiRequest, NextApiResponse } from 'next';
import { AuthResult } from '../../libs';

const OMNI_URL = process.env.NEXT_PUBLIC_OMNI_URL;
const OMNI_USERNAME = process.env.OMNI_USERNAME;
const OMNI_PASSWORD = process.env.OMNI_PASSWORD;

interface AuthOmni {
  code: number;
  data: {
    token: string;
    expired: string;
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<AuthResult>) {
  try {
    const response = await fetch(OMNI_URL + '/api/v1/token/', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        username: OMNI_USERNAME,
        password: OMNI_PASSWORD,
      }),
    });

    if (response.status !== 200) {
      throw new Error('auth failed');
    }

    const result = (await response.json()) as AuthOmni;
    if (result.code !== 200) {
      throw new Error('auth failed');
    }

    res.status(200).json({ code: 200, token: result.data.token });
  } catch (error) {
    res.status(400).json({ code: 400, token: '' });
  }
}
