import React, { useContext, useState } from "react";
import { GlobalContext } from "../context/GlobalState";
import { categorySettings } from "../utils/categoryConfig";

export const TransactionList = () => {
  const { transactions, deleteTransaction, setEditingItem } =
    useContext(GlobalContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date_new");

  let processedTransactions = [...transactions];

  // Фильтр по типу
  if (filterType !== "all") {
    processedTransactions = processedTransactions.filter(
      (t) => t.type === filterType,
    );
  }

  // Фильтр по категории
  if (filterCategory !== "all") {
    processedTransactions = processedTransactions.filter(
      (t) => t.category === filterCategory,
    );
  }

  //  Поиск
  if (searchTerm) {
    processedTransactions = processedTransactions.filter((t) =>
      t.description.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }

  // Сортировка
  processedTransactions.sort((a, b) => {
    switch (sortBy) {
      case "date_new":
        return b.id - a.id;
      case "date_old":
        return a.id - b.id;
      case "amount_high":
        return b.amount - a.amount;
      case "amount_low":
        return a.amount - b.amount;
      case "alpha_asc":
        return a.description.localeCompare(b.description);
      case "alpha_desc":
        return b.description.localeCompare(a.description);
      default:
        return 0;
    }
  });

  const uniqueCategories = [
    ...new Set(transactions.map((item) => item.category)),
  ];

  return (
    <div className="history-container">
      <h3>История операций</h3>

      <div className="list-controls">
        <div className="control-group">
          <label>Поиск</label>
          <input
            type="text"
            placeholder="Например: кофе..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="control-group">
          <label>Тип</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">Все</option>
            <option value="income">Доходы</option>
            <option value="expense">Расходы</option>
          </select>
        </div>

        <div className="control-group">
          <label>Категория</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">Все категории</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Сортировка</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date_new">сначала новые</option>
            <option value="date_old">сначала старые</option>
            <option value="amount_high">сначала дорогие</option>
            <option value="amount_low">сначала дешевые</option>
            <option value="alpha_asc">от А до Я </option>
            <option value="alpha_desc">от Я до А </option>
          </select>
        </div>
      </div>

      {processedTransactions.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888", padding: "20px 0" }}>
          Ничего не найдено
        </p>
      ) : (
        <ul className="transaction-list">
          {processedTransactions.map((transaction) => {
            const catInfo = categorySettings[transaction.category] || {
              icon: "🏷️",
              color: "#eee",
            };

            return (
              <li
                key={transaction.id}
                className={`transaction-item ${transaction.type}`}
              >
                <div className="transaction-info-wrapper">
                  <div
                    className="category-icon"
                    style={{ backgroundColor: catInfo.color }}
                  >
                    {catInfo.icon}
                  </div>
                  <div className="transaction-info">
                    <strong>{transaction.description}</strong>
                    <small>
                      {transaction.category} • {transaction.date}
                    </small>
                  </div>
                </div>

                <div className="transaction-actions">
                  <span
                    className="transaction-amount"
                    style={{
                      color:
                        transaction.type === "income" ? "#2ed573" : "#ff4757",
                    }}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {transaction.amount} {transaction.currency}
                  </span>

                  <button
                    className="edit-btn"
                    onClick={() => {
                      setEditingItem(transaction);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    title="Редактировать"
                  >
                    ✎
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteTransaction(transaction.id)}
                    title="Удалить"
                  >
                    X
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
