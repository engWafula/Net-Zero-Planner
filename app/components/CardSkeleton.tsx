import React from 'react';
import { Skeleton } from 'antd';

const CardSkeleton: React.FC = () => (
    <div className="bg-white p-6  rounded-lg shadow-md flex flex-col h-full w-72">
    <Skeleton active paragraph={{ rows: 2 }} />
  </div>);

export default CardSkeleton;
