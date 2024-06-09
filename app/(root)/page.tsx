"use client";

import PlanCard from "../components/PlanCard";
import { useEffect, useState } from "react";
import CardSkeleton from "../components/CardSkeleton";
import {
  DatePicker,
  DatePickerProps,
  Empty,
  InputNumber,
  InputNumberProps,
  Modal,
} from "antd";
import dayjs from "dayjs";
import { Plan } from "@/types";

export default function Home() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emission, setEmission] = useState<Number | null>();
  const [targetYear, setTargetYear] = useState<String | null>();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentEmissions: emission, targetYear }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const newPlan = await response.json();
      setIsModalOpen(false);
      getPlans();
      setLoading(false);
      setEmission(null);
      setTargetYear(null);
    } catch (error) {
      console.log(error);
    }
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
    setTargetYear(dateString as string);
  };

  const handleChange: InputNumberProps["onChange"] = (value) => {
    setEmission(value as number);
  };

  const disabledPastAndCurrentYears = (
    current: dayjs.Dayjs | null
  ): boolean => {
    if (!current) return false;
    const currentYear = dayjs().year();
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
        ) : plans && plans.length > 0 ? (
          plans.map((plan, index) => (
            <PlanCard
              key={plan.id}
              index={plan.id}
              targetYear={new Date(plan.targetYear).getFullYear()}
              emission={plan.currentEmissions}
            />
          ))
        ) : (
          <Empty description="You currently have no Net zero plans yet" />
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
