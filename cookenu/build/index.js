"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const ErrorCatcher_1 = __importDefault(require("./Middlewares/ErrorCatcher"));
const Routes_1 = __importDefault(require("./Routes"));
const app = express_1.default();
app.use(express_1.default.json());
app.use(Routes_1.default);
app.use(ErrorCatcher_1.default);
const server = app.listen(process.env.PORT || 3000, () => {
    if (server) {
        const address = server.address();
        console.log(`Server is running in http://localhost:${address.port}`);
    }
    else {
        console.error(`Failure upon starting server.`);
    }
});
