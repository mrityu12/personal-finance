import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { EXPENSE_CATEGORIES } from '@/data/categories';

export default function BudgetComparisonChart({ budgets, transactions }) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const currentMonthExpenses = transactions
    .filter(t => {
      const transactionDate = new Date(t.date);
      return t.type === 'expense' && 
             transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });

  const chartData = budgets.map(budget => {
    const categoryInfo = EXPENSE_CATEGORIES.find(cat => cat.value === budget.category);
    const actualSpending = currentMonthExpenses
      .filter(t => t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      category: categoryInfo?.label || budget.category,
      budget: budget.amount,
      actual: actualSpending,
      remaining: Math.max(0, budget.amount - actualSpending),
      over: Math.max(0, actualSpending - budget.amount),
      icon: categoryInfo?.icon || '📦',
    };
  });

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <p>No budget data available</p>
          <p className="text-sm">Set up budgets to see the comparison</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="category" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            formatter={(value, name) => [formatCurrency(value), name]}
            labelStyle={{ color: '#374151' }}
            contentStyle={{ 
              backgroundColor: '#f9fafb', 
              border: '1px solid #e5e7eb',
              borderRadius: '6px'
            }}
          />
          <Legend />
          <Bar dataKey="budget" fill="#3b82f6" name="Budget" radius={[2, 2, 0, 0]} />
          <Bar dataKey="actual" fill="#ef4444" name="Actual" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
