// Cryptocurrency icon mapping
export const cryptoIconMap: Record<string, string> = {
  'BTC': 'cryptoIcons/btc.png',
  'BITCOIN': 'cryptoIcons/btc.png',
  'ETH': 'cryptoIcons/eth.png',
  'ETHEREUM': 'cryptoIcons/eth.png',
  'LTC': 'cryptoIcons/ltc.png',
  'LITECOIN': 'cryptoIcons/ltc.png',
  'XRP': 'cryptoIcons/xrp.png',
  'RIPPLE': 'cryptoIcons/xrp.png',
  'ADA': 'cryptoIcons/ada.png',
  'CARDANO': 'cryptoIcons/ada.png',
  'BCH': 'cryptoIcons/bch.png',
  'BITCOIN-CASH': 'cryptoIcons/bch.png',
  'DOT': 'cryptoIcons/dot.png',
  'POLKADOT': 'cryptoIcons/dot.png',
  'BNB': 'cryptoIcons/bnb.png',
  'BINANCE-COIN': 'cryptoIcons/bnb.png',
  'DOGE': 'cryptoIcons/doge.png',
  'DOGECOIN': 'cryptoIcons/doge.png',
  'LINK': 'cryptoIcons/link.png',
  'CHAINLINK': 'cryptoIcons/link.png',
  'USDT': 'cryptoIcons/usdt.png',
  'TETHER': 'cryptoIcons/usdt.png',
};

/**
 * Get the icon path for a cryptocurrency
 * @param symbol - The cryptocurrency symbol (e.g., 'BTC', 'ETH')
 * @param name - The cryptocurrency name (optional fallback)
 * @returns Icon path if available, null if no icon found
 */
export function getCryptoIcon(symbol: string, name?: string): string | null {
  const upperSymbol = symbol.toUpperCase();
  const upperName = name?.toUpperCase().replace(/\s/g, '-');

  // Try symbol first
  if (cryptoIconMap[upperSymbol]) {
    return cryptoIconMap[upperSymbol];
  }

  // Try name as fallback
  if (upperName && cryptoIconMap[upperName]) {
    return cryptoIconMap[upperName];
  }

  return null;
}

/**
 * Component for displaying cryptocurrency icon with fallback
 */
interface CryptoIconProps {
  symbol: string;
  name?: string;
  size?: number;
  className?: string;
}

export function CryptoIcon({ symbol, name, size = 40, className = '' }: CryptoIconProps) {
  const iconPath = getCryptoIcon(symbol, name);

  if (iconPath) {
    return (
      <img
        src={iconPath}
        alt={`${name || symbol} icon`}
        width={size}
        height={size}
        className={`crypto-icon ${className}`}
        onError={(e) => {
          // Fallback to gradient background if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const fallback = target.nextElementSibling as HTMLElement;
          if (fallback) {
            fallback.style.display = 'flex';
          }
        }}
      />
    );
  }

  // Return null if no icon available - parent component should handle fallback
  return null;
}