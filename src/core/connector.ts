import type { ConnectorUserOptions, ConnectorOptions } from "../types";
import Providers from "../providers/";
import LocalStorage from "../helpers/localStorage";
import { BaseProvider } from "./BaseProvider";

export class Connector {
    public options: ConnectorOptions;
    public providers: BaseProvider[];
    public localStorage: LocalStorage;

    constructor(
        options: ConnectorOptions,
        providers: BaseProvider[],
        localStorage: LocalStorage
    ) {
        this.options = options;
        this.providers = providers;
        this.localStorage = localStorage;
    }

    static init(
        userOptions: ConnectorUserOptions,
        userProviders = Object.values(Providers)
    ): Connector {
        const localStorage = new LocalStorage();
        const options = Connector.initOptions(userOptions);
        const providers = Connector.initProviders(
            options,
            userProviders,
            localStorage
        );
        return new Connector(options, providers, localStorage);
    }

    private static initOptions(
        options: ConnectorUserOptions
    ): ConnectorOptions {
        return {
            appName: options.appName,
            appLogoUrl: options.appLogoUrl || undefined,
            networkName: options.networkName || "",
            chainId: options.chainId || 1,
            rpcUri: options.rpcUri || undefined,
            webUri: options.webUri || undefined,
            xsUri: options.xsUri || undefined,
            infuraId: options.infuraId, // required
            infuraRpcUri:
                options.infuraRpcUri ||
                `https://mainnet.infura.io/v3/${options.infuraId}`,
            authereum: {
                ...options.authereum,
                key: options.authereum?.key || "",
            },
            fortmatic: {
                key: options.fortmatic?.key || "",
            },
            walletconnect: {
                bridge:
                    options.walletconnect?.bridge ||
                    "https://bridge.walletconnect.org",
                qrcode: options.walletconnect?.qrcode || true,
                qrcodeModalOptions:
                    options.walletconnect?.qrcodeModalOptions || undefined,
                rpc: options.walletconnect?.rpc
            },
            walletlink: {
                darkMode: options.walletlink?.darkMode || false,
            },
        };
    }

    private static initProviders(
        options: ConnectorOptions,
        providers: BaseProvider[],
        localStorage: LocalStorage
    ): BaseProvider[] {
        return Object.values(providers).map((provider) =>
            provider.init(options, localStorage)
        );
    }
}
