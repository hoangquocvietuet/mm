// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import { Counter } from "./Counter.sol";
import { Test } from "forge-std/Test.sol";
import { Dex } from "./Dex.sol";
import { IUniswapV2Router02 } from "./interfaces/IUniswapV2Router02.sol";
import { IERC20 } from "@openzeppelin/contracts/interfaces/IERC20.sol";
import { console } from "forge-std/Test.sol";
import { Token } from "./Token.sol";

// Solidity tests are compatible with foundry, so they
// use the same syntax and offer the same functionality.

contract DexTest is Test {
    Dex dex;
    Token token;
    IUniswapV2Router02 router = IUniswapV2Router02(0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3);
    address public userAddress = address(makeAddr("user"));
                           

    function setUp() public {
        vm.deal(userAddress, 200 ether);

        dex = new Dex();

        vm.prank(userAddress);
        token = new Token("TestToken", "TT", 1000);

        require(IERC20(address(token)).balanceOf(userAddress) == 1000 ether, "Token balance is not 1000 ether");

        vm.prank(userAddress);
        token.approve(address(router), 100 ether);

        vm.prank(userAddress);
        router.addLiquidityETH{value: 100 ether}(
            address(token),
            100 ether,
            0,
            0,
            userAddress,
            block.timestamp + 1000
        );
    }

    function test_setToPrice() public {
        uint256 getCurrentPrice = dex.getCurrentPrice(address(router), address(token), router.WETH());

        vm.prank(userAddress);
        dex.setToPrice{value: 100 ether}(address(router), address(token), getCurrentPrice * 2, 1, 1, block.timestamp, block.timestamp + 1000);

        uint256 newPrice = dex.getCurrentPrice(address(router), address(token), router.WETH());
        console.log("new price", newPrice);

        vm.prank(userAddress);
        dex.setToPrice(address(router), address(token), newPrice / 2, 1, 2, block.timestamp, block.timestamp + 1000);

        uint256 newPrice2 = dex.getCurrentPrice(address(router), address(token), router.WETH());
        console.log("new price 2", newPrice2);
    }

    // function test_addLiquidity() public {
    //     vm.deal(user, 1 ether);
    //     vm.prank(user);
    //     IUniswapV2Router02(address(0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008)).addLiquidityETH{value: 0.05 ether}(
    //         address(0xF75E51EF7DBc302044eaC29B3b428DdC6b4FE4e6),
    //         0.05 ether,
    //         0,
    //         0,
    //         user,
    //         block.timestamp + 1000
    //     );
    // }

    // function test_removeLiquidity() public {
    //     vm.prank(user);
    //     IERC20(address(0x5464EcebF895fA0CFA4667F63032BD5A5c4aA74c)).approve(address(0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008), 49999999999999000);

    //     vm.prank(user);
    //     IUniswapV2Router02(address(0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008)).removeLiquidityETH(
    //         address(0x7c1937ca21F39Fbf8F8a5B736aC16c0222a51D69),
    //         49999999999999000,
    //         0,
    //         0,
    //         user,
    //         block.timestamp + 1000
    //     );
    // }
    
}