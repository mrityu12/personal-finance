import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/utils';
import { EXPENSE_CATEGORIES } from '@/data/categories';
import { Plus, Edit, Trash2, Target, AlertTriangle } from 'lucide-react';

export default function BudgetManager({ budgets, transactions, onBudgetUpdate }) {
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    month: new Date().toISOString().slice(0, 7), // YYYY-MM format
  });

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Calculate spending for each budget
  const budgetData = budgets.map(budget => {
    const categoryTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return t.type === 'expense' && 
             t.category === budget.category &&
             transactionDate.getMonth() === currentMonth &&
             transactionDate.getFullYear() === currentYear;
    });

    const spent = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
    const categoryInfo = EXPENSE_CATEGORIES.find(cat => cat.value === budget.category);

    return {
      ...budget,
      spent,
      remaining: Math.max(0, budget.amount - spent),
      percentage: Math.min(100, percentage),
      isOverBudget: spent > budget.amount,
      categoryInfo,
    };
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const method = editingBudget ? 'PUT' : 'POST';
      const budgetPayload = editingBudget 
        ? { ...formData, _id: editingBudget._id }
        : formData;

      const response = await fetch('/api/budgets', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(budgetPayload),
      });

      if (response.ok) {
        onBudgetUpdate();
        setShowBudgetForm(false);
        setEditingBudget(null);
        setFormData({
          category: '',
          amount: '',
          month: new Date().toISOString().slice(0, 7),
        });
      }
    } catch (error) {
      console.error('Error saving budget:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch('/api/budgets', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        onBudgetUpdate();
      }
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setFormData({
      category: budget.category,
      amount: budget.amount.toString(),
      month: budget.month,
    });
    setShowBudgetForm(true);
  };

  const usedCategories = budgets.map(b => b.category);
  const availableCategories = EXPENSE_CATEGORIES.filter(cat => 
    !usedCategories.includes(cat.value) || editingBudget?.category === cat.value
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Budget Management</h2>
          <p className="text-gray-600">Set and track your monthly spending limits</p>
        </div>
        <Button 
          onClick={() => setShowBudgetForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Budget
        </Button>
      </div>

      {/* Budget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgetData.map((budget) => (
          <Card key={budget._id} className={`${budget.isOverBudget ? 'border-red-300 bg-red-50' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{budget.categoryInfo?.icon || '📦'}</span>
                  <div>
                    <CardTitle className="text-lg">{budget.categoryInfo?.label || budget.category}</CardTitle>
                    <p className="text-sm text-gray-600">Monthly Budget</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(budget)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(budget._id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Budget Overview */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Budget</span>
                  <span className="font-semibold">{formatCurrency(budget.amount)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Spent</span>
                  <span className={`font-semibold ${budget.isOverBudget ? 'text-red-600' : 'text-gray-900'}`}>
                    {formatCurrency(budget.spent)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Remaining</span>
                  <span className={`font-semibold ${
                    budget.isOverBudget ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {budget.isOverBudget 
                      ? `-${formatCurrency(budget.spent - budget.amount)}`
                      : formatCurrency(budget.remaining)
                    }
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <Progress 
                    value={budget.percentage} 
                    className={`h-2 ${budget.isOverBudget ? 'bg-red-200' : ''}`}
                  />
                  <div className="flex justify-between items-center text-xs">
                    <span className={budget.isOverBudget ? 'text-red-600' : 'text-gray-600'}>
                      {budget.percentage.toFixed(1)}% used
                    </span>
                    {budget.isOverBudget && (
                      <div className="flex items-center gap-1 text-red-600">
                        <AlertTriangle className="h-3 w-3" />
                        Over budget
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Empty State */}
        {budgetData.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No budgets set</h3>
              <p className="text-gray-600 text-center mb-4">
                Create your first budget to start tracking your spending limits
              </p>
              <Button onClick={() => setShowBudgetForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Budget
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Budget Form Dialog */}
      {showBudgetForm && (
        <Dialog open={true} onOpenChange={(open) => {
          if (!open) {
            setShowBudgetForm(false);
            setEditingBudget(null);
            setFormData({
              category: '',
              amount: '',
              month: new Date().toISOString().slice(0, 7),
            });
          }
        }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingBudget ? 'Edit Budget' : 'Add New Budget'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category */}
              <div className="space-y-2">
                <Label>Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <span className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          {category.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="budget-amount">Monthly Budget ($)</Label>
                <Input
                  id="budget-amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  required
                />
              </div>

              {/* Month */}
              <div className="space-y-2">
                <Label htmlFor="budget-month">Month</Label>
                <Input
                  id="budget-month"
                  type="month"
                  value={formData.month}
                  onChange={(e) => setFormData(prev => ({ ...prev, month: e.target.value }))}
                  required
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingBudget ? 'Update Budget' : 'Add Budget'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowBudgetForm(false);
                    setEditingBudget(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}