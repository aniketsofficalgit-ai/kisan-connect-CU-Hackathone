import React from 'react';
import {
  Clock, CheckCircle, Calendar, Truck, CheckCircle2,
  XCircle, AlertTriangle
} from 'lucide-react';
import './Collection.css';

const STANDARD_STEPS = [
  { key: 'Pending', label: 'Request Initiated', desc: 'Farmer submitted collection request' },
  { key: 'Accepted', label: 'Accepted by Partner', desc: 'Partner reviewed waste quantity & quote' },
  { key: 'Scheduled', label: 'Pickup Scheduled', desc: 'Equipment and transport assigned' },
  { key: 'Picked Up', label: 'Waste Picked Up', desc: 'Baled and loaded onto transport vehicles' },
  { key: 'Completed', label: 'Completed & Paid', desc: 'Delivery verified, farmer confirmed receipt' },
];

export const TrackingTimeline = ({ currentStatus, history = [] }) => {
  const isRejected = currentStatus === 'Rejected';
  const isCancelled = currentStatus === 'Cancelled';

  // Determine current step index
  const statusOrder = ['Pending', 'Accepted', 'Scheduled', 'Picked Up', 'Completed'];
  const currentIndex = statusOrder.indexOf(currentStatus);

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2ECE0] shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#E2ECE0]">
        <div>
          <h3 className="font-heading font-black text-base text-[#20392A]">Live Collection Progress Tracker</h3>
          <p className="text-xs text-[#56715E] mt-0.5 font-sans">Transparent milestone tracking from farm-gate to recycler</p>
        </div>
        <span className="px-3 py-1 rounded-full text-[10px] font-heading font-bold bg-[#E8F1E5] text-[#347A46] uppercase tracking-wider">
          {currentStatus}
        </span>
      </div>

      {isRejected || isCancelled ? (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-3 font-sans">
          <XCircle size={24} className="shrink-0 text-red-600" />
          <div>
            <h4 className="font-heading font-bold text-sm">Request {currentStatus}</h4>
            <p className="text-red-700 mt-0.5">
              This collection request has been {currentStatus.toLowerCase()}. The waste listing is restored to available for other partners.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {STANDARD_STEPS.map((step, idx) => {
            const isCompleted = currentIndex > idx;
            const isCurrent = currentIndex === idx;
            const isPending = currentIndex < idx;

            // Check if there is an actual history entry for this step
            const histEntry = history.find(h => h.status === step.key);

            let nodeClass = "timeline-node bg-[#FAF9F3] text-gray-400 border border-[#E2ECE0]";
            if (isCompleted) nodeClass = "timeline-node bg-[#347A46] text-white shadow-xs";
            if (isCurrent) nodeClass = "timeline-node bg-[#E8F1E5] text-[#347A46] border-2 border-[#347A46]";

            return (
              <div
                key={step.key}
                className={`timeline-step ${isCompleted ? 'completed' : ''}`}
              >
                <div className={nodeClass}>
                  {isCompleted ? <CheckCircle size={18} /> : idx + 1}
                </div>

                <div className="flex-1 pb-1 font-sans">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-sm font-heading font-bold ${isCurrent ? 'text-[#347A46]' : isCompleted ? 'text-[#20392A]' : 'text-gray-400'}`}>
                      {step.label}
                    </h4>
                    {histEntry && (
                      <span className="text-[11px] text-gray-400">
                        {new Date(histEntry.created_at).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#56715E] mt-0.5">{step.desc}</p>
                  {histEntry && histEntry.comment && (
                    <p className="mt-2 p-2.5 bg-[#FAF9F3] rounded-xl text-xs text-[#20392A] border border-[#E2ECE0]">
                      "{histEntry.comment}" <span className="text-[10px] text-[#56715E] ml-1">— {histEntry.updated_by}</span>
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TrackingTimeline;
