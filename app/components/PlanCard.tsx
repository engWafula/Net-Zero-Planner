import Link from 'next/link';
import React from 'react';

interface PlanCardProps {
  emission: number;
  targetYear: number;
  index: string;
}

export default function PlanCard({ emission, targetYear, index }: PlanCardProps) {
  return (
    <div key={index}>
      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col h-full">
        <h2 className="text-2xl font-semibold mb-4">
          Current CO<sub>2</sub> Emission: {emission} tons
        </h2>
        <p className="text-gray-700 mb-4 flex-grow">Target Year: {targetYear}</p>
        <Link href={`/${index}`}>
          <p className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 mt-auto text-center">
            View Projections
          </p>
        </Link>
      </div>
    </div>
  );
}
