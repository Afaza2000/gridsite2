const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const upload = multer({ dest: 'uploads/' });

let approved = [];
let pending = [];

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

app.post('/upload', upload.single('image'), (req, res) => {
  const imgPath = `/uploads/${req.file.filename}`;
  pending.unshift(imgPath);
  res.sendStatus(200);
});

app.get('/pending', (req, res) => {
  res.json(pending);
});

app.get('/approved', (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const pageSize = 20;
  const start = page * pageSize;
  const end = start + pageSize;
  res.json(approved.slice(start, end));
});

app.get('/approve', (req, res) => {
  const image = req.query.image;
  const index = pending.indexOf(image);
  if (index !== -1) {
    approved.unshift(image);
    pending.splice(index, 1);
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});