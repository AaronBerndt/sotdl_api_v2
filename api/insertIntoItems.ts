import { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchCollection, insertIntoCollection } from "../utilities/MongoUtils";

export default async (request: VercelRequest, response: VercelResponse) => {
  try {
    const { documents } = request.body;
    const data = await insertIntoCollection("items", documents);
    response.status(200).send(data);
  } catch (e) {
    response.status(504).send(e);
  }
};
