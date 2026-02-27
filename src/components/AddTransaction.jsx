import React, { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { categorySettings } from '../utils/categoryConfig'; 

const expenseCategories = ['Продукты', 'Транспорт', 'Спорт','Развлечения', 'Счета', 'Одежда', 'Здоровье', 'Другое'];
const incomeCategories = ['Зарплата', 'Фриланс', 'Подарки', 'Инвестиции', 'Продажа вещей', 'Другое'];

export const AddTransaction = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState(expenseCategories[0]);
  const [transactionCurrency, setTransactionCurrency] = useState('KGS'); 

  const { addTransaction, updateTransaction, editingItem, setEditingItem } = useContext(GlobalContext);

  useEffect(() => {
    if (editingItem) {
      setDescription(editingItem.description);
      setAmount(editingItem.amount);
      setType(editingItem.type);
      setCategory(editingItem.category);
      setTransactionCurrency(editingItem.currency || 'KGS');
    }
  }, [editingItem]);

  const handleTypeChange = (e) => {
    const selectedType = e.target.value;
    setType(selectedType);
    setCategory(selectedType === 'income' ? incomeCategories[0] : expenseCategories[0]);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!description || !amount) {
      alert('Пожалуйста, введите описание и сумму!');
      return;
    }

    const transactionData = {
      id: editingItem ? editingItem.id : Date.now(), 
      description,
      amount: Number(amount),
      type,
      category,
      currency: transactionCurrency,
      date: editingItem ? editingItem.date : new Date().toISOString().split('T')[0] 
    };

  
    if (editingItem) {
      updateTransaction(transactionData);
    } else {
      addTransaction(transactionData);
    }

    setDescription('');
    setAmount('');
    setEditingItem(null);
  };

  const currentCategories = type === 'income' ? incomeCategories : expenseCategories;

  return (
    <div className="form-container">
      <h3>{editingItem ? '✏️ Редактирование записи' : 'Новая запись'}</h3>
      <form onSubmit={onSubmit}>
        
        <div className="form-group">
          <label>Описание</label>
          <input type="text" className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Например: Покупка кофе" />
        </div>

        <div className="form-group">
          <label>Сумма и Валюта</label>
          <div className="amount-input-group">
            <input type="number" className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" />
            <select className="form-control" value={transactionCurrency} onChange={(e) => setTransactionCurrency(e.target.value)}>
              <option value="KGS">KGS</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="RUB">RUB</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Тип транзакции</label>
          <select className="form-control" value={type} onChange={handleTypeChange}>
            <option value="expense">Расход</option>
            <option value="income">Доход</option>
          </select>
        </div>

        <div className="form-group">
          <label>Категория</label>
          <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
            {currentCategories.map((cat, index) => {
              const icon = categorySettings[cat]?.icon || '🏷️';
              return (
                <option key={index} value={cat}>
                  {icon} {cat}
                </option>
              );
            })}
          </select>
        </div>

        <button type="submit" className={`btn ${type === 'income' ? 'btn-income' : 'btn-expense'}`}>
          {editingItem ? 'Сохранить изменения' : (type === 'income' ? '+ Добавить доход' : '- Добавить расход')}
        </button>
        
        {/* Кнопка отмены редактирования */}
        {editingItem && (
          <button type="button" className="btn" style={{ background: '#888', marginTop: '10px' }} onClick={() => {
            setEditingItem(null);
            setDescription(''); setAmount('');
          }}>
            Отменить
          </button>
        )}
      </form>
    </div>
  );
};