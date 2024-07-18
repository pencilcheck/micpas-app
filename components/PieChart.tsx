import { AgCharts } from 'ag-charts-react';
import { useState } from 'react';

export { PieChart }

function PieChart({ data, total, title, angleKey, legendItemKey }: { data: object[], total: number, title: string, angleKey: string, legendItemKey: string }) {
  const options = {
    data: data,
    title: {
      text: title,
    },
    series: [
      {
        type: "pie",
        angleKey,
        legendItemKey,
        calloutLabelKey: legendItemKey,
        sectorLabelKey: angleKey,
        sectorLabel: {
          color: "white",
          fontWeight: "bold",
          // switching to percentage
          //formatter: ({ value }) => `${(value / 1000).toFixed(0)}K`,
          formatter: ({ value }) => `${((value / total) * 100).toFixed(0)}%`,
        },
      },
    ],
  }

  return <AgCharts className="h-[600px] w-[1000px]" options={options} />;
}
