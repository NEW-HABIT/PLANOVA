'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  PieChart as PieIcon,
  PlusCircle,
  Download,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  DollarSign,
  Trash2,
  CheckCircle2,
  Calendar,
  Layers,
  Edit2,
  X,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import { PlanovaStore } from '@/lib/storage';
import { EventItem, BudgetCategoryItem, ExpenseItem } from '@/types';
import { calculateBudgetMetrics, generateCostSavingRecommendations } from '@/lib/budget-calc';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function BudgetManagerPage() {
  const params = useParams();
  const eventId = params.eventId as string;

  const [event, setEvent] = useState<EventItem | null>(null);
  const [categories, setCategories] = useState<BudgetCategoryItem[]>([]);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);

  // Add Expense Modal
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: '',
    category_id: '',
    amount: 10000,
    date: new Date().toISOString().split('T')[0],
    payment_status: 'paid' as 'paid' | 'pending' | 'partially_paid',
    vendor_name: '',
    notes: '',
  });

  useEffect(() => {
    if (eventId) {
      const evt = PlanovaStore.getEventById(eventId);
      if (evt) setEvent(evt);

      const cats = PlanovaStore.getBudgetCategories(eventId);
      setCategories(cats);

      const exps = PlanovaStore.getExpenses(eventId);
      setExpenses(exps);
    }
  }, [eventId]);

  if (!event) {
    return <div className="p-8 text-center text-slate-500">Loading budget...</div>;
  }

  // Calculate high-precision metrics
  const metrics = calculateBudgetMetrics(event.total_budget, categories, expenses);
  const costSavingsTips = generateCostSavingRecommendations(metrics.categoriesWithSpending, event.currency);

  // Handle Add Expense
  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.title || !newExpense.category_id || newExpense.amount <= 0) return;

    PlanovaStore.addExpense(eventId, newExpense);
    setExpenses(PlanovaStore.getExpenses(eventId));
    setShowAddExpense(false);
    setNewExpense({
      title: '',
      category_id: categories[0]?.id || '',
      amount: 5000,
      date: new Date().toISOString().split('T')[0],
      payment_status: 'paid',
      vendor_name: '',
      notes: '',
    });
  };

  // Handle Delete Expense
  const handleDeleteExpense = (id: string) => {
    if (confirm('Delete this expense entry?')) {
      PlanovaStore.deleteExpense(eventId, id);
      setExpenses(PlanovaStore.getExpenses(eventId));
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Category,Planned Amount,Spent Amount,Remaining,Status\n';

    metrics.categoriesWithSpending.forEach((cat) => {
      csvContent += `"${cat.name}",${cat.allocated_amount},${cat.spent_amount},${cat.remaining_amount},${cat.is_over ? 'OVER BUDGET' : 'Within Budget'}\n`;
    });

    csvContent += '\n\nExpenses Log\nTitle,Category,Vendor,Amount,Date,Status,Notes\n';
    expenses.forEach((exp) => {
      const catName = categories.find((c) => c.id === exp.category_id)?.name || 'General';
      csvContent += `"${exp.title}","${catName}","${exp.vendor_name || ''}",${exp.amount},"${exp.date}","${exp.payment_status}","${exp.notes || ''}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}_Budget_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Chart data
  const pieChartData = metrics.categoriesWithSpending.map((cat) => ({
    name: cat.name,
    value: cat.allocated_amount,
    color: cat.color || '#4338CA',
  }));

  const barChartData = metrics.categoriesWithSpending.map((cat) => ({
    name: cat.name.length > 12 ? cat.name.slice(0, 10) + '...' : cat.name,
    Allocated: cat.allocated_amount,
    Spent: cat.spent_amount,
  }));

  return (
    <div className="space-y-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-indigo-700" />
            Smart Budget & Expense Manager
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Auto-allocated target breakdown with real-time variance and emergency reserve protection.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddExpense(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-700 hover:bg-indigo-800 shadow-md"
          >
            <PlusCircle className="w-4 h-4" /> Add Expense
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-500" /> Export CSV
          </button>
        </div>
      </div>

      {/* OVER-BUDGET ALERT BANNER */}
      {metrics.isOverBudget && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-800 text-xs">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          <div>
            <span className="font-bold block">Over-Budget Warning</span>
            Recorded expenses exceed your planned allocation by{' '}
            <span className="font-bold">
              {formatCurrency(metrics.totalSpent - metrics.totalBudget, event.currency)}
            </span>
            . Consider reviewing the cost-saving suggestions below.
          </div>
        </div>
      )}

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card">
          <span className="text-xs font-bold text-slate-500 uppercase">Target Budget</span>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {formatCurrency(metrics.totalBudget, event.currency)}
          </p>
          <span className="text-[11px] text-slate-400">Strict mode enabled</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card">
          <span className="text-xs font-bold text-slate-500 uppercase">Total Spent & Committed</span>
          <p className="text-2xl font-black text-indigo-700 mt-1">
            {formatCurrency(metrics.totalSpent, event.currency)}
          </p>
          <span className="text-[11px] text-indigo-600 font-semibold">
            {metrics.spentPercentage}% of total budget
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card">
          <span className="text-xs font-bold text-slate-500 uppercase">Remaining Balance</span>
          <p
            className={`text-2xl font-black mt-1 ${
              metrics.remainingBudget >= 0 ? 'text-emerald-600' : 'text-red-600'
            }`}
          >
            {formatCurrency(metrics.remainingBudget, event.currency)}
          </p>
          <span className="text-[11px] text-slate-400">
            {metrics.remainingBudget >= 0 ? 'Available to spend' : 'Deficit'}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card">
          <span className="text-xs font-bold text-slate-500 uppercase">Emergency Reserve</span>
          <p className="text-2xl font-black text-amber-600 mt-1">
            {formatCurrency(
              Math.round((metrics.totalBudget * (event.emergency_reserve_percentage || 8)) / 100),
              event.currency
            )}
          </p>
          <span className="text-[11px] text-slate-400">
            {event.emergency_reserve_percentage || 8}% Contingency preserved
          </span>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Doughnut Chart */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Planned Allocation Breakdown</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => formatCurrency(val, event.currency)}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart Comparison */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Planned vs Spent By Category</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-25} textAnchor="end" />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip formatter={(val: number) => formatCurrency(val, event.currency)} />
                <Bar dataKey="Allocated" fill="#4338CA" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Spent" fill="#7C3AED" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* CATEGORY LEVEL BREAKDOWN TABLE */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-card overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Category Budgets & Variance</h3>
          <span className="text-xs text-slate-500">{categories.length} categories</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                <th className="p-4">Category</th>
                <th className="p-4">Share (%)</th>
                <th className="p-4">Planned</th>
                <th className="p-4">Spent</th>
                <th className="p-4">Remaining</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {metrics.categoriesWithSpending.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                    {cat.name}
                  </td>
                  <td className="p-4">{cat.percentage}%</td>
                  <td className="p-4 font-semibold">{formatCurrency(cat.allocated_amount, event.currency)}</td>
                  <td className="p-4 font-semibold text-indigo-700">
                    {formatCurrency(cat.spent_amount, event.currency)}
                  </td>
                  <td className="p-4">
                    <span className={cat.remaining_amount < 0 ? 'text-red-600 font-bold' : 'text-emerald-600 font-semibold'}>
                      {formatCurrency(cat.remaining_amount, event.currency)}
                    </span>
                  </td>
                  <td className="p-4">
                    {cat.is_over ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">
                        Over by {formatCurrency(cat.spent_amount - cat.allocated_amount, event.currency)}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        On Track ({cat.spent_percentage}%)
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECORDED EXPENSES TABLE */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-card overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recorded Expenses & Invoices</h3>
            <span className="text-xs text-slate-500">{expenses.length} payments recorded</span>
          </div>
          <button
            onClick={() => setShowAddExpense(true)}
            className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5" /> Add New
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                <th className="p-4">Title / Item</th>
                <th className="p-4">Category</th>
                <th className="p-4">Vendor</th>
                <th className="p-4">Date</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Payment Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No expenses recorded yet. Click "Add Expense" to track receipts and advance payments.
                  </td>
                </tr>
              ) : (
                expenses.map((exp) => {
                  const cat = categories.find((c) => c.id === exp.category_id);
                  return (
                    <tr key={exp.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-4 font-bold text-slate-900">{exp.title}</td>
                      <td className="p-4 text-slate-600">{cat?.name || 'General'}</td>
                      <td className="p-4 text-slate-600">{exp.vendor_name || '—'}</td>
                      <td className="p-4 text-slate-500">{formatDate(exp.date)}</td>
                      <td className="p-4 font-bold text-slate-900">
                        {formatCurrency(exp.amount, event.currency)}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            exp.payment_status === 'paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : exp.payment_status === 'partially_paid'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {exp.payment_status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteExpense(exp.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded transition"
                          title="Delete Expense"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI COST-SAVING ALTERNATIVES */}
      <div className="p-6 sm:p-8 rounded-3xl bg-indigo-50/50 border border-indigo-100 shadow-card">
        <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5 mb-4">
          <Sparkles className="w-4 h-4 text-violet-600" /> AI-Generated Cost-Saving Recommendations
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {costSavingsTips.map((tip, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white border border-indigo-100 shadow-sm space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{tip.category}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {tip.saving}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{tip.tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ADD EXPENSE MODAL */}
      {showAddExpense && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">Record New Expense</h3>
              <button
                onClick={() => setShowAddExpense(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Expense Title *
                </label>
                <input
                  type="text"
                  required
                  value={newExpense.title}
                  onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                  placeholder="e.g. Lawn advance deposit"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Category *
                  </label>
                  <select
                    value={newExpense.category_id}
                    onChange={(e) => setNewExpense({ ...newExpense, category_id: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Amount ({event.currency}) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newExpense.amount}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, amount: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Date</label>
                  <input
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Status</label>
                  <select
                    value={newExpense.payment_status}
                    onChange={(e) =>
                      setNewExpense({
                        ...newExpense,
                        payment_status: e.target.value as 'paid' | 'pending' | 'partially_paid',
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                  >
                    <option value="paid">Paid in Full</option>
                    <option value="partially_paid">Partially Paid</option>
                    <option value="pending">Pending Payment</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Vendor Name (Optional)
                </label>
                <input
                  type="text"
                  value={newExpense.vendor_name}
                  onChange={(e) => setNewExpense({ ...newExpense, vendor_name: e.target.value })}
                  placeholder="e.g. Jai Mahal Palace"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddExpense(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-700 hover:bg-indigo-800 shadow-sm"
                >
                  Record Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
