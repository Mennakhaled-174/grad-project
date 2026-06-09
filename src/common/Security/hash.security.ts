import * as bcrypt from 'bcryptjs';

export const Hash = (
  plainText: string,
  saltRound = Number(process.env.SALT as string),
) => {
  return bcrypt.hashSync(plainText, saltRound);
};

export const compareHash = (
  plainText: string,
  hash: string,
) => {
  return bcrypt.compareSync(plainText, hash);
};