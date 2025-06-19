import axios from "axios";

export const uploadToIPFS = async (
  metadata: object,
  name: string
): Promise<string | null> => {
  const pinataApiKey = import.meta.env.VITE_PINATA_API_KEY;
  const pinataSecretApiKey = import.meta.env.VITE_PINATA_API_KEY_SECRET;

  try {
    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      {
        pinataMetaData: {
          name,
        },
        pinataContent: metadata,
      },
      {
        headers: {
          "Content-Type": "application/json",
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
        },
      }
    );

    console.log("res data...", res.data);

    const ipfsHash = res.data?.IpfsHash || res.data?.ipfsHash;

    if (!ipfsHash) {
      console.error("ipfsHash not found in response", res.data);
      return null;
    }

    return `ipfs://${ipfsHash}`;
  } catch (error) {
    console.error("Upload ipfs failed:", error);
    return null;
  }
};
