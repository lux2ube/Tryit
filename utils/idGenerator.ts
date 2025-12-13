export const generateTransactionId = (prefix: string = 'TRX'): string => {
  // Current timestamp in base 36 (compacts the time)
  const timestamp = Date.now().toString(36).toUpperCase();
  
  // Random segment to ensure uniqueness even if called rapidly
  const randomSegment = Math.random().toString(36).substring(2, 6).toUpperCase();
  
  // Combine formatted string
  return `${prefix}-${timestamp}-${randomSegment}`;
};