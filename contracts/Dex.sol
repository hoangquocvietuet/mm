// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "./interfaces/IUniswapV2Router02.sol";
import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";
import { console } from "forge-std/Test.sol";
import { IWETH } from "./interfaces/IWETH.sol";
import { IUniswapV2Pair } from "./interfaces/IUniswapV2Pair.sol";
contract Dex {
    uint256 public randomNonce = 0;
    mapping(uint256 => uint256) public orders;

    function buy(address _router, address _token, uint256 _amount, bool isAmountIn) internal returns (uint256) {
        IUniswapV2Router02 router = IUniswapV2Router02(_router);
        address[] memory path = new address[](2);
        path[0] = router.WETH();
        path[1] = _token;
        
        if (isAmountIn == true) {
            uint256 amountOut = router.getAmountsOut(_amount, path)[1];
            router.swapExactETHForTokensSupportingFeeOnTransferTokens{value: _amount}(
                amountOut,
                path,
                address(this),
                block.timestamp + 1000
            );
            return amountOut;
        } else {
            uint256 amountIn = router.getAmountsIn(_amount, path)[0];
            console.log("amountIn", amountIn);
            console.log("balance", IERC20(_token).balanceOf(address(this)));
            router.swapExactETHForTokensSupportingFeeOnTransferTokens{value: amountIn}(
                _amount,
                path,
                address(this),
                block.timestamp + 1000
            );
            return _amount;
        }
    }

    function sell(address _router, address _token, uint256 _amount) internal returns (uint256) {
        IUniswapV2Router02 router = IUniswapV2Router02(_router);
        address[] memory path = new address[](2);
        path[0] = _token;
        path[1] = router.WETH();
        
        if (IERC20(_token).balanceOf(address(this)) < _amount) {
            buy(_router, _token, _amount - IERC20(_token).balanceOf(address(this)), false);
        }

        uint256 amountOut = router.getAmountsOut(_amount, path)[1];

        router.swapExactTokensForETHSupportingFeeOnTransferTokens(
            _amount,
            amountOut,
            path,
            address(this),
            block.timestamp + 1000
        );

        return amountOut;
    }

    // TODO: add ownable
    function withdrawToken(address _weth, address _token, uint256 _amount) public {
        if (_token == address(0)) {
            if (_amount > address(this).balance) {
                IWETH(_weth).withdraw(_amount - address(this).balance);
            }
            payable(msg.sender).transfer(_amount);
        } else {
            IERC20(_token).transfer(msg.sender, _amount);
        }
    }

    function volumeEachBuyThenSell(address _router, address _token, uint256 _amountEachLoop, uint256 numLoops) public payable {
        IUniswapV2Router02 router = IUniswapV2Router02(_router);
        IERC20(_token).approve(address(router), type(uint256).max);

        for (uint256 i = 0; i < numLoops; i++) {
            uint256 amountOut = buy(_router, _token, _amountEachLoop, true);
            uint256 amountToSell = sell(_router, _token, amountOut);
        }
    }

    function randomArray(uint256 total, uint256 num) private returns (uint256[] memory) {
        require(num > 0 && total >= num, "Invalid input");

        uint256[] memory result = new uint256[](num);
        uint256 remaining = total;
        uint256 nonce = 0;

        for (uint256 i = 0; i < num - 1; i++) {
            uint256 max = remaining - (num - 1 - i);
            uint256 rand = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, randomNonce))) % max + 1;
            result[i] = rand;
            remaining -= rand;
            randomNonce++;
        }

        // assign the leftover to the last element
        result[num - 1] = remaining;
        return result;
    }

    function randomValue(uint256 low, uint256 high) private returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, randomNonce))) % (high - low + 1) + low;
    }

    function volumeAllBuyThenSell(address _router, address _token, uint256 _totalAmountBuy, uint256 numLoopsBuy, uint256 numLoopsSell) public payable {
        uint256[] memory amountsBuy = randomArray(_totalAmountBuy, numLoopsBuy);
        uint256 totalBuy = 0;
        for (uint256 i = 0; i < numLoopsBuy; i++) {
            totalBuy += buy(_router, _token, amountsBuy[i], true);
        }
        
        uint256[] memory amountsSell = randomArray(totalBuy, numLoopsSell);
        for (uint256 i = 0; i < numLoopsSell; i++) {
            sell(_router, _token, amountsSell[i]);
        }
    }

    function volumeRandomBuyAndSell(address _router, address _token, uint256 _totalAmountBuy, uint256 _numLoopsBuy) public payable {
        uint256[] memory amountsBuy = randomArray(_totalAmountBuy, _numLoopsBuy);
        uint256 totalBuy = 0;
        for (uint256 i = 0; i < _numLoopsBuy; i++) {
            uint256 amountBuy = buy(_router, _token, amountsBuy[i], true);
            totalBuy += amountBuy;
            if (randomValue(0, 1) == 0) {
                uint256 amountSell = randomValue(0, totalBuy);
                sell(_router, _token, amountSell);
                totalBuy -= amountSell;
            }
        }        
        if (totalBuy > 0) {
            sell(_router, _token, totalBuy);
        }
    }

    function getPairAddress(address _router, address tokenA, address tokenB) public pure returns (address pair) {
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        pair = address(uint160(uint(keccak256(abi.encodePacked(
            hex'ff',
            IUniswapV2Router02(_router).factory(),
            keccak256(abi.encodePacked(token0, token1)),
            hex'96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f' // init code hash for PancakeSwap
        )))));
    }

    function sqrt(uint y) internal pure returns (uint z) {
        if (y > 3) {
            z = y;
            uint x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }

    function getCurrentPrice(address _router, address _tokenA, address _tokenB) public payable returns (uint256) {
        IUniswapV2Router02 router = IUniswapV2Router02(_router);
        address pair = getPairAddress(_router, _tokenA, _tokenB);
        (uint256 reserve0, uint256 reserve1,) = IUniswapV2Pair(pair).getReserves();
        if (_tokenB == router.WETH()) {
            return reserve1 * 1e18 / reserve0;
        } else {
            return reserve0 * 1e18 / reserve1;
        }
    }

    function setToPrice(address _router, address _token, uint256 _price, uint256 orderId, uint256 status, uint256 startTime, uint256 endTime) public payable {
        require(orders[orderId] != status, "Order already set");
        require(block.timestamp >= startTime && block.timestamp <= endTime, "Invalid time");
        orders[orderId] = status;
        IUniswapV2Router02 router = IUniswapV2Router02(_router);
        address pair = getPairAddress(_router, router.WETH(), _token);
        (uint256 reserve0, uint256 reserve1,) = IUniswapV2Pair(pair).getReserves();
        uint256 newTokenReserve = sqrt(reserve0 * reserve1 * 1e18 / _price);
        uint256 currentPrice = getCurrentPrice(_router, _token, router.WETH());
        if (currentPrice > _price) {
            uint256 reserveToSell = (router.WETH() < _token) ? newTokenReserve - reserve1 : newTokenReserve - reserve0;
            sell(_router, _token, reserveToSell);
        } else {
            uint256 newNativeReserve = sqrt(reserve0 * reserve1 * _price / 1e18);
            uint256 reserveToBuy = (router.WETH() < _token) ? newNativeReserve - reserve0 : newNativeReserve - reserve1;
            buy(_router, _token, reserveToBuy, true);
        }
        IERC20(_token).approve(address(router), type(uint256).max);
    }

    

    fallback() external payable {}
}
