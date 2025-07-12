"use client";

import { useState } from "react";

interface CalculationResult {
  totalPrincipal: number;
  totalInterest: number;
  taxAmount: number;
  afterTaxInterest: number;
  finalAmount: number;
}

interface FormData {
  period: number;
  periodUnit: "일" | "주" | "개월" | "년";
  monthlyAmount: number;
  interestRate: number;
}

export default function InterestCalculator() {
  const [formData, setFormData] = useState<FormData>({
    period: 0,
    periodUnit: "개월",
    monthlyAmount: 0,
    interestRate: 0,
  });

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string>("");

  const periodUnits = [
    { value: "일", label: "일" },
    { value: "주", label: "주" },
    { value: "개월", label: "개월" },
    { value: "년", label: "년" },
  ];

  const validateInputs = (data: FormData): string => {
    if (data.period <= 0) return "적금 기간은 1 이상이어야 합니다.";
    if (data.monthlyAmount <= 0) return "납부액은 0보다 커야 합니다.";
    if (data.interestRate < 0) return "이자율은 0 이상이어야 합니다.";
    return "";
  };

  const convertToMonths = (period: number, unit: string): number => {
    switch (unit) {
      case "일":
        return period / 30.417;
      case "주":
        return period / 4.345;
      case "개월":
        return period;
      case "년":
        return period * 12;
      default:
        return period;
    }
  };

  const getPaymentCount = (period: number, unit: string): number => {
    switch (unit) {
      case "일":
        return period;
      case "주":
        return period;
      case "개월":
        return period;
      case "년":
        return period * 12;
      default:
        return period;
    }
  };

  const calculateInterest = (data: FormData): CalculationResult => {
    const paymentCount = getPaymentCount(data.period, data.periodUnit);
    const totalPrincipal = data.monthlyAmount * paymentCount;

    // 월 단위로 변환
    const months = convertToMonths(data.period, data.periodUnit);

    // 단리 이자 계산 (월 기준)
    const monthlyInterestRate = data.interestRate / 100 / 12;
    const totalInterest = totalPrincipal * monthlyInterestRate * months;

    // 이자소득세 계산 (15.4%)
    const taxAmount = totalInterest * 0.154;
    const afterTaxInterest = totalInterest - taxAmount;
    const finalAmount = totalPrincipal + afterTaxInterest;

    return {
      totalPrincipal,
      totalInterest,
      taxAmount,
      afterTaxInterest,
      finalAmount,
    };
  };

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);

    // 실시간 계산
    const errorMessage = validateInputs(newData);
    setError(errorMessage);

    if (!errorMessage) {
      try {
        const result = calculateInterest(newData);
        setResult(result);
      } catch {
        setError("계산 중 오류가 발생했습니다.");
      }
    } else {
      setResult(null);
    }
  };

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString("ko-KR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const formatPercentage = (amount: number): string => {
    return amount.toLocaleString("ko-KR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
      {/* 입력 폼 */}
      <div className="bg-white rounded-lg shadow-lg p-6 w-full">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          적금 정보 입력
        </h2>

        <div className="space-y-6">
          {/* 적금 기간 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              적금 기간
            </label>
            <div className="flex gap-3">
              <input
                type="number"
                min="1"
                placeholder="기간 입력"
                value={formData.period}
                onChange={(e) =>
                  handleInputChange("period", parseInt(e.target.value) || 0)
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={formData.periodUnit}
                onChange={(e) =>
                  handleInputChange(
                    "periodUnit",
                    e.target.value as FormData["periodUnit"]
                  )
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {periodUnits.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-gray-500 mt-1"></p>
          </div>

          {/* 월 납부액 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              월 납부액 (원)
            </label>
            <input
              type="number"
              min="1"
              step="1000"
              value={formData.monthlyAmount}
              onChange={(e) =>
                handleInputChange(
                  "monthlyAmount",
                  parseInt(e.target.value) || 0
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="100000"
            />
          </div>

          {/* 연 이자율 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              연 이자율 (%)
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={formData.interestRate}
              onChange={(e) =>
                handleInputChange(
                  "interestRate",
                  parseFloat(e.target.value) || 0
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="3.5"
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* 결과 표시 */}
      <div className="bg-white rounded-lg shadow-lg p-6 w-full">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">계산 결과</h2>

        {result ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-blue-700 font-medium">
                    총 납입 원금
                  </span>
                  <span className="text-blue-900 font-bold text-lg">
                    {formatCurrency(result.totalPrincipal)}원
                  </span>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-green-700 font-medium">총 이자</span>
                  <span className="text-green-900 font-bold text-lg">
                    {formatPercentage(result.totalInterest)}원
                  </span>
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-orange-700 font-medium">
                    이자소득세 (15.4%)
                  </span>
                  <span className="text-orange-900 font-bold text-lg">
                    {formatPercentage(result.taxAmount)}원
                  </span>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-purple-700 font-medium">세후 이자</span>
                  <span className="text-purple-900 font-bold text-lg">
                    {formatPercentage(result.afterTaxInterest)}원
                  </span>
                </div>
              </div>

              <div className="bg-indigo-50 p-4 rounded-lg border-2 border-indigo-200">
                <div className="flex justify-between items-center">
                  <span className="text-indigo-700 font-medium text-lg">
                    최종 수령액
                  </span>
                  <span className="text-indigo-900 font-bold text-xl">
                    {formatCurrency(result.finalAmount)}원
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">계산 정보</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  • 납부 횟수:{" "}
                  {getPaymentCount(formData.period, formData.periodUnit)}회
                </p>
                <p>• 납부 주기: {formData.periodUnit} 단위</p>
                <p>• 이자 계산 방식: 단리</p>
                <p>• 이자소득세율: 15.4%</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 text-6xl mb-4">💰</div>
            <p className="text-gray-500">
              {error
                ? "입력값을 확인해주세요"
                : "적금 정보를 입력하면 계산 결과가 표시됩니다"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
