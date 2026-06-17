import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { useState } from "react";
import {
  FiUsers,
  FiMic,
  FiAward, // Changed from FiTrophy
  FiMail,
  FiTrendingUp,
  FiClock,
  FiUserPlus,
  FiCalendar,
} from "react-icons/fi";

function Dashboard() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const stats = [
    {
      title: "Delegates",
      value: "5,000+",
      icon: <FiUsers className="text-2xl" />,
      color: "from-blue-500 to-blue-600",
      bg: "bg-blue-50",
      textColor: "text-blue-600",
      borderColor: "border-blue-200",
    },
    {
      title: "Speakers",
      value: "150+",
      icon: <FiMic className="text-2xl" />,
      color: "from-orange-500 to-orange-600",
      bg: "bg-orange-50",
      textColor: "text-orange-600",
      borderColor: "border-orange-200",
    },
    {
      title: "Sponsors",
      value: "80+",
      icon: <FiAward className="text-2xl" />, // Changed from FiTrophy
      color: "from-green-500 to-green-600",
      bg: "bg-green-50",
      textColor: "text-green-600",
      borderColor: "border-green-200",
    },
    {
      title: "Queries",
      value: "120",
      icon: <FiMail className="text-2xl" />,
      color: "from-purple-500 to-purple-600",
      bg: "bg-purple-50",
      textColor: "text-purple-600",
      borderColor: "border-purple-200",
    },
  ];

  const chartData = [
    { name: "Solar", value: 45, color: "#f97316" },
    { name: "Wind", value: 30, color: "#3b82f6" },
    { name: "Hydrogen", value: 25, color: "#22c55e" },
  ];

  const lineData = [
    { day: "Mon", delegates: 120, speakers: 20 },
    { day: "Tue", delegates: 150, speakers: 25 },
    { day: "Wed", delegates: 180, speakers: 30 },
    { day: "Thu", delegates: 160, speakers: 28 },
    { day: "Fri", delegates: 200, speakers: 35 },
    { day: "Sat", delegates: 220, speakers: 40 },
    { day: "Sun", delegates: 250, speakers: 45 },
  ];

  const recentActivities = [
    {
      id: 1,
      icon: <FiUserPlus />,
      bg: "bg-green-100",
      text: "New Speaker Added",
      time: "2 minutes ago",
      color: "text-green-600",
    },
    {
      id: 2,
      icon: <FiCalendar />,
      bg: "bg-blue-100",
      text: "Agenda Updated",
      time: "15 minutes ago",
      color: "text-blue-600",
    },
    {
      id: 3,
      icon: <FiAward />, // Changed from FiTrophy
      bg: "bg-orange-100",
      text: "New Sponsor Added",
      time: "1 hour ago",
      color: "text-orange-600",
    },
    {
      id: 4,
      icon: <FiUsers />,
      bg: "bg-purple-100",
      text: "New Delegate Registered",
      time: "2 hours ago",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            <span>Welcome back, Admin</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2">
            <FiClock className="text-sm" />
            <span>Last 30 days</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((item, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-[28px] bg-white border border-slate-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            {/* top */}
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-sm font-medium">
                  {item.title}
                </p>

                <h2 className="text-4xl font-bold text-slate-900 mt-3">
                  {item.value}
                </h2>
              </div>

              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color}
          flex items-center justify-center text-white shadow-lg`}
              >
                {item.icon}
              </div>
            </div>

            {/* bottom */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2"></div>

              <span className="text-xs text-slate-400">Last 30 Days</span>
            </div>

            {/* bottom accent */}
            <div
              className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${item.color}`}
            />
          </div>
        ))}
      </div>



      {/* Charts Section */}
      <div className="grid xl:grid-cols-3 gap-6">
        {/* Energy Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:shadow-lg transition-all">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-slate-800">Energy Sources</h3>
              <p className="text-xs text-slate-500">Distribution</p>
            </div>

            <span className="text-xs px-3 py-1 rounded-full bg-orange-50 text-orange-600">
              2026
            </span>
          </div>

          <div className="h-[220px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={55}
                  outerRadius={80}
                  dataKey="value"
                  paddingAngle={3}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3">
            {chartData.map((item) => (
              <div className="text-center bg-slate-50 rounded-xl p-2">
                <div
                  className="w-2 h-2 rounded-full mx-auto mb-1"
                  style={{ background: item.color }}
                />
                <p className="text-xs">{item.name}</p>
                <p className="font-bold text-sm">{item.value}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trend Card */}
        <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:shadow-lg transition-all">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="font-bold text-slate-800">Registration Trend</h3>
              <p className="text-xs text-slate-500">Weekly Analytics</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-semibold">
                +18%
              </span>

              <FiTrendingUp className="text-green-500" />
            </div>
          </div>

          <div className="h-[280px]">
            <ResponsiveContainer>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                <XAxis dataKey="day" tickLine={false} axisLine={false} />

                <YAxis tickLine={false} axisLine={false} />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="delegates"
                  stroke="#FF6B00"
                  strokeWidth={3}
                  dot={false}
                />

                <Line
                  type="monotone"
                  dataKey="speakers"
                  stroke="#2563EB"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid xl:grid-cols-3 gap-6 mt-8">

  {/* Recent Activity */}
  <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

    <div className="flex items-center justify-between p-6 border-b border-slate-100">
      <div>
        <h3 className="text-lg font-bold text-slate-900">
          Recent Activity
        </h3>
        <p className="text-sm text-slate-500">
          Live platform updates
        </p>
      </div>

      <button className="text-orange-500 font-medium text-sm">
        View All
      </button>
    </div>

    <div className="p-4 space-y-3">

      {recentActivities.map((activity) => (
        <div
          key={activity.id}
          className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer"
        >

          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${activity.bg} ${activity.color}`}
          >
            {activity.icon}
          </div>

          <div className="flex-1">

            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-slate-800">
                {activity.text}
              </h4>

              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            </div>

            <p className="text-sm text-slate-500 mt-1">
              {activity.time}
            </p>
          </div>

          <div className="text-xs text-slate-400">
            →
          </div>

        </div>
      ))}

    </div>
  </div>

  {/* Quick Stats */}
  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">

    <div className="mb-6">
      <h3 className="text-lg font-bold text-slate-900">
        Live Statistics
      </h3>

      <p className="text-sm text-slate-500">
        Real-time overview
      </p>
    </div>

    <div className="space-y-4">

      <div className="rounded-2xl bg-orange-50 p-4">
        <p className="text-sm text-orange-600">
          Delegates
        </p>

        <h2 className="text-3xl font-bold text-orange-700 mt-1">
          5,248
        </h2>

        <span className="text-xs text-green-600">
          +12% this week
        </span>
      </div>

      <div className="rounded-2xl bg-blue-50 p-4">
        <p className="text-sm text-blue-600">
          Speakers
        </p>

        <h2 className="text-3xl font-bold text-blue-700 mt-1">
          148
        </h2>

        <span className="text-xs text-green-600">
          +8% this week
        </span>
      </div>

      <div className="rounded-2xl bg-emerald-50 p-4">
        <p className="text-sm text-emerald-600">
          Sponsors
        </p>

        <h2 className="text-3xl font-bold text-emerald-700 mt-1">
          82
        </h2>

        <span className="text-xs text-green-600">
          +15% this week
        </span>
      </div>

    </div>

  </div>

</div>

    </div>
  );
}

export default Dashboard;
