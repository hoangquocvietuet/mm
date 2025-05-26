import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { IUniswapV2Router02 } from "./interfaces/IUniswapV2Router02.sol";
contract Token is ERC20 {
    constructor(string memory name, string memory symbol, uint256 initialSupply) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply * 10 ** 18);
    }
}
