"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HOST = exports.PORT = void 0;
/* ------------ Choosing Env ------------ */
// choosing which env to use before proceed
if (process.env["NODE_ENV"] === 'production') {
    require('custom-env').env(process.env.NODE_ENV);
    console.log(`server running on ${process.env["NODE_ENV"]} mode`);
}
else {
    require('dotenv').config();
    console.log(`server running on ${process.env["NODE_ENV"]} mode`);
}
/**
 * @namespace PORT port number to establish connection
 */
exports.PORT = Number(process.env.PORT) || 6060;
/**
 * @namespace HOST name of host to connect with
 */
exports.HOST = String(process.env.HOST) || 'localhost';
