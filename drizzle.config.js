import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  schema: "./configs/schema.jsx",
  out: "./drizzle",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_cdW6XuO7zZFj@ep-damp-morning-ahuen9zk.c-3.us-east-1.aws.neon.tech/AI_Course_Generator?sslmode=require&channel_binding=require",
  }
});
