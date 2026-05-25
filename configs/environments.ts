export const ENV = {
  baseUrl: process.env.BASE_URL ?? 'http://lojaebac.ebaconline.art.br',
  credentials: {
    email: process.env.USER_EMAIL ?? 'teste@gmail.com',
    password: process.env.USER_PASSWORD ?? 'Teste@12345',
  },
};

export const RUNNER = {
  workers: process.env.WORKERS ? parseInt(process.env.WORKERS, 10) : 5,
  fullyParallel: process.env.FULLY_PARALLEL !== 'false',
  retries: process.env.CI ? 2 : 1,
};
