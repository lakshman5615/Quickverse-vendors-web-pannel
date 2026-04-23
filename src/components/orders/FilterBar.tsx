import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// ─── Constants ──────────────────────────────────────────────────
const STATUS_OPTIONS = [
  { label: "All", value: "ALL" },
  { label: "Accepted", value: "ACCEPTED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Assigning", value: "ASSIGNING" },
  { label: "Assigned", value: "ASSIGNED" },
  { label: "Delivered", value: "DELIVERED" },
];

const TIME_OPTIONS = [
  { label: "Last 30 min", value: "LAST_30_MIN" },
  { label: "Today", value: "TODAY" },
  { label: "Last Week", value: "LAST_WEEK" },
];

const currentYear = new Date().getFullYear();
const YEAR_LIST = Array.from({ length: 6 }, (_, i) => currentYear - i);

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// ─── Props ──────────────────────────────────────────────────────
interface FilterBarProps {
  statusFilter: string;
  timeFilter: string;
  selectedMonth: number | null;
  selectedYear: number | null;
  customStartDate: Date | null;
  customEndDate: Date | null;
  onStatusChange: (status: string) => void;
  onTimeChange: (time: string) => void;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  onCustomDateChange: (start: Date | null, end: Date | null) => void;
}

// ─── Component ──────────────────────────────────────────────────
const FilterBar = ({
  statusFilter,
  timeFilter,
  selectedMonth,
  selectedYear,
  customStartDate,
  customEndDate,
  onStatusChange,
  onTimeChange,
  onMonthChange,
  onYearChange,
  onCustomDateChange,
}: FilterBarProps) => {

  // Shared pill button classes
  const pillBase =
    "px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer border";
  const pillActive =
    "bg-zinc-100 text-zinc-900 border-zinc-100";
  const pillInactive =
    "bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-zinc-200";

  // Shared dropdown classes
  const dropdownClass =
    "bg-zinc-800 text-zinc-300 text-xs rounded-lg px-3 py-1.5 border border-zinc-700 outline-none focus:border-zinc-500 cursor-pointer";

  return (
    <div className="space-y-3">
      {/* ─── Row 1: Status Filter Pills ──────────────────── */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-zinc-500 mr-1">Status:</span>
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onStatusChange(opt.value)}
            className={`${pillBase} ${statusFilter === opt.value ? pillActive : pillInactive
              }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* ─── Row 2: Time Filter Pills + Dropdowns + DatePicker ── */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-zinc-500 mr-1">Time:</span>

        {/* Quick time pills */}
        {TIME_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onTimeChange(opt.value)}
            className={`${pillBase} ${timeFilter === opt.value ? pillActive : pillInactive
              }`}
          >
            {opt.label}
          </button>
        ))}

        {/* Monthly dropdown */}
        <select
          value={timeFilter === "MONTHLY" && selectedMonth !== null ? selectedMonth : ""}
          onChange={(e) => {
            onMonthChange(Number(e.target.value));
          }}
          className={dropdownClass}
        >
          <option value="" disabled>
            Monthly
          </option>
          {MONTH_NAMES.map((name, idx) => (
            <option key={name} value={idx}>
              {name}
            </option>
          ))}
        </select>

        {/* Yearly dropdown */}
        <select
          value={timeFilter === "YEARLY" && selectedYear !== null ? selectedYear : ""}
          onChange={(e) => {
            onYearChange(Number(e.target.value));
          }}
          className={dropdownClass}
        >
          <option value="" disabled>
            Yearly
          </option>
          {YEAR_LIST.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        {/* Custom date range button + pickers */}
        <button
          onClick={() => onTimeChange("CUSTOM")}
          className={`${pillBase} ${timeFilter === "CUSTOM" ? pillActive : pillInactive
            }`}
        >
          Custom
        </button>

        {timeFilter === "CUSTOM" && (
          <div className="flex items-center gap-2">
            <DatePicker
              selected={customStartDate}
              onChange={(date) => onCustomDateChange(date, customEndDate)}
              placeholderText="From date"
              dateFormat="dd MMM yyyy"
              maxDate={customEndDate || new Date()}
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"

              className="bg-zinc-800 text-zinc-300 text-xs rounded-lg px-3 py-1.5 border border-zinc-700 outline-none w-32 focus:border-zinc-500"
            />
            <span className="text-zinc-600 text-xs">→</span>
            <DatePicker
              selected={customEndDate}
              onChange={(date) => onCustomDateChange(customStartDate, date)}
              placeholderText="To date"
              dateFormat="dd MMM yyyy"
              minDate={customStartDate || undefined}
              maxDate={new Date()}
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"

              className="bg-zinc-800 text-zinc-300 text-xs rounded-lg px-3 py-1.5 border border-zinc-700 outline-none w-32 focus:border-zinc-500"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
