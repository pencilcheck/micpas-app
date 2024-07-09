import { AgCharts } from 'ag-charts-react';
import { useState } from 'react';

export { PieChart }

function PieChart({ data, title, angleKey, legendItemKey }: { data: object[], title: string, angleKey: string, legendItemKey: string }) {
  const [options, setOptions] = useState({
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
          formatter: ({ value }) => `${(value / 1000).toFixed(0)}K`,
        },
      },
    ],
  });

  return <AgCharts className="h-[600px] w-[1000px]" options={options} />;
}
