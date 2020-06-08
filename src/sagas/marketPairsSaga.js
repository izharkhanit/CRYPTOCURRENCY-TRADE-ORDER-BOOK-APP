import {eventChannel, END} from 'redux-saga';
import { all, fork, take, call, put, takeEvery } from 'redux-saga/effects';

import {updateMarketData} from '../actions/updateMarketPairs'

let ws;

function createEventChannel() {
    return eventChannel(emit => {
          function createWs() {
            //Subscribe to websocket
            const streams = ['!ticker@arr']
            const allStreams = streams && streams.join('/');
            
            ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${allStreams}`);

        

            ws.onopen = () => {
                console.log("Opening Websocket");
            };

            ws.onerror = error => {
                console.log("ERROR: ", error);
            };

            function _getTickerBySymbol(data) {
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

            ws.onmessage = e => {
              let ticker = _getTickerBySymbol(JSON.parse(e.data).data)
              console.log(ticker);
                return emit({data: ticker})
            };

            ws.onclose = e => {
                if (e.code === 1005) {
                    console.log("WebSocket: closed");
                    emit(END);
                } else {
                    console.log('Socket is closed Unexpectedly. Reconnect will be attempted in 4 second.', e.reason);
                    setTimeout(() =>  {
                        createWs();
                    }, 4000);
                }
            };
        }
        createWs();

        return () => {
            console.log("Closing Websocket");
            ws.close();
        };
    });
}


function * initializeWebSocketsChannel() {
  const channel = yield call(createEventChannel);
  while (true) {
      const {data} = yield take(channel);
      yield put(updateMarketData(data));
  }
}

export function * initWebSocket() {
  yield takeEvery('CONNECT_SOCKET_STREAM', initializeWebSocketsChannel);
}

export default function* marketPairsSagas() {
    yield all([
      fork(initWebSocket)
    ]);
}
  