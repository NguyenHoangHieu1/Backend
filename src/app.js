"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const main_1 = __importDefault(require("./routes/main"));
const admin_1 = __importDefault(require("./routes/admin"));
const auth_1 = __importDefault(require("./routes/auth"));
const express_rate_limit_1 = require("express-rate-limit");
const helmet_1 = __importDefault(require("helmet"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    keyGenerator: (request, response) => request.ip,
}));
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use("/admin", admin_1.default);
app.use(auth_1.default);
app.use(main_1.default);
const errorHandler = (error, req, res, next) => {
    res.status(error.status).json({ message: error.message, data: error.data });
};
app.use(errorHandler);
app.listen(8080);
