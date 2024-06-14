import { InputNumber } from 'antd'
import React from 'react'

interface NumberInputProps{
    label:string;
    onChange: (value: number | null) => void;
    value: any;
}

export default function NumberInput({label,onChange,value}:NumberInputProps) {
  return (
    <div>
    <label className="font-semibold text-sm text-gray-600 pb-1 block">
        {label}
          </label>
          <InputNumber
            min={1}
            value={value}
            className="rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
            onChange={onChange}
          />
    </div>
  )
}
