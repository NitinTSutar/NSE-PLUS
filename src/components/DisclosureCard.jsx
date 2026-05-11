import React from 'react';

const DisclosureCard = ({ item }) => {
  if (!item) return null;

  return (
    <div className="glass-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{item.title || 'Disclosure'}</h2>
          <p className="text-secondary text-sm mt-1">{item.company}</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wider text-secondary">Event Date</p>
          <p className="text-sm font-semibold text-foreground">{item.eventDate || '-'}</p>
        </div>
      </div>

      <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <div className="bg-card p-3 rounded-xl border border-border">
          <p className="text-xs uppercase tracking-wider text-secondary">Symbol</p>
          <p className="text-sm font-semibold text-foreground">{item.symbol || '-'}</p>
        </div>
        <div className="bg-card p-3 rounded-xl border border-border">
          <p className="text-xs uppercase tracking-wider text-secondary">ISIN</p>
          <p className="text-sm font-semibold text-foreground">{item.isin || '-'}</p>
        </div>
      </div>

      {item.highlights?.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary mb-3">Highlights</h3>
          <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            {item.highlights.map((highlight) => (
              <div key={highlight.label} className="bg-card p-3 rounded-xl border border-border">
                <p className="text-xs uppercase tracking-wider text-secondary mb-1">{highlight.label}</p>
                <p className="text-sm font-semibold text-foreground" style={{ wordBreak: 'break-word' }}>
                  {highlight.value || '-'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {item.details?.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary mb-3">Details</h3>
          <div className="glass-card border border-border" style={{ overflow: 'hidden' }}>
            <table className="w-full border border-border" style={{ tableLayout: 'fixed', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th className="p-3 text-left text-xs uppercase tracking-wider text-secondary border border-border" style={{ width: '35%' }}>
                    Field
                  </th>
                  <th className="p-3 text-left text-xs uppercase tracking-wider text-secondary border border-border">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {item.details.map((detail) => (
                  <tr key={detail.label}>
                    <td className="p-3 text-sm font-medium text-foreground border border-border" style={{ width: '35%' }}>
                      {detail.label}
                    </td>
                    <td className="p-3 text-sm text-secondary border border-border" style={{ wordBreak: 'break-word' }}>
                      {detail.value || '-'}
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
};

export default DisclosureCard;
