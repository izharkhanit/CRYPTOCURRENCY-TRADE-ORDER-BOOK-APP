import React from 'react'
import { connect } from 'react-redux'
import Loading from '../common/loading'
import DataTable from './data-table'
import { marketpairsSelector } from './../selectors/marketpairsSelectors';

class MarketPairs extends React.Component {

    constructor(props) {
        super(props);
        // console.log('this.props constructor-->',this.props);
        this.state = {
            isLoaded: this.props.market_pairs && this.props.active_market.filtered_pairs
        };
        this._handleTabClick = this._handleTabClick.bind(this);
    }

    

    _handleTabClick(e) {
        let market = e.currentTarget ? e.currentTarget.getAttribute('data-tab') : e;
        this.props.dispatch({
            type: 'SET_ACTIVE_MARKET',
            data: {
                filtered_pairs: Object.keys(this.props.market_pairs).filter(item => item.endsWith(market)),
                market: market
            }
        })
    }

    _disconnectSocketStreams(streams){
        streams = streams.join('/');
        let connection = btoa(streams);
        if (this[connection].readyState === WebSocket.OPEN) {
            this[connection].close();
        }
    }

    componentDidMount() {
        // this._connectSocketStreams(['!ticker@arr'])
        this.props.connectSocketStreams(['!ticker@arr'])
    }

    componentWillUnmount() {
        this._disconnectSocketStreams(['!ticker@arr'])
    }

    render() {
        const { error, isLoaded} = this.state;
        const {items,fetched} = this.props;
        if (error) {
          return <div className="alert alert-danger">{error.message}</div>;
        }
        if (!isLoaded) {
          return <Loading />;
        }
      
        return (
            <React.Fragment>
                izhar
                <ul className="nav nav-tabs pt-2">
                    <li className="nav-item">
                        <a className={this.props.active_market.market === 'BNB' ? 'nav-link active' : 'nav-link'} onClick={this._handleTabClick} data-tab="BNB">BNB<span className="d-none d-sm-inline"> Markets</span></a>
                    </li>
                    <li className="nav-item">
                        <a className={this.props.active_market.market === 'BTC' ? 'nav-link active' : 'nav-link'} onClick={this._handleTabClick} data-tab="BTC">BTC<span className="d-none d-sm-inline"> Markets</span></a>
                    </li>
                    <li className="nav-item">
                        <a className={this.props.active_market.market === 'ETH' ? 'nav-link active' : 'nav-link'} onClick={this._handleTabClick} data-tab="ETH">ETH<span className="d-none d-sm-inline"> Markets</span></a>
                    </li>
                    <li className="nav-item">
                        <a className={this.props.active_market.market === 'USDT' ? 'nav-link active' : 'nav-link'} onClick={this._handleTabClick} data-tab="USDT">USDT<span className="d-none d-sm-inline"> Markets</span></a>
                    </li>    
                </ul>
                {this.props.market_pairs && this.props.active_market.filtered_pairs ? <DataTable ticker={this.props.market_pairs} filter={this.props.active_market.filtered_pairs} /> : <Loading />}
              
            </React.Fragment>    
      )
    }

}

const mapStateToProps = (state) => {
    console.log('state---->',state);
    const items = marketpairsSelector(state);
    return {
        items,
        fetched: items !== null
    }
};

const mapDispatchToProps = dispatch => {
    return{
        connectSocketStreams:()=> dispatch({type: 'CONNECT_SOCKET_STREAM', payload:{streams:['!ticker@arr']}})
    }
}

export default connect(
    // state => state
    mapStateToProps,
    mapDispatchToProps
)(MarketPairs)