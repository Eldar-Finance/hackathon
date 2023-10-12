export interface IScPayment {
    token: string;
    nonce: number;
    amount: number;
}

export interface IScUserInfo {
  address: string;
  secretWords: string[];
}

type ElrondType =
  | "NonFungibleESDT"
  | "SemiFungibleESDT"
  | "MetaESDT "
  | "FungibleESDT";

export interface IElrondToken {
    type: ElrondType;
    identifier: string;
    name: string;
    ticker: string;
    owner?: string;
    decimals: number;
    isPaused?: boolean;
    assets: {
      website?: string;
      description?: string;
      status?: string;
      pngUrl?: string;
      svgUrl: string;
      img?: string;
      static?: {
        src: string;
      };
      social?: {
        email: string;
        twitter: string;
        whitepaper: string;
        coingecko: string;
        discord: string;
        telegram: string;
      };
    };
    transactions?: number;
    accounts?: number;
    canUpgrade?: boolean;
    canMint?: boolean;
    canBurn?: boolean;
    canChangeOwner?: boolean;
    canPause?: boolean;
    canFreeze?: boolean;
    canWipe?: boolean;
    price: number;
    marketCap?: number;
    supply: string | number;
    circulatingSupply: string | number;
  }

  export interface IElrondAccountToken {
    type: ElrondType;
    identifier: string;
    name: string;
    ticker: string;
    owner: string;
    decimals: number;
    isPaused: boolean;
    assets: {
      website: string;
      description: string;
      status: string;
      pngUrl: string;
      svgUrl: string;
      social: {
        email: string;
        twitter: string;
        whitepaper: string;
        coingecko: string;
        discord: string;
        telegram: string;
      };
    };
    transactions: number;
    accounts: number;
    canUpgrade: boolean;
    canMint: boolean;
    canBurn: boolean;
    canChangeOwner: boolean;
    canPause: boolean;
    canFreeze: boolean;
    canWipe: boolean;
    price: number;
    marketCap: number;
    supply: string;
    circulatingSupply: string;
  
    minted: string;
    burnt: string;
    initialMinted: string;
  
    timestamp: number;
    balance: string;
    valueUsd: number;
    attributes: string;
  }
  
  export interface IElrondUserAccount {
    address: string;
    balance: string;
    nonce: number;
    shard: number;
    assets?: any;
    code?: string;
    codeHash?: string;
    rootHash?: string;
    txCount: number;
    scrCount: number;
    username?: string;
    developerReward?: string;
    ownerAddress?: string;
    deployedAt?: number;
    isUpgradeable?: boolean;
    isReadable?: boolean;
    isPayable?: boolean;
    isPayableBySmartContract?: boolean;
    scamInfo?: {
      type: number;
      info: string;
    };
  }


export interface IElrondNFT {
    identifier: string;
    collection: string;
    timestamp: number;
    attributes: string;
    nonce: number;
    type: ElrondType;
    name: string;
    creator: string;
    royalties?: number;
    uris?: string[];
    url: string;
    media?: {
      url: string;
      fileSize?: number;
      fileType?: string;
      originalUrl?: string;
      thumbnailUrl?: string;
    }[];
    isWhitelistedStorage?: boolean;
    metadata?: {
      description: string;
      compiler?: string;
      attributes?: any[];
    };
    supply?: string;
    ticker: string;
    rarities?: any;
  
    thumbnailUrl?: string;
    tags?: string[];
  
    owner?: string;
    balance?: string;
    decimals?: number;
    assets: {
      website?: string;
      description?: string;
      status?: string;
      pngUrl?: string;
      svgUrl?: string;
      ledgerSignature?: string;
      lockedAccounts?: string;
      extraTokens?: string[];
      preferredRankAlgorithm?: string;
  
      social?: IElrondSocial;
    };
    scamInfo?: {
      type?: string;
      info: string;
    };
    score?: number;
    rank?: number;
  
    isNsfw?: boolean;
  
    unlockSchedule?: {
      remainingEpochs: number;
      percent: number;
    }[];
  }

interface IElrondSocial {
    blog?: string;
    twitter?: string;
    whitepaper?: string;
    discord?: string;
    telegram?: string;
}

export interface IGasLimit {
  gas?: number;
}

export interface IScQxTagInfo {
  username: string;
  extension: string;
  tag: string;
}

export interface IScQxTagExtension extends IScPayment {
  extension: string;
}

export interface IElrondEconomics {
  totalSupply: number;
  circulatingSupply: number;
  staked: number;
  price: number;
  marketCap: number;
  apr: number;
  topUpApr: number;
  baseApr: number;
  tokenMarketCap: number;
}
export interface IElrondStats {
  shards: number;
  blocks: number;
  accounts: number;
  transactions: number;
  refreshRate: number;
  epoch: number;
  roundsPassed: number;
  roundsPerEpoch: number;
}