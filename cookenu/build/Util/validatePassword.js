"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePassword = void 0;
function validatePassword(password) {
    const regexp = new RegExp(/(?=.{6,})/);
    const validation = regexp.test(password);
    return validation;
}
exports.validatePassword = validatePassword;
