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
} from 'chart.js';
import { Blip, Quadrant, Ring } from '@/core/types';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

interface RadarChartProps {
  blips: Blip[];
  onBlipClick?: (blip: Blip) => void;
  zoomQuadrant?: Quadrant;
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

export function RadarChart({ blips, onBlipClick, zoomQuadrant }: RadarChartProps) {
  const chartData = useMemo(() => {
    const datasets = QUADRANTS.map((quadrant, qIndex) => {
      const quadrantBlips = blips.filter((b) => b.quadrant === quadrant);
      
      // Calculate angle range for this quadrant
      const startAngle = (qIndex * Math.PI) / 2;
      const endAngle = ((qIndex + 1) * Math.PI) / 2;
      
      const data = quadrantBlips.map((blip, index) => {
        const ringRadius = RING_RADIUS[blip.ring];
        
        // Distribute blips within the quadrant with some randomization
        const angleSpread = endAngle - startAngle;
        const angleOffset = (index / Math.max(quadrantBlips.length - 1, 1)) * angleSpread * 0.8;
        const angle = startAngle + angleOffset + angleSpread * 0.1;
        
        // Add some random jitter to radius within the ring
        const radiusJitter = (Math.random() - 0.5) * 0.05;
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
        borderColor: QUADRANT_COLORS[quadrant].replace('0.7', '1'),
        borderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      };
    });

    return { datasets };
  }, [blips]);

  // Calculate zoom bounds based on selected quadrant
  const zoomBounds = useMemo(() => {
    if (!zoomQuadrant) {
      return { xMin: -1.1, xMax: 1.1, yMin: -1.1, yMax: 1.1 };
    }

    const quadrantIndex = QUADRANTS.indexOf(zoomQuadrant);
    
    // Map quadrants to their positions:
    // 0: 'Languages & Frameworks' - top-right (positive x, positive y)
    // 1: 'Tools' - top-left (negative x, positive y)
    // 2: 'Platforms' - bottom-left (negative x, negative y)
    // 3: 'Techniques' - bottom-right (positive x, negative y)
    
    switch (quadrantIndex) {
      case 0: // Languages & Frameworks (top-right)
        return { xMin: -0.2, xMax: 1.1, yMin: -0.2, yMax: 1.1 };
      case 1: // Tools (top-left)
        return { xMin: -1.1, xMax: 0.2, yMin: -0.2, yMax: 1.1 };
      case 2: // Platforms (bottom-left)
        return { xMin: -1.1, xMax: 0.2, yMin: -1.1, yMax: 0.2 };
      case 3: // Techniques (bottom-right)
        return { xMin: -0.2, xMax: 1.1, yMin: -1.1, yMax: 0.2 };
      default:
        return { xMin: -1.1, xMax: 1.1, yMin: -1.1, yMax: 1.1 };
    }
  }, [zoomQuadrant]);

  const options: ChartOptions<'scatter'> = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1,
    scales: {
      x: {
        min: zoomBounds.xMin,
        max: zoomBounds.xMax,
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
        min: zoomBounds.yMin,
        max: zoomBounds.yMax,
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
