const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

let jsonData = null;

app.get('/', (req, res) => {
  res.render('index', { data: jsonData });
});

app.post('/upload', upload.single('jsonfile'), (req, res) => {
  const filePath = path.join(__dirname, req.file.path);
  const raw = fs.readFileSync(filePath, 'utf8');
  jsonData = JSON.parse(raw);
  fs.unlinkSync(filePath); // Borra el archivo subido
  res.redirect('/');
});

app.get('/export-pdf', async (req, res) => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '5mm', bottom: '5mm', left: '5mm', right: '5mm' }
  });
  await browser.close();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=organigrama.pdf');
  res.send(pdfBuffer);
});

app.listen(3000, () => {
  console.log('Servidor en http://localhost:3000');
}); 