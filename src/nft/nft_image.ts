import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import wallet from "../../devnet-wallet.json";
import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { readFile } from "fs/promises";

const umi = createUmi(process.env.RPC_URL ?? "https://api.devnet.solana.com");
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(
  irysUploader({
    address: process.env.IRYS_UPLOAD_URL ?? "https://devnet.irys.xyz/",
  }),
);

umi.use(signerIdentity(signer));

(async () => {
  try {
    const image = await readFile("./habdams.jpg");
    const file = createGenericFile(image, "Happy man", {
      contentType: "image/jpeg",
    });

    const [myUri] = await umi.uploader.upload([file]);
    console.log(`Image url is: ${myUri}`);
  } catch (error) {
    console.log(error);
  }
})();
