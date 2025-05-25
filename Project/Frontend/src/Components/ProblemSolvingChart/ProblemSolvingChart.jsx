import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import "./ProblemSolvingChart.css";

const COLORS = ["#22c55e", "#3b82f6", "#ef4444"];

const ProblemSolvingChart = ({ easy, medium, hard }) => {
  const data = [
    { name: "Easy", value: easy, label: "Easy problems" },
    { name: "Medium", value: medium, label: "Medium problems" },
    { name: "Hard", value: hard, label: "Hard problems" },
  ];

  return (
    <div className="chart-container ">
      {data.map((entry, index) => (
        <div className="chart-box" key={entry.name}>
          <div className="chart-wrapper">
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie
                  data={[{ value: entry.value }, { value: 100 - entry.value }]}
                  innerRadius={40}
                  outerRadius={60}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  <Cell key={`cell-${index}-filled`} fill={COLORS[index]} />
                  <Cell key={`cell-${index}-empty`} fill="#e5e7eb" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="chart-label">{entry.value}%</div>
          </div>
          <p className="chart-title">{entry.label}</p>
        </div>
      ))}
    </div>
  );
};

export default ProblemSolvingChart;
