export const settings = {
  MONGO_URI:
    process.env.mongoURI ||
    'mongodb://0.0.0.0:27017/blogPlatform?maxPoolSize=20&w=majority',
  JWT_SECRET: process.env.JWT_SECRET || '123',
  BASIC_USER: 'admin',
  BASIC_PASS: 'qwerty',
  SALT_GENERATE_ROUND: '10',
  CONFIRMATION_CODE_EXPIRE: '24', // Time life for confirmation code
  TIME_TO_EXPIRED_AT: '300000', // Time life for accessToken
  TIME_TO_EXPIRED_RT: '300000', // Time life for refreshToken
  CONNECTION_TIME_LIMIT: '10000',
  CONNECTION_COUNT_LIMIT: '5',
  environment: 'dev',
};
