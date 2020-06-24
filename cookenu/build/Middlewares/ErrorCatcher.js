"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CustomError_1 = require("../Util/CustomError");
function errorCatcher(error, request, response, next) {
    if (error instanceof CustomError_1.CustomError) {
        return response
            .status(error.code)
            .send({ message: error.message });
    }
    else {
        console.log(error);
        return response
            .status(400)
            .send({ message: "Ops! Aconteceu algo inesperado." });
    }
}
exports.default = errorCatcher;
