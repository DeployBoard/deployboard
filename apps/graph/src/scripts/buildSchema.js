import fs from "fs-extra";
import path from "path";
import { graphql } from "graphql";
import { introspectionQuery, printSchema } from "graphql/utilities";

import Schema from "../schemas/index";

async function buildSchema() {
  console.log(`Ensuring schema files exist in ${__dirname}/../data/`);
  await fs.ensureFile(`${__dirname}/../data/schema.graphql.json`);
  await fs.ensureFile(`${__dirname}/../data/schema.graphql`);

  console.log("Files exist, running introspection query...");

  fs.writeFileSync(
    path.join(__dirname, "../data/schema.graphql.json"),
    JSON.stringify(
      await graphql({ schema: Schema, source: introspectionQuery }),
      null,
      2
    )
  );

  console.log("Introspection query complete, writing schema to file...");

  fs.writeFileSync(
    path.join(__dirname, "../data/schema.graphql"),
    printSchema(Schema)
  );

  console.log("Schema written to file, build complete!");
}
async function run() {
  await buildSchema();
  console.log("Schema build complete!");
}

run().catch((e) => {
  console.log(e);
  process.exit(0);
});
