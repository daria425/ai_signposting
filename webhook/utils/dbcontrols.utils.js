require("dotenv").config({
  path: "/home/vboxuser/repos/ai_signposting/webhook/.env",
});
const { MongoClient } = require("mongodb");
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

async function addLocation(client, location) {
  try {
    await client.connect();
    const db = client.db("signposting_db");
    const collection = db.collection("support_options");
    await collection.updateMany(
      { "Local / National": "Local" },
      { $set: { "location": location } }
    );

    await collection.updateMany(
      { "Local / National": { $ne: "Local" } },
      { $set: { "location": "National" } }
    );

    console.log("Fields updated successfully");
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
}

async function changeFieldToDouble(client, collectionName) {
  try {
    await client.connect();
    const db = client.db("signposting_db");
    const collection = db.collection(collectionName);
    await collection
      .aggregate([
        {
          $addFields: {
            convertedFields: {
              $map: {
                input: { $objectToArray: "$$ROOT" },
                as: "field",
                in: {
                  k: "$$field.k",
                  v: {
                    $cond: {
                      if: { $eq: [{ $type: "$$field.v" }, "decimal"] },
                      then: { $toDouble: "$$field.v" },
                      else: "$$field.v",
                    },
                  },
                },
              },
            },
          },
        },
        {
          $replaceRoot: {
            newRoot: { $arrayToObject: "$convertedFields" },
          },
        },
        {
          $merge: {
            into: collectionName, // replace with your collection name
            whenMatched: "replace",
          },
        },
      ])
      .toArray();
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

async function changeFieldToStr(client, collectionName) {
  try {
    await client.connect();
    const db = client.db("signposting_db");
    const collection = db.collection(collectionName);
    await collection
      .aggregate([
        {
          $addFields: {
            convertedFields: {
              $map: {
                input: { $objectToArray: "$$ROOT" },
                as: "field",
                in: {
                  k: "$$field.k",
                  v: {
                    $cond: {
                      if: { $eq: [{ $type: "$$field.v" }, "int64"] },
                      then: { $toString: "$$field.v" },
                      else: "$$field.v",
                    },
                  },
                },
              },
            },
          },
        },
        {
          $replaceRoot: {
            newRoot: { $arrayToObject: "$convertedFields" },
          },
        },
        {
          $merge: {
            into: collectionName, // replace with your collection name
            whenMatched: "replace",
          },
        },
      ])
      .toArray();
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

async function addField(client, dbName, collectionName, fieldToAdd) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    await collection.updateMany(
      {},
      {
        "$set": fieldToAdd,
      }
    );
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

async function addFlows(client, organizationNumber, flowNames) {
  try {
    await client.connect();
    const db = client.db("controlRoomDB");
    const organizationCollection = db.collection("organizations");
    const flowsCollection = db.collection("flows");
    const flows = await flowsCollection
      .find({ name: { $in: flowNames } })
      .toArray();
    console.log(flows);
    const flowIds = flows.map((flow) => flow._id);
    await organizationCollection.findOneAndUpdate(
      { organizationPhoneNumber: organizationNumber },
      {
        $set: {
          enabledFlowIds: flowIds,
        },
      }
    );
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}
