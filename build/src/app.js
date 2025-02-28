"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const user_1 = __importDefault(require("./routes/user"));
const app = (0, express_1.default)();
const PORT = 3000;
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use("/api/v1/user", user_1.default);
app.listen(PORT, () => console.log(`Listing to port...${PORT}`));
