import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './ROUTES/auth.route.js'; 
import proveedor from './ROUTES/labo.route.js';
import productos from './ROUTES/producto.routes.js';
import movimientos from './ROUTES/movimiento.routes.js';
import informe from './ROUTES/informes.routes.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://172.210.66.28:5173',
     'http://localhost:5174',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Rutas API
app.use("/api", authRoutes); 
app.use('/api', proveedor);
app.use('/api', productos);
app.use('/api', movimientos);
app.use('/api', informe);

export default app;
