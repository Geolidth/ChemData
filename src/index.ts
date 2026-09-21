import { Elysia } from "elysia";
import { connectDB } from "./db";
import { chemicalsRoutes } from "./routes/chemicals";
await connectDB();

const app = new Elysia()
  .get("/", () => ({
    message: "Üdv a ChemData Mongoose API-n!"
  }))
  .use(chemicalsRoutes)
  .use(import("./routes/pubchem").then((module) => module.pubchemRoutes))
  .listen(3000);

console.log(`🦊 Elysia + Mongoose fut a http://${app.server?.hostname}:${app.server?.port} címen`);