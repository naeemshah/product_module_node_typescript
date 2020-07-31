const {
  MONGO_HOSTNAME,
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_PORT,
  MONGO_DB,
} = process.env;

export const config = {
  name: 'mongo',
  connector: 'mongodb',
  url: '',
  host: MONGO_HOSTNAME || 'database',
  port: MONGO_PORT || 27018,
  user: MONGO_USERNAME || '',
  password: MONGO_PASSWORD || '',
  database: MONGO_DB || 'bedayeahDB',
  useNewUrlParser: true,
};

export const emailConfig = {
  name: 'mail',
  connector: 'mail',
  transports: [
    {
      type: 'SMTP',
      host: 'smtp.gmail.com',
      secure: true,
      port: 465,
      auth: {
        user: 'usmanfarazegenie@gmail.com',
        pass: 'Pa55word@123',
      },
    },
  ],
};
console.log(emailConfig);
