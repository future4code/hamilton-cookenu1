import express from "express";
import "express-async-errors";
import { AddressInfo } from "net";
import errorCatcher from "./Middlewares/ErrorCatcher";
import routes from "./Routes";

const app = express();

app.use(express.json());

app.use(routes);

app.use(errorCatcher);

const server = app.listen(process.env.PORT || 3000, () => {
  if (server) {
    const address = server.address() as AddressInfo;
    console.log(`Server is running in http://localhost:${address.port}`);
  } else {
    console.error(`Failure upon starting server.`);
  }
});
