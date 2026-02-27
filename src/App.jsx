import { useState } from "react";
import "./App.css";
import { GlobalProvider } from "./context/GlobalState";
import { AddTransaction } from "./components/AddTransaction";
import { Balance } from "./components/Balance";
import { TransactionList } from './components/TransactionList';
import { BudgetLimit } from './components/BudgetLimit';
import { Analytics } from './components/Analytics';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <GlobalProvider>
        <div className="app-container">
          <h1 className="title">Smart Budget </h1>
          <div className="main-content">
            <div className="left-column">
              <Balance />
              <BudgetLimit />
            </div>

           <div className="right-column">
              <AddTransaction />
            </div>
          </div>
          <TransactionList />
          <Analytics />
        </div>
      </GlobalProvider>
    </>
  );
}

export default App;
