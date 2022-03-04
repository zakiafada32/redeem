const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export interface AuthResult {
  code: number;
  token: string;
}

export type Token = string;

export const auth = async (): Promise<Token> => {
  try {
    const response = await fetch(BASE_URL + '/api/auth', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    });

    if (response.status !== 200) {
      throw new Error('auth failed');
    }

    const data = (await response.json()) as AuthResult;
    if (data.code !== 200) {
      throw new Error('auth failed');
    }

    return data.token;
  } catch (error) {
    return '';
  }
};
