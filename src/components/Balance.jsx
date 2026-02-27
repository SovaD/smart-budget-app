import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const EXCHANGE_RATES = {
  USD: 1, // 1 Доллар = 1 Доллар
  EUR: 0.92, // 1 Доллар = 0.92 Евро
  RUB: 92, // 1 Доллар = 92 Рубля
  KGS: 89.5, // 1 Доллар = 89.5 Сом
};

export const Balance = () => {
  const { transactions, currency, changeCurrency } = useContext(GlobalContext);

  const convertAmount = (amount, fromCurrency, toCurrency) => {
    if (fromCurrency === toCurrency) return amount;

    const amountInUSD = amount / (EXCHANGE_RATES[fromCurrency] || 1);
    return amountInUSD * (EXCHANGE_RATES[toCurrency] || 1);
  };

  const totalIncome = transactions
    .filter((item) => item.type === "income")
    .reduce((acc, item) => {
      const itemCurrency = item.currency || "KGS";
      return acc + convertAmount(item.amount, itemCurrency, currency);
    }, 0);

  const totalExpense = transactions
    .filter((item) => item.type === "expense")
    .reduce((acc, item) => {
      const itemCurrency = item.currency || "KGS";
      return acc + convertAmount(item.amount, itemCurrency, currency);
    }, 0);

  const totalBalance = totalIncome - totalExpense;

  const chartData = [
    { name: "Доходы", value: Number(totalIncome.toFixed(2)) },
    { name: "Расходы", value: Number(totalExpense.toFixed(2)) },
  ];

  const COLORS = ["#2ed573", "#ff4757"];
  const hasData = totalIncome > 0 || totalExpense > 0;

  return (
    <div className="balance-container">
      <h3>Общий баланс</h3>
      <select
        className="currency-selector"
        value={currency}
        onChange={(e) => changeCurrency(e.target.value)}
      >
        <option value="KGS">В сомах (KGS)</option>
        <option value="USD">В долларах (USD)</option>
        <option value="EUR">В евро (EUR)</option>
        <option value="RUB">В рублях (RUB)</option>
      </select>

      <h1 className="balance-total">
        {totalBalance.toFixed(2)} {currency}
      </h1>

      <div className="balance-details">
        <div>
          <h4>Доходы</h4>
          <p className="balance-income">
            +{totalIncome.toFixed(2)} {currency}
          </p>
        </div>
        <div>
          <h4>Расходы</h4>
          <p className="balance-expense">
            -{totalExpense.toFixed(2)} {currency}
          </p>
        </div>
      </div>

      {hasData ? (
        <div style={{ width: "100%", height: 250 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} ${currency}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p style={{ color: "#888", marginTop: "20px" }}>
          Добавьте записи для статистики 📊
        </p>
      )}
    </div>
  );
};
