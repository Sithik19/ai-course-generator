const { neon } = require('@neondatabase/serverless');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const sql = neon(process.env.NEXT_PUBLIC_DB_CONNECTION_STRING);

async function check() {
  const courseId = '84859983-d7fb-403d-bd5b-d538fdd2109f';
  const result = await sql`
    SELECT "courseOutput"->'chapters' as chapters
    FROM "courseList"
    WHERE "courseId" = ${courseId}
  `;
  console.log("CHAPTERS IN COURSE OUTPUT:", JSON.stringify(result[0].chapters, null, 2));
}

check().catch(console.error);
