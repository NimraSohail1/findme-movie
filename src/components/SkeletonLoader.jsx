import React from 'react';

export default function SkeletonLoader({ count = 6 }) {
  return (
    <div className="horizontal-scroll-container">
      <div className="horizontal-movie-row">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            style={{
              width: '185px',
              height: '280px',
              borderRadius: '12px',
              backgroundColor: 'var(--color-surface-card)',
              border: '1px solid var(--color-border-default)',
              overflow: 'hidden',
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Shimmer Image Area */}
            <div
              className="skeleton-shimmer"
              style={{
                width: '100%',
                height: '220px'
              }}
            />
            {/* Shimmer Text Area */}
            <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div
                className="skeleton-shimmer"
                style={{ height: '12px', width: '80%', borderRadius: '4px' }}
              />
              <div
                className="skeleton-shimmer"
                style={{ height: '10px', width: '40%', borderRadius: '4px' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
