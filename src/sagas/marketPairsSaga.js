import { takeEvery, put, call, take } from 'redux-saga/effects'
import {
    updateMarketPairs
} from '../actions/updateMarketPairs'

export default function* marketPairsSagas() {
    yield takeEvery("UPDATE_MARKET_PAIRS", connectSocketStreams)

}
  
function doAction (data){
    let ticker = {}
    data.forEach(item => {
        let symbol = item.symbol || item.s;
        ticker[symbol] = {
            symbol: symbol,
            lastPrice: item.lastPrice || item.c,
            priceChange: item.priceChange || item.p,
            priceChangePercent: item.priceChangePercent || item.P,
            highPrice: item.highPrice || item.h,
            lowPrice: item.lowPrice || item.l,
            quoteVolume: item.quoteVolume || item.q,
        }
    }) 
    return ticker;

}

function* foo (tickerdata) {
    console.log("yielding");  // appears in console
    console.log('after yielding tickerdata',tickerdata);
    yield put(updateMarketPairs(tickerdata));  // action *is not* dispatched
    console.log("yielded"); //appears in console
}

 function connectSocketStreams(action) {
    const payload = action.payload
    const allStreams = payload.streams && payload.streams.join('/');
    let connection = btoa(allStreams);
    connection = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${allStreams}`);
    connection.onmessage = evt => {
        // yield put({ type: 'ACTION_TYPE', payload: JSON.parse(evt.data)})
        let tickerdata = doAction(JSON.parse(evt.data).data);
        const iter = foo(tickerdata);
        iter.next();
        // yield put(updateMarketPairs(tickerdata));
        console.log('tickerdata saga---->',tickerdata);
    }
    connection.onerror = evt => {
        console.error(evt);
    }
    // yield put(updateMarketPairs(tickerdata));
}


