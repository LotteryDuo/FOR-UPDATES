import React, { useState } from "react";

const DateDropdown = ({ dates, onSelectDate }) => {
  const [selectedDate, setSelectedDate] = useState("");

  const handleChange = (event) => {
    const date = event.target.value;
    setSelectedDate(date);
    onSelectDate(date);
  };

  return (
    <div>
      <label>Select Date: </label>
      <select value={selectedDate} onChange={handleChange}>
        <option value="">-- Select Date --</option>
        {dates.map((date, index) => (
          <option key={index} value={date}>
            {date}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DateDropdown;
