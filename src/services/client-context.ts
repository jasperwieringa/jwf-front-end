import { createContext } from '@lit/context';
import { JwfClient } from './JwfClient.ts';
export type { JwfClient } from './JwfClient.ts';
export const clientContext = createContext<JwfClient>('client');
