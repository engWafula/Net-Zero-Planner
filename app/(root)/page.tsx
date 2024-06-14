"use client";

import PlanCard from "../components/PlanCard";
import {  useState } from "react";
import CardSkeleton from "../components/CardSkeleton";
import {
  DatePicker,
  Empty,
  InputNumberProps,
  Modal,
  message,
} from "antd";
import dayjs from "dayjs";
import { ClimatePlan} from "@/types";
import NumberInput from "../components/NumberInput";
import moment from "moment";
import { useFetch } from "@/hooks/useFetch";

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emission, setEmission] = useState<number | null>();
  const [targetYear, setTargetYear] = useState<string | null>();

  const { data, isPending, error, refetch } = useFetch<ClimatePlan[]>("/api/plan");

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

      message.success('Plan created succesfully');

      const newPlan = await response.json();
      setIsModalOpen(false);
      setLoading(false);
      setEmission(null);
      setTargetYear(null);
      refetch()
    } catch (error) {
      console.log(error);
      message.error("Internal server error")
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleChange: InputNumberProps["onChange"] = (value):void => {
    setEmission(value as number);
  };

  const disabledPastAndCurrentYears = (
    current: dayjs.Dayjs | null
  ): boolean => {
    if (!current) return false;
    const currentYear = dayjs().year();
    return current.year() <= currentYear;
  };

  return (
    <main className="p-5 font-inter min-h-screen bg-gray-100">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center text-green-700">
          Net Zero Planner
        </h1>
        <p className="text-lg text-center text-gray-600 mt-2">
          Plan Your Path to a Sustainable Future with Climate Actions
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
        {isPending ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : data && data.length > 0 ? (
          data.map((plan, index) => (
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
          <NumberInput label="Current Carbon Emission" value={emission} onChange={handleChange}/>
          <label className="font-semibold text-sm text-gray-600 pb-1 block">
            Target Year
          </label>
          <DatePicker
            disabledDate={disabledPastAndCurrentYears}
            value={targetYear ? moment(targetYear, "YYYY") : null}
            onChange={(date, dateString) => setTargetYear(dateString as string)}
            picker="year"
            className="w-full px-3 py-2 mt-1 mb-5 rounded-lg"
          />
        </div>
      </Modal>
    </main>
  );
}
