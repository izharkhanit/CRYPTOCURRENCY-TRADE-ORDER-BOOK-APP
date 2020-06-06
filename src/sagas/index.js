import { spawn } from 'redux-saga/effects'
import marketPairsSagas from './marketPairsSaga'
export default function* sagas() {
    yield spawn(marketPairsSagas)
}