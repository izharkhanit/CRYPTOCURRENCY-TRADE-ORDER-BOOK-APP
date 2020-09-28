import React from 'react'
import { connect } from 'react-redux'
import Loading from '../common/loading'
import DataTable from './data-table'
import { marketpairsSelector } from './../selectors/marketpairsSelectors';

class MarketPairs extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoaded: this.props.market_pairs && this.props.active_market.filtered_pairs
         
        };
        this.handleTabClick = this.handleTabClick.bind(this);
    }

     handleTabClick(itemsdata){
        let market = 'BNB';
        let data = Object.keys(itemsdata).filter(item => item.endsWith(market));
        // console.log('data',data);
        return data;
       
     }

    _disconnectSocketStreams(streams){
        streams = streams.join('/');
        let connection = btoa(streams);
        if (this[connection].readyState === WebSocket.OPEN) {
            this[connection].close();
        }
    }

    componentDidMount() {
        this.props.connectSocketStreams(['!ticker@arr'])
    }

    componentWillUnmount() {
        this._disconnectSocketStreams(['!ticker@arr'])
    }
// hello I am Izhar how are you
    render() {
        const { error, isLoaded} = this.state;
        const {items,fetched} = this.props;
        // console.log("items coming as market_pairs",items);
        const fetchedOne = this.handleTabClick(items);
        
        if (error) {
          return <div className="alert alert-danger">{error.message}</div>;
        }
      
        return (
            <React.Fragment>
              {/* TO DO LATER */}
                {/* <ul className="nav nav-tabs pt-2">
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
                </ul> */}
                {items && fetchedOne  ? <DataTable ticker={items} filter={fetchedOne} /> : <Loading />}
              
            </React.Fragment>    
      )
    }

}

const mapStateToProps = (state) => ({
    items : state.market_pairs     
});

const mapDispatchToProps = dispatch => {
    return{
        connectSocketStreams:()=> dispatch({type: 'CONNECT_SOCKET_STREAM', payload:{streams:['!ticker@arr']}})
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MarketPairs)