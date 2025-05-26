export const DexABI = [
  {
    stateMutability: 'payable',
    type: 'fallback',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_router',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_tokenA',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_tokenB',
        type: 'address',
      },
    ],
    name: 'getCurrentPrice',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_router',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'tokenA',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'tokenB',
        type: 'address',
      },
    ],
    name: 'getPairAddress',
    outputs: [
      {
        internalType: 'address',
        name: 'pair',
        type: 'address',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'orders',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'randomNonce',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_router',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_price',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'orderId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'status',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'startTime',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'endTime',
        type: 'uint256',
      },
    ],
    name: 'setToPrice',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_router',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_totalAmountBuy',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'numLoopsBuy',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'numLoopsSell',
        type: 'uint256',
      },
    ],
    name: 'volumeAllBuyThenSell',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_router',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_amountEachLoop',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'numLoops',
        type: 'uint256',
      },
    ],
    name: 'volumeEachBuyThenSell',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_router',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_totalAmountBuy',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_numLoopsBuy',
        type: 'uint256',
      },
    ],
    name: 'volumeRandomBuyAndSell',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_weth',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'withdrawToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
