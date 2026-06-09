export type Role = "admin" | "staff";

export function validateCredentials(username: string, password: string): Role | null {
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return "admin";
  }
  if (
    username === process.env.STAFF_USERNAME &&
    password === process.env.STAFF_PASSWORD
  ) {
    return "staff";
  }
  return null;
}
