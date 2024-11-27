import algosdk from 'algosdk'

// Initialize Algorand client
const algodClient = new algosdk.Algodv2(
  '', // No token needed for TestNet
  'https://testnet-api.algonode.cloud',
  ''
)

export class AlgorandService {
  static async getAccountInfo(address: string) {
    try {
      return await algodClient.accountInformation(address).do()
    } catch (error) {
      console.error('Error fetching account info:', error)
      throw error
    }
  }

  static async getTransactionParams() {
    try {
      return await algodClient.getTransactionParams().do()
    } catch (error) {
      console.error('Error fetching transaction params:', error)
      throw error
    }
  }

  static generateAccount(): algosdk.Account {
    return algosdk.generateAccount()
  }

  static async signAndSendTransaction(
    transaction: algosdk.Transaction,
    account: algosdk.Account
  ) {
    try {
      const signedTxn = transaction.signTxn(account.sk)
      const { txId } = await algodClient.sendRawTransaction(signedTxn).do()
      await this.waitForConfirmation(txId)
      return txId
    } catch (error) {
      console.error('Error sending transaction:', error)
      throw error
    }
  }

  static async waitForConfirmation(txId: string) {
    try {
      const status = await algodClient.status().do()
      let lastRound = status['last-round']
      while (true) {
        const pendingInfo = await algodClient
          .pendingTransactionInformation(txId)
          .do()
        if (pendingInfo['confirmed-round']) {
          return pendingInfo
        }
        lastRound++
        await algodClient.statusAfterBlock(lastRound).do()
      }
    } catch (error) {
      console.error('Error waiting for confirmation:', error)
      throw error
    }
  }

  static async getAssetInfo(assetId: number) {
    try {
      return await algodClient.getAssetByID(assetId).do()
    } catch (error) {
      console.error('Error fetching asset info:', error)
      throw error
    }
  }

  static async getBalance(address: string) {
    try {
      const accountInfo = await this.getAccountInfo(address)
      return accountInfo.amount
    } catch (error) {
      console.error('Error fetching balance:', error)
      throw error
    }
  }
} 