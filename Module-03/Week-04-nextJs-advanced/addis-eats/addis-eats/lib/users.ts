import "server-only";
import { compare, hash } from "bcryptjs";

export type Role = "customer" | "staff";
export type User = { id: string; name: string; phone: string; role: Role };

// Seeded demo accounts (course decision: no real database). All share DEMO_PASSWORD.
const USERS: readonly User[] = [
  { id: "usr_1", name: "Almaz", phone: "0911000001", role: "customer" },
  { id: "usr_2", name: "Dawit", phone: "0911000002", role: "customer" },
  { id: "usr_3", name: "Selam", phone: "0911000003", role: "staff" },
];

const DEMO_PASSWORD = "addis2026";
const BCRYPT_COST = 10;

type Credentials = { byId: Map<string, string>; dummy: string };
let credentials: Promise<Credentials> | undefined;

// Hashes are built once per server instance, on first sign-in, so routes that
// only read the session do not pay the bcrypt cost on a cold start.
function loadCredentials(): Promise<Credentials> {
  credentials ??= (async () => {
    const entries = await Promise.all(
      USERS.map(async (u) => [u.id, await hash(DEMO_PASSWORD, BCRYPT_COST)] as const),
    );
    return { byId: new Map(entries), dummy: await hash("not-a-real-password", BCRYPT_COST) };
  })();
  return credentials;
}

export function findUserById(id: string): User | null {
  return USERS.find((u) => u.id === id) ?? null;
}

// Always runs exactly one bcrypt compare, even for an unknown phone number, so
// response time does not reveal which phone numbers have accounts.
export async function authenticate(phone: string, password: string): Promise<User | null> {
  const creds = await loadCredentials();
  const user = USERS.find((u) => u.phone === phone) ?? null;
  const passwordOk = await compare(password, (user && creds.byId.get(user.id)) ?? creds.dummy);
  return user && passwordOk ? user : null;
}
