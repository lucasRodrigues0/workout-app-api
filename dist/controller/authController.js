"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEmail = exports.logout = exports.refresh = exports.authenticatedUser = exports.login = exports.createUser = void 0;
const User_1 = require("../model/User");
const BadRequestError_1 = __importDefault(require("../errors/BadRequestError"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = require("jsonwebtoken");
const createUser = async (req, res, next) => {
    const { name, email, password, passwordConfirm, admin } = req.body;
    const user = {
        name,
        email,
        password: await bcryptjs_1.default.hash(password, 12),
        admin
    };
    if (!name) {
        throw new BadRequestError_1.default({ code: 400, message: "Name is Required" });
    }
    if (!email) {
        throw new BadRequestError_1.default({ code: 400, message: "Email is Required" });
    }
    if (!password) {
        throw new BadRequestError_1.default({ code: 400, message: "Password is Required" });
    }
    const emailIsValid = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/gm.test(email);
    if (!emailIsValid) {
        throw new BadRequestError_1.default({ code: 400, message: "invalid email format" });
    }
    if (password.length < 5) {
        throw new BadRequestError_1.default({ code: 400, message: "password must have at least 5 characters" });
    }
    if (typeof (password) !== 'string')
        return;
    const obj = { uppercase: 0, lowercase: 0, number: 0, special: 0 };
    password.trim().split('').forEach(element => {
        /[A-Z]/g.test(element) ? ++obj.uppercase :
            /[a-z]/g.test(element) ? ++obj.lowercase :
                /[0-9]/g.test(element) ? ++obj.number :
                    ++obj.special;
    });
    if (obj.uppercase === 0) {
        throw new BadRequestError_1.default({ code: 400, message: "password must have at least one uppercase character" });
    }
    if (obj.lowercase === 0) {
        throw new BadRequestError_1.default({ code: 400, message: "password must have at least one lowercase character" });
    }
    if (obj.number === 0) {
        throw new BadRequestError_1.default({ code: 400, message: "password must have at least one number" });
    }
    if (obj.special === 0) {
        throw new BadRequestError_1.default({ code: 400, message: "password must have at least one special character" });
    }
    const invalidCharacters = /[ç;:?ãõáéíóúâêôûªº~^´`à/]/gm.test(password);
    if (invalidCharacters) {
        throw new BadRequestError_1.default({ code: 400, message: "password contains invalid characters" });
    }
    if (password !== passwordConfirm) {
        throw new BadRequestError_1.default({ code: 400, message: "Password and confirmation do not match" });
    }
    const emailCheck = await User_1.User.findOne({ email: email });
    if (emailCheck) {
        throw new BadRequestError_1.default({ code: 400, message: "Email already registered" });
    }
    const data = await User_1.User.create(user);
    res.status(200).send(data);
};
exports.createUser = createUser;
const login = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User_1.User.findOne({ email: email });
    if (!user) {
        throw new BadRequestError_1.default({ code: 400, message: "User not found!" });
    }
    if (!await bcryptjs_1.default.compare(password, user.password)) {
        throw new BadRequestError_1.default({ code: 400, message: "Incorrect Password!" });
    }
    const token = (0, jsonwebtoken_1.sign)({ id: user._id }, process.env.ACCESS_SECRET || '', { expiresIn: '30s' });
    const refreshToken = (0, jsonwebtoken_1.sign)({ id: user._id }, process.env.REFRESH_SECRET || '', { expiresIn: '1w' });
    res.cookie('access_token', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 //1d
    });
    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 * 7 //7d
    });
    res.status(200).send({
        message: "success!"
    });
};
exports.login = login;
const authenticatedUser = async (req, res, next) => {
    const cookie = req.cookies['access_token'];
    if (!cookie) {
        throw new BadRequestError_1.default({ code: 401, message: "unauthorized" });
    }
    const payload = (0, jsonwebtoken_1.verify)(cookie, process.env.ACCESS_SECRET || '');
    if (!payload) {
        throw new BadRequestError_1.default({ code: 401, message: "unauthorized" });
    }
    const user = await User_1.User.findOne({ _id: payload.id });
    if (!user) {
        throw new BadRequestError_1.default({ code: 401, message: "unauthorized" });
    }
    const data = {
        name: user.name,
        email: user.email,
        id: user._id
    };
    return res.status(200).json(data);
};
exports.authenticatedUser = authenticatedUser;
const refresh = (req, res, next) => {
    const cookie = req.cookies['refresh_token'];
    const payload = (0, jsonwebtoken_1.verify)(cookie, process.env.REFRESH_SECRET || '');
    if (!payload) {
        throw new BadRequestError_1.default({ code: 401, message: "unauthorized" });
    }
    const token = (0, jsonwebtoken_1.sign)({ id: payload.id }, process.env.ACCESS_SECRET || '', { expiresIn: '30s' });
    res.cookie('access_token', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 //1d
    });
    return res.status(200).send({ message: "success!" });
};
exports.refresh = refresh;
const logout = (req, res, next) => {
    res.cookie('access_token', '', { maxAge: 0 });
    res.cookie('refresh_token', '', { maxAge: 0 });
    return res.status(200).send({ message: "success!" });
};
exports.logout = logout;
const checkEmail = async (req, res, next) => {
    const { email } = req.body;
    const response = await User_1.User.findOne({ email: email });
    if (!response) {
        return res.status(200).send(false);
    }
    return res.status(200).send(true);
};
exports.checkEmail = checkEmail;
