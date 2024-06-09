import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ClimatePlan } from '@/types';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ClimatePlanChartProps {
  data: ClimatePlan;
}

const Projections: React.FC<ClimatePlanChartProps> = ({ data }) => {
  const [series, setSeries] = useState<ApexAxisChartSeries>([]);
  const [options, setOptions] = useState<ApexCharts.ApexOptions>({});

  useEffect(() => {
    if (!data) return;

    const { currentEmissions, targetYear, climateActions } = data;

    if (typeof currentEmissions !== 'number' || !targetYear || !Array.isArray(climateActions)) return;

    const emissions = [{ year: new Date().getFullYear(), emissions: currentEmissions }];

    climateActions.sort((a, b) => {
      const startYearA = parseInt(a.startYear, 10);
      const startYearB = parseInt(b.startYear, 10);
      return startYearA - startYearB;
    });

    climateActions.forEach(action => {
      const year = action.startYear ? parseInt(action.startYear, 10) : null;
      const reduction = action.emissionsReduction || 0;

      if (year !== null) {
        const existingEmission = emissions.find(e => e.year === year);
        if (existingEmission) {
          existingEmission.emissions -= reduction;
        } else {
          const lastEmission = emissions[emissions.length - 1];
          const newEmission = lastEmission ? lastEmission.emissions - reduction : 0;
          emissions.push({ year, emissions: newEmission });
        }
      }
    });

    const lastYear = parseInt(targetYear, 10);
    for (let year = emissions[emissions.length - 1].year + 1; year <= lastYear; year++) {
      const lastEmission = emissions[emissions.length - 1];
      emissions.push({ year, emissions: lastEmission.emissions });
    }

    const seriesData = emissions.map(e => ({
      x: e.year.toString(),
      y: e.emissions,
      fillColor: e.year === lastYear ? (e.emissions > 0 ? '#FF0000' : '#16A34A') : "#26A0FC"
    }));

    setSeries([
      {
        name: "Projected Emissions",
        data: seriesData,
      },
    ]);

    setOptions({
      chart: {
        type: 'bar',
        height: 350,
      },
      title: {
        text: 'Emissions Projections Over Time',
      },
      xaxis: {
        categories: emissions.map(e => e.year?.toString() ?? 'Unknown'),
        title: {
          text: 'Year',
        },
      },
      yaxis: {
        title: {
          text: 'Emissions',
        },
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        y: {
          formatter: (val) => val.toFixed(2),
        },
      }
    });
  }, [data]);

  return (
    <div>
      {series.length > 0 && (
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={500}
          width={"100%"}
        />
      )}
    </div>
  );
};

export default Projections;
