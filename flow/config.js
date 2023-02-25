import { config } from "@onflow/fcl";

config({
    "accessNode.api": "https://rest-testnet.onflow.org", // Mainnet: "https://rest-mainnet.onflow.org"
    "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn", // Mainnet: "https://fcl-discovery.onflow.org/authn"
    // "app.detail.icon": "https://cdn.discordapp.com/attachments/941095160517894185/1077244247746564126/logo_1.png",
    "app.detail.title": "PayUp",
    "0xPay-Up": "0xea3d5a66653f8acf",
    "0xView": "0xb7874805d6872be3",
    "0xNonFungibleToken": "0x631e88ae7f1d7c20",
    "0xFungibleToken": "0x9a0766d93b6608b7",
    "0xFUSD": "0xe223d8a629e49c68"
})