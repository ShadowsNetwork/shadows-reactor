import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { PaperClipOutlined } from '@ant-design/icons';
import './App.css';
import MenuLay from '../pages/menuLay/MenuLay';
import Personal from '../pages/personal/Personal';
import Synthesis from '../pages/synthesis/Synthesis';
import Transaction from '../pages/transaction/Transaction';
import Flow from '../pages/flow/Flow';
import FlowStep from '../pages/flow/FlowStep';
import Destruction from '../pages/Destruction/Destruction';
import Reward from '../pages/reward/Reward';
import Success from '../pages/Success';
import Error from '../pages/Error';
import Language from '../pages/Language';
import Wallet from '../components/Wallet';
import SideBar from '@/layouts/Sidebar';

function BasicLayout() {
  return (
    <div className="App">
      <Router>
        <SideBar />
        <Route path="/" exact component={MenuLay} />
        <Route path="/Personal" exact component={Personal} />
        <Route path="/Synthesis" exact component={Synthesis} />
        <Route path="/Transaction" exact component={Transaction} />
        <Route path="/Flow" component={Flow} />
        <Route path="/Destruction" exact component={Destruction} />
        <Route path="/Reward" exact component={Reward} />
        <Route path="/Success" exact component={Success} />
        <Route path="/Error" exact component={Error} />
        <Route path="/FlowStep" exact component={FlowStep} />
      </Router>
      <div className="money">
        <PaperClipOutlined style={{ fontSize: '16px', color: '#fff' }} />
        <Wallet />
      </div>
      <Language />
    </div>
  );
}

export default BasicLayout;
