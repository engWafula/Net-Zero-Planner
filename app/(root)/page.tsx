"use client";

import PlanCard from "../components/PlanCard";
import { useEffect, useState } from "react";
import CardSkeleton from "../components/CardSkeleton";
import {
  DatePicker,
  DatePickerProps,
  InputNumber,
  InputNumberProps,
  Modal,
} from "antd";
import moment from "moment";

interface Plan {
  id: string;
  currentEmissions: number;
  targetYear: string;
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emission, setEmission] = useState<Number>();
  const [targetYear, setTargetYear] = useState<String>();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    getPlans();
  }, []);
  const getPlans = async () => {
    setLoading(true);
    try {
      const data = await fetch("/api/plan");
      const plans = await data.json();
      setPlans(plans);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
    setTargetYear(dateString);
  };

  const handleChange: InputNumberProps["onChange"] = (value) => {
    console.log("changed", value);
    setEmission(value);
  };

  const disabledPastAndCurrentYears = (current: moment.Moment | null) => {
    if (!current) return false; 
    const currentYear = new Date().getFullYear();
    return current.year() <= currentYear; 
  };

  console.log(emission, targetYear);

  return (
    <main className="p-5 font-inter min-h-screen bg-gray-100">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center text-green-700">
          Net Zero Planner
        </h1>
        <p className="text-lg text-center text-gray-600 mt-2">
          Plan your path to a sustainable future
        </p>
      </header>
      <div className="flex justify-end mb-6">
        <button
          onClick={showModal}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          + Add Plan
        </button>
      </div>
      <section className="flex items-center justify-center flex-wrap space-x-3 gap-6">
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          plans?.map((plan, index) => (
            <PlanCard
              key={plan.id}
              index={index}
              targetYear={new Date(plan.targetYear).getFullYear()}
              emission={plan.currentEmissions}
            />
          ))
        )}
      </section>
      <Modal
        title="Create New Plan"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="px-5 py-7">
          <label className="font-semibold text-sm text-gray-600 pb-1 block">
            Current Carbon Emission
          </label>
          <InputNumber
            min={1}
            className="rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
            onChange={handleChange}
          />
          <label className="font-semibold text-sm text-gray-600 pb-1 block">
            Target Year
          </label>
          <DatePicker
            disabledDate={disabledPastAndCurrentYears}
            onChange={onChange}
            picker="year"
            className="w-full px-3 py-2 mt-1 mb-5 rounded-lg"
          />
        </div>
      </Modal>
    </main>
  );
}
