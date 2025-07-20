![banner](https://github.com/iotaledger/notarization/raw/HEAD/.github/notarization.svg)

## IOTA Notarization Examples

The following code examples demonstrate how to use the IOTA Notarization Wasm bindings in JavaScript/TypeScript.

The examples are written in TypeScript and can be run with Node.js.

### Prerequisites

Examples can be run against

- a local IOTA node
- or an existing network, e.g. the IOTA testnet

When setting up the local node, you'll also need to publish a notarization package as described in
[Local Network Setup](https://docs.iota.org/developer/iota-notarization/getting-started/local-network-setup) in the documentation portal.
You'll also need to provide an environment variable `IOTA_NOTARIZATION_PKG_ID` set to the package-id of your locally deployed
notarization package, to be able to run the examples against the local node.

In case of running the examples against an existing network, this network needs to have a faucet to fund your accounts (the IOTA testnet (`https://api.testnet.iota.cafe`) supports this), and you need to specify this via `NETWORK_URL`.

The examples require you to have the node you want to use in the iota clients "envs" (`iota client env`) configuration. If this node is configured as `localnet`, you don't have to provide it when running the examples, if not, provide its name as `NETWORK_NAME_FAUCET`. The table below assumes - in case you're running a local node - you have it configured as `localnet` in your IOTA clients "env" setting.

### Environment variables

Summarizing the last point, you'll need one or more of the following environment variables:

| Name                     | Required for local node | Required for testnet | Required for other node |       Comment        |
| ------------------------ | :---------------------: | :------------------: | :---------------------: | :------------------: |
| IOTA_NOTARIZATION_PKG_ID |            x            |                      |            x            |                      |
| NETWORK_URL              |                         |          x           |            x            |                      |
| NETWORK_NAME_FAUCET      |                         |          x           |            x            | see assumption above |

### Node.js

Install the dependencies:

```bash
npm install
```

Build the bindings:

```bash
npm run build
```

Then, run an example using the following command, environment variables depend on your setup, see [Environment variables](#environment-variables).

```bash
IOTA_NOTARIZATION_PKG_ID=0x84e8d715fbb210eb4b9ef8126ea3cd4c3d50c6826eb2a13da8105ec9e3e34979 npm run example:node -- <example-name>
```

For instance, to run the `0_create_did` example with the following (environment variables depend on you setup, see [Environment variables](#environment-variables)):

```bash
IOTA_NOTARIZATION_PKG_ID=0x84e8d715fbb210eb4b9ef8126ea3cd4c3d50c6826eb2a13da8105ec9e3e34979 npm run example:node -- 0_create_did
```

cd /Users/maharajababu/Desktop/notarization/bindings/wasm/notarization_wasm && IOTA_NOTARIZATION_PKG_ID=0x84e8d715fbb210eb4b9ef8126ea3cd4c3d50c6826eb2a13da8105ec9e3e34979 npm run example:node -- 01_create_locked

## Basic Examples

The following examples are available:

| Name                                                                                                                                                            | Information                                                                                           |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------- |
| [01_create_locked](https://github.com/iotaledger/notarization/tree/main/bindings/wasm/notarization_wasm/examples/src/01_create_locked.ts)                       | Demonstrates how to create a a new locked notarization.                                               |
| [02_create_dynamic](https://github.com/iotaledger/notarization/tree/main/bindings/wasm/notarization_wasm/examples/src/02_create_dynamic.ts)                     | Demonstrates how to create a a new dynamic notarization.                                              |
| [03_update_dynamic](https://github.com/iotaledger/notarization/tree/main/bindings/wasm/notarization_wasm/examples/src/03_update_dynamic.ts)                     | Demonstrates how to update a dynamic notarization.                                                    |
| [04_destroy_notarization](https://github.com/iotaledger/notarization/tree/main/bindings/wasm/notarization_wasm/examples/src/04_destroy_notarization.ts)         | Demonstrates how to destroy a Notarization.                                                           |
| [05_update_state](https://github.com/iotaledger/notarization/tree/main/bindings/wasm/notarization_wasm/examples/src/05_update_state.ts)                         | Demonstrates how to update the state of a Notarization.                                               |
| [06_update_metadata](https://github.com/iotaledger/notarization/tree/main/bindings/wasm/notarization_wasm/examples/src/06_update_metadata.ts)                   | Demonstrates how to update the metadata of a Notarization.                                            |
| [07_transfer_notarization](https://github.com/iotaledger/notarization/tree/main/bindings/wasm/notarization_wasm/examples/src/07_transfer_notarization.ts)       | Demonstrates how to transfer a dynamic Notarization and transferring a locked Notarization will fail. |
| [08_access_read_only_methods](https://github.com/iotaledger/notarization/tree/main/bindings/wasm/notarization_wasm/examples/src/08_access_read_only_methods.ts) | Demonstrates read-only methods for notarization inspection.                                           |

<!--

## Browser

While the examples should work in a browser environment, we do not provide browser examples yet.

-->
