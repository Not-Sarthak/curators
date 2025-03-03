import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { JupiterSwapQuote } from '../../types';
const GLOBAL_SLIPPAGE_BPS = 10_000;
const JUPITER_ENDPOINT = 'https://quote-api.jup.ag/v6';

export async function getJupiterQuote(params: {
  fromToken: string;
  toToken: string;
  amount: number;
}): Promise<JupiterSwapQuote> {
  const amount = params.amount * LAMPORTS_PER_SOL;
  const slippageBps = GLOBAL_SLIPPAGE_BPS;
  const response = await fetch(
    `${JUPITER_ENDPOINT}/quote?inputMint=${params.fromToken}&outputMint=${params.toToken}&amount=${amount}&slippageBps=${slippageBps}`
  );

  const data = await response.json();
  console.log('Jupiter Quote::', data);
  return data as JupiterSwapQuote;
}

export async function getSwapTxn(
  inputMint: string,
  outputMint: string,
  amount: number,
  userPublicKey: string
) {
  const quoteResponse = await getJupiterQuote({
    fromToken: inputMint,
    toToken: outputMint,
    amount,
  });

  console.log('Quote Response Inside getSwapTxn: ', quoteResponse);
  console.log('Input Mint Inside getSwapTxn: ', inputMint);
  console.log('Output Mint Inside getSwapTxn: ', outputMint);
  console.log('Amount Inside getSwapTxn: ', amount);

  const swapObj: any = await (
    await fetch('https://quote-api.jup.ag/v6/swap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quoteResponse,
        userPublicKey,
        dynamicComputeUnitLimit: true,
        dynamicSlippage: { maxBps: GLOBAL_SLIPPAGE_BPS },
      }),
    })
  ).json();

  console.log('Jupiter Swap Transaction:', swapObj);

  const outAmount = quoteResponse.outAmount;
  console.log('Out Amount Inside getSwapTxn: ', outAmount);

  return {
    swapObj,
    outAmount,
  };
}
