import React, { useContext, useState } from "react";
import { GlobalContext } from "../context/GlobalState";

const EXCHANGE_RATES = { USD: 1, EUR: 0.92, RUB: 92, KGS: 89.5 };

export const BudgetLimit = () => {
  const { transactions, currency, budgetLimit, updateLimit } =
    useContext(GlobalContext);

  const [inputValue, setInputValue] = useState(
    budgetLimit === 0 ? "" : budgetLimit,
  );

  const convertAmount = (amount, fromCurrency, toCurrency) => {
    if (fromCurrency === toCurrency) return amount;
    const amountInUSD = amount / (EXCHANGE_RATES[fromCurrency] || 1);
    return amountInUSD * (EXCHANGE_RATES[toCurrency] || 1);
  };

  // расходы
  const totalExpense = transactions
    .filter((item) => item.type === "expense")
    .reduce((acc, item) => {
      const itemCurrency = item.currency || "KGS";
      return acc + convertAmount(item.amount, itemCurrency, currency);
    }, 0);

  const handleSaveLimit = () => {
    if (inputValue !== "") {
      updateLimit(Number(inputValue));
    }
  };

  let percentSpent = 0;
  if (budgetLimit > 0) {
    percentSpent = (totalExpense / budgetLimit) * 100;
  }

  const barWidth = percentSpent > 100 ? 100 : percentSpent;

  // цвет прогресс-бара
  let barColor = "#2ed573"; // по умолчанию
  if (percentSpent >= 80 && percentSpent < 100) barColor = "#ffa502"; //внимание
  if (percentSpent >= 100) barColor = "#ff4757"; // превышение

  return (
    <div className="limit-container">
      <div className="limit-header">
        <h4>Лимит расходов на месяц</h4>
        <div className="limit-input-group">
          <input
            type="number"
            placeholder="0"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button onClick={handleSaveLimit}>Задать</button>
        </div>
      </div>

      {budgetLimit > 0 ? (
        <>
          <div className="progress-bg">
            <div
              className="progress-fill"
              style={{ width: `${barWidth}%`, backgroundColor: barColor }}
            ></div>
          </div>

          <div className="limit-status">
            <span>
              Потрачено: {totalExpense.toFixed(2)} {currency}
            </span>
            <span>
              Лимит: {budgetLimit} {currency}
            </span>
          </div>

          {percentSpent >= 100 && (
            <div className="warning-text">
              ⚠️ Вы превысили установленный лимит!
            </div>
          )}
        </>
      ) : (
        <p style={{ fontSize: "0.85rem", color: "#888", margin: 0 }}>
          Установите лимит, чтобы контролировать свои траты.
        </p>
      )}
    </div>
  );
};
