// ============================================================
// src/components/DashboardMetrics.tsx — RoleRadar AI KPI Cards
// ============================================================


import type { JobEntry } from '../types';

interface DashboardMetricsProps {
  jobs: JobEntry[];
}

function daysSince(isoDate: string): number {
  const applied = new Date(isoDate);
  const now = new Date();
  return Math.floor((now.getTime() - applied.getTime()) / (1000 * 60 * 60 * 24));
}

interface MetricCardProps {
  label: string;
  value: number;
  icon: string;
  color: string;
  subtext?: string;
}

function MetricCard({ label, value, icon, color, subtext }: MetricCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/5 bg-slate-900/60 backdrop-blur-sm p-5 flex flex-col gap-1 transition-all duration-300 hover:scale-[1.02] hover:border-white/10 hover:shadow-xl`}
    >
      {/* Ambient glow */}
      <div
        className={`absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-20 blur-2xl ${color}`}
      />

      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        <span className={`text-3xl font-bold tracking-tight ${color.replace('bg-', 'text-')}`}>
          {value}
        </span>
      </div>
      <p className="text-sm font-semibold text-slate-300 mt-1">{label}</p>
      {subtext && <p className="text-xs text-slate-500">{subtext}</p>}
    </div>
  );
}

export function DashboardMetrics({ jobs }: DashboardMetricsProps) {
  const active = jobs.filter((j) => j.status !== 'Rejected').length;
  const followUps = jobs.filter(
    (j) => j.status === 'Applied' && daysSince(j.dateApplied) >= 7
  ).length;
  const interviews = jobs.filter((j) => j.status === 'Interview').length;
  const offers = jobs.filter((j) => j.status === 'Offer').length;
  const total = jobs.length;

  const conversionRate =
    total > 0 ? Math.round((interviews / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        label="Active Applications"
        value={active}
        icon="🚀"
        color="bg-blue-500"
        subtext={`${total} total tracked`}
      />
      <MetricCard
        label="Follow-Ups Needed"
        value={followUps}
        icon="⚠️"
        color="bg-amber-500"
        subtext="Applied ≥ 7 days ago"
      />
      <MetricCard
        label="Interviews Scheduled"
        value={interviews}
        icon="🎯"
        color="bg-orange-500"
        subtext={`${conversionRate}% conversion rate`}
      />
      <MetricCard
        label="Offers Received"
        value={offers}
        icon="🏆"
        color="bg-emerald-500"
        subtext="You're doing great!"
      />
    </div>
  );
}
