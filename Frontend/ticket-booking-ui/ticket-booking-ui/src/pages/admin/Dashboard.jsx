import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, Legend 
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "Admin") {
      nav("/");
      return;
    }
    fetchData(user.id);
  }, []);

  const fetchData = async (adminId) => {
    try {
      const res = await api.get(`/admin/analytics?adminId=${adminId}`);
      setData(res.data);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="container mt-4 pb-5">
      <h2 className="mb-4 fw-bold">Admin Insights</h2>
<h2 className="text-center mt-4">Hi Admin, Welcome Again!!!</h2>
      {/* --- TOP CARDS --- */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <div className="card text-white bg-primary shadow-sm border-0">
            <div className="card-body p-4">
              <h6 className="text-uppercase opacity-75">Total Registered Users</h6>
              <h2 className="fw-bold">{data?.totalUsers || 0}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="card text-white bg-success shadow-sm border-0">
            <div className="card-body p-4">
              <h6 className="text-uppercase opacity-75">Total Revenue Generated</h6>
              <h2 className="fw-bold">₹ {data?.revenue?.toLocaleString() || 0}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* --- 1. REVENUE TREND (Area Chart) --- */}
        <div className="col-md-8 mb-4">
          <div className="card shadow-sm border-0 p-3">
            <h5 className="mb-3 fw-bold">7-Day Revenue Trend</h5>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <AreaChart data={data?.revenueTrend}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="amount" stroke="#82ca9d" fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* --- 2. USER SOURCES (Pie Chart) --- */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm border-0 p-3">
            <h5 className="mb-3 fw-bold">User Sources</h5>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={data?.userSources} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {data?.userSources?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.Length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* --- 3. MOVIE POPULARITY (Bar Chart) --- */}
        <div className="col-md-12 mb-4">
          <div className="card shadow-sm border-0 p-3">
            <h5 className="mb-3 fw-bold">Tickets Sold per Movie</h5>
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <BarChart data={data?.movieData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Legend />
                  <Bar dataKey="value" name="Tickets Sold" fill="#0088FE" radius={[5, 5, 0, 0]} barSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}