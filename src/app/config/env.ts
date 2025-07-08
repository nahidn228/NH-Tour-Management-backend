import dotenv from "dotenv";

dotenv.config();

interface IEnvConfig {
  PORT: string;
  DB_URL: string;
  NODE_ENV: "development" | "production";
}

const loadEnvVariables = (): IEnvConfig => {
  const requireEnvVariables = ["PORT", "DB_URL", "NODE_ENV"];
  requireEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable, ${key}`);
    }
  });

  return {
    PORT: process.env.PORT as string,
    DB_URL: process.env.DB_URL!,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
  };
};

export const envVars: IEnvConfig = loadEnvVariables();
