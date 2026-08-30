const LIFF_ID = '2010201815-z3mfiA3O';

const getLiff = () => typeof window === 'undefined' ? undefined : window.liff;

export const initLiff = (): Promise<unknown> | undefined => getLiff()?.init({ liffId: LIFF_ID });

export const isLiffClient = (): boolean => getLiff()?.isInClient() ?? false;
