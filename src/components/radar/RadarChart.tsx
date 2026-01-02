'use client';

import { useMemo } from 'react';
import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ChartOptions,
  TooltipItem,
  Plugin,
} from 'chart.js';
import { Blip, Quadrant, Ring } from '@/core/types';

// Custom plugin to render first letter labels on blip dots
const blipLabelPlugin: Plugin<'scatter'> = {
  id: 'blipLabels',
  afterDatasetsDraw(chart) {
    const { ctx, chartArea } = chart;
    if (!chartArea) return;

    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      
      meta.data.forEach((point, index) => {
        const dataPoint = dataset.data[index] as { x: number; y: number; blip: Blip };
        if (!dataPoint.blip || !dataPoint.blip.name) return;

        const { x, y } = point.getCenterPoint();
        const firstLetter = dataPoint.blip.name.charAt(0).toUpperCase();

        ctx.save();
        ctx.font = BLIP_LABEL_FONT;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Add text shadow for better contrast and accessibility
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 3;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        ctx.fillStyle = BLIP_LABEL_COLOR;
        ctx.fillText(firstLetter, x, y);
        ctx.restore();
      });
    });
  },
};

ChartJS.register(LinearScale, PointElement, Tooltip, Legend, blipLabelPlugin);

interface RadarChartProps {
  blips: Blip[];
  onBlipClick?: (blip: Blip) => void;
}

const RINGS: Ring[] = ['Adopt', 'Trial', 'Assess', 'Hold'];
const QUADRANTS: Quadrant[] = [
  'Languages & Frameworks',
  'Tools',
  'Platforms',
  'Techniques',
];

const RING_RADIUS = {
  Adopt: 0.25,
  Trial: 0.5,
  Assess: 0.75,
  Hold: 1.0,
};

const QUADRANT_COLORS = {
  'Languages & Frameworks': 'rgba(59, 130, 246, 0.8)', // blue-500
  'Tools': 'rgba(34, 197, 94, 0.8)', // green-500
  'Platforms': 'rgba(249, 115, 22, 0.8)', // orange-500
  'Techniques': 'rgba(168, 85, 247, 0.8)', // purple-500
};

// Constants for deterministic pseudo-random positioning
const ANGLE_JITTER_SEED = 17;
const RADIUS_JITTER_SEED = 23;
const JITTER_MODULO_BASE = 100;

// Label styling
const BLIP_LABEL_FONT = 'bold 11px sans-serif';
const BLIP_LABEL_COLOR = '#ffffff';

/**
 * Generate a deterministic pseudo-random value between -0.5 and 0.5
 * based on an index and seed value. This ensures consistent positioning
 * across renders while providing good distribution.
 */
function getPseudoRandomValue(index: number, seed: number): number {
  return ((index * seed) % JITTER_MODULO_BASE) / JITTER_MODULO_BASE - 0.5;
}

export function RadarChart({ blips, onBlipClick }: RadarChartProps) {
  const chartData = useMemo(() => {
    const datasets = QUADRANTS.map((quadrant, qIndex) => {
      const quadrantBlips = blips.filter((b) => b.quadrant === quadrant);
      
      // Calculate angle range for this quadrant
      const startAngle = (qIndex * Math.PI) / 2;
      const endAngle = ((qIndex + 1) * Math.PI) / 2;
      
      const data = quadrantBlips.map((blip, index) => {
        const ringRadius = RING_RADIUS[blip.ring];
        
        // Distribute blips within the quadrant with deterministic pseudo-randomization
        const angleSpread = endAngle - startAngle;
        // Better angular distribution with pseudo-random spread based on index
        const baseAngleOffset = (index / Math.max(quadrantBlips.length - 1, 1)) * angleSpread * 0.7;
        // Use index-based pseudo-random for consistent positioning
        const angleJitter = getPseudoRandomValue(index, ANGLE_JITTER_SEED) * angleSpread * 0.2;
        const angle = startAngle + baseAngleOffset + angleSpread * 0.15 + angleJitter;
        
        // Deterministic radial jitter for better ring distribution
        const radiusJitter = getPseudoRandomValue(index, RADIUS_JITTER_SEED) * 0.15;
        const radius = ringRadius - 0.12 + radiusJitter;
        
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        return {
          x,
          y,
          blip,
        };
      });

      return {
        label: quadrant,
        data,
        backgroundColor: QUADRANT_COLORS[quadrant],
        borderColor: QUADRANT_COLORS[quadrant].replace(/[\d.]+\)$/, '1)'), // Replace opacity with 1
        borderWidth: 2,
        pointRadius: 11,
        pointHoverRadius: 13,
      };
    });

    return { datasets };
  }, [blips]);

  const options: ChartOptions<'scatter'> = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1,
    scales: {
      x: {
        min: -1.1,
        max: 1.1,
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        min: -1.1,
        max: 1.1,
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
        border: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'scatter'>) => {
            const dataPoint = context.raw as { x: number; y: number; blip: Blip };
            return [
              dataPoint.blip.name,
              `Ring: ${dataPoint.blip.ring}`,
              `Quadrant: ${dataPoint.blip.quadrant}`,
            ];
          },
        },
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0 && onBlipClick) {
        const element = elements[0];
        const datasetIndex = element.datasetIndex;
        const index = element.index;
        const dataPoint = chartData.datasets[datasetIndex].data[index];
        if ('blip' in dataPoint) {
          onBlipClick(dataPoint.blip);
        }
      }
    },
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Ring labels */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <svg className="w-full h-full" viewBox="-110 -110 220 220">
          {/* Draw rings */}
          {RINGS.map((ring, index) => {
            const radius = RING_RADIUS[ring] * 100;
            return (
              <g key={ring}>
                <circle
                  cx="0"
                  cy="0"
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-gray-300"
                  opacity="0.3"
                />
                <text
                  x="0"
                  y={-radius + 3}
                  textAnchor="middle"
                  className="text-xs fill-gray-600"
                  fontSize="2.5"
                >
                  {ring}
                </text>
              </g>
            );
          })}
          
          {/* Draw quadrant dividers */}
          <line x1="-110" y1="0" x2="110" y2="0" stroke="currentColor" strokeWidth="0.5" className="text-gray-300" opacity="0.3" />
          <line x1="0" y1="-110" x2="0" y2="110" stroke="currentColor" strokeWidth="0.5" className="text-gray-300" opacity="0.3" />
          
          {/* Quadrant labels */}
          <text x="70" y="-90" textAnchor="middle" className="text-sm font-semibold" fontSize="4.5" fill="rgba(59, 130, 246, 1)">
            Frameworks
          </text>
          <text x="70" y="95" textAnchor="middle" className="text-sm font-semibold" fontSize="4.5" fill="rgba(168, 85, 247, 1)">
            Techniques
          </text>
          <text x="-70" y="95" textAnchor="middle" className="text-sm font-semibold" fontSize="4.5" fill="rgba(249, 115, 22, 1)">
            Platforms
          </text>
          <text x="-70" y="-90" textAnchor="middle" className="text-sm font-semibold" fontSize="4.5"  fill="rgba(34, 197, 94, 1)">
            Tools
          </text>
        </svg>
      </div>
      
      {/* Chart */}
      <Scatter data={chartData} options={options} />
    </div>
  );
}
