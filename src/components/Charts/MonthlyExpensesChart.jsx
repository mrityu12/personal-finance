import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/utils';

export default function MonthlyExpensesChart({ transactions }) {
  // Group transactions by month
  const monthlyData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: monthLabel,
          amount: 0,
          count: 0,
        };
      }
      
      acc[monthKey].amount += transaction.amount;
      acc[monthKey].count += 1;
      
      return acc;
    }, {});

  const chartData = Object.values(monthlyData)
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6); // Show last 6 months

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <p>No expense data available</p>
          <p className="text-sm">Add some transactions to see the chart</p>
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
            dataKey="month" 
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
            formatter={(value) => [formatCurrency(value), 'Amount']}
            labelStyle={{ color: '#374151' }}
            contentStyle={{ 
              backgroundColor: '#f9fafb', 
              border: '1px solid #e5e7eb',
              borderRadius: '6px'
            }}
          />
          <Bar 
            dataKey="amount" 
            fill="#ef4444" 
            radius={[4, 4, 0, 0]}
            className="hover:opacity-80"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
