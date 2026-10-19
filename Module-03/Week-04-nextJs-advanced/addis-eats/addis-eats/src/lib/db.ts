import "server-only";
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is missing. Copy .env.example to .env.local and configure Neon.");
export const sql = neon(url);
