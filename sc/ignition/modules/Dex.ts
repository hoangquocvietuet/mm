import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("DexModule", (m) => {
  const dex = m.contract("Dex");

  return { dex };   
});
