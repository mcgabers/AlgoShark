import algosdk from 'algosdk'

// Algorand node configuration
const algodToken = process.env.NEXT_PUBLIC_ALGOD_TOKEN || ''
const algodServer = process.env.NEXT_PUBLIC_ALGOD_SERVER || 'https://testnet-api.algonode.cloud'
const algodPort = process.env.NEXT_PUBLIC_ALGOD_PORT || ''

// Initialize the Algod client
const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort)

export interface ProjectToken {
  assetId: number
  name: string
  totalSupply: number
  decimals: number
  unitName: string
}

export class AlgorandService {
  static async getAccountInfo(address: string) {
    try {
      return await algodClient.accountInformation(address).do()
    } catch (error) {
      console.error('Error fetching account info:', error)
      throw error
    }
  }

  static async createProjectToken(
    creator: algosdk.Account,
    projectName: string,
    totalSupply: number
  ): Promise<ProjectToken> {
    try {
      // Get suggested parameters
      const suggestedParams = await algodClient.getTransactionParams().do()

      // Asset creation parameters
      const asset = {
        from: creator.addr,
        total: totalSupply,
        decimals: 0,
        defaultFrozen: false,
        unitName: 'PROJ',
        assetName: `${projectName} Token`,
        manager: creator.addr,
        reserve: creator.addr,
        freeze: creator.addr,
        clawback: creator.addr,
        suggestedParams,
      }

      // Create the asset creation transaction
      const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject(asset)

      // Sign the transaction
      const signedTxn = txn.signTxn(creator.sk)

      // Submit the transaction
      const { txId } = await algodClient.sendRawTransaction(signedTxn).do()

      // Wait for confirmation
      await this.waitForConfirmation(txId)

      // Get the asset ID
      const ptx = await algodClient.pendingTransactionInformation(txId).do()
      const assetId = ptx['asset-index']

      return {
        assetId,
        name: asset.assetName,
        totalSupply: asset.total,
        decimals: asset.decimals,
        unitName: asset.unitName,
      }
    } catch (error) {
      console.error('Error creating project token:', error)
      throw error
    }
  }

  static async investInProject(
    investor: algosdk.Account,
    projectAssetId: number,
    amount: number
  ) {
    try {
      const suggestedParams = await algodClient.getTransactionParams().do()

      // Create opt-in transaction if needed
      const optInTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: investor.addr,
        to: investor.addr,
        amount: 0,
        assetIndex: projectAssetId,
        suggestedParams,
      })

      // Sign and send opt-in transaction
      const signedOptIn = optInTxn.signTxn(investor.sk)
      const { txId: optInTxId } = await algodClient.sendRawTransaction(signedOptIn).do()
      await this.waitForConfirmation(optInTxId)

      // Create investment transaction
      const investTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: investor.addr,
        to: investor.addr, // This will be replaced with project wallet
        amount,
        assetIndex: projectAssetId,
        suggestedParams,
      })

      // Sign and send investment transaction
      const signedInvest = investTxn.signTxn(investor.sk)
      const { txId: investTxId } = await algodClient.sendRawTransaction(signedInvest).do()
      await this.waitForConfirmation(investTxId)

      return {
        optInTxId,
        investTxId,
      }
    } catch (error) {
      console.error('Error investing in project:', error)
      throw error
    }
  }

  static async distributeRewards(
    project: algosdk.Account,
    holders: string[],
    rewardAmount: number,
    projectAssetId: number
  ) {
    try {
      const suggestedParams = await algodClient.getTransactionParams().do()

      // Create transactions for each holder
      const transactions = holders.map((holder) =>
        algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          from: project.addr,
          to: holder,
          amount: rewardAmount,
          suggestedParams,
        })
      )

      // Group transactions
      const txGroup = algosdk.assignGroupID(transactions)

      // Sign transactions
      const signedTxns = txGroup.map((txn) => txn.signTxn(project.sk))

      // Send transactions
      const { txId } = await algodClient.sendRawTransaction(signedTxns).do()
      await this.waitForConfirmation(txId)

      return txId
    } catch (error) {
      console.error('Error distributing rewards:', error)
      throw error
    }
  }

  static async createProposal(
    creator: algosdk.Account,
    projectAssetId: number,
    title: string,
    description: string,
    startDate: Date,
    endDate: Date,
    type: string,
    parameters?: Record<string, any>
  ): Promise<{ txId: string }> {
    try {
      const suggestedParams = await algodClient.getTransactionParams().do()

      // Create a note field with proposal metadata
      const metadata = {
        type: 'proposal',
        projectAssetId,
        title,
        description,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        proposalType: type,
        parameters,
      }
      const encodedMetadata = new TextEncoder().encode(JSON.stringify(metadata))

      // Create application call transaction
      const txn = algosdk.makeApplicationCallTxnFromObject({
        from: creator.addr,
        appIndex: 0, // Replace with your governance app ID
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: [new TextEncoder().encode('create_proposal')],
        note: encodedMetadata,
        suggestedParams,
      })

      // Sign and send transaction
      const signedTxn = txn.signTxn(creator.sk)
      const { txId } = await algodClient.sendRawTransaction(signedTxn).do()
      await this.waitForConfirmation(txId)

      return { txId }
    } catch (error) {
      console.error('Error creating proposal:', error)
      throw error
    }
  }

  static async castVote(
    voter: algosdk.Account,
    proposalId: number,
    choice: string,
    votingPower: number
  ): Promise<{ txId: string }> {
    try {
      const suggestedParams = await algodClient.getTransactionParams().do()

      // Create a note field with vote metadata
      const metadata = {
        type: 'vote',
        proposalId,
        choice,
        votingPower,
      }
      const encodedMetadata = new TextEncoder().encode(JSON.stringify(metadata))

      // Create application call transaction
      const txn = algosdk.makeApplicationCallTxnFromObject({
        from: voter.addr,
        appIndex: 0, // Replace with your governance app ID
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: [
          new TextEncoder().encode('cast_vote'),
          new TextEncoder().encode(choice),
          algosdk.encodeUint64(votingPower),
        ],
        note: encodedMetadata,
        suggestedParams,
      })

      // Sign and send transaction
      const signedTxn = txn.signTxn(voter.sk)
      const { txId } = await algodClient.sendRawTransaction(signedTxn).do()
      await this.waitForConfirmation(txId)

      return { txId }
    } catch (error) {
      console.error('Error casting vote:', error)
      throw error
    }
  }

  static async delegateVotingPower(
    delegator: algosdk.Account,
    delegate: string,
    projectAssetId: number
  ): Promise<{ txId: string }> {
    try {
      const suggestedParams = await algodClient.getTransactionParams().do()

      // Create a note field with delegation metadata
      const metadata = {
        type: 'delegation',
        projectAssetId,
        delegate,
      }
      const encodedMetadata = new TextEncoder().encode(JSON.stringify(metadata))

      // Create application call transaction
      const txn = algosdk.makeApplicationCallTxnFromObject({
        from: delegator.addr,
        appIndex: 0, // Replace with your governance app ID
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: [
          new TextEncoder().encode('delegate'),
          new TextEncoder().encode(delegate),
        ],
        note: encodedMetadata,
        suggestedParams,
      })

      // Sign and send transaction
      const signedTxn = txn.signTxn(delegator.sk)
      const { txId } = await algodClient.sendRawTransaction(signedTxn).do()
      await this.waitForConfirmation(txId)

      return { txId }
    } catch (error) {
      console.error('Error delegating voting power:', error)
      throw error
    }
  }

  static async getProposalState(proposalId: number): Promise<{
    votesYes: number
    votesNo: number
    votesAbstain: number
    status: string
  }> {
    try {
      const appState = await algodClient
        .getApplicationByID(0) // Replace with your governance app ID
        .do()

      // Parse global state
      const globalState = appState['params']['global-state']
      const proposalKey = `proposal_${proposalId}`
      const proposalState = globalState.find(
        (item: any) => item.key === proposalKey
      )

      if (!proposalState) {
        throw new Error('Proposal not found')
      }

      // Decode proposal state
      const state = JSON.parse(
        Buffer.from(proposalState.value.bytes, 'base64').toString()
      )

      return {
        votesYes: state.votesYes || 0,
        votesNo: state.votesNo || 0,
        votesAbstain: state.votesAbstain || 0,
        status: state.status,
      }
    } catch (error) {
      console.error('Error getting proposal state:', error)
      throw error
    }
  }

  static async getUserVotingPower(
    address: string,
    projectAssetId: number
  ): Promise<number> {
    try {
      // Get user's asset holding
      const accountInfo = await algodClient.accountInformation(address).do()
      const assetHolding = accountInfo.assets.find(
        (asset: any) => asset['asset-id'] === projectAssetId
      )

      if (!assetHolding) {
        return 0
      }

      // Get delegated voting power
      const appState = await algodClient
        .getApplicationByID(0) // Replace with your governance app ID
        .do()

      const globalState = appState['params']['global-state']
      const delegationKey = `delegation_${address}`
      const delegationState = globalState.find(
        (item: any) => item.key === delegationKey
      )

      let delegatedPower = 0
      if (delegationState) {
        const delegations = JSON.parse(
          Buffer.from(delegationState.value.bytes, 'base64').toString()
        )
        delegatedPower = delegations.reduce(
          (sum: number, delegation: any) => sum + delegation.power,
          0
        )
      }

      return assetHolding.amount + delegatedPower
    } catch (error) {
      console.error('Error getting user voting power:', error)
      throw error
    }
  }

  private static async waitForConfirmation(
    txId: string,
    timeout: number = 4
  ): Promise<void> {
    const status = await algodClient.status().do()
    let lastRound = status['last-round']
    const startRound = lastRound

    while (lastRound < startRound + timeout) {
      const pendingInfo = await algodClient
        .pendingTransactionInformation(txId)
        .do()

      if (pendingInfo['confirmed-round']) {
        return
      }

      lastRound++
      await algodClient.statusAfterBlock(lastRound).do()
    }

    throw new Error(`Transaction ${txId} not confirmed after ${timeout} rounds`)
  }
} 