export function generateEmail(): string {
  return `test_${Date.now()}@test.com`;
}

export function generatePassword(): string {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghjkmnpqrstuvwxyz';
  const digits = '23456789';
  const special = '!@#$';
  const all = upper + lower + digits + special;
  const rand = (s: string) => s[Math.floor(Math.random() * s.length)];
  const body = Array.from({ length: 8 }, () => rand(all)).join('');
  return rand(upper) + rand(lower) + rand(digits) + rand(special) + body;
}
