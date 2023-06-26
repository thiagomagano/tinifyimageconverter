const tinify = require("tinify");

require('dotenv').config()

const fs = require('fs');
const path = require('path');

const API_KEY = process.env.TINIFY_API_KEY;

tinify.key = API_KEY;

const folderPath = process.argv[2] || '.';

// Cria a nova pasta "imagens convertidas" se ela não existir
const outputFolderPath = path.join(folderPath, 'imagens_convertidas');
if (!fs.existsSync(outputFolderPath)) {
  fs.mkdirSync(outputFolderPath);
}

fs.readdir(folderPath, (err, files) => {
  if (err) throw err;

  // Itera sobre cada arquivo
  files.forEach((file) => {
    // Verifica se o arquivo é uma imagem (opcional)
    if (file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')) {
      const filePath = path.join(folderPath, file);

      // Carrega a imagem local e comprime usando a API Tinify
      const source = tinify.fromFile(filePath);
      const resized = source.resize({
        method: "fit",
        width: 1600,
        height: 1200
      });
      const converted = resized.convert({ type: ["image/webp"] });
      const outputFilePath = path.join(outputFolderPath, `compressed_${file.replace(/\.[^/.]+$/, "")}.webp`);

      converted.toFile(outputFilePath, (err) => {
        if (err) throw err;
        console.log(`Imagem convertida com sucesso! O arquivo comprimido foi salvo como ${outputFilePath}`);
      });
    }
  });
});