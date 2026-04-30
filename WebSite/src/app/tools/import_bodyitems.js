#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');

function parseMaybeJs(content) {
  // try JSON first
  try {
    return JSON.parse(content);
  } catch (e) {
    // fallback: evaluate as JS (the file appears to be JS-style object/array)
    // This uses Function() to evaluate in a safe-ish local scope.
    // Only run on trusted files.
    return Function('return ' + content)();
  }
}

async function main() {
  const argv = process.argv.slice(2);
  const fileArg = argv[0] || 'src/app/tools/BodyItems.json';
  const filePath = path.resolve(fileArg);
  const mongoUri = process.env.MONGO_URI || argv[1];
  const dbName = argv[2] || 'DB';
  const collName = argv[3] || 'bodyItem';
  const writeBack = argv.includes('--write');

  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    process.exit(2);
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  let items;
  try {
    items = parseMaybeJs(raw);
  } catch (err) {
    console.error('Failed to parse file as JSON or JS:', err.message);
    process.exit(3);
  }

  if (!Array.isArray(items)) {
    console.error('Parsed value is not an array. Aborting.');
    process.exit(4);
  }

  // Ensure each item has an id; generate ObjectId hex strings where missing
  for (const it of items) {
    if (!it.hasOwnProperty('id') || it.id === null || String(it.id).trim() === '') {
      const oid = new ObjectId();
      it.id = oid.toHexString();
      // also set _id for Mongo insertion convenience
      it._id = oid;
    } else {
      // try to use existing id as ObjectId, otherwise create new _id
      try {
        it._id = new ObjectId(String(it.id));
      } catch (e) {
        it._id = new ObjectId();
      }
    }
  }

  const updatedPath = filePath.replace(/\.json$/i, '.withIds.json');
  fs.writeFileSync(updatedPath, JSON.stringify(items, null, 2), 'utf8');
  console.log('Wrote updated file with ids to', updatedPath);

  if (!mongoUri) {
    console.log('No MongoDB URI provided. To insert into MongoDB, pass the URI as the second arg or set MONGO_URI env var.');
    console.log('Example: MONGO_URI="mongodb://user:pass@host:27017" node import_bodyitems.js', filePath, '"myDb" "bodyItem" --write');
    process.exit(0);
  }

  // connect and insert
  const client = new MongoClient(mongoUri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const coll = db.collection(collName);

    // Convert items to documents for insert: ensure _id is ObjectId
    const docs = items.map(it => {
      const copy = Object.assign({}, it);
      // keep both id (hex string) and _id:ObjectId
      if (!copy._id) copy._id = new ObjectId();
      return copy;
    });

    const res = await coll.insertMany(docs, { ordered: false });
    console.log(`Inserted ${res.insertedCount} documents into ${dbName}.${collName}`);

    if (writeBack) {
      // overwrite original file with items (but keep .json extension)
      fs.writeFileSync(filePath, JSON.stringify(items, null, 2), 'utf8');
      console.log('Overwrote original file with generated ids:', filePath);
    }
  } catch (err) {
    console.error('Mongo error:', err.message);
    process.exit(5);
  } finally {
    await client.close();
  }
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(99);
});
