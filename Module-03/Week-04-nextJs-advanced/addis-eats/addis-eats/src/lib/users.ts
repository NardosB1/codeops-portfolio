import "server-only";
import bcrypt from "bcryptjs";

export type Role = "customer" | "staff";

export type User = {
  id: string;
  name: string;
  phone: string;
  role: Role;
  passwordHash: string;
};

// Cost 10 = 2^10 rounds. Slow on purpose.
const hash = (password: string) => bcrypt.hashSync(password, 10);

// Seeded demo users. In a real app these rows live in a database, and
// the hash is created at sign-up, not at startup.
const users: User[] = [
  { id: "usr_1", name: "Almaz", phone: "0911000001", role: "customer", passwordHash: hash("addis2026") },
  { id: "usr_2", name: "Dawit", phone: "0911000002", role: "customer", passwordHash: hash("addis2026") },
  { id: "usr_3", name: "Selam", phone: "0911000003", role: "staff", passwordHash: hash("addis2026") },
];

// Compared against when the phone number doesn't exist, so "no such user"
// takes as long as "wrong password" and can't be told apart by timing.
export const DUMMY_HASH = hash("a-password-nobody-has");

export function findUserByPhone(phone: string): User | null {
  return users.find((u) => u.phone === phone) ?? null;
}

export function findUserById(id: string): User | null {
  return users.find((u) => u.id === id) ?? null;
}