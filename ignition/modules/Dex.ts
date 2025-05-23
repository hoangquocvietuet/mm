import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("DexModule", (m) => {
  const dex = m.contract("Dex", [
    "0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3"
  ]);

  return { dex };   
});
