/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WORLD_ADDRESS: string
  readonly VITE_RPC_URL: string
  readonly VITE_TORII_URL: string
  readonly VITE_TELEGRAM_BOT_TOKEN: string
  readonly VITE_ENV: string
  readonly VITE_NETWORK: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

