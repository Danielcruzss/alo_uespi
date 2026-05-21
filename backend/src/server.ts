import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { manifestacaoRoutes } from './routes/manifestacaoRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', app: 'Alô UESPI API' });
});

app.use('/manifestacoes', manifestacaoRoutes);
app.use(errorHandler);

const port = Number(process.env.PORT || 3333);
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
