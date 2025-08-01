'use client';

import { useState, useEffect } from 'react';
import Dashboard from '@/components/Dashboard';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import BudgetManager from '@/components/BudgetManager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, BarChart3, List, Target } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTransactionForm, setShowTransactionForm] = useState(false);

  useEffect(() => {
    fetchTransactions();
    fetchBudgets();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions');
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBudgets = async () => {
    try {
      const response = await fetch('/api/budgets');
      const data = await response.json();
      setBudgets(data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  const handleTransactionSubmit = async (transactionData) => {
    try {
      const method = transactionData._id ? 'PUT' : 'POST';
      const response = await fetch('/api/transactions', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData),
      });

      if (response.ok) {
        fetchTransactions();
        setShowTransactionForm(false);
      }
    } catch (error) {
      console.error('Error submitting transaction:', error);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        fetchTransactions();
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'transactions', label: 'Transactions', icon: List },
    { id: 'budgets', label: 'Budgets', icon: Target },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Personal Finance Visualizer
        </h1>
        <p className="text-gray-600">
          Track your expenses, manage budgets, and visualize your financial health
        </p>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </Button>
          );
        })}
        <Button
          onClick={() => setShowTransactionForm(true)}
          className="flex items-center gap-2 ml-auto bg-green-600 hover:bg-green-700"
        >
          <PlusCircle className="h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      {/* Content */}
      {isLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your financial data...</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {activeTab === 'dashboard' && (
            <Dashboard transactions={transactions} budgets={budgets} />
          )}
          {activeTab === 'transactions' && (
            <TransactionList
              transactions={transactions}
              onEdit={(transaction) => {
                setShowTransactionForm(transaction);
              }}
              onDelete={handleDeleteTransaction}
            />
          )}
          {activeTab === 'budgets' && (
            <BudgetManager
              budgets={budgets}
              transactions={transactions}
              onBudgetUpdate={fetchBudgets}
            />
          )}
        </>
      )}

      {/* Transaction Form Modal */}
      {showTransactionForm && (
        <TransactionForm
          transaction={typeof showTransactionForm === 'object' ? showTransactionForm : null}
          onSubmit={handleTransactionSubmit}
          onClose={() => setShowTransactionForm(false)}
        />
      )}
    </div>
  );
}