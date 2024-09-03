import { httpServer } from "./app.js";
import connectdb from "../database/connectdb.js";

const PORT = 3117;

connectdb()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });
