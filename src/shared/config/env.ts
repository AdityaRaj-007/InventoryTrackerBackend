import "dotenv/config";

const getEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
};

export const env = {
  mongoUri: getEnv("MONGO_URI"),
  port: Number(getEnv("PORT") ?? 3000),
  dummyPassowrd: getEnv("DUMMY_HASHED_PASSWORD"),
  jwtSecret: getEnv("JWT_SECRET"),
};
