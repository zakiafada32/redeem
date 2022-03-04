const OMNI_URL = process.env.NEXT_PUBLIC_OMNI_URL;
const OMNI_USERNAME = process.env.OMNI_USERNAME;
const OMNI_PASSWORD = process.env.OMNI_PASSWORD;

interface AuthResult {
  code: number;
  data: {
    token: string;
    expired: string;
  };
}

export type Token = string;

export const auth = async (): Promise<Token> => {
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

    const result = (await response.json()) as AuthResult;
    if (result.code !== 200) {
      throw new Error('auth failed');
    }

    return result.data.token;
  } catch (error) {
    return '';
  }
};
