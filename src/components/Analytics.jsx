import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";
import { categorySettings } from "../utils/categoryConfig";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";

const EXCHANGE_RATES = { USD: 1, EUR: 0.92, RUB: 92, KGS: 89.5 };

export const Analytics = () => {
  const { transactions, currency } = useContext(GlobalContext);

  const convertAmount = (amount, fromCurrency, toCurrency) => {
    if (fromCurrency === toCurrency) return amount;
    const amountInUSD = amount / (EXCHANGE_RATES[fromCurrency] || 1);
    return amountInUSD * (EXCHANGE_RATES[toCurrency] || 1);
  };

  const expenses = transactions.filter((t) => t.type === "expense");

  // ДАННЫЕ ДЛЯ ГРАФИКА КАТЕГОРИЙ
  const expensesByCategory = expenses.reduce((acc, transaction) => {
    const amount = convertAmount(
      transaction.amount,
      transaction.currency || "KGS",
      currency,
    );
    acc[transaction.category] = (acc[transaction.category] || 0) + amount;
    return acc;
  }, {});

  const barChartData = Object.keys(expensesByCategory)
    .map((category) => ({
      name: category,
      amount: Number(expensesByCategory[category].toFixed(2)),
      color: categorySettings[category]?.color || "#8884d8",
    }))
    .sort((a, b) => b.amount - a.amount);

  // ДАННЫЕ ДЛЯ СТАТИСТИКИ
  //  по месяцу
  const expensesByMonth = expenses.reduce((acc, transaction) => {
    const month = transaction.date.substring(0, 7); // Формат YYYY-MM
    const amount = convertAmount(
      transaction.amount,
      transaction.currency || "KGS",
      currency,
    );
    acc[month] = (acc[month] || 0) + amount;
    return acc;
  }, {});

  // по хронологии
  const lineChartData = Object.keys(expensesByMonth)
    .map((month) => ({
      date: month,
      amount: Number(expensesByMonth[month].toFixed(2)),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  if (expenses.length === 0) return null;

  return (
    <div className="analytics-container">
      <h3>Аналитика расходов</h3>

      <h4 style={{ color: "#666", marginTop: "20px", fontSize: "1rem" }}>
        По категориям
      </h4>
      <div style={{ width: "100%", height: 250 }}>
        <ResponsiveContainer>
          <BarChart
            data={barChartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value) => `${value} ${currency}`}
              cursor={{ fill: "transparent" }}
            />
            <Bar dataKey="amount" radius={[5, 5, 0, 0]}>
              {barChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h4 style={{ color: "#666", marginTop: "40px", fontSize: "1rem" }}>
        Ежемесячная динамика
      </h4>
      <div style={{ width: "100%", height: 250 }}>
        <ResponsiveContainer>
          <LineChart
            data={lineChartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#eee"
            />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => `${value} ${currency}`} />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#ff4757"
              strokeWidth={3}
              dot={{ r: 5, fill: "#ff4757" }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
