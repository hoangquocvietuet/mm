import { network } from "hardhat";

const DEX_ROUTER = "0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008";

async function mainnetExample() {
  const { viem } = await network.connect({
    network: "sepolia",
    chainType: "l1",
  });

  const publicClient = await viem.getPublicClient();
  const dexRouterCode = await publicClient.getCode({
    address: DEX_ROUTER,
  });
}

await mainnetExample();
