// import { makeActionCreator } from '../utility/makeActionCreators';
// export const UPDATE_MARKET_PAIRS = "UPDATE_MARKET_PAIRS";
// export const updateMarketPairs = makeActionCreator(UPDATE_MARKET_PAIRS,"ticker");

import { createAction } from 'redux-act';

export const updateMarketData = createAction('UPDATE_MARKET_PAIRS');