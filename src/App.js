import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import AppHeader from './common/app-header'
import MarketPairs from './marketpairs/market-pairs'
import Trade from './trades/trade'

const App = () => (
  <Router>
    <React.Fragment>
      <AppHeader />
      <main role="main">
        <div className="container-fluid">
              <div className="row">
                  <div className="col-12">
                    <Route exact path="/" component={MarketPairs} />
                    <Route path="/trade/:symbol" component={Trade} />
                  </div>
              </div>    
          </div>
      </main>
    </React.Fragment>
  </Router>
);  

export default App;