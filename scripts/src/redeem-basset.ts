import { BN } from "@utils/tools";
import { simpleToExactAmount } from "@utils/math";
import { StandardAccounts } from "@utils/machines/standardAccounts";
import { getRelevantContractInstances } from "./utils/getRelevantContractInstances";
import { logTx } from "./utils/logging";

export default async (scope: any, bassetIndex: string, amount: string, account?: string) => {
    const { mUSD, basketManager, bassets } = await getRelevantContractInstances(scope);
    const sa = new StandardAccounts(await scope.web3.eth.getAccounts());
    account = account || sa.default;

    const basset = bassets[parseInt(bassetIndex, 10)];
    const bassetDecimals = await basset.decimals();
    const bassetSymbol = await basset.symbol();

    // console.log("MTA balance before", (await MTA.balanceOf(account)).toString());
    console.log("mUSD balance before", (await mUSD.balanceOf(account)).toString());
    console.log(`${bassetSymbol} balance before`, (await basset.balanceOf(account)).toString());

    const bassetQ = simpleToExactAmount(new BN(amount), bassetDecimals.toNumber());
    console.log(bassetQ.toString());
    await logTx(
        mUSD.redeem(basset.address, bassetQ),
        `Redeeming ${amount} ${bassetSymbol} for ${account}`,
    );

    // console.log("MTA balance after", (await MTA.balanceOf(account)).toString());
    console.log("mUSD balance after", (await mUSD.balanceOf(account)).toString());
    console.log(`${bassetSymbol} balance after`, (await basset.balanceOf(account)).toString());
};
