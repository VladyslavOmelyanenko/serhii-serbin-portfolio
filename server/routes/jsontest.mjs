import fs from 'fs';
import express from "express";
const router = express.Router();


router.get('/', async (req, res) => {
  try {
    fs.readFile('./data/media.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading data file:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const jsonData = JSON.parse(data);
    res.json(jsonData);
  });
  } catch (error){
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


export default router;

