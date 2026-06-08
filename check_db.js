const { neon } = require('@neondatabase/serverless');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const sql = neon(process.env.NEXT_PUBLIC_DB_CONNECTION_STRING);

async function check() {
  const result = await sql`SELECT * FROM chapters`;
  console.log("CHAPTERS IN DB:", result);
  const courses = await sql`SELECT * FROM "courseList"`;
  console.log("COURSES IN DB:", courses);
}

check().catch(console.error);
