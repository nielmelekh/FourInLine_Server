require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

// Prisma 7 allows you to pass the raw credentials directly into the adapter as an object.
// This completely bypasses the connection string parser and forces the exact IPv4 route.
const adapter = new PrismaMariaDb({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'Shahar203',
    database: 'FourInLineDB'
});

const prisma = new PrismaClient({ adapter });

module.exports = { prisma };