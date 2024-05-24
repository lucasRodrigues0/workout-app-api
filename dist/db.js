"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
main().catch(err => console.log(err));
async function main() {
    try {
        await mongoose_1.default.connect(`${process.env.DB_STRING}`);
        console.log('connected');
    }
    catch (error) {
        console.log(`oops! an error ocurred: ${error.message}`);
    }
}
exports.main = main;
