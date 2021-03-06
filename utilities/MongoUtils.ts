import { MongoClient, ObjectID } from "mongodb";

let cachedDb = null;

const uri = process.env.MONGO_URI;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const client = await MongoClient.connect(uri, { useNewUrlParser: true });

  const db = client.db("sotdl");

  cachedDb = db;
  return db;
}

export async function fetchCollection(collectionName: string) {
  try {
    if (uri === undefined) {
      throw "URI is undefined";
    }

    const database = await connectToDatabase();
    const collection = database.collection(collectionName);
    const data = await collection.find({}).toArray();

    return data;
  } catch (e) {
    throw e;
  }
}

export async function insertIntoCollection(
  collectionName: string,
  newDocuments: any
) {
  try {
    if (uri === undefined) {
      throw "URI is undefined";
    }
    if (newDocuments === undefined) {
      throw "newDocuments is undefined";
    }

    const database = await connectToDatabase();
    const collection = database.collection(collectionName);
    await collection.insertMany(newDocuments, { ordered: true });

    return { message: `Sucessfully Added new documents into ${collection}` };
  } catch (e) {
    throw e;
  }
}

export async function updateCollection(
  collectionName: string,
  documentToUpdate: any,
  filter: any
) {
  try {
    if (uri === undefined) {
      throw "URI is undefined";
    }
    if (documentToUpdate === undefined) {
      throw "documentToUpdate is undefined";
    }

    const database = await connectToDatabase();
    const collection = database.collection(collectionName);
    const { _id, ...rest } = documentToUpdate;

    console.log(
      `Attemping to update ${documentToUpdate.name} in ${collectionName}`
    );
    await collection.updateOne(
      filter,
      {
        $set: {
          ...rest,
        },
      },
      {
        upsert: true,
      }
    );

    console.log(
      `Sucessfully updated ${documentToUpdate.name} in ${collectionName}`
    );

    return { message: `Sucessfully updated document in ${collectionName}` };
  } catch (e) {
    throw e;
  }
}
