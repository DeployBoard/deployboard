import fs from "fs-extra";
import path from "path";
import { graphql } from "graphql";
import { introspectionQuery, printSchema } from "graphql/utilities";

import Schema from "../schemas/index";

async function buildSchema() {
  console.log(`Ensuring schema files exists in ${__dirname}/../data/`);
  await fs.ensureFile(`${__dirname}/../data/schema.graphql.json`);
  await fs.ensureFile(`${__dirname}/../data/schema.graphql`);

  fs.writeFileSync(
    path.join(__dirname, "../data/schema.graphql.json"),
    JSON.stringify(await graphql(Schema, introspectionQuery), null, 2)
  );

  fs.writeFileSync(
    path.join(__dirname, "../data/schema.graphql"),
    printSchema(Schema)
  );
}
async function run() {
  await buildSchema();
  console.log("Schema build complete!");
}

run().catch((e) => {
  console.log(e);
  process.exit(0);
});
