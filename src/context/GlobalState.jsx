import React, { createContext, useReducer, useEffect } from "react";

const initialState = {
  transactions: JSON.parse(localStorage.getItem("transactions")) || [],
  currency: "KGS",
  budgetLimit: JSON.parse(localStorage.getItem("budgetLimit")) || 0,
  editingItem: null,
};

const AppReducer = (state, action) => {
  switch (action.type) {
    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };
    case "ADD_TRANSACTION":
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };
    case "CHANGE_CURRENCY":
      return { ...state, currency: action.payload };

    case "SET_LIMIT":
      return { ...state, budgetLimit: action.payload };
    case "UPDATE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t,
        ),
        editingItem: null,
      };

    case "SET_EDITING_ITEM":
      return { ...state, editingItem: action.payload };
    default:
      return state;
  }
};

export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(state.transactions));
  }, [state.transactions]);

  useEffect(() => {
    localStorage.setItem("budgetLimit", JSON.stringify(state.budgetLimit));
  }, [state.budgetLimit]);

  function deleteTransaction(id) {
    dispatch({ type: "DELETE_TRANSACTION", payload: id });
  }
  function addTransaction(transaction) {
    dispatch({ type: "ADD_TRANSACTION", payload: transaction });
  }
  function changeCurrency(currency) {
    dispatch({ type: "CHANGE_CURRENCY", payload: currency });
  }
  function updateLimit(limit) {
    dispatch({ type: "SET_LIMIT", payload: limit });
  }
  function updateTransaction(transaction) {
    dispatch({ type: "UPDATE_TRANSACTION", payload: transaction });
  }
  function setEditingItem(item) {
    dispatch({ type: "SET_EDITING_ITEM", payload: item });
  }
  return (
    <GlobalContext.Provider
      value={{
        transactions: state.transactions,
        currency: state.currency,
        budgetLimit: state.budgetLimit,
        editingItem: state.editingItem,
        deleteTransaction,
        addTransaction,
        changeCurrency,
        updateLimit,
        updateTransaction,
        setEditingItem,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
