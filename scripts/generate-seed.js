const fs = require('fs');

const epoch1 = JSON.parse(fs.readFileSync('epoch1.json', 'utf8'));
const epoch2 = JSON.parse(fs.readFileSync('epoch2.json', 'utf8'));
const epoch3 = JSON.parse(fs.readFileSync('epoch3.json', 'utf8'));
const epoch4 = JSON.parse(fs.readFileSync('epoch4.json', 'utf8'));

const epoch3Filtered = epoch3.data.filter(p => !p.id.startsWith('jesus'));
const epoch4Filtered = epoch4.data.filter(p => !p.id.startsWith('jesus'));

const nodes = [];
const edges = [];

let currentY = 0;
const Y_GAP = 200;
const CARD_WIDTH_HALF = 150; // Half of 300px
const BRANCH_OFFSET = 160;

function addNode(data, centerX, y) {
  nodes.push({ ...data, x: centerX - CARD_WIDTH_HALF, y });
}

function addEdge(source, target) {
  edges.push({ id: `e-${source}-${target}`, source, target });
}

// Phase 1: Adam to David (Linear Trunk centered at X=0)
const linearLine = [...epoch1.data, ...epoch2.data];
for (let i = 0; i < linearLine.length; i++) {
  const person = linearLine[i];
  addNode(person, 0, currentY);
  if (i > 0) {
    addEdge(linearLine[i-1].id, person.id);
  }
  currentY += Y_GAP;
}

const davidY = currentY - Y_GAP;

// Phase 2: Royal Line
let royalY = davidY + Y_GAP;
let lastRoyalId = 'david';
for (const person of epoch3Filtered) {
  addNode(person, -BRANCH_OFFSET, royalY);
  addEdge(lastRoyalId, person.id);
  lastRoyalId = person.id;
  royalY += Y_GAP;
}
const finalRoyalJosephId = lastRoyalId;

// Phase 3: Biological Line
let biologicalY = davidY + Y_GAP;
let lastBiologicalId = 'david';
for (const person of epoch4Filtered) {
  addNode(person, BRANCH_OFFSET, biologicalY);
  addEdge(lastBiologicalId, person.id);
  lastBiologicalId = person.id;
  biologicalY += Y_GAP;
}
const finalBiologicalJosephId = lastBiologicalId;

// Phase 4: Unified Jesus Node
const maxY = Math.max(royalY, biologicalY);
const jesusNode = {
  id: 'jesus_unified',
  name: 'Jesus Christ',
  title: 'The Messiah, Son of God',
  description: 'The ultimate fulfillment of both the royal and biological lineages of David, the Savior of the world.',
  scripture_reference: 'Matthew 1:16 / Luke 3:23 (NLT)',
  scripture_text: 'Mary gave birth to Jesus, who is called the Messiah.',
  lineage: 'royal',
  epoch: 'the_messiah'
};

addNode(jesusNode, 0, maxY + Y_GAP);
addEdge(finalRoyalJosephId, 'jesus_unified');
addEdge(finalBiologicalJosephId, 'jesus_unified');

// Generate SQL
let sql = `-- Seed file centered around X=0 with 300px cards\n\n`;
nodes.forEach(n => {
  const escape = (str) => str ? str.replace(/'/g, "''") : null;
  sql += `INSERT INTO nodes (id, name, title, description, scripture_reference, scripture_text, lineage, epoch, x, y) VALUES ('${n.id}', '${escape(n.name)}', '${escape(n.title)}', '${escape(n.description)}', '${escape(n.scripture_reference)}', '${escape(n.scripture_text)}', '${n.lineage}', '${n.epoch}', ${n.x}, ${n.y});\n`;
});
edges.forEach(e => {
  sql += `INSERT INTO edges (id, source, target) VALUES ('${e.id}', '${e.source}', '${e.target}');\n`;
});

fs.writeFileSync('seed.sql', sql);
