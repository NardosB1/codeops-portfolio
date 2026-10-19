const required = ["DATABASE_URL", "SESSION_SECRET"];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) { console.error(`Missing environment variables: ${missing.join(", ")}`); process.exit(1); }
if (Buffer.byteLength(process.env.SESSION_SECRET) < 32) { console.error("SESSION_SECRET must be at least 32 bytes."); process.exit(1); }
console.log("Required environment variables are present.");
