import express from 'express';
import cors from 'cors';
import db from './CONFIG/db.js';
import morgan from 'morgan';
import servidor from "./app.js";

const port = 4000;

servidor.listen(port, () => {
    console.log(`Servidor escuchando en http://${port}`);
});