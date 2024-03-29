

const _withoutProtocol = (url) => {
    return url.replace(/(^\w+:|^)\/\//, '');
}


export default {
    trust: {
        id: 'trust',	
	name: 'Trust Wallet',
        walletURL: "https://trustwalletapp.com",
	dappStoreUrl: "https://dapps.trustwalletapp.com/",
	mobile: {
	    android: {
		support: true,
		deepLink: (url) =>  `trust://open_url?coin_id=61&url=${encodeURIComponent(url)}`		
	    },
	    ios: {
		support: true,
		deepLink: (url) =>  `https://link.trustwallet.com/open_url?coin_id=60&url=${encodeURIComponent(url)}`
	    }
	}
    },
    portis: {
	id: 'portis',
	name: 'Portis',
        walletURL: "https://portis.io/",
	dappStoreUrl: "https://wallet.portis.io/",	
	mobile: {
	    android: {
		support: true,
		deepLink: () => {}
	    },
	    ios: {
		support: true,
		deepLink:  () => {}
	    }
	}	
    },    
    opera: {
	id: 'opera',
	name: 'Opera',
        walletURL: "https://play.google.com/store/apps/details?id=com.opera.browser",
	dappStoreUrl: "https://www.opera.com/dapps-store",	
	mobile: {
	    android: {
		support: true,
		deepLink: (url) =>  `intent://${_withoutProtocol(url)}/#Intent;scheme=http;package=com.opera.browser;end`
	    },
	    ios: {
		support: false,
		deepLink: null
	    }
	}	
    },
  imtoken: {
    id: 'imtoken',
    name: 'imToken',
    walletURL: 'https://token.im/',
    dappStoreUrl: 'https://dapps.trustwalletapp.com/',
    mobile: {
      android: {
        support: true,
        deepLink: url =>
          `imtokenv2://navigate/DappView?url=${encodeURIComponent(url)}`
      },
      ios: {
        support: true,
        deepLink: url =>
          `imtokenv2://navigate/DappView?url=${encodeURIComponent(url)}`
      }
    }
  }, 
  status: {
	id: 'status',
	name: 'Status',
        walletURL: "https://status.im/",
	dappStoreUrl: null,
	mobile: {
	    android: {
		support: true,
		deepLink: url => `https://get.status.im/browse/${_withoutProtocol(url)}`
	    },
	    ios: {
		support: true,
		deepLink: url => `https://get.status.im/browse/${_withoutProtocol(url)}`
	    }
	}			
    },    
    token_pocket: {
	id: 'token_pocket',	
	name: "Token Pocket",
        walletURL: "https://tokenpocket.jp/index_en.html",
	dappStoreUrl: null,	
	mobile: {
	    android: {
		support: false,
		deepLink: null
	    },
	    ios: {
		support: true,
		deepLink: (url) =>  `https://tokenpocket.github.io/applink?dappUrl=${encodeURIComponent(url)}`
	    }
	}	
    },
    coinbase_wallet: {
	id: 'coinbase_wallet',	
        name: "Coinbase Wallet",
        walletURL: "https://www.toshi.org",
	dappStoreUrl: null,	
	mobile: {
	    android: {
		support: true,
		deepLink: null
	    },
	    ios: {
		support: true,
		deepLink: null
	    }
	}		
    },
    cipher: {
	id: 'cipher',	
        name: "Cipher Browser",
        walletURL: "https://www.cipherbrowser.com",
	dappStoreUrl: null,	
	mobile: {
	    android: {
		support: true,
		deepLink: null
	    },
	    ios: {
		support: true,
		deepLink: null
	    }
	}		
    },
  
}
