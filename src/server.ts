import { app } from "./app";
import { connectDb } from "./infrastructure/db";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  connectDb();
  console.log(`Server is running on PORT:${PORT}`);
});
