import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import wallet from "../../devnet-wallet.json";
import {
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

const umi = createUmi("https://api.devnet.solana.com");
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(
  irysUploader({
    address: "https://devnet.irys.xyz/",
  }),
);

umi.use(signerIdentity(signer));

(async () => {
  try {
    const image =
      "https://gateway.irys.xyz/5YYbPcHk99AyFUrtjHHWd7YuGsAobT2yExvMYoQV425s";
    const metadata = {
      name: "Happy Teejay",
      description: "A rare portrait of a happy Teejay",
      image,
      attributes: [{ triat_type: "Rarity", value: "Legendary" }],
      properties: {
        files: [
          {
            type: "image/jpeg",
            uri: image,
          },
        ],
        category: "image",
      },
    };

    const myUri = await umi.uploader.uploadJson(metadata);
    console.log(`metadata URI: ${myUri}`);
  } catch (error) {
    console.log(error);
  }
})();
