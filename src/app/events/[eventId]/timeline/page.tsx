'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  CheckSquare,
  PlusCircle,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Filter,
  User,
  X,
  Flag,
} from 'lucide-react';
import { PlanovaStore } from '@/lib/storage';
import { EventItem, TaskItem, Priority, TaskStatus } from '@/types';
import { formatDate, calculateDaysRemaining } from '@/lib/utils';

export default function TimelinePage() {
  const params = useParams();
  const eventId = params.eventId as string;

  const [event, setEvent] = useState<EventItem | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showAddTask, setShowAddTask] = useState(false);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    due_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    priority: 'high' as Priority,
    status: 'todo' as TaskStatus,
    assignee: '',
    category: 'General',
  });

  useEffect(() => {
    if (eventId) {
      const evt = PlanovaStore.getEventById(eventId);
      const currentUser = PlanovaStore.getUser();
      if (evt) {
        setEvent(evt);
        setNewTask((prev) => ({ ...prev, assignee: currentUser?.full_name || 'Event Host' }));
      }
      setTasks(PlanovaStore.getTasks(eventId));
    }
  }, [eventId]);

  const handleToggleComplete = (taskId: string) => {
    PlanovaStore.toggleTaskCompleted(eventId, taskId);
    const updated = PlanovaStore.getTasks(eventId);
    setTasks(updated);

    const updatedEvt = PlanovaStore.getEventById(eventId);
    if (updatedEvt) setEvent(updatedEvt);
  };

  const handleDeleteTask = (taskId: string) => {
    PlanovaStore.deleteTask(eventId, taskId);
    const updated = PlanovaStore.getTasks(eventId);
    setTasks(updated);

    const updatedEvt = PlanovaStore.getEventById(eventId);
    if (updatedEvt) setEvent(updatedEvt);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;

    PlanovaStore.addTask(eventId, {
      ...newTask,
      is_completed: false,
    });
    const updated = PlanovaStore.getTasks(eventId);
    setTasks(updated);

    const updatedEvt = PlanovaStore.getEventById(eventId);
    if (updatedEvt) setEvent(updatedEvt);

    setShowAddTask(false);
    setNewTask({
      title: '',
      description: '',
      due_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      priority: 'medium',
      status: 'todo',
      assignee: PlanovaStore.getUser()?.full_name || 'Event Host',
      category: 'General',
    });
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesStatus =
      filterStatus === 'all'
        ? true
        : filterStatus === 'completed'
        ? t.is_completed
        : !t.is_completed;
    const matchesPriority = filterPriority === 'all' || t.priority === filterPriority;
    return matchesStatus && matchesPriority;
  });

  const completedCount = tasks.filter((t) => t.is_completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-indigo-700" />
            Timeline & Production Tasks
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Backward-scheduled milestones to guarantee every dependency is completed before event day.
          </p>
        </div>

        <button
          onClick={() => setShowAddTask(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-700 hover:bg-indigo-800 shadow-md"
        >
          <PlusCircle className="w-4 h-4" /> Add Task
        </button>
      </div>

      {/* PROGRESS OVERVIEW BAR */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card space-y-3">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-700">Production Completion</span>
          <span className="text-indigo-700">
            {completedCount} of {tasks.length} Completed ({progressPercent}%)
          </span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-emerald-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filterStatus === 'all'
                ? 'bg-indigo-700 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Tasks ({tasks.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filterStatus === 'pending'
                ? 'bg-indigo-700 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Pending ({tasks.length - completedCount})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filterStatus === 'completed'
                ? 'bg-indigo-700 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold">Priority:</span>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* TASK LIST */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">No tasks found</h4>
            <p className="text-xs text-slate-400 mt-1">All filtered tasks are cleared or none have been created yet.</p>
          </div>
        ) : (
          filteredTasks.map((t) => {
            const daysLeft = calculateDaysRemaining(t.due_date);
            const isOverdue = !t.is_completed && daysLeft < 0;

            const priorityBadgeColors: Record<Priority, string> = {
              urgent: 'bg-red-100 text-red-800 border-red-200',
              high: 'bg-amber-100 text-amber-800 border-amber-200',
              medium: 'bg-blue-100 text-blue-800 border-blue-200',
              low: 'bg-slate-100 text-slate-700 border-slate-200',
            };

            return (
              <div
                key={t.id}
                className={`p-4 sm:p-5 rounded-2xl bg-white border transition-all duration-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  t.is_completed ? 'border-slate-200 bg-slate-50/50 opacity-75' : 'border-slate-200/90 hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1">
                  {/* Complete checkbox */}
                  <button
                    onClick={() => handleToggleComplete(t.id)}
                    className={`mt-0.5 w-5 h-5 rounded-lg border-2 flex items-center justify-center transition shrink-0 ${
                      t.is_completed
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-slate-300 hover:border-indigo-600 bg-white'
                    }`}
                  >
                    {t.is_completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4
                        className={`text-sm font-bold leading-tight ${
                          t.is_completed ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {t.title}
                      </h4>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                          priorityBadgeColors[t.priority]
                        }`}
                      >
                        {t.priority}
                      </span>
                      {t.category && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                          {t.category}
                        </span>
                      )}
                    </div>
                    {t.description && (
                      <p className="text-xs text-slate-500 line-clamp-2">{t.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 text-xs shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.assignee || 'Unassigned'}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className={isOverdue ? 'text-red-600 font-bold' : 'text-slate-600'}>
                      {formatDate(t.due_date)}
                    </span>
                    {isOverdue && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700">
                        Overdue
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteTask(t.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 transition"
                    title="Delete Task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ADD TASK MODAL */}
      {showAddTask && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">Add New Milestone Task</h3>
              <button
                onClick={() => setShowAddTask(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="e.g. Confirm DJ playlist and sound check"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Action details, contacts, or requirements..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Priority })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newTask.due_date}
                    onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Assignee
                  </label>
                  <input
                    type="text"
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                    placeholder="e.g. Lead Planner"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                    placeholder="e.g. Catering, Venue, Decor"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTask(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-700 hover:bg-indigo-800 shadow-sm"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
