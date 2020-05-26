var OPTINOFACTORYADDRESS = "0xAD756120c8a3e4738D181879Dc1c0B73868021FC";
var OPTINOFACTORYABI = [{"inputs":[{"internalType":"address","name":"_optinoTokenTemplate","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"fee","type":"uint256"}],"name":"FeeUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"feed","type":"address"}],"name":"FeedLocked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"feed","type":"address"},{"indexed":false,"internalType":"string","name":"message","type":"string"}],"name":"FeedMessageUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"feed","type":"address"},{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"string","name":"message","type":"string"},{"indexed":false,"internalType":"uint8","name":"feedType","type":"uint8"},{"indexed":false,"internalType":"uint8","name":"decimals","type":"uint8"}],"name":"FeedUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes","name":"note","type":"bytes"},{"indexed":false,"internalType":"address","name":"addr","type":"address"},{"indexed":false,"internalType":"uint256","name":"number","type":"uint256"}],"name":"LogInfo","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"_message","type":"string"}],"name":"MessageUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"seriesKey","type":"bytes32"},{"indexed":true,"internalType":"uint256","name":"seriesIndex","type":"uint256"},{"indexed":false,"internalType":"contract OptinoToken[2]","name":"optinos","type":"address[2]"},{"indexed":false,"internalType":"uint256","name":"tokens","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"ownerFee","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"integratorFee","type":"uint256"}],"name":"OptinosMinted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_from","type":"address"},{"indexed":true,"internalType":"address","name":"_to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"seriesKey","type":"bytes32"},{"indexed":true,"internalType":"uint256","name":"seriesIndex","type":"uint256"},{"indexed":false,"internalType":"contract OptinoToken[2]","name":"optinos","type":"address[2]"}],"name":"SeriesAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"seriesKey","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"spot","type":"uint256"}],"name":"SeriesSpotUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract ERC20","name":"token","type":"address"},{"indexed":false,"internalType":"uint8","name":"decimals","type":"uint8"},{"indexed":false,"internalType":"uint8","name":"locked","type":"uint8"}],"name":"TokenDecimalsUpdated","type":"event"},{"inputs":[],"name":"acceptOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract ERC20[2]","name":"pair","type":"address[2]"},{"internalType":"address[2]","name":"feeds","type":"address[2]"},{"internalType":"uint8[6]","name":"feedParameters","type":"uint8[6]"},{"internalType":"uint256[5]","name":"data","type":"uint256[5]"},{"internalType":"uint256[]","name":"spots","type":"uint256[]"}],"name":"calcPayoffs","outputs":[{"internalType":"contract ERC20","name":"_collateralToken","type":"address"},{"internalType":"uint256[6]","name":"results","type":"uint256[6]"},{"internalType":"uint256[]","name":"payoffs","type":"uint256[]"},{"internalType":"string","name":"error","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[2]","name":"feeds","type":"address[2]"},{"internalType":"uint8[6]","name":"feedParameters","type":"uint8[6]"}],"name":"calculateSpot","outputs":[{"internalType":"uint8","name":"feedDecimals0","type":"uint8"},{"internalType":"uint8","name":"feedType0","type":"uint8"},{"internalType":"uint256","name":"spot","type":"uint256"},{"internalType":"bool","name":"ok","type":"bool"},{"internalType":"string","name":"error","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"fee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"feedLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"seriesKey","type":"bytes32"}],"name":"getCalcData","outputs":[{"internalType":"uint256[5]","name":"_seriesData","type":"uint256[5]"},{"internalType":"uint8[4]","name":"decimalsData","type":"uint8[4]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"i","type":"uint256"}],"name":"getFeedByIndex","outputs":[{"internalType":"address","name":"feed","type":"address"},{"internalType":"string","name":"feedName","type":"string"},{"internalType":"string","name":"_message","type":"string"},{"internalType":"uint8[3]","name":"_feedData","type":"uint8[3]"},{"internalType":"uint256","name":"spot","type":"uint256"},{"internalType":"bool","name":"hasData","type":"bool"},{"internalType":"uint8","name":"feedReportedDecimals","type":"uint8"},{"internalType":"uint256","name":"feedTimestamp","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"seriesKey","type":"bytes32"}],"name":"getFeedDecimals0","outputs":[{"internalType":"uint8","name":"feedDecimals0","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_feed","type":"address"}],"name":"getFeedName","outputs":[{"internalType":"bool","name":"isRegistered","type":"bool"},{"internalType":"string","name":"feedName","type":"string"},{"internalType":"uint8","name":"feedType","type":"uint8"},{"internalType":"uint8","name":"decimals","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"feed","type":"address"},{"internalType":"enum FeedHandler.FeedType","name":"feedType","type":"uint8"}],"name":"getRateFromFeed","outputs":[{"internalType":"uint256","name":"_rate","type":"uint256"},{"internalType":"bool","name":"_hasData","type":"bool"},{"internalType":"uint8","name":"_decimals","type":"uint8"},{"internalType":"uint256","name":"_timestamp","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"i","type":"uint256"}],"name":"getSeriesByIndex","outputs":[{"internalType":"bytes32","name":"_seriesKey","type":"bytes32"},{"internalType":"contract ERC20[2]","name":"pair","type":"address[2]"},{"internalType":"address[2]","name":"feeds","type":"address[2]"},{"internalType":"uint8[6]","name":"feedParameters","type":"uint8[6]"},{"internalType":"uint8","name":"feedDecimals0","type":"uint8"},{"internalType":"uint256[5]","name":"data","type":"uint256[5]"},{"internalType":"contract OptinoToken[2]","name":"optinos","type":"address[2]"},{"internalType":"uint256","name":"timestamp","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"seriesKey","type":"bytes32"}],"name":"getSeriesByKey","outputs":[{"internalType":"uint256","name":"_seriesIndex","type":"uint256"},{"internalType":"contract ERC20[2]","name":"pair","type":"address[2]"},{"internalType":"address[2]","name":"feeds","type":"address[2]"},{"internalType":"uint8[6]","name":"feedParameters","type":"uint8[6]"},{"internalType":"uint256[5]","name":"data","type":"uint256[5]"},{"internalType":"contract OptinoToken[2]","name":"optinos","type":"address[2]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"seriesKey","type":"bytes32"}],"name":"getSeriesSpot","outputs":[{"internalType":"uint256","name":"spot","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_feed","type":"address"}],"name":"lockFeed","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"message","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract ERC20[2]","name":"pair","type":"address[2]"},{"internalType":"address[2]","name":"feeds","type":"address[2]"},{"internalType":"uint8[6]","name":"feedParameters","type":"uint8[6]"},{"internalType":"uint256[5]","name":"data","type":"uint256[5]"},{"internalType":"address","name":"integratorFeeAccount","type":"address"}],"name":"mint","outputs":[{"internalType":"contract OptinoToken[2]","name":"_optinos","type":"address[2]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"newOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"optinoTokenTemplate","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract OptinoToken","name":"optinoToken","type":"address"},{"internalType":"contract ERC20","name":"token","type":"address"},{"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"recoverTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"seriesLength","outputs":[{"internalType":"uint256","name":"_seriesLength","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"seriesKey","type":"bytes32"}],"name":"setSeriesSpot","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"seriesKey","type":"bytes32"},{"internalType":"uint256","name":"spot","type":"uint256"}],"name":"setSeriesSpotIfPriceFeedFails","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_fee","type":"uint256"}],"name":"updateFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_feed","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"_message","type":"string"},{"internalType":"uint8","name":"feedType","type":"uint8"},{"internalType":"uint8","name":"decimals","type":"uint8"}],"name":"updateFeed","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_feed","type":"address"},{"internalType":"string","name":"_message","type":"string"}],"name":"updateFeedMessage","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_message","type":"string"}],"name":"updateMessage","outputs":[],"stateMutability":"nonpayable","type":"function"}];

var OPTINOABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"tokenOwner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract OptinoToken","name":"optinoToken","type":"address"},{"indexed":true,"internalType":"contract OptinoToken","name":"coverToken","type":"address"},{"indexed":true,"internalType":"address","name":"tokenOwner","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokens","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"collateralRefunded","type":"uint256"}],"name":"Close","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes","name":"note","type":"bytes"},{"indexed":false,"internalType":"address","name":"addr","type":"address"},{"indexed":false,"internalType":"uint256","name":"number","type":"uint256"}],"name":"LogInfo","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_from","type":"address"},{"indexed":true,"internalType":"address","name":"_to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract OptinoToken","name":"optinoOrCoverToken","type":"address"},{"indexed":true,"internalType":"address","name":"tokenOwner","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokens","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"collateralPaid","type":"uint256"}],"name":"Payoff","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"acceptOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenOwner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"remaining","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenOwner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"balance","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenOwner","type":"address"},{"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"burn","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"close","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenOwner","type":"address"},{"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"closeFor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"collateralToken","outputs":[{"internalType":"contract ERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"currentSpot","outputs":[{"internalType":"uint256","name":"_currentSpot","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"currentSpotAndPayoff","outputs":[{"internalType":"uint256","name":"_spot","type":"uint256"},{"internalType":"uint256","name":"currentPayoff","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"contract OptinoFactory","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getFeedInfo","outputs":[{"internalType":"address","name":"feed0","type":"address"},{"internalType":"address","name":"feed1","type":"address"},{"internalType":"uint8","name":"feedType0","type":"uint8"},{"internalType":"uint8","name":"feedType1","type":"uint8"},{"internalType":"uint8","name":"decimals0","type":"uint8"},{"internalType":"uint8","name":"decimals1","type":"uint8"},{"internalType":"uint8","name":"inverse0","type":"uint8"},{"internalType":"uint8","name":"inverse1","type":"uint8"},{"internalType":"uint8","name":"feedDecimals0","type":"uint8"},{"internalType":"uint256","name":"currentSpot","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getInfo","outputs":[{"internalType":"contract ERC20","name":"token0","type":"address"},{"internalType":"contract ERC20","name":"token1","type":"address"},{"internalType":"address","name":"feed0","type":"address"},{"internalType":"bool","name":"_isCustom","type":"bool"},{"internalType":"uint256","name":"callPut","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint256","name":"strike","type":"uint256"},{"internalType":"uint256","name":"bound","type":"uint256"},{"internalType":"bool","name":"_isCover","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getPricingInfo","outputs":[{"internalType":"uint256","name":"currentSpot","type":"uint256"},{"internalType":"uint256","name":"currentPayoff","type":"uint256"},{"internalType":"uint256","name":"spot","type":"uint256"},{"internalType":"uint256","name":"payoff","type":"uint256"},{"internalType":"uint256","name":"collateral","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getSeriesData","outputs":[{"internalType":"bytes32","name":"_seriesKey","type":"bytes32"},{"internalType":"uint256","name":"_seriesIndex","type":"uint256"},{"internalType":"contract ERC20[2]","name":"pair","type":"address[2]"},{"internalType":"address[2]","name":"feeds","type":"address[2]"},{"internalType":"uint8[6]","name":"feedParameters","type":"uint8[6]"},{"internalType":"uint256[5]","name":"data","type":"uint256[5]"},{"internalType":"contract OptinoToken[2]","name":"optinos","type":"address[2]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract OptinoFactory","name":"_factory","type":"address"},{"internalType":"bytes32","name":"_seriesKey","type":"bytes32"},{"internalType":"contract OptinoToken","name":"_optinoPair","type":"address"},{"internalType":"bool","name":"_isCover","type":"bool"},{"internalType":"uint256","name":"_decimals","type":"uint256"}],"name":"initOptinoToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"isCover","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isCustom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenOwner","type":"address"},{"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"mint","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"newOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"optinoPair","outputs":[{"internalType":"contract OptinoToken","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokens","type":"uint256"},{"internalType":"uint256","name":"_spot","type":"uint256"}],"name":"payoffForSpot","outputs":[{"internalType":"uint256","name":"payoff","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokens","type":"uint256"},{"internalType":"uint256[]","name":"spots","type":"uint256[]"}],"name":"payoffForSpots","outputs":[{"internalType":"uint256[]","name":"payoffs","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract ERC20","name":"token","type":"address"},{"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"recoverTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"seriesKey","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"setSpot","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"settle","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenOwner","type":"address"}],"name":"settleFor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"spot","outputs":[{"internalType":"uint256","name":"_spot","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"spotAndPayoff","outputs":[{"internalType":"uint256","name":"_spot","type":"uint256"},{"internalType":"uint256","name":"payoff","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}];

var TOKENTOOLZADDRESS = "0x5Faee8F6b33371e15e597911146f59A22976a6c6";
var TOKENTOOLZABI = [{"inputs":[{"internalType":"contract ERC20","name":"token","type":"address"},{"internalType":"address","name":"tokenOwner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"getTokenInfo","outputs":[{"internalType":"uint256","name":"_decimals","type":"uint256"},{"internalType":"uint256","name":"_totalSupply","type":"uint256"},{"internalType":"uint256","name":"_balance","type":"uint256"},{"internalType":"uint256","name":"_allowance","type":"uint256"},{"internalType":"string","name":"_symbol","type":"string"},{"internalType":"string","name":"_name","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract ERC20[]","name":"tokens","type":"address[]"},{"internalType":"address","name":"tokenOwner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"getTokensInfo","outputs":[{"internalType":"uint256[]","name":"totalSupply","type":"uint256[]"},{"internalType":"uint256[]","name":"balance","type":"uint256[]"},{"internalType":"uint256[]","name":"allowance","type":"uint256[]"}],"stateMutability":"view","type":"function"}];

var FAKETOKENFACTORYADDRESS = "0x2e559C5651a1f385BCB93fa25b5C7dA8d98A6b2a";
var FAKETOKENFACTORYABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract FakeToken","name":"fakeToken","type":"address"},{"indexed":false,"internalType":"string","name":"symbol","type":"string"},{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"uint8","name":"decimals","type":"uint8"}],"name":"FakeTokenDeployed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_from","type":"address"},{"indexed":true,"internalType":"address","name":"_to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"acceptOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"fakeTokenTemplate","outputs":[{"internalType":"contract FakeToken","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"fakeTokens","outputs":[{"internalType":"contract FakeToken","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"fakeTokensLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"symbol","type":"string"},{"internalType":"string","name":"name","type":"string"},{"internalType":"uint8","name":"decimals","type":"uint8"}],"name":"mint","outputs":[{"internalType":"contract FakeToken","name":"fakeToken","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"newOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract ERC20","name":"token","type":"address"},{"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"recoverTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract FakeToken","name":"fakeToken","type":"address"},{"internalType":"contract ERC20","name":"token","type":"address"},{"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"recoverTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}];

// TODO Remove below
var PRICEFEEDADDRESS = "0x217fe95b0877f59bbc5fd6e7d87fde0889da81f5";
var PRICEFEEDABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"bool","name":"hasValue","type":"bool"}],"name":"SetValue","type":"event"},{"inputs":[],"name":"hasValue","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"peek","outputs":[{"internalType":"bytes32","name":"_value","type":"bytes32"},{"internalType":"bool","name":"_hasValue","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_value","type":"uint256"},{"internalType":"bool","name":"_hasValue","type":"bool"}],"name":"setValue","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"value","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];


var ERC20ABI = [{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"totalSupply","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}];
