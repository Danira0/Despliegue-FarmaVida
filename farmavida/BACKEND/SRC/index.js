import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './CONFIG/db.js';
import morgan from 'morgan';
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});