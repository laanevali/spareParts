const express = require('express')
const app = express()
const port = 3000
const fs = require("fs")

app.get('/spare-parts', (req, res) => {
  const parts = [];
  const page = req.query.page || 1;
  const name = req.query.name;
  const pageRows = 20;
  const lastRowOnPage = page * pageRows;
  const firstRowOnPage = lastRowOnPage - pageRows;

  const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('LE.txt')
  });

  let currentLineNum=1;
  lineReader.on('line', function (line){
    if (currentLineNum>firstRowOnPage&&currentLineNum<=lastRowOnPage) {
      const lineArray= line.split('\t');
      
      const item = {
        seeria: lineArray[0].replace(/^"|"$/g, ''),
        name: lineArray[1].replace(/^"|"$/g, ''),
        hind: lineArray[10].replace(/^"|"$/g, '')
      };

    parts.push(item);
    }
    currentLineNum++;
  }).on('close', function(){
    if (name !== undefined){
      parts=parts.filter(item =>item.name.toLowerCase().includes(name.toLowerCase()))
    }
    
    res.send(parts);
  })
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})