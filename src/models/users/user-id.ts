export interface UserId {
  id: string;
  username: string;
  domain: string;
  isValid: boolean;
}

export const makeUserId = (id: string): UserId => {
  const [username, domain] = id
    .replace(/^@/, '')
    .split('@');

  const isValid = !!username && !!domain;

  return {
    id,
    username,
    domain,
    isValid,
  };
};