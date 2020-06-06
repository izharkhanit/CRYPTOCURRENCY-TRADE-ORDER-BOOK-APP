import { makeActionCreator } from '../utility/makeActionCreators';
export const UPDATE_MARKET_PAIRS = "UPDATE_MARKET_PAIRS";
export const updateMarketPairs = makeActionCreator(UPDATE_MARKET_PAIRS,"ticker");

