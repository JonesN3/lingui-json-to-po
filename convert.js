var fs = require('fs');

const args = require('minimist')(process.argv.slice(2));

const language = args['lang'];
const inputFile = args['file'];

const data = fs.readFileSync(inputFile, 'utf8');
const json = JSON.parse(data);

const file = fs.createWriteStream(`${language}.po`);

const writePoArrayToFile = poArray => {
  writeHeaderData();
  poArray.forEach(writeTranslationEntry);
  file.end('');
};

const writeHeaderData = () => {
  file.write(`msgid ""\n`);
  file.write(`msgstr ""\n`);
  file.write(`"POT-Creation-Date: 2019-08-01 16:07+0200\\n"\n`);
  file.write(`"Mime-Version: 1.0\\n"\n`);
  file.write(`"Content-Type: text/plain; charset=utf-8\\n"\n`);
  file.write(`"Content-Transfer-Encoding: 8bit\\n"\n`);
  file.write(`"X-Generator: @lingui/cli\\n"\n`);
  file.write(`"Language: ${language}\\n"\n`);
  file.write(`\n`);
};

const writeTranslationEntry = trans => {
  trans.origins.forEach(writeOriginToFile);
  file.write(`msgid "${trans.msgid}"\n`);
  file.write(`msgstr "${trans.msgstr}"\n`);
  file.write('\n');
};

const writeOriginToFile = origin => {
  file.write(`#: ${origin}\n`);
};

let array = [];

for (let [key, value] of Object.entries(json)) {
  const origins = value.origin.map(o => o[0] + ':' + o[1]);
  const posObject = { msgid: key, msgstr: value.translation, origins };
  array.push(posObject);
}

writePoArrayToFile(array);

console.log('finish');
