import { network } from "hardhat";
import { encodeFunctionData, parseEther } from "viem";
import dexAbi from "../artifacts/contracts/Dex.sol/Dex.json"
import routerAbi from "../artifacts/contracts/interfaces/IUniswapV2Router02.sol/IUniswapV2Router02.json"
import tokenAbi from "../artifacts/contracts/Token.sol/Token.json"
import wethAbi from "../artifacts/contracts/interfaces/WETH.sol/WETH9.json"
const DEX = "0xD6F84Aa8d1b989a33279D09816c66F71232991e3";

async function wethToETH() {
  const { viem } = await network.connect({
    network: "sepolia",
    chainType: "l1",
  });

  const publicClient = await viem.getPublicClient();
  const [senderClient] = await viem.getWalletClients();
  const calldata = encodeFunctionData({
    abi: wethAbi.abi,
    functionName: 'withdraw',
    args: [await publicClient.readContract({
      address: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
      abi: wethAbi.abi,
      functionName: 'balanceOf',
      args: [senderClient.account.address]
    })]
  });

  const txHash = await senderClient.sendTransaction({
    to: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
    data: calldata,
    account: senderClient.account.address
  });

  const tx = await publicClient.waitForTransactionReceipt({ hash: txHash });

  console.log(tx.transactionHash);
}

async function swap() {
  await wethToETH();

  const { viem } = await network.connect({
    network: "sepolia",
    chainType: "l1",
  });

  const publicClient = await viem.getPublicClient();
  const [senderClient] = await viem.getWalletClients();

  const calldata = encodeFunctionData({
    abi: dexAbi.abi,
    functionName: 'swap',
    args: ["0xe4646147e52e914144f6010a736ffe019b549f94"]
  });  

  const txHash = await senderClient.sendTransaction({
    to: DEX,
    data: calldata,
    value: parseEther("0.065"),
    account: senderClient.account.address
  });

  console.log("Sending transaction... waiting for receipt...");

  const tx = await publicClient.waitForTransactionReceipt({ hash: txHash });

  console.log(tx.transactionHash);
}

async function removeLiquidity() {
  const { viem } = await network.connect({
    network: "sepolia",
    chainType: "l1",
  });

  const publicClient = await viem.getPublicClient();
  const [senderClient] = await viem.getWalletClients();

  // approve the router to spend the token
  const approveCalldata = encodeFunctionData({
    abi: tokenAbi.abi,
    functionName: 'approve',
    args: ["0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008", 49999999999999000n]
  });

  const approveTxHash = await senderClient.sendTransaction({
    to: "0xeD923CD79d534594aD57976445BE575A8ba15791",
    data: approveCalldata,
    account: senderClient.account.address
  });

  const approveTx = await publicClient.waitForTransactionReceipt({ hash: approveTxHash });

  console.log(approveTx.transactionHash);
  

  const calldata = encodeFunctionData({
    abi: routerAbi.abi,
    functionName: 'removeLiquidityETH',
    args: [
      "0xea2dc259e363676b42402798de76c1b1b6a3f752", 
      49999999999999000n, 
      0, 
      0, 
      senderClient.account.address,
      Math.floor(Date.now() / 1000) + 1000
    ]
  });

  const txHash = await senderClient.sendTransaction({
    to: "0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008",
    data: calldata, 
    account: senderClient.account.address
  });

  console.log("Sending transaction... waiting for receipt...");

  const tx = await publicClient.waitForTransactionReceipt({ hash: txHash });

}

async function addLiquidity() {
  const { viem } = await network.connect({
    network: "sepolia",
    chainType: "l1",
  });

  const publicClient = await viem.getPublicClient();
  const [senderClient] = await viem.getWalletClients();

  // approve the router to spend the token
  const approveCalldata = encodeFunctionData({
    abi: tokenAbi.abi,
    functionName: 'approve',
    args: ["0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008", parseEther("0.05")]
  });

  const approveTxHash = await senderClient.sendTransaction({
    to: "0xea2DC259e363676b42402798De76C1b1b6A3F752",
    data: approveCalldata,
    account: senderClient.account.address
  });

  const approveTx = await publicClient.waitForTransactionReceipt({ hash: approveTxHash });

  console.log(approveTx.transactionHash);

  const calldata = encodeFunctionData({
    abi: routerAbi.abi,
    functionName: 'addLiquidityETH',
    args: [
      "0xea2DC259e363676b42402798De76C1b1b6A3F752",
      parseEther("0.05"),
      0,
      0,
      senderClient.account.address,
      Math.floor(Date.now() / 1000) + 1000
    ],
  });

  const txHash = await senderClient.sendTransaction({
    to: "0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008",
    data: calldata,
    value: parseEther("0.05"),
    account: senderClient.account.address
  });

  console.log("Sending transaction... waiting for receipt...");

  const tx = await publicClient.waitForTransactionReceipt({ hash: txHash });

  console.log(tx.transactionHash);
}

// await addLiquidity();

await swap();

// await removeLiquidity();
