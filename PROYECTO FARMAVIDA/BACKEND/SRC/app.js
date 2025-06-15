import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './ROUTES/auth.route.js'; 
import proveedor from './ROUTES/labo.route.js'
import productos from './ROUTES/producto.routes.js';
import movimientos from './ROUTES/movimiento.routes.js';
import informe from './ROUTES/informes.routes.js';
import cookieParser from 'cookie-parser';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));


// Rutas
app.use("/api", authRoutes); 
app.use('/api', proveedor);
app.use('/api', productos);
app.use('/api', movimientos);
app.use('/api', informe);

export default app;
