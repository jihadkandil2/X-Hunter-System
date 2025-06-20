import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "./Heatmapcard.css";

const Heatmapcard = ({ heatmapData = [], stats = {}, selectedYear, onYearChange }) => {
  const filteredData = Array.isArray(heatmapData)
    ? heatmapData.filter((entry) => {
        const date = new Date(entry.date);
        return date.getFullYear() === selectedYear;
      })
    : [];

  return (
    <div className="heatmap-container p-4 bg-[#0b0f12] rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg md:text-xl font-semibold text-white">
          Problem Solving Activity
        </h2>
        <select
          className="bg-[#1f2a38] text-white p-1 rounded"
          value={selectedYear}
          onChange={(e) => onYearChange(parseInt(e.target.value))}
        >
          {[...Array(5)].map((_, i) => {
            const year = new Date().getFullYear() - i;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>
      </div>

      <div className="overflow-x-auto pb-1">
        <div className="min-w-[900px]">
          <CalendarHeatmap
            className="react-calendar-heatmap"
            startDate={new Date(`${selectedYear}-01-01`)}
            endDate={new Date(`${selectedYear}-12-31`)}
            values={filteredData}
            showWeekdayLabels={true}
            weekdayLabels={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
            classForValue={(value) => {
              if (!value || value.count === 0) return "color-empty";
              if (value.count < 2) return "color-scale-1";
              if (value.count < 4) return "color-scale-2";
              return "color-scale-3";
            }}
            tooltipDataAttrs={(value) => {
              if (!value || !value.date) return null;
              return { "data-tip": `${value.date}: ${value.count} solved` };
            }}
          />
        </div>
      </div>

      <div className="summary-stats-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 -mt-1 text-center">
        <div>
          <p className="text-2xl font-bold text-green-400">{stats.totalAllTime || 0}</p>
          <p className="text-white text-sm">Solved For All Time</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-green-400">{stats.totalLastYear || 0}</p>
          <p className="text-white text-sm">Solved For Last Year</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-green-400">{stats.totalLastMonth || 0}</p>
          <p className="text-white text-sm">Solved For Last Month</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-green-400">{stats.streakAllTime || 0}</p>
          <p className="text-white text-sm">In A Row All Time</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-green-400">{stats.streakLastYear || 0}</p>
          <p className="text-white text-sm">In A Row For Last Year</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-green-400">{stats.streakLastMonth || 0}</p>
          <p className="text-white text-sm">In A Row For Last Month</p>
        </div>
      </div>
    </div>
  );
};

export default Heatmapcard;
