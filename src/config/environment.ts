const isDevelopment =
  typeof window !== 'undefined'
    ? window.location.hostname === 'localhost'
    : process.env.NODE_ENV === 'development';

export const config = {
  bridgeWsUrl:
    process.env.NEXT_PUBLIC_BRIDGE_WS_URL ||
    (isDevelopment ? 'ws://localhost:3002' : 'wss://bridge.sector1.ai'),
  bridgeHttpUrl:
    process.env.NEXT_PUBLIC_BRIDGE_HTTP_URL ||
    (isDevelopment ? 'http://localhost:3002' : 'https://bridge.sector1.ai'),
  pingIntervalMs: 20_000,
  reconnectBaseMs: 2_000,
  reconnectMaxMs: 30_000,
};
