import { Request, Response } from 'express';
import multer from 'multer';
import csv from 'csv-parser';
import { parse as json2csv } from 'json2csv';
import fs from 'fs';
import stream from 'stream';

const storega = multer.memoryStorage()
const upload = multer({ 
  dest: 'uploads/'
 }
);

export const handleCsvUpload = [
  upload.single('file'),
  async (req: Request, res: Response) => {
    try {
      if (req.file) {
        const results:any [] = [];
        fs.createReadStream(req.file.path)
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', () => {
            fs.unlinkSync(req.file!.path);
            const csvStr = json2csv(results);
            res.json({ data: results, csv: csvStr });
          });
      } else if (req.body.data) {
        const data = JSON.parse(req.body.data);
        const csvStr = json2csv(data);
        res.json({ data, csv: csvStr });
      } else if (req.body.csv) {
        const rows: any[] = [];
        const bufferStream = new stream.PassThrough();
        bufferStream.end(Buffer.from(req.body.csv));

        bufferStream
          .pipe(csv())
          .on('data', (data) => rows.push(data))
          .on('end', () => {
            const csvStr = json2csv(rows);
            res.json({ data: rows, csv: csvStr });
          });
      } else {
        res.status(400).json({ error: 'Hech qanday maʼlumot topilmadi.' });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
];