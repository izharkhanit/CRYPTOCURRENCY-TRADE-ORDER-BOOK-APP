import { createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import createSagaMiddleware from 'redux-saga';

import reducer from '../reducers'
import Sagas from '../sagas/index'

const sagaMiddleware = createSagaMiddleware();
export const store = createStore(
    reducer,
    applyMiddleware(logger, sagaMiddleware)
)

export default store

sagaMiddleware.run(Sagas);