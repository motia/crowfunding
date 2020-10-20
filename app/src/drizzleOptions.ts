import {IDrizzleOptions} from '@drizzle/store';
import Manager from './web3/contracts/Manager.json';

export default {
    web3: {
        fallback: {
            type: "ws",
            url: 'ws://localhost:9545'
        }
    },
    contracts: [Manager as any]
} as IDrizzleOptions;
