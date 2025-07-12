"use client";

import InterestCalculator from "../components/InterestCalculator";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-indigo-100 py-8 px-4 flex justify-center items-center">
      <div className="max-w-4xl w-full flex flex-col justify-center items-center gap-10">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">적금 계산기</h1>
          <p className="text-gray-600 text-lg">
            단리 이자로 적금 수익을 계산해보세요
          </p>
        </header>

        <InterestCalculator />
      </div>
    </div>
  );
}
