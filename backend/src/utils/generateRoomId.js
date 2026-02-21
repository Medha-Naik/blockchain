/**
 * Generate a unique 4-digit room ID
 */
export function generateRoomId() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

/**
 * Generate a cryptographically secure room ID
 */
export function generateSecureRoomId() {
  const crypto = await import('crypto');
  const buffer = crypto.randomBytes(2);
  const number = buffer.readUInt16BE(0);
  return (1000 + (number % 9000)).toString();
}

export default {
  generateRoomId,
  generateSecureRoomId
};
