import { describe, it, expect, vi } from 'vitest';
import { DojoClient } from '../src/dojoClient';

describe('DojoClient', () => {
  it('startGame calls account.execute with correct args', async () => {
    const mockAccount: any = {
      execute: vi.fn().mockResolvedValue({ transaction_hash: '0xabc' }),
      waitForTransaction: vi.fn().mockResolvedValue({ status: 'ACCEPTED' }),
    };

    const client = new DojoClient({ worldAddress: '0xWORLD', rpcUrl: 'http://localhost:5050' });
    client.setProvider({
      waitForTransaction: vi.fn().mockResolvedValue({ status: 'ACCEPTED' }),
    });

    const tx = await client.startGame(mockAccount, 2);
    expect(mockAccount.execute).toHaveBeenCalled();
    const callArg = mockAccount.execute.mock.calls[0][0];
    expect(callArg.contractAddress).toBe('0xWORLD');
    expect(callArg.entrypoint).toBe('start_game');
    expect(callArg.calldata).toContain('2');
    expect(tx).toBeDefined();
  });

  it('getGameState calls provider.callContract and returns result', async () => {
    const client = new DojoClient({ worldAddress: '0xWORLD', rpcUrl: 'http://localhost:5050' });
    const providerMock = {
      callContract: vi.fn().mockResolvedValue({ result: ['1', '2'] }),
    };
    client.setProvider(providerMock);

    const res = await client.getGameState(7);
    expect(providerMock.callContract).toHaveBeenCalled();
    const arg = providerMock.callContract.mock.calls[0][0];
    expect(arg.contractAddress).toBe('0xWORLD');
    expect(arg.entrypoint).toBe('get_game');
    expect(arg.calldata).toContain('7');
    expect(res).toEqual({ result: ['1', '2'] });
  });
});