import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { handleCsvUpload } from './csvController';

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/csv', handleCsvUpload);

app.listen(port, () => {
  console.log(`🚀 Server http://localhost:${port} da ishlamoqda`);
});