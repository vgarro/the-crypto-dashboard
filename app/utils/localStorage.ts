/**
 * Local Storage utilities for persisting crypto card order
 * Client-side only utilities for managing card order preferences
 */

const CRYPTO_ORDER_KEY = 'crypto-card-order';

export interface CryptoOrderMapping {
  [cryptoId: number]: number;
}

/**
 * Check if we're in a browser environment
 */
const isBrowser = typeof window !== 'undefined';

/**
 * Save crypto card order mapping to localStorage
 */
export function saveCryptoOrder(orderMapping: CryptoOrderMapping): void {
  if (!isBrowser) return;

  try {
    localStorage.setItem(CRYPTO_ORDER_KEY, JSON.stringify(orderMapping));
  } catch (error) {
    console.warn('Failed to save crypto order to localStorage:', error);
  }
}

/**
 * Load crypto card order mapping from localStorage
 */
export function loadCryptoOrder(): CryptoOrderMapping {
  if (!isBrowser) return {};

  try {
    const stored = localStorage.getItem(CRYPTO_ORDER_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.warn('Failed to load crypto order from localStorage:', error);
    return {};
  }
}

/**
 * Clear saved crypto order from localStorage
 */
export function clearCryptoOrder(): void {
  if (!isBrowser) return;

  try {
    localStorage.removeItem(CRYPTO_ORDER_KEY);
  } catch (error) {
    console.warn('Failed to clear crypto order from localStorage:', error);
  }
}

/**
 * Apply saved order to crypto data array
 */
export function applySavedOrder<T extends { id: number; order: number }>(
  cryptoData: T[]
): T[] {
  const savedOrder = loadCryptoOrder();

  // If no saved order, return original data
  if (Object.keys(savedOrder).length === 0) {
    return cryptoData;
  }

  // Apply saved order, fallback to original order for new items
  const reorderedData = cryptoData.map(crypto => ({
    ...crypto,
    order: savedOrder[crypto.id] !== undefined ? savedOrder[crypto.id] : crypto.order
  }));

  // Sort by order field
  return reorderedData.sort((a, b) => a.order - b.order);
}

/**
 * Generate order mapping from current crypto data order
 */
export function generateOrderMapping<T extends { id: number; order: number }>(
  cryptoData: T[]
): CryptoOrderMapping {
  const orderMapping: CryptoOrderMapping = {};

  cryptoData.forEach((crypto, index) => {
    orderMapping[crypto.id] = index;
  });

  return orderMapping;
}