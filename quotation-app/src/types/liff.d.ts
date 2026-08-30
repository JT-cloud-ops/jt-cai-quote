export {};

declare global {
  interface Window {
    liff?: {
      init(options: { liffId: string }): Promise<unknown>;
      isInClient(): boolean;
    };
  }
}
