"use client";

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { db } from '@/configs/db';
import { Subscriptions } from '@/configs/schema';
import { eq } from 'drizzle-orm';
import { Button } from '@/components/ui/button';
import { Check, X, ShieldAlert, Loader2 } from 'lucide-react';

const ADMIN_EMAILS = ['sithikranjan25@gmail.com', '717823i155@kce.ac.in'];

function AdminDashboard() {
  const { user } = useUser();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const isAdmin = ADMIN_EMAILS.includes(userEmail);

  useEffect(() => {
    if (isAdmin) {
      getSubmissions();
    }
  }, [isAdmin]);

  const getSubmissions = async () => {
    try {
      setLoading(true);
      const result = await db.select().from(Subscriptions);
      // Sort descending by ID
      const sorted = result.sort((a, b) => b.id - a.id);
      setSubmissions(sorted);
    } catch (err) {
      console.error("Error fetching submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, newStatus) => {
    try {
      setProcessingId(id);
      await db.update(Subscriptions)
        .set({ status: newStatus })
        .where(eq(Subscriptions.id, id));
      
      // Update local state list
      setSubmissions(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
    } catch (err) {
      console.error("Error updating subscription status:", err);
      alert("Failed to update status.");
    } finally {
      setProcessingId(null);
    }
  };

  if (!userEmail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        <p className="text-gray-500">Loading admin panel...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-red-50/10 dark:bg-red-950/10 border border-red-200/40 rounded-2xl max-w-lg mx-auto mt-10">
        <ShieldAlert className="h-16 w-16 text-red-500 mb-4 animate-bounce" />
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Access Denied</h1>
        <p className="text-gray-500 max-w-sm">
          You do not have administrative permissions to access the payment approval dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8 border-b border-gray-100 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Admin Payment Approvals</h1>
          <p className="text-gray-500 mt-1">Verify manual UPI transactions (UTR) against bank records and activate plans.</p>
        </div>
        <Button onClick={getSubmissions} variant="outline" className="rounded-xl">Refresh List</Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900">
          <p className="text-gray-500 font-medium">No subscription requests submitted yet.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800 text-xs font-semibold uppercase text-gray-500 tracking-wider">
                  <th className="p-4">Email</th>
                  <th className="p-4">UTR Number</th>
                  <th className="p-4">Plan / Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date Submitted</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-sm">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/10 transition-colors">
                    <td className="p-4 font-medium text-gray-900 dark:text-white">{sub.email}</td>
                    <td className="p-4 font-mono select-all font-semibold text-blue-600 dark:text-blue-400">{sub.utr}</td>
                    <td className="p-4">
                      <div className="font-semibold text-gray-800 dark:text-slate-200">{sub.plan}</div>
                      <div className="text-xs text-gray-400">{sub.amount}</div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        sub.status === 'approved' 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : sub.status === 'rejected'
                            ? 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 text-xs">{new Date(sub.createdAt).toLocaleString()}</td>
                    <td className="p-4">
                      {sub.status === 'pending' ? (
                        <div className="flex gap-2 justify-center">
                          <Button
                            onClick={() => handleAction(sub.id, 'approved')}
                            disabled={processingId !== null}
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex gap-1 items-center px-3"
                          >
                            <Check className="h-4 w-4" /> Approve
                          </Button>
                          <Button
                            onClick={() => handleAction(sub.id, 'rejected')}
                            disabled={processingId !== null}
                            size="sm"
                            variant="destructive"
                            className="rounded-lg flex gap-1 items-center px-3"
                          >
                            <X className="h-4 w-4" /> Reject
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center text-xs text-gray-400">Processed</div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
