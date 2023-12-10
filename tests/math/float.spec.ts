import { Blockchain, SandboxContract, TreasuryContract, printTransactionFees } from '@ton-community/sandbox';
import { Cell, beginCell, toNano } from 'ton-core';
import { MathExample } from '../../wrappers/MathExample';
import { GetMethodError } from '@ton-community/sandbox';
import '@ton-community/test-utils';

describe('NFTExample', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let mathContract: SandboxContract<MathExample>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');
        const jetton_content: Cell = beginCell().endCell();
        mathContract = blockchain.openContract(await MathExample.fromInit());
        const deployResult = await mathContract.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: mathContract.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and nFTCollection are ready to use
    });

    it('2 + 7', async () => {
        const addResult = await mathContract.getAdd();
        const safeAddResult = await mathContract.getSafeAdd();
        const actualFloatResult = await mathContract.getFloat(9n);
        expect(actualFloatResult).toEqual(166020696663385964544n);
        expect(addResult).toEqual(actualFloatResult);
        expect(safeAddResult).toEqual(actualFloatResult);
    });

    it('2 - 7', async () => {
        const subResult = await mathContract.getSub();
        const safeSubResult = await mathContract.getSafeSub();
        const actualFloatResult = await mathContract.getFloat(-5n);
        expect(actualFloatResult).toEqual(-92233720368547758080n);
        expect(subResult).toEqual(actualFloatResult);
        expect(safeSubResult).toEqual(actualFloatResult);
    });

    it('2 * 7', async () => {
        const mulResult = await mathContract.getMul();
        const safeMulResult = await mathContract.getSafeMul();
        const actualFloatResult = await mathContract.getFloat(14n);
        expect(actualFloatResult).toEqual(258254417031933722624n);
        expect(mulResult).toEqual(actualFloatResult);
        expect(safeMulResult).toEqual(actualFloatResult);
    });

    it('2 / 7', async () => {
        const divResult = await mathContract.getDiv();
        const safeDivResult = await mathContract.getSafeDiv();
        expect(divResult).toEqual(5270498306774157604n);
        expect(safeDivResult).toEqual(5270498306774157604n);
    });

    // it('Should throw errorCode 4 if div by 0', async () => {
    //     const t = async () => {
    //         await mathContract.getDivisionByZero();
    //     };
    //     expect(t()).toThrowError(GetMethodError);
    // });
});
