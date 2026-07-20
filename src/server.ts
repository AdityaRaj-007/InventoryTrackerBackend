import app from "./app";
import { connectDb } from "./infrastructure/db";
import { env } from "./shared/config/env";

const PORT = env.port;

app.listen(PORT, () => {
  connectDb();
  console.log(`Server is running on PORT:${PORT}`);
});
