/*
Migration script: assign _id to MaterialAvailable subdocuments that lack _id
Usage:
  DB_URL='mongodb://user:pass@host:port' node scripts/migrate-add-material-ids.js

Caution: Run against a backup or a staging DB first.
*/

const { MongoClient, ObjectId } = require('mongodb');

async function run() {
  const url = process.env.DB_URL;
  if (!url) {
    console.error('Please set DB_URL environment variable');
    process.exit(1);
  }

  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const db = client.db('realEstate');
    const coll = db.collection('projects');

    const cursor = coll.find({}, { projection: { MaterialAvailable: 1 } });
    let updated = 0;
    let checked = 0;

    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      checked++;
      const mat = doc.MaterialAvailable;
      if (!Array.isArray(mat) || mat.length === 0) continue;

      let changed = false;
      const newArr = mat.map(item => {
        // If _id is missing or null/undefined, assign a new ObjectId
        if (!item || item._id === undefined || item._id === null) {
          changed = true;
          return { ...item, _id: new ObjectId() };
        }
        return item;
      });

      if (changed) {
        await coll.updateOne({ _id: doc._id }, { $set: { MaterialAvailable: newArr } });
        updated++;
        console.log('Updated project', String(doc._id));
      }
    }

    console.log('Done. Checked:', checked, 'Updated:', updated);
  } catch (err) {
    console.error('Migration error:', err);
    process.exitCode = 2;
  } finally {
    await client.close();
  }
}

run();
