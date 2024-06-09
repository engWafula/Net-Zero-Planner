"use client";

import React, { useEffect, useState } from "react";
import {
  Tabs,
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Popconfirm,
} from "antd";
import { useParams } from "next/navigation";
import { useFetch } from "@/hooks/useFetch";
import moment from "moment";
import Projections from "@/app/components/Projections";
import { ClimateAction, ClimatePlan } from "@/types";

const { TabPane } = Tabs;

export default function Page() {
  const [climateActions, setClimateActions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [startYear, setStartYear] = useState<string>();
  const [title, setTitle] = useState<string>();
  const [cost, setCost] = useState<number>();
  const [estimatedReduction, setEstimatedReduction] = useState<number>();
  const [editingAction, setEditingAction] = useState<boolean>(false);
  const [actionId,setActionId] = useState<string>()
  const [form] = Form.useForm();
  const { planId } = useParams();
  const currentYear = moment().year();

  const { data, isPending, error, refetch } = useFetch<ClimatePlan>(`/api/plan/${planId}`);

  const showAddActionModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    // form.validateFields().then((values) => {
    //   setClimateActions([...climateActions, values]);
    //   setIsModalVisible(false);
    //   form.resetFields();
    // });
    try {
      const response = await fetch(editingAction?`/api/climateAction/${actionId}`:"/api/climateAction", {
        method: editingAction? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          startYear: startYear,
          cost: `$${cost}`,
          emissionsReduction: estimatedReduction,
          netZeroPlanId: data?.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setIsModalVisible(false);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async (record:ClimateAction) => {
    try {
      const response = await fetch(`/api/climateAction/${record.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleEdit = (record:ClimateAction) => {
    setActionId(record.id)
    setStartYear(record.startYear);
    setTitle(record.title);
    setCost(Number(record.actionCost.replace("$", "")));
    setEstimatedReduction(record.emissionsReduction);
    setEditingAction(!editingAction);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Start Year",
      dataIndex: "startYear",
      key: "startYear",
    },
    {
      title: "Estimated Emission Reduction",
      dataIndex: "emissionsReduction",
      key: "emissionsReduction",
      width: 300,
    },
    {
      title: "Cost",
      dataIndex: "actionCost",
      key: "actionCost",
    },
    {
      title: "Actions",
      dataIndex: "",
      key: "actions",
      render: (_, record: any) => (
        <div className="flex space-x-3">
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete Action"
            description="Are you sure to delete this Action?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </div>
      ),
      width: 300,
    },
  ];

  const disabledPastAndFutureYears = (current: moment.Moment | null) => {
    if (!current) return false;
    const year = current.year();
    return year < currentYear || year > parseInt(data?.targetYear!);
  };


  return (
    <div className="p-5 ml-40 font-inter min-h-screen bg-gray-100">
      <header>
        <h1 className="text-4xl font-bold text-center text-green-700">
          Net Zero Planner
        </h1>
        <p className="text-lg text-center text-gray-600 mt-2">
          Current Carbon Emission: {data?.currentEmissions} tons
        </p>
        <p className="text-lg text-center text-gray-600">
          Target Year for Zero Emission: {data?.targetYear}
        </p>
      </header>
      <div className="flex justify-end mb-6">
        <button
          onClick={showAddActionModal}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          + Add Action
        </button>
      </div>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Projections" key="1">
        <Projections data={data!}/>
        </TabPane>
        <TabPane tab="Climate Actions" key="2">
          <Table
            dataSource={data?.climateActions}
            columns={columns}
            rowKey="action"
          />
        </TabPane>
      </Tabs>

      <Modal
        title={editingAction ? "Edit Climate Action" : "Add Climate Action"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="px-5 py-7">
          <label className="font-semibold text-sm text-gray-600 pb-1 block">
            Title
          </label>
          <Input
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            type="text"
            style={{
              borderRadius: "0.5rem",
              paddingLeft: "0.75rem",
              paddingRight: "0.75rem",
              paddingTop: "0.5rem",
              paddingBottom: "0.5rem",
              marginTop: "0.25rem",
              marginBottom: "1.25rem",
              fontSize: "0.875rem",
              width: "100%",
            }}
          />
          <label className="font-semibold text-sm text-gray-600 pb-1 block">
            Cost ($)
          </label>
          <InputNumber
            value={cost}
            
            min={1}
            className="rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
            onChange={(value) => setCost(value)}
          />
          <label className="font-semibold text-sm text-gray-600 pb-1 block">
            Estimated Emission Reduction (tons)
          </label>
          <InputNumber
            value={estimatedReduction}
            min={1}
            className="rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
            onChange={(value) => setEstimatedReduction(value)}
          />
          <label className="font-semibold text-sm text-gray-600 pb-1 block">
            Start Year
          </label>
          <DatePicker
            value={startYear ? moment(startYear, "YYYY") : null}
            disabledDate={disabledPastAndFutureYears}
            onChange={(date, dateString) => setStartYear(dateString)}
            picker="year"
            className="w-full px-3 py-2 mt-1 mb-5 rounded-lg"
          />
        </div>
      </Modal>
    </div>
  );
}
