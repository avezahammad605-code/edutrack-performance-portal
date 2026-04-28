import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  GraduationCap, 
  BarChart3, 
  Users, 
  CheckCircle2, 
  Phone, 
  Mail, 
  ArrowRight, 
  LogOut, 
  Search,
  TrendingUp,
  Award,
  Calendar,
  BookOpen,
  Plus,
  X,
  Info,
  ChevronRight
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { cn } from "./lib/utils";

// --- Types ---
interface Student {
  id: number;
  name: string;
  grade: string;
  attendance: number;
  math: number;
  science: number;
  english: number;
  history: number;
}

// --- Components ---

const VerificationScreen = ({ onVerify }: { onVerify: () => void }) => {
  const [step, setStep] = useState<"input" | "code">("input");
  const [contact, setContact] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/verify-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact }),
      });
      if (res.ok) setStep("code");
      else setError("Failed to send code. Please try again.");
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (res.ok) onVerify();
      else setError("Invalid code. Try 123456.");
    } catch (err) {
      setError("Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-indigo-100 p-8"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-200">
            <GraduationCap className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">EduTrack Portal</h1>
          <p className="text-gray-500 text-center mt-2">
            Secure access to student performance data
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === "input" ? (
            <motion.form 
              key="input"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleRequestCode}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email or Phone Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="e.g., student@school.edu or +1..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none pl-11"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    {contact.includes("@") ? <Mail size={18} /> : <Phone size={18} />}
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Verification Code"}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.form>
          ) : (
            <motion.form 
              key="code"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleVerifyCode}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter 6-digit Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="000000"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-center text-2xl tracking-widest font-mono"
                />
                <p className="text-xs text-gray-400 mt-2 text-center italic">
                  Hint: Use code 123456 for this demo
                </p>
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify & Access Portal"}
                <CheckCircle2 size={18} />
              </button>
              <button 
                type="button"
                onClick={() => setStep("input")}
                className="w-full text-indigo-600 text-sm font-medium hover:underline"
              >
                Change email/phone
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const Dashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    grade: "A",
    attendance: 100,
    math: 0,
    science: 0,
    english: 0,
    history: 0
  });

  const fetchData = () => {
    fetch("/api/performance")
      .then(res => res.json())
      .then(data => {
        setStudents(data);
        if (!selectedStudent) setSelectedStudent(data[0]);
      });
    
    fetch("/api/stats")
      .then(res => res.json())
      .then(data => setStats(data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
      });
      if (res.ok) {
        setShowAddModal(false);
        fetchData();
        setNewStudent({
          name: "",
          grade: "A",
          attendance: 100,
          math: 0,
          science: 0,
          english: 0,
          history: 0
        });
      }
    } catch (err) {
      console.error("Failed to add student", err);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

  const getSubjectData = (student: Student) => [
    { name: 'Math', score: student.math },
    { name: 'Science', score: student.science },
    { name: 'English', score: student.english },
    { name: 'History', score: student.history },
  ];

  const getAttendanceData = (student: Student) => [
    { name: 'Present', value: student.attendance },
    { name: 'Absent', value: 100 - student.attendance },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <GraduationCap className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 hidden sm:block">EduTrack Performance</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Student</span>
          </button>
          
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64"
            />
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors text-sm font-medium"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: Student List */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <Users size={18} className="text-indigo-600" />
                Students ({filteredStudents.length})
              </h2>
            </div>
            <div className="overflow-y-auto flex-1">
              {filteredStudents.map(student => (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className={cn(
                    "w-full p-4 text-left border-b border-gray-50 transition-colors flex items-center justify-between group",
                    selectedStudent?.id === student.id ? "bg-indigo-50" : "hover:bg-gray-50"
                  )}
                >
                  <div>
                    <p className={cn(
                      "font-medium",
                      selectedStudent?.id === student.id ? "text-indigo-700" : "text-gray-700"
                    )}>{student.name}</p>
                    <p className="text-xs text-gray-500">Grade: {student.grade}</p>
                  </div>
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                    student.grade.startsWith('A') ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                  )}>
                    {student.grade}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content: Performance Analytics */}
        <div className="lg:col-span-9 space-y-6">
          {selectedStudent ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Profile Overview Card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 font-bold text-3xl">
                    {selectedStudent.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedStudent.name}</h2>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <span className="flex items-center gap-1 text-xs font-medium bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md">
                        <Award size={14} /> Academic Year 2025-26
                      </span>
                      <span className="flex items-center gap-1 text-xs font-medium bg-green-50 text-green-700 px-2 py-1 rounded-md">
                        <Calendar size={14} /> Active Status
                      </span>
                      <span className="flex items-center gap-1 text-xs font-medium bg-amber-50 text-amber-700 px-2 py-1 rounded-md">
                        <BookOpen size={14} /> Grade {selectedStudent.grade}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="flex gap-4">
                    <div className="text-center px-6 py-3 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Attendance</p>
                      <p className="text-2xl font-bold text-indigo-600">{selectedStudent.attendance}%</p>
                    </div>
                    <div className="text-center px-6 py-3 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">GPA Equivalent</p>
                      <p className="text-2xl font-bold text-green-600">
                        {selectedStudent.grade.startsWith('A') ? '3.8' : '3.2'}
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setShowStatsModal(true)}
                    className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors"
                    title="View Detailed Analytics"
                  >
                    <BarChart3 size={24} />
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Subject Performance Chart */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                      <BarChart3 size={18} className="text-indigo-600" />
                      Subject Performance
                    </h3>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getSubjectData(selectedStudent)}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                        <YAxis hide domain={[0, 100]} />
                        <Tooltip 
                          cursor={{ fill: '#F8FAFC' }}
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                          {getSubjectData(selectedStudent).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Attendance Distribution */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                      <TrendingUp size={18} className="text-indigo-600" />
                      Attendance Analysis
                    </h3>
                  </div>
                  <div className="h-64 w-full flex items-center justify-center relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getAttendanceData(selectedStudent)}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          <Cell fill="#4F46E5" />
                          <Cell fill="#E2E8F0" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-2xl font-bold text-gray-900">{selectedStudent.attendance}%</span>
                      <span className="text-[10px] text-gray-500 uppercase font-bold">Present</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Scores Table */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="font-bold text-gray-800">Detailed Scorecard</h3>
                </div>
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                      <th className="px-6 py-3">Subject</th>
                      <th className="px-6 py-3 text-center">Score</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {getSubjectData(selectedStudent).map((subject) => (
                      <tr key={subject.name} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-700">{subject.name}</td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-mono font-bold text-indigo-600">{subject.score}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                            subject.score >= 90 ? "bg-green-100 text-green-700" : 
                            subject.score >= 80 ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                          )}>
                            {subject.score >= 90 ? "Exceeds" : subject.score >= 80 ? "Proficient" : "Developing"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="w-24 h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-indigo-500" 
                              style={{ width: `${subject.score}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 italic">
              Select a student to view performance analytics
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 p-4 text-center text-xs text-gray-500">
        &copy; 2026 EduTrack Systems. All rights reserved. Secure Portal Access.
      </footer>

      {/* Modals */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-indigo-600 text-white">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Plus size={20} /> Add New Student
                </h3>
                <button onClick={() => setShowAddModal(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleAddStudent} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                    <input 
                      required
                      type="text" 
                      value={newStudent.name}
                      onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Grade</label>
                    <select 
                      value={newStudent.grade}
                      onChange={e => setNewStudent({...newStudent, grade: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C'].map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Attendance %</label>
                    <input 
                      type="number" min="0" max="100"
                      value={newStudent.attendance}
                      onChange={e => setNewStudent({...newStudent, attendance: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Math Score</label>
                    <input 
                      type="number" min="0" max="100"
                      value={newStudent.math}
                      onChange={e => setNewStudent({...newStudent, math: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Science Score</label>
                    <input 
                      type="number" min="0" max="100"
                      value={newStudent.science}
                      onChange={e => setNewStudent({...newStudent, science: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">English Score</label>
                    <input 
                      type="number" min="0" max="100"
                      value={newStudent.english}
                      onChange={e => setNewStudent({...newStudent, english: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">History Score</label>
                    <input 
                      type="number" min="0" max="100"
                      value={newStudent.history}
                      onChange={e => setNewStudent({...newStudent, history: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Save Student
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {showStatsModal && selectedStudent && stats && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Comparative Analytics</h3>
                  <p className="text-sm text-gray-500">{selectedStudent.name} vs. Class Averages</p>
                </div>
                <button onClick={() => setShowStatsModal(false)} className="hover:bg-gray-200 p-1 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["math", "science", "english", "history"].map((sub) => {
                    const studentScore = (selectedStudent as any)[sub];
                    const subStats = stats[sub];
                    const diff = studentScore - subStats.avg;
                    
                    return (
                      <div key={sub} className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm hover:border-indigo-200 transition-colors group">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-gray-800 capitalize flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-indigo-500" />
                            {sub}
                          </h4>
                          <span className={cn(
                            "text-xs font-bold px-2 py-0.5 rounded-md",
                            diff >= 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                          )}>
                            {diff >= 0 ? `+${diff}` : diff} from avg
                          </span>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Student Score</span>
                            <span className="font-bold text-indigo-600">{studentScore}</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500" style={{ width: `${studentScore}%` }} />
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-50 mt-2">
                            <div className="text-center">
                              <p className="text-[10px] text-gray-400 uppercase font-bold">Average</p>
                              <p className="text-sm font-bold text-gray-700">{subStats.avg}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-[10px] text-gray-400 uppercase font-bold">Highest</p>
                              <p className="text-sm font-bold text-green-600">{subStats.max}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-[10px] text-gray-400 uppercase font-bold">Lowest</p>
                              <p className="text-sm font-bold text-amber-600">{subStats.min}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="bg-indigo-50 p-4 rounded-xl flex gap-3 items-start">
                  <Info className="text-indigo-600 shrink-0 mt-0.5" size={18} />
                  <p className="text-xs text-indigo-800 leading-relaxed">
                    This analysis compares individual performance against the current cohort's metrics. 
                    Scores are calculated based on the latest assessment data available in the system.
                  </p>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                <button 
                  onClick={() => setShowStatsModal(false)}
                  className="px-6 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Close Analytics
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [isVerified, setIsVerified] = useState(false);

  // Check for existing session (mock)
  useEffect(() => {
    const session = localStorage.getItem("edu_session");
    if (session) setIsVerified(true);
  }, []);

  const handleVerify = () => {
    localStorage.setItem("edu_session", "true");
    setIsVerified(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("edu_session");
    setIsVerified(false);
  };

  return (
    <div className="font-sans">
      <AnimatePresence mode="wait">
        {!isVerified ? (
          <motion.div 
            key="verify"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <VerificationScreen onVerify={handleVerify} />
          </motion.div>
        ) : (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <Dashboard onLogout={handleLogout} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
