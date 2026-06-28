require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

// Prisma 7 allows you to pass the raw credentials directly into the adapter as an object.
// This completely bypasses the connection string parser and forces the exact IPv4 route.
const adapter = new PrismaMariaDb({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const prisma = new PrismaClient({ adapter });

module.exports = { prisma };