import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MonthlyExpensesChart from '@/components/Charts/MonthlyExpensesChart';
import CategoryPieChart from '@/components/Charts/CategoryPieChart';
import BudgetComparisonChart from '@/components/Charts/BudgetComparisonChart';
import { formatCurrency } from '@/lib/utils';
import { EXPENSE_CATEGORIES } from '@/data/categories';
import { DollarSign, TrendingDown, TrendingUp, Target } from 'lucide-react';

export default function Dashboard({ transactions, budgets }) {
  // Calculate summary statistics
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const currentMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === currentMonth && 
           transactionDate.getFullYear() === currentYear;
  });

  const totalExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);

  const recentTransactions = transactions.slice(0, 5);

  // Calculate category spending
  const categorySpending = EXPENSE_CATEGORIES.map(category => {
    const spending = currentMonthTransactions
      .filter(t => t.type === 'expense' && t.category === category.value)
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      ...category,
      amount: spending,
    };
  }).filter(c => c.amount > 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="income-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              Income This Month
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {formatCurrency(totalIncome)}
            </div>
          </CardContent>
        </Card>

        <Card className="expense-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800">
              Expenses This Month
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">
              {formatCurrency(totalExpenses)}
            </div>
          </CardContent>
        </Card>

        <Card className="budget-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              Total Budget
            </CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {formatCurrency(totalBudget)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Net Balance
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              totalIncome - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(totalIncome - totalExpenses)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlyExpensesChart transactions={transactions} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryPieChart data={categorySpending} />
          </CardContent>
        </Card>
      </div>

      {/* Budget vs Actual */}
      {budgets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Budget vs Actual Spending</CardTitle>
          </CardHeader>
          <CardContent>
            <BudgetComparisonChart 
              budgets={budgets} 
              transactions={currentMonthTransactions} 
            />
          </CardContent>
        </Card>
      )}

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div 
                key={transaction._id} 
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    transaction.type === 'expense' ? 'bg-red-500' : 'bg-green-500'
                  }`}></div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className={`font-bold ${
                  transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'
                }`}>
                  {transaction.type === 'expense' ? '-' : '+'}
                  {formatCurrency(transaction.amount)}
                </div>
              </div>
            ))}
            {recentTransactions.length === 0 && (
              <p className="text-center text-gray-600 py-8">
                No transactions yet. Add your first transaction to get started!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
