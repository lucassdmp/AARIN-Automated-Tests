export const ENV = {
  baseUrl: process.env.BASE_URL ?? 'http://lojaebac.ebaconline.art.br',
};

export const RUNNER = {
  workers: process.env.WORKERS ? parseInt(process.env.WORKERS, 10) : 5,
  fullyParallel: process.env.FULLY_PARALLEL !== 'false',
  retries: process.env.CI ? 5 : 3,
};
