import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
  LineChart, Line,
  PieChart, Pie,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#FFBB28", "#FF8042", "#AA336A", "#3399AA"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Biểu đồ doanh thu theo tháng
function MonthlyRevenueChart() {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const data = MONTHS.map((month, idx) => ({
    month,
    revenue: Math.floor(Math.random() * 10000 + 5000),
    isCurrentMonth: idx === currentMonth,
  }));

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Monthly Revenue - {currentYear}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => `$${value}`} />
          <Legend />
          <Bar dataKey="revenue" name="Revenue">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.isCurrentMonth ? COLORS[1] : COLORS[0]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Biểu đồ số học viên mới đăng ký theo tháng
function NewStudentsChart() {
  const currentYear = new Date().getFullYear();
  const data = MONTHS.map((month) => ({
    month,
    newStudents: Math.floor(Math.random() * 300 + 50),
  }));

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">New Students Registered - {currentYear}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="newStudents" stroke={COLORS[0]} strokeWidth={3} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Biểu đồ tỉ lệ doanh thu từng khóa (mock data)
function CourseRevenuePieChart() {
  const data = [
    { name: "Course A", value: 4000 },
    { name: "Course B", value: 3000 },
    { name: "Course C", value: 2000 },
    { name: "Course D", value: 1000 },
  ];

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Revenue Share by Course</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `$${value}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// Component tổng chứa 3 biểu đồ
export default function DashboardCharts() {
  return (
    <div className="space-y-12">
      <MonthlyRevenueChart />
      <NewStudentsChart />
      <CourseRevenuePieChart />
    </div>
  );
}
