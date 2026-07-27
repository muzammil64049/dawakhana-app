"use client";
import { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Users, Plus, RotateCcw, X, ChevronDown, Search, Sparkles, Activity, Leaf, HeartPulse, Sun, Moon, BarChart3, Settings as SettingsIcon, DollarSign, ShieldCheck, TrendingUp, LogOut, Printer, Download } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export default function App() {
  const [mounted, setMounted] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isSlipModalOpen, setIsSlipModalOpen] = useState(false);
  
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('unani_dark_mode');
      return saved !== null ? JSON.parse(saved) : false;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('unani_dark_mode', JSON.stringify(darkMode));
    }
  }, [darkMode]);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'all-patients' | 'analytics' | 'settings'>('dashboard');
  const [patients, setPatients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPatient, setModalPatient] = useState<any>({ 
    Id: null, Name: '', Address: '', Amount: '', Medicine: '', Syrup: '', Additional: '', Date: new Date().toISOString().split('T')[0], isCrushed: false 
  });

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const [newPatient, setNewPatient] = useState<any>({ 
    Id: null, Name: '', Address: '', Amount: '', Medicine: '', Syrup: '', Additional: '', Date: getTodayDate(), isCrushed: false 
  });

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openModalDropdown, setOpenModalDropdown] = useState<string | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const modalDropdownRef = useRef<HTMLDivElement>(null);
  const slipRef = useRef<HTMLDivElement>(null);

  const dropdownData = [
    { name: "HAB E Azraki", options: ["28 Azraki", "21 Azraki", "14 Azraki", "7 Azraki", "28 Azraki Capsule", "21 Azraki Capsule", "14 Azraki Capsule", "7 Azraki Capsule"] },
    { name: "HAB E Banafsha", options: ["28 Banafsha", "21 Banafsha", "14 Banafsha", "7 Banafsha", "28 Banafsha Capsule", "21 Banafsha Capsule", "14 Banafsha Capsule", "7 Banafsha Capsule"] },
    { name: "HAB E Taqat", options: ["28 Taqat", "21 Taqat", "14 Taqat", "7 Taqat", "28 Laal Taqat", "21 Laal Taqat", "14 Laal Taqat", "7 Laal Taqat"] },
    { name: "HAB E Suranja", options: ["28 Suranja", "14 Suranja", "7 Suranja"] },
    { name: "Ruqat capsule", options: ["28 Ruqat Capsule", "21 Ruqat Capsule", "14 Ruqat Capsule", "7 Ruqat Capsule"] },
    { name: "Zafrani Capsule", options: ["28 Zafrani Capsule", "21 Zafrani Capsule", "14 Zafrani Capsule", "7 Zafrani Capsule"] },
    { name: "HAB E Sugar", options: ["28 Sugar", "21 Sugar", "14 Sugar", "7 Sugar"] },
    { name: "HAB E Khaas", options: ["28 Khaas", "21 Khaas", "14 Khaas", "7 Khaas", "28 Khaas Capsule", "21 Khaas Capsule", "14 Khaas Capsule", "7 Khaas Capsule"] },
    { name: "HAB E Tankaar", options: ["28 Tankaar Black", "21 Tankaar Black", "14 Tankaar Black", "7 Tankaar Black", "28 Tankaar Orange", "21 Tankaar Orange", "14 Tankaar Orange", "7 Tankaar Orange"] },
    { name: "Safoof", options: ["Safoof E Khaas", "Safoof E Sugar", "Majoon E khaas", "Majoon E khaas Powder"] },
    { name: "Powder", options: ["Gas Powder", "Mubarak Powder", "Ruqat Powder", "Maleen Jadeed Powder"] },
    { name: "Syrup", options: ["Zafrani Faulad", "Faulad", "Jigar Faulad", "Podina", "Peppermint", "Carbo", "Hazim", "Akseer E Maida", "Gastorin", "Gastorin S", "Gastinol", "Gastinol S", "General tonic", "Taryaq E Sada", "Sual", "Sarfol", "Sadar", "Akseer E Bukhar", "Gonocare", "Taqat", "Taqat S", "Artho", "Sakoon E Qalb", "Sakoon E Qalb S", "Ashoka"] }
  ];

  const capitalizeFirstLetter = (val: string) => {
    if (!val) return "";
    return val.charAt(0).toUpperCase() + val.slice(1);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setOpenDropdown(null);
      if (modalDropdownRef.current && !modalDropdownRef.current.contains(event.target as Node)) setOpenModalDropdown(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function fetchData() {
    const { data, error } = await supabase.from('patients_table').select('*').order('Id', { ascending: false }).limit(5); 
    if (error) {
      console.error("Error fetching data:", error);  
    } else if (data) {
      setPatients(data);  
    }
  }

  async function handleServerSearch(keyword: string) {
    try {
      let query = supabase.from('patients_table').select('*').order('Id', { ascending: false });  

      if (keyword.trim()) {
        query = query.or(`Name.ilike.%${keyword}%,Address.ilike.%${keyword}%,Medicine.ilike.%${keyword}%,Syrup.ilike.%${keyword}%,Additional.ilike.%${keyword}%`);  
      }

      const { data, error } = await query;  
      if (error) {
        fetchData();  
      } else if (data) {
        setPatients(data);  
      }
    } catch (err) {
      console.error(err);  
    }
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;  
    setSearchTerm(val);  
    // Auto-search removed here
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleServerSearch(searchTerm);
    }
  }

  function handleClearFilters() {
    setSearchTerm('');  
    fetchData();  
  }

  function isOptionInCategory(categoryName: string, option: string) {
    const cat = dropdownData.find(d => d.name === categoryName);  
    return cat ? cat.options.includes(option) : false;  
  }

  function handleToggleOption(categoryName: string, option: string, isModal = false) {
    const targetSetter = isModal ? setModalPatient : setNewPatient;  
    targetSetter((prev: any) => {
      if (categoryName === "Syrup") {
        let currentList = prev.Syrup ? prev.Syrup.split(', ').filter(Boolean) : [];  
        currentList = currentList.includes(option) ? currentList.filter((item: string) => item !== option) : [...currentList, option];  
        return { ...prev, Syrup: currentList.join(', ') };  
      } else {
        let currentList = prev.Medicine ? prev.Medicine.split(', ').filter(Boolean) : [];  
        currentList = currentList.includes(option) ? currentList.filter((item: string) => item !== option) : [...currentList, option];  
        return { ...prev, Medicine: currentList.join(', ') };  
      }
    });
  }

  function handleDashboardRowClick(patient: any) {
    setSelectedPatient(patient);  
    setNewPatient({
      Id: patient.Id, Name: patient.Name || '', Address: patient.Address || '', Amount: patient.Amount || '',  
      Medicine: patient.Medicine?.replace(" ✨ [CRUSH]", "") || '', Syrup: patient.Syrup || '',  
      Additional: patient.Additional || '', Date: patient.Date || getTodayDate(), isCrushed: patient.Medicine?.includes("✨ [CRUSH]") || false  
    });
  }

  function handleAllPatientsRowClick(patient: any) {
    setModalPatient({
      Id: patient.Id, Name: patient.Name || '', Address: patient.Address || '', Amount: patient.Amount || '',  
      Medicine: patient.Medicine?.replace(" ✨ [CRUSH]", "") || '', Syrup: patient.Syrup || '',  
      Additional: patient.Additional || '', Date: patient.Date || getTodayDate(), isCrushed: patient.Medicine?.includes("✨ [CRUSH]") || false  
    });
    setIsModalOpen(true);  
  }

  function handleClearDashboardForm() {
    setNewPatient({ Id: null, Name: '', Address: '', Amount: '', Medicine: '', Syrup: '', Additional: '', Date: getTodayDate(), isCrushed: false });  
    setSelectedPatient(null);  
  }

  async function handleSaveFromDashboard() {
    if (!newPatient.Name.trim()) return alert("Name field khali hai!");  
    let finalMedicine = newPatient.isCrushed ? newPatient.Medicine + " ✨ [CRUSH]" : newPatient.Medicine;  
    const { error } = await supabase.from('patients_table').insert([{  
      Name: capitalizeFirstLetter(newPatient.Name),  
      Address: capitalizeFirstLetter(newPatient.Address),  
      Amount: newPatient.Amount,  
      Medicine: finalMedicine,  
      Syrup: newPatient.Syrup,  
      Additional: capitalizeFirstLetter(newPatient.Additional),  
      Date: newPatient.Date  
    }]);
    if (error) alert("Error: " + error.message);  
    else { alert("Saved successfully!"); fetchData(); handleClearDashboardForm(); }  
  }

  async function handleUpdateFromDashboard() {
    if (!newPatient.Id) return alert("Select a patient first!");  
    let finalMedicine = newPatient.isCrushed ? newPatient.Medicine + " ✨ [CRUSH]" : newPatient.Medicine;  
    const { error } = await supabase.from('patients_table').update({  
      Name: capitalizeFirstLetter(newPatient.Name),  
      Address: capitalizeFirstLetter(newPatient.Address),  
      Amount: newPatient.Amount,  
      Medicine: finalMedicine,  
      Syrup: newPatient.Syrup,  
      Additional: capitalizeFirstLetter(newPatient.Additional),  
      Date: newPatient.Date  
    }).eq('Id', newPatient.Id);  
    if (error) alert("Error: " + error.message);  
    else { alert("Update kamyab raha!"); fetchData(); }  
  }

  async function handleDeleteFromDashboard() {
    if (!newPatient.Id) return alert("Select a patient first!");  
    if (!confirm("Delete karna chahte hain?")) return;  
    const { error } = await supabase.from('patients_table').delete().eq('Id', newPatient.Id);  
    if (error) alert("Error: " + error.message);  
    else { alert("Deleted!"); fetchData(); handleClearDashboardForm(); }  
  }

  async function handleSaveFromModal() {
    if (!modalPatient.Name.trim()) return alert("Name field khali hai!");  
    let finalMedicine = modalPatient.isCrushed ? modalPatient.Medicine + " ✨ [CRUSH]" : modalPatient.Medicine;  
    const { error } = await supabase.from('patients_table').insert([{  
      Name: capitalizeFirstLetter(modalPatient.Name),  
      Address: capitalizeFirstLetter(modalPatient.Address),  
      Amount: modalPatient.Amount,  
      Medicine: finalMedicine,  
      Syrup: modalPatient.Syrup,  
      Additional: capitalizeFirstLetter(modalPatient.Additional),  
      Date: modalPatient.Date  
    }]);
    if (error) alert("Error: " + error.message);  
    else { alert("Saved successfully!"); fetchData(); setIsModalOpen(false); }  
  }

  async function handleUpdateFromModal() {
    if (!modalPatient.Id) return alert("Patient ID missing!");  
    let finalMedicine = modalPatient.isCrushed ? modalPatient.Medicine + " ✨ [CRUSH]" : modalPatient.Medicine;  
    const { error } = await supabase.from('patients_table').update({  
      Name: capitalizeFirstLetter(modalPatient.Name),  
      Address: capitalizeFirstLetter(modalPatient.Address),  
      Amount: modalPatient.Amount,  
      Medicine: finalMedicine,  
      Syrup: modalPatient.Syrup,  
      Additional: capitalizeFirstLetter(modalPatient.Additional),  
      Date: modalPatient.Date  
    }).eq('Id', modalPatient.Id);  
    if (error) alert("Error: " + error.message);  
    else { alert("Updated successfully!"); fetchData(); setIsModalOpen(false); }  
  }

  async function handleDeleteFromModal() {
    if (!modalPatient.Id) return alert("Patient ID missing!");  
    if (!confirm("Delete karna chahte hain?")) return;  
    const { error } = await supabase.from('patients_table').delete().eq('Id', modalPatient.Id);  
    if (error) alert("Error: " + error.message);  
    else { alert("Deleted!"); fetchData(); setIsModalOpen(false); }  
  }

  const handleDownloadSlip = async () => {
    const pName = selectedPatient ? selectedPatient.Name : (newPatient.Name || "Patient");
    const pDate = selectedPatient ? selectedPatient.Date : newPatient.Date;
    const pId = selectedPatient?.Id || 'NEW';
    const pAddress = selectedPatient ? selectedPatient.Address : newPatient.Address;
    const pAdditional = selectedPatient ? selectedPatient.Additional : newPatient.Additional;
    const pMed = selectedPatient ? selectedPatient.Medicine : newPatient.Medicine;
    const pSyrup = selectedPatient ? selectedPatient.Syrup : newPatient.Syrup;
    const pAmount = selectedPatient ? selectedPatient.Amount : (newPatient.Amount || "0");

    try {
      const { jsPDF } = await import('jspdf');

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a5'
      });

      doc.setDrawColor(244, 63, 94);
      doc.setLineWidth(0.8);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(10, 10, 128, 190, 4, 4, 'FD');

      doc.setTextColor(190, 18, 60);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);
      doc.text("HAKEEM AMJAD MAQSOOD", 74, 22, { align: "center" });

      doc.setFontSize(10);
      doc.setTextColor(70, 70, 70);
      doc.text("M Mehmood Unani Dawakhana", 74, 28, { align: "center" });

      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text("Gulshan-e-Iqbal, Karachi | Ph: +92 300 7071814", 74, 33, { align: "center" });

      doc.setDrawColor(225, 29, 72);
      doc.setLineWidth(0.5);
      doc.line(16, 38, 132, 38);

      doc.setFillColor(255, 241, 242);
      doc.setDrawColor(254, 205, 211);
      doc.roundedRect(16, 42, 116, 10, 2, 2, 'FD');

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 100, 100);
      doc.text(`Date:`, 20, 48);
      doc.setTextColor(30, 30, 30);
      doc.text(`${pDate}`, 30, 48);

      doc.setTextColor(100, 100, 100);
      doc.text(`Slip ID:`, 100, 48, { align: "right" });
      doc.setTextColor(30, 30, 30);
      doc.text(`#${pId}`, 128, 48, { align: "right" });

      let yPos = 62;

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(140, 140, 140);
      doc.text("PATIENT NAME:", 18, yPos);
      
      yPos += 5;
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(pName, 18, yPos);

      yPos += 8;
      doc.setDrawColor(241, 245, 249);
      doc.line(18, yPos, 130, yPos);
      yPos += 6;

      if (pAddress) {
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(140, 140, 140);
        doc.text("ADDRESS:", 18, yPos);
        
        yPos += 5;
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(51, 65, 85);
        doc.text(pAddress, 18, yPos);

        yPos += 8;
        doc.line(18, yPos, 130, yPos);
        yPos += 6;
      }

      if (pAdditional) {
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(140, 140, 140);
        doc.text("ADDITIONAL INFO:", 18, yPos);
        
        yPos += 5;
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(51, 65, 85);
        doc.text(pAdditional, 18, yPos);

        yPos += 8;
        doc.line(18, yPos, 130, yPos);
        yPos += 6;
      }

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(140, 140, 140);
      doc.text("PRESCRIBED MEDICINES / SYRUP:", 18, yPos);
      yPos += 6;

      const medContent = (pMed || "-") + (pSyrup ? `\n${pSyrup}` : "");
      const splitMeds = doc.splitTextToSize(medContent, 106);
      const boxHeight = Math.max(16, (splitMeds.length * 6) + 6);

      doc.setFillColor(240, 253, 250); 
      doc.setDrawColor(204, 251, 241);
      doc.roundedRect(16, yPos, 116, boxHeight, 2, 2, 'FD');

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(17, 94, 89); 
      doc.text(splitMeds, 22, yPos + 6);

      yPos += boxHeight + 10;

      doc.setFillColor(255, 241, 242);
      doc.setDrawColor(254, 205, 211);
      doc.roundedRect(16, yPos, 116, 14, 2, 2, 'FD');

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 100, 100);
      doc.text("TOTAL AMOUNT:", 22, yPos + 9);

      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(225, 29, 72);
      doc.text(`Rs. ${pAmount}`, 126, yPos + 9, { align: "right" });

      yPos += 26;
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8.5);
      doc.setTextColor(150, 150, 150);
      doc.text("Get well soon! Thank you for visiting our dawakhana.", 74, yPos, { align: "center" });

      doc.save(`Slip_${pName.replace(/\s+/g, '_')}_${pDate}.pdf`);
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("PDF generate karne mein masla aaya hai.");
    }
  };

  const totalPatientsCount = patients.length;  
  const totalRevenue = patients.reduce((sum, p) => sum + (parseFloat(p.Amount) || 0), 0);  
  const todayPatientsCount = patients.filter(p => p.Date === getTodayDate()).length;  
  const avgRevenuePerPatient = totalPatientsCount > 0 ? Math.round(totalRevenue / totalPatientsCount) : 0;  

  useEffect(() => { setMounted(true); fetchData(); }, []);  
  if (!mounted) return null;  

  return (
    <div className={`min-h-screen lg:h-screen w-full lg:w-screen overflow-x-hidden lg:overflow-hidden font-sans flex flex-col transition-colors duration-300 selection:bg-indigo-500 selection:text-white ${  
      darkMode 
        ? 'bg-[#121619] text-slate-100'  
        : 'bg-gradient-to-br from-[#fffbfa] via-[#fdf6f5] to-[#f4f7f6] text-slate-800'  
    }`}
    onClick={() => {
      setOpenDropdown(null);  
      setOpenModalDropdown(null);  
    }}
    >
      
      {/* HEADER */}
      <header className={`h-14 px-3 sm:px-5 flex-shrink-0 flex justify-between items-center z-40 border-b transition-colors duration-300 relative ${  
        darkMode 
          ? 'bg-gradient-to-r from-[#181e22] via-[#1f2937] to-[#111827] border-slate-800 shadow-md'  
          : 'bg-gradient-to-r from-rose-100/80 via-teal-100/60 to-indigo-100/80 border-rose-200/60 shadow-md shadow-rose-500/5 backdrop-blur-md'  
      }`}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-rose-400 via-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
            <Leaf size={16} className="text-white animate-pulse" />  
          </div>
          <div>
            <h1 className={`text-xs sm:text-base md:text-lg font-black tracking-tight bg-gradient-to-r ${  
              darkMode ? 'from-rose-300 via-teal-300 to-indigo-300' : 'from-rose-700 via-teal-700 to-indigo-700'  
            } bg-clip-text text-transparent leading-tight`}>
              M Mehmood Unani Dawakhana
            </h1>
          </div>
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center">
          <div className={`px-5 py-1.5 rounded-full border shadow-inner transition-all duration-300 ${  
            darkMode 
              ? 'bg-slate-900/40 border-amber-500/30 shadow-amber-500/10'  
              : 'bg-white/50 border-amber-400/40 shadow-amber-500/10'  
          }`}>
            <span className={`text-base sm:text-lg font-black tracking-wider uppercase bg-gradient-to-r ${  
              darkMode ? 'from-amber-200 via-yellow-400 to-amber-300' : 'from-amber-600 via-yellow-600 to-amber-700'  
            } bg-clip-text text-transparent drop-shadow-sm`}>
              Hakeem Amjad Maqsood
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className={`hidden sm:block text-xs font-bold font-serif px-3.5 py-1.5 rounded-xl border shadow-sm ${  
            darkMode ? 'bg-slate-800/60 border-slate-700 text-rose-300' : 'bg-white/60 border-rose-200/60 text-rose-900'  
          }`}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>

          <button 
            onClick={() => setDarkMode(!darkMode)}  
            className={`p-2 sm:p-2.5 rounded-xl border transition-all shadow-sm flex items-center justify-center ${  
              darkMode ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' : 'bg-white border-rose-200 text-slate-700 hover:bg-rose-50'  
            }`}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}  
          </button>
        </div>
      </header>

      {/* BODY CONTAINER */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden relative">
        
        {/* SIDEBAR */}
        <aside className={`w-full lg:w-56 flex-shrink-0 border-b lg:border-r flex flex-row lg:flex-col justify-between items-center lg:items-stretch p-2.5 sm:p-3.5 gap-2 sm:gap-3 overflow-x-auto ${  
          darkMode ? 'bg-[#181e22]/80 border-slate-800' : 'bg-white/60 border-rose-100/60 backdrop-blur-md'  
        }`}>
          <div className="flex flex-row lg:flex-col gap-2.5 sm:gap-3 w-full overflow-x-auto lg:overflow-visible items-center lg:items-stretch">
            <button 
              onClick={() => setActiveTab('dashboard')}  
              className={`flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3.5 rounded-2xl font-extrabold text-xs sm:text-sm transition-all whitespace-nowrap lg:w-full text-left shadow-sm ${  
                activeTab === 'dashboard' 
                  ? 'bg-gradient-to-r from-rose-500 to-teal-500 text-white shadow-rose-500/25 shadow-md'  
                  : darkMode ? 'hover:bg-slate-800 text-slate-300 hover:text-white' : 'hover:bg-rose-50/80 text-slate-700'  
              }`}
            >
              <LayoutDashboard size={18} />  
              <span>Dashboard</span>
            </button>

            <button 
              onClick={() => setActiveTab('all-patients')}  
              className={`flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3.5 rounded-2xl font-extrabold text-xs sm:text-sm transition-all whitespace-nowrap lg:w-full text-left shadow-sm ${  
                activeTab === 'all-patients' 
                  ? 'bg-gradient-to-r from-rose-500 to-teal-500 text-white shadow-rose-500/25 shadow-md'  
                  : darkMode ? 'hover:bg-slate-800 text-slate-300 hover:text-white' : 'hover:bg-rose-50/80 text-slate-700'  
              }`}
            >
              <Users size={18} />  
              <span>All Patients</span>
            </button>

            <button 
              onClick={() => setActiveTab('analytics')}  
              className={`flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3.5 rounded-2xl font-extrabold text-xs sm:text-sm transition-all whitespace-nowrap lg:w-full text-left shadow-sm ${  
                activeTab === 'analytics' 
                  ? 'bg-gradient-to-r from-rose-500 to-teal-500 text-white shadow-rose-500/25 shadow-md'  
                  : darkMode ? 'hover:bg-slate-800 text-slate-300 hover:text-white' : 'hover:bg-rose-50/80 text-slate-700'  
              }`}
            >
              <BarChart3 size={18} />  
              <span>Analytics</span>
            </button>

            <button 
              onClick={() => setActiveTab('settings')}  
              className={`flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3.5 rounded-2xl font-extrabold text-xs sm:text-sm transition-all whitespace-nowrap lg:w-full text-left shadow-sm ${  
                activeTab === 'settings' 
                  ? 'bg-gradient-to-r from-rose-500 to-teal-500 text-white shadow-rose-500/25 shadow-md'  
                  : darkMode ? 'hover:bg-slate-800 text-slate-300 hover:text-white' : 'hover:bg-rose-50/80 text-slate-700'  
              }`}
            >
              <SettingsIcon size={18} />  
              <span>Settings</span>
            </button>

            <div className="hidden lg:flex flex-col px-1 pt-4 pb-1 flex-1">
              <img 
                src="/Your paragraph text (1)111.png"  
                alt="M Mehmood Unani Dawakhhana"  
                className={`w-full h-full min-h-[240px] rounded-2xl object-cover shadow-sm border-0 transition-all duration-300 ${  
                  darkMode ? 'brightness-0 invert' : ''  
                }`}
              />
            </div>
          </div>

          <div className="pt-0 lg:pt-3 lg:border-t border-rose-200/40 dark:border-slate-800 flex-shrink-0">
            <button 
              onClick={() => setIsLogoutConfirmOpen(true)}  
              title="Logout"
              className="w-full flex items-center justify-center lg:justify-start gap-2.5 px-3 lg:px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group whitespace-nowrap"
            >
              <LogOut size={16} className="transition-transform duration-300 group-hover:-translate-x-1 flex-shrink-0" />  
              <span className="hidden lg:inline">Logout</span>
            </button>
          </div>
        </aside>

        {/* LOGOUT CONFIRMATION MODAL */}
        {isLogoutConfirmOpen && (
          <div 
            onClick={(e) => { if (e.target === e.currentTarget) setIsLogoutConfirmOpen(false); }}  
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <div 
              className={`border p-5 sm:p-6 rounded-3xl w-full max-w-sm relative flex flex-col gap-4 shadow-2xl ${  
                darkMode ? 'bg-[#181e22] border-slate-800 text-slate-100' : 'bg-white border-rose-100 text-slate-900 shadow-rose-500/10'  
              }`}
              onClick={(e) => e.stopPropagation()}  
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 flex-shrink-0">
                  <LogOut size={20} />  
                </div>
                <div>
                  <h3 className="font-black text-base">Are you sure?</h3>  
                  <p className="text-xs text-slate-400 font-semibold">Do you really want to log out from your account?</p>  
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  onClick={() => setIsLogoutConfirmOpen(false)}  
                  className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm border transition ${  
                    darkMode ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800' : 'bg-rose-50/50 border-rose-200 text-slate-700 hover:bg-rose-100'  
                  }`}
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    localStorage.removeItem('isLoggedIn');  
                    setIsLogoutConfirmOpen(false);  
                    window.location.href = '/login';  
                  }}
                  className="flex-1 py-2.5 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-rose-500 to-teal-500 text-white shadow-md shadow-rose-500/25 hover:opacity-95 transition"
                >
                  Yes, Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SLIP GENERATOR MODAL */}
        {isSlipModalOpen && (
          <div 
            onClick={(e) => { if (e.target === e.currentTarget) setIsSlipModalOpen(false); }}  
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          >
            <div 
              className="bg-white text-slate-900 border border-slate-200 p-6 sm:p-8 rounded-3xl w-full max-w-lg relative flex flex-col gap-5 shadow-2xl my-auto"
              onClick={(e) => e.stopPropagation()}  
            >
              <button onClick={() => setIsSlipModalOpen(false)} className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-rose-500 transition">
                <X size={20}/>  
              </button>

              <div ref={slipRef} className="bg-white border-2 border-dashed border-rose-300 p-6 rounded-2xl flex flex-col gap-4 text-slate-900">
                <div className="text-center border-b-2 border-rose-500 pb-3">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-rose-700 uppercase">
                    Hakeem Amjad Maqsood
                  </h2>
                  <p className="text-xs font-extrabold text-slate-600 mt-0.5">M Mehmood Unani Dawakhana</p>  
                  <p className="text-[11px] font-semibold text-slate-500">Gulshan-e-Iqbal, Karachi | Ph: +92 300 7071814</p>  
                </div>

                <div className="flex justify-between items-center text-xs font-bold text-slate-500 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100">
                  <span>Date: <strong className="text-slate-800">{selectedPatient ? selectedPatient.Date : newPatient.Date}</strong></span>  
                  <span>Slip ID: <strong className="text-slate-800">#{selectedPatient?.Id || 'NEW'}</strong></span>  
                </div>

                <div className="space-y-2.5 py-1">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                    <span className="text-xs font-bold text-slate-400">Patient Name:</span>
                    <span className="text-sm sm:text-base font-black text-slate-900">{selectedPatient ? selectedPatient.Name : (newPatient.Name || "-")}</span>  
                  </div>

                  {(selectedPatient?.Address || newPatient.Address) && (
                    <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                      <span className="text-xs font-bold text-slate-400">Address:</span>
                      <span className="text-xs sm:text-sm font-bold text-slate-700">{selectedPatient ? selectedPatient.Address : newPatient.Address}</span>  
                    </div>
                  )}

                  {(selectedPatient?.Additional || newPatient.Additional) && (
                    <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                      <span className="text-xs font-bold text-slate-400">Additional Info:</span>
                      <span className="text-xs sm:text-sm font-bold text-slate-700">{selectedPatient ? selectedPatient.Additional : newPatient.Additional}</span>  
                    </div>
                  )}

                  <div className="flex flex-col gap-1 pt-1 border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-400">Prescribed Medicine / Syrup:</span>
                    <span className="text-xs sm:text-sm font-extrabold text-teal-800 bg-teal-50 p-2.5 rounded-xl border border-teal-100">
                      {selectedPatient ? selectedPatient.Medicine : newPatient.Medicine || "-"}  
                      {selectedPatient?.Syrup || newPatient.Syrup ? <><br/>{selectedPatient ? selectedPatient.Syrup : newPatient.Syrup}</> : null}  
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">Total Amount:</span>
                    <span className="text-base sm:text-lg font-black text-rose-600">Rs. {selectedPatient ? selectedPatient.Amount : (newPatient.Amount || "0")}</span>  
                  </div>
                </div>

                <div className="text-center pt-4 border-t border-slate-200 mt-2">
                  <p className="text-[11px] font-bold text-slate-400 italic">Get well soon! Thank you for visiting our dawakhana.</p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={handleDownloadSlip}
                  className="flex-1 bg-gradient-to-r from-rose-500 to-teal-500 hover:opacity-95 text-white py-3 px-4 rounded-xl font-black text-xs sm:text-sm shadow-md shadow-rose-500/25 flex items-center justify-center gap-2 transition"
                >
                  <Download size={16} /> Download PDF Slip
                </button>
                <button 
                  onClick={() => setIsSlipModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MAIN VIEWPORT AREA */}
        <main className="flex-1 overflow-y-auto lg:overflow-hidden p-3.5 flex flex-col lg:flex-row gap-4">

          {/* POPUP MODAL FOR EDITING FROM ALL PATIENTS */}
          {isModalOpen && (
            <div 
              onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}  
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
            >
              <div 
                className={`border p-4 sm:p-5 rounded-3xl w-full max-w-xl relative flex flex-col shadow-2xl max-h-[90vh] overflow-y-auto ${  
                  darkMode ? 'bg-[#181e22] border-slate-800 text-slate-100' : 'bg-white border-rose-100 text-slate-900 shadow-rose-500/10'  
                }`} 
                ref={modalDropdownRef}  
                onClick={(e) => e.stopPropagation()}  
              >
                <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-rose-500 transition">
                  <X size={18}/>  
                </button>
                
                <h3 className="font-black mb-3 text-sm sm:text-base flex items-center gap-2">
                  <Activity size={18} className="text-emerald-500 animate-pulse" />  
                  {modalPatient.Id ? "Edit Patient Details" : "Add New Patient"}  
                </h3>

                <div className={`border rounded-2xl p-4 mb-4 flex flex-col gap-3 shadow-sm ${  
                  darkMode ? 'bg-slate-900/80 border-slate-700' : 'bg-rose-50/60 border-rose-200'  
                }`}>
                  <div className="flex justify-between items-center border-b pb-2 border-rose-200/50 dark:border-slate-800">
                    <h4 className="font-extrabold text-sm sm:text-base flex items-center gap-2 text-rose-600 dark:text-rose-400">
                      <HeartPulse size={18} className="text-rose-500 animate-pulse"/> Profile Summary  
                    </h4>
                    <span className="text-xs sm:text-sm font-bold text-slate-400">{modalPatient.Date || getTodayDate()}</span>  
                  </div>

                  <div className="flex justify-between items-center text-sm sm:text-base">
                    <span className="font-black truncate pr-2 text-base sm:text-lg">{modalPatient.Name || "Patient Name"}</span>  
                    <span className="font-black text-rose-500 text-base sm:text-lg whitespace-nowrap">{modalPatient.Amount || "0"}</span>  
                  </div>

                  {modalPatient.Address && (
                    <div className="text-xs sm:text-sm font-black text-black dark:text-black truncate">
                      <span className="font-bold text-slate-400">Address: </span>{modalPatient.Address}  
                    </div>
                  )}

                  {modalPatient.Additional && (
                    <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
                      <span className="font-bold text-slate-400">Additional: </span>{modalPatient.Additional}  
                    </div>
                  )}

                  <div className="text-xs sm:text-sm font-bold text-rose-500/90 leading-relaxed">
                    <span className="font-extrabold text-slate-400">Med: </span>  
                    {modalPatient.isCrushed ? `${modalPatient.Medicine || "-"} ✨ [CRUSH]` : (modalPatient.Medicine || "-")}  
                    {modalPatient.Syrup ? <><br/><span className="font-extrabold text-slate-400">Syrup: </span>{modalPatient.Syrup}</> : null}  
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-400">Patient Name</label>
                      <input placeholder="Enter Name" className={`p-3 rounded-xl border text-xs sm:text-sm font-bold outline-none transition h-12 ${darkMode ? 'bg-slate-900 border-slate-800 text-white focus:border-rose-500' : 'bg-rose-50/30 border-rose-100 focus:border-rose-400'}`} value={modalPatient.Name} onChange={(e) => setModalPatient({...modalPatient, Name: e.target.value})} />  
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-400">Date</label>
                      <input type="date" className={`p-3 rounded-xl border text-xs sm:text-sm font-bold outline-none transition h-12 ${darkMode ? 'bg-slate-900 border-slate-800 text-white focus:border-rose-500' : 'bg-rose-50/30 border-rose-100 focus:border-rose-400'}`} value={modalPatient.Date} onChange={(e) => setModalPatient({...modalPatient, Date: e.target.value})} />  
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-400">Address</label>
                      <input placeholder="Enter Address" className={`p-3 rounded-xl border text-xs sm:text-sm font-semibold outline-none transition h-12 ${darkMode ? 'bg-slate-900 border-slate-800 text-white focus:border-rose-500' : 'bg-rose-50/30 border-rose-100 focus:border-rose-400'}`} value={modalPatient.Address} onChange={(e) => setModalPatient({...modalPatient, Address: e.target.value})} />  
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-400">Additional</label>
                      <input placeholder="Additional info" className={`p-3 rounded-xl border text-xs sm:text-sm font-semibold outline-none transition h-12 ${darkMode ? 'bg-slate-900 border-slate-800 text-white focus:border-rose-500' : 'bg-rose-50/30 border-rose-100 focus:border-rose-400'}`} value={modalPatient.Additional} onChange={(e) => setModalPatient({...modalPatient, Additional: e.target.value})} />  
                    </div>
                  </div>

                  <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 border rounded-2xl ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-rose-50/20 border-rose-100'}`}>
                    {dropdownData.map((drop, idx) => {  
                      const isOpen = openModalDropdown === drop.name;  
                      let selectedItems: string[] = drop.name === "Syrup" ? (modalPatient.Syrup ? modalPatient.Syrup.split(', ').filter((i: string) => isOptionInCategory("Syrup", i)) : []) : (modalPatient.Medicine ? modalPatient.Medicine.split(', ').filter((i: string) => isOptionInCategory(drop.name, i)) : []);  

                      return (
                        <div key={idx} className="flex flex-col gap-1 relative">
                          <label className="text-[11px] font-extrabold text-rose-500 truncate">{drop.name}</label>
                          <div onClick={(e) => { e.stopPropagation(); setOpenModalDropdown(isOpen ? null : drop.name); }} className={`px-3 py-2.5 rounded-xl border text-xs sm:text-sm font-bold flex justify-between items-center cursor-pointer transition h-12 ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-rose-100 text-slate-800 hover:border-rose-300'}`}>
                            <span className="truncate">{selectedItems.length > 0 ? selectedItems.join(", ") : `Select...`}</span>
                            <ChevronDown size={15} className="text-rose-500 flex-shrink-0" />  
                          </div>
                          {isOpen && (
                            <div className={`absolute bottom-[calc(100%+2px)] left-0 right-0 mb-1 border rounded-xl shadow-xl z-30 max-h-40 overflow-y-auto p-1 space-y-1 ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-rose-100'}`}>
                              {drop.options.map((opt, optIdx) => {
                                const isSelected = selectedItems.includes(opt);
                                return (
                                  <div 
                                    key={optIdx} 
                                    onClick={() => handleToggleOption(drop.name, opt, true)}  
                                    className={`p-2 text-xs sm:text-sm font-bold rounded-lg cursor-pointer flex justify-between items-center transition ${isSelected ? 'bg-rose-500 text-white' : darkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-rose-50 text-slate-800'}`}
                                  >
                                    <span className="truncate">{opt}</span>
                                    {isSelected && <span>✓</span>}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 items-center">
                    <label 
                      className={`flex items-center gap-3 px-3.5 rounded-xl font-bold text-xs sm:text-sm cursor-pointer border h-12 transition select-none ${  
                        modalPatient.isCrushed ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500 shadow-sm shadow-emerald-500/10' : darkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-rose-50/30 border-rose-100 text-slate-700'  
                      }`}
                      onClick={() => setModalPatient({...modalPatient, isCrushed: !modalPatient.isCrushed})}  
                    >
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${modalPatient.isCrushed ? 'bg-emerald-500 border-emerald-500 text-white' : darkMode ? 'border-slate-700 bg-slate-800' : 'border-rose-200 bg-white'}`}>
                        {modalPatient.isCrushed && <span className="text-xs font-black leading-none">✓</span>}  
                      </div>
                      <span className="font-extrabold">Crush Med</span>
                    </label>
                    <input placeholder="Amount" className={`p-3 rounded-xl border font-black text-sm sm:text-base h-12 outline-none transition ${darkMode ? 'bg-slate-900 border-slate-800 text-white focus:border-rose-500' : 'bg-rose-50/30 border-rose-100 focus:border-rose-400'}`} value={modalPatient.Amount} onChange={(e) => setModalPatient({...modalPatient, Amount: e.target.value})} />  
                  </div>
                </div>

                <div className="pt-3.5 border-t mt-4 flex gap-2.5 flex-shrink-0 border-rose-100/60">
                  {modalPatient.Id ? (
                    <>
                      <button onClick={handleUpdateFromModal} className="flex-1 bg-gradient-to-r from-rose-500 to-teal-500 hover:opacity-95 text-white p-3 rounded-xl font-black text-sm shadow-md shadow-rose-500/25">Update</button>  
                      <button onClick={handleDeleteFromModal} className={`p-3 rounded-xl font-black text-sm border ${darkMode ? 'bg-slate-900 border-slate-800 text-rose-400 hover:bg-rose-950/30' : 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'}`}>Delete</button>  
                    </>
                  ) : (
                    <button onClick={handleSaveFromModal} className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-white p-3 rounded-xl font-black text-sm shadow-md shadow-emerald-500/25">Save Patient</button>  
                  )}
                </div>
              </div>
            </div>
          )}

          {/* DASHBOARD TAB VIEW */}
          {activeTab === 'dashboard' && (
            <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-visible lg:overflow-hidden" ref={dropdownRef}>  
              
              <div 
                className={`flex-1 border rounded-3xl p-3.5 sm:p-5 flex flex-col shadow-lg overflow-visible lg:overflow-hidden justify-between ${  
                  darkMode ? 'bg-[#181e22]/90 border-slate-800' : 'bg-white/80 border-rose-100/60 shadow-rose-500/5 backdrop-blur-md'  
                }`}
                onClick={(e) => e.stopPropagation()}  
              >
                <div className="flex justify-between items-center pb-2.5 border-b border-rose-100/60 flex-shrink-0">
                  <h3 className="font-black text-xs sm:text-sm flex items-center gap-2">
                    <Sparkles size={16} className="text-amber-500 animate-spin" /> Patient Form  
                  </h3>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setModalPatient({ Id: null, Name: '', Address: '', Amount: '', Medicine: '', Syrup: '', Additional: '', Date: getTodayDate(), isCrushed: false }); setIsModalOpen(true); }} className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-emerald-500/20">
                      <Plus size={14} /> Add Patient  
                    </button>
                    <button onClick={handleClearDashboardForm} className={`p-2 rounded-xl border transition ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800' : 'bg-rose-50/50 border-rose-200 text-slate-700 hover:bg-rose-100'}`}>
                      <RotateCcw size={14}/>  
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 my-auto py-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="flex flex-col gap-0.5">
                      <label className="text-[11px] font-bold text-slate-400">Patient Name</label>
                      <input placeholder="Name" className={`px-3 py-2 rounded-xl border text-xs sm:text-sm font-bold outline-none transition h-10 ${darkMode ? 'bg-slate-900 border-slate-800 text-white focus:border-rose-500' : 'bg-rose-50/30 border-rose-100 focus:border-rose-400'}`} value={newPatient.Name} onChange={(e) => setNewPatient({...newPatient, Name: e.target.value})} />  
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <label className="text-[11px] font-bold text-slate-400">Date</label>
                      <input type="date" className={`px-3 py-2 rounded-xl border text-xs sm:text-sm font-bold outline-none transition h-10 ${darkMode ? 'bg-slate-900 border-slate-800 text-white focus:border-rose-500' : 'bg-rose-50/30 border-rose-100 focus:border-rose-400'}`} value={newPatient.Date} onChange={(e) => setNewPatient({...newPatient, Date: e.target.value})} />  
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <label className="text-[11px] font-bold text-slate-400">Address</label>
                      <input placeholder="Address" className={`px-3 py-2 rounded-xl border text-xs sm:text-sm font-semibold outline-none transition h-10 ${darkMode ? 'bg-slate-900 border-slate-800 text-white focus:border-rose-500' : 'bg-rose-50/30 border-rose-100 focus:border-rose-400'}`} value={newPatient.Address} onChange={(e) => setNewPatient({...newPatient, Address: e.target.value})} />  
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <label className="text-[11px] font-bold text-slate-400">Additional</label>
                      <input placeholder="Additional" className={`px-3 py-2 rounded-xl border text-xs sm:text-sm font-semibold outline-none transition h-10 ${darkMode ? 'bg-slate-900 border-slate-800 text-white focus:border-rose-500' : 'bg-rose-50/30 border-rose-100 focus:border-rose-400'}`} value={newPatient.Additional} onChange={(e) => setNewPatient({...newPatient, Additional: e.target.value})} />  
                    </div>
                  </div>

                  <div className={`grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 border rounded-2xl ${darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-rose-50/20 border-rose-100'}`}>
                    {dropdownData.map((drop, idx) => {  
                      const isOpen = openDropdown === drop.name;  
                      let selectedItems: string[] = drop.name === "Syrup" ? (newPatient.Syrup ? newPatient.Syrup.split(', ').filter((i: string) => isOptionInCategory("Syrup", i)) : []) : (newPatient.Medicine ? newPatient.Medicine.split(', ').filter((i: string) => isOptionInCategory(drop.name, i)) : []);  

                      return (
                        <div key={idx} className="flex flex-col gap-0.5 relative">
                          <label className="text-[10px] font-extrabold text-rose-500 truncate">{drop.name}</label>
                          <div onClick={(e) => { e.stopPropagation(); setOpenDropdown(isOpen ? null : drop.name); }} className={`px-3 py-2 rounded-xl border text-xs font-bold flex justify-between items-center cursor-pointer transition h-10 ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-rose-100 text-slate-800 hover:border-rose-300'}`}>
                            <span className="truncate">{selectedItems.length > 0 ? selectedItems.join(", ") : `Select...`}</span>
                            <ChevronDown size={14} className="text-rose-500 flex-shrink-0" />  
                          </div>
                          {isOpen && (
                            <div className={`absolute bottom-[calc(100%+2px)] left-0 right-0 mb-1 border rounded-xl shadow-2xl z-30 max-h-36 overflow-y-auto p-1 space-y-1 ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-rose-100'}`}>
                              {drop.options.map((opt, optIdx) => {
                                const isSelected = selectedItems.includes(opt);
                                return (
                                  <div 
                                    key={optIdx} 
                                    onClick={() => handleToggleOption(drop.name, opt)}  
                                    className={`p-1.5 text-xs font-bold rounded-lg cursor-pointer flex justify-between items-center transition ${isSelected ? 'bg-rose-500 text-white shadow-sm' : darkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-rose-50 text-slate-800'}`}
                                  >
                                    <span className="truncate">{opt}</span>
                                    {isSelected && <span>✓</span>}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 items-center">
                    <label 
                      className={`flex items-center gap-3 px-3 rounded-xl font-bold text-xs cursor-pointer border h-10 transition select-none ${  
                        newPatient.isCrushed ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500 shadow-sm shadow-emerald-500/10' : darkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-rose-50/30 border-rose-100 text-slate-700'  
                      }`}
                      onClick={() => setNewPatient({...newPatient, isCrushed: !newPatient.isCrushed})}  
                    >
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${newPatient.isCrushed ? 'bg-emerald-500 border-emerald-500 text-white' : darkMode ? 'border-slate-700 bg-slate-800' : 'border-rose-200 bg-white'}`}>
                        {newPatient.isCrushed && <span className="text-[10px] font-black leading-none">✓</span>}  
                      </div>
                      <span className="font-extrabold">Crush Med</span>
                    </label>
                    <input placeholder="Amount" className={`px-3 py-2 rounded-xl border font-black text-xs sm:text-sm h-10 outline-none transition ${darkMode ? 'bg-slate-900 border-slate-800 text-white focus:border-rose-500' : 'bg-rose-50/30 border-rose-100 focus:border-rose-400'}`} value={newPatient.Amount} onChange={(e) => setNewPatient({...newPatient, Amount: e.target.value})} />  
                  </div>
                </div>

                <div className="pt-2.5 border-t flex gap-2 flex-shrink-0 border-rose-100/60 bg-transparent">
                  <button onClick={handleSaveFromDashboard} className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-white py-2.5 px-3 rounded-xl font-black text-xs shadow-md shadow-emerald-500/25 transition h-10 flex items-center justify-center">
                    Save
                  </button>
                  <button onClick={handleUpdateFromDashboard} className="flex-1 bg-gradient-to-r from-rose-500 to-teal-500 hover:opacity-95 text-white py-2.5 px-3 rounded-xl font-black text-xs shadow-md shadow-rose-500/25 transition h-10 flex items-center justify-center">
                    Update
                  </button>
                  <button onClick={handleDeleteFromDashboard} className={`py-2.5 px-3 rounded-xl font-black text-xs border transition h-10 flex items-center justify-center ${darkMode ? 'bg-slate-900 border-slate-800 text-rose-400 hover:bg-rose-950/30' : 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'}`}>
                    Delete
                  </button>
                </div>

              </div>

              <div className="w-full lg:w-[390px] xl:w-[450px] flex-shrink-0 flex flex-col gap-4 overflow-visible lg:overflow-hidden">
                
                <div className={`border rounded-3xl p-4.5 sm:p-5 flex flex-col gap-3.5 shadow-lg flex-shrink-0 ${  
                  darkMode ? 'bg-[#181e22]/90 border-slate-800' : 'bg-white/80 border-rose-100/60 shadow-rose-500/5 backdrop-blur-md'  
                }`}>
                  <div className="flex justify-between items-center border-b pb-2 border-rose-200/50 dark:border-slate-800">
                    <h3 className="font-black text-sm sm:text-base flex items-center gap-2 text-rose-600 dark:text-rose-400">
                      <HeartPulse size={18} className="text-rose-500 animate-pulse"/> Profile Summary  
                    </h3>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setIsSlipModalOpen(true)}
                        className="bg-gradient-to-r from-rose-500 to-teal-500 text-white px-3 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md shadow-rose-500/20 hover:opacity-95 transition"
                      >
                        <Download size={13} /> Download Slip
                      </button>
                      <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">Active</span>  
                    </div>
                  </div>

                  <div className={`p-4 rounded-2xl border flex flex-col gap-3 ${darkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-rose-50/40 border-rose-200/60'}`}>
                    <div className="flex justify-between items-center">
                      <h4 className="font-black text-base sm:text-lg break-words pr-2">{selectedPatient ? selectedPatient.Name : (newPatient.Name || "No Patient Selected")}</h4>  
                      <span className="text-xs sm:text-sm font-bold text-slate-400 whitespace-nowrap">{selectedPatient ? selectedPatient.Date : newPatient.Date}</span>  
                    </div>
                    
                    {(selectedPatient?.Address || newPatient.Address) && (
                      <div className="text-xs sm:text-sm font-black text-black dark:text-black whitespace-pre-wrap break-words">
                        <span className="font-bold text-slate-400">Address: </span>  
                        {selectedPatient ? selectedPatient.Address : newPatient.Address}  
                      </div>
                    )}

                    {(selectedPatient?.Additional || newPatient.Additional) && (
                      <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-black whitespace-pre-wrap break-words">
                        <span className="font-bold text-slate-400">Additional: </span>  
                        {selectedPatient ? selectedPatient.Additional : newPatient.Additional}  
                      </div>
                    )}

                    <div className="text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-400 leading-relaxed whitespace-pre-wrap break-words">
                      <span className="font-extrabold text-slate-400">Med: </span>  
                      {selectedPatient ? selectedPatient.Medicine : newPatient.Medicine || "-"}  
                      {selectedPatient?.Syrup || newPatient.Syrup ? <><br/><span className="font-extrabold text-slate-400">Syrup: </span>{selectedPatient ? selectedPatient.Syrup : newPatient.Syrup}</> : null}  
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-rose-200/40 dark:border-slate-800">
                      <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Amount</span>
                      <span className="text-base sm:text-lg font-black text-rose-500">{selectedPatient ? selectedPatient.Amount : newPatient.Amount || "0"}</span>  
                    </div>
                  </div>
                </div>

                <div className={`border rounded-3xl p-4.5 flex-1 flex flex-col overflow-hidden shadow-lg min-h-[250px] lg:min-h-0 ${  
                  darkMode ? 'bg-[#181e22]/90 border-slate-800' : 'bg-white/80 border-rose-100/60 shadow-rose-500/5 backdrop-blur-md'  
                }`}>
                  <div className="flex justify-between items-center pb-2.5 mb-2.5 border-b border-rose-100/60 flex-shrink-0">
                    <h3 className="font-black text-xs sm:text-sm flex items-center gap-2">
                      <Users size={16} className="text-teal-500" /> Recent Patients  
                    </h3>
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20">{patients.length}</span>  
                  </div>

                  <div className="flex gap-2 mb-2.5 flex-shrink-0">
                    <div className="relative flex-1">
                      <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />  
                      <input 
                        placeholder="Search patients..." 
                        value={searchTerm}  
                        onChange={handleSearchChange}  
                        onKeyDown={handleKeyDown}
                        className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold outline-none transition h-11 ${  
                          darkMode ? 'bg-slate-900 border-slate-800 text-white focus:border-rose-500' : 'bg-rose-50/30 border-rose-100 focus:border-rose-400'  
                        }`} 
                      />
                    </div>
                    {/* Search Button */}
                    <button 
                      onClick={() => handleServerSearch(searchTerm)}  
                      title="Search"
                      className={`px-3 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition h-11 flex items-center justify-center gap-1 ${  
                        darkMode ? 'bg-slate-900 border-slate-800 text-teal-400 hover:bg-slate-800' : 'bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100'  
                      }`}
                    >
                      <Search size={14} />
                      <span className="hidden sm:inline">Search</span>
                    </button>

                    {searchTerm && (
                      <button 
                        onClick={handleClearFilters}  
                        title="Clear Search"
                        className={`px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition h-11 flex items-center justify-center ${  
                          darkMode ? 'bg-slate-900 border-slate-800 text-rose-400 hover:bg-slate-800' : 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'  
                        }`}
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  <div className="flex-1 overflow-y-auto pr-1.5 space-y-2">
                    {patients.map((pat, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => handleDashboardRowClick(pat)}  
                        className={`p-3 rounded-xl border cursor-pointer flex justify-between items-center transition ${  
                          selectedPatient?.Id === pat.Id 
                            ? 'bg-rose-500/10 border-rose-500 shadow-sm'  
                            : darkMode ? 'bg-slate-900/40 border-slate-800 hover:bg-slate-900' : 'bg-white border-rose-100/80 hover:bg-rose-50/40'  
                        }`}
                      >
                        <div className="flex flex-col gap-1 truncate pr-2">
                          <div className="flex items-center gap-2.5">
                            <span className="font-black text-xs sm:text-sm truncate">{pat.Name}</span>  
                            {pat.Address && (
                              <span className="text-xs text-slate-400 truncate max-w-[130px]">({pat.Address})</span>  
                            )}
                          </div>
                          <span className="text-xs text-teal-600 dark:text-teal-400 font-bold truncate">{pat.Medicine || pat.Syrup || "-"}</span>  
                        </div>
                        <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                          <span className="text-xs sm:text-sm font-black text-rose-500">{pat.Amount || "0"}</span>  
                          <span className="text-[10px] font-bold text-slate-400">{pat.Date}</span>  
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ALL PATIENTS TAB VIEW */}
          {activeTab === 'all-patients' && (
            <div className="flex-1 flex gap-4 overflow-hidden">
              <div className={`flex-1 border rounded-3xl p-4 sm:p-5 flex flex-col overflow-hidden shadow-lg ${  
                darkMode ? 'bg-[#181e22]/90 border-slate-800' : 'bg-white/80 border-rose-100/60 shadow-rose-500/5 backdrop-blur-md'  
              }`}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 mb-3.5 border-b border-rose-100/60 flex-shrink-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="font-black text-sm sm:text-base flex items-center gap-2">
                      <Users size={18} className="text-teal-500 animate-bounce" /> All Patients Directory  
                    </h3>
                    <button 
                      onClick={() => { 
                        setModalPatient({ Id: null, Name: '', Address: '', Amount: '', Medicine: '', Syrup: '', Additional: '', Date: getTodayDate(), isCrushed: false });  
                        setIsModalOpen(true);  
                      }} 
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                    >
                      <Plus size={15} /> Add Patient  
                    </button>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />  
                    <input 
                      placeholder="Search database..." 
                      value={searchTerm}  
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold outline-none transition h-11 ${  
                        darkMode ? 'bg-slate-900 border-slate-800 text-white focus:border-rose-500' : 'bg-rose-50/30 border-rose-100 focus:border-rose-400'  
                      }`} 
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-auto rounded-2xl border border-rose-100/40 dark:border-slate-800">
                  <table className="w-full min-w-[750px] text-left border-collapse text-xs sm:text-sm">
                    <thead className={`sticky top-0 z-10 border-b ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-rose-50/90 border-rose-100 text-slate-700'}`}>
                      <tr>
                        <th className="p-3.5 font-black">Name</th>
                        <th className="p-3.5 font-black">Date</th>
                        <th className="p-3.5 font-black">Address</th>
                        <th className="p-3.5 font-black">Medicine</th>
                        <th className="p-3.5 font-black">Syrup</th>
                        <th className="p-3.5 font-black">Additional</th>
                        <th className="p-3.5 font-black">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-rose-100/40 dark:divide-slate-800 font-semibold">
                      {patients.map((pat, idx) => (
                        <tr 
                          key={idx} 
                          onClick={() => handleAllPatientsRowClick(pat)}  
                          className={`cursor-pointer transition align-top ${  
                            selectedPatient?.Id === pat.Id 
                              ? 'bg-rose-500/10 border-rose-500'  
                              : darkMode ? 'hover:bg-slate-800/50' : 'hover:bg-rose-50/30'  
                          }`}
                        >
                          <td className="p-3.5 font-black whitespace-pre-wrap break-words">{pat.Name}</td>  
                          <td className="p-3.5 text-slate-400 whitespace-nowrap font-bold">{pat.Date}</td>  
                          <td className="p-3.5 text-slate-500 dark:text-slate-400 whitespace-pre-wrap break-words">{pat.Address || "-"}</td>  
                          <td className="p-3.5 text-teal-600 dark:text-teal-400 font-bold whitespace-pre-wrap break-words">{pat.Medicine || "-"}</td>  
                          <td className="p-3.5 text-indigo-600 dark:text-indigo-400 font-bold whitespace-pre-wrap break-words">{pat.Syrup || "-"}</td>  
                          <td className="p-3.5 text-slate-500 dark:text-slate-400 whitespace-pre-wrap break-words">{pat.Additional || "-"}</td>  
                          <td className="p-3.5 font-black text-rose-500 whitespace-nowrap">{pat.Amount || "0"}</td>  
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ANALYTICS TAB VIEW */}
          {activeTab === 'analytics' && (
            <div className={`flex-1 border rounded-3xl p-4 sm:p-6 flex flex-col gap-6 overflow-y-auto shadow-lg ${  
              darkMode ? 'bg-[#181e22]/90 border-slate-800' : 'bg-white/80 border-rose-100/60 shadow-rose-500/5 backdrop-blur-md'  
            }`}>
              <div className="flex items-center justify-between pb-3.5 border-b border-rose-100/60">
                <div className="flex items-center gap-3.5">
                  <BarChart3 size={24} className="text-rose-500" />  
                  <h3 className="font-black text-base sm:text-lg">Clinic Analytics & Performance Graphs</h3>  
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
                  Total Records: {totalPatientsCount}  
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`p-5 rounded-2xl border flex flex-col gap-2.5 ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-rose-50/30 border-rose-100'}`}>
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs sm:text-sm font-extrabold">Total Patients</span>
                    <Users size={20} className="text-teal-500" />  
                  </div>
                  <span className="text-3xl font-black text-teal-600 dark:text-teal-400">{totalPatientsCount}</span>  
                  <span className="text-xs font-semibold text-slate-400">Synced from Database</span>
                </div>

                <div className={`p-5 rounded-2xl border flex flex-col gap-2.5 ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-rose-50/30 border-rose-100'}`}>
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs sm:text-sm font-extrabold">Total Revenue</span>
                    <DollarSign size={20} className="text-rose-500" />  
                  </div>
                  <span className="text-3xl font-black text-rose-500">Rs. {totalRevenue.toLocaleString()}</span>  
                  <span className="text-xs font-semibold text-slate-400">Overall collection amount</span>
                </div>

                <div className={`p-5 rounded-2xl border flex flex-col gap-2.5 ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-rose-50/30 border-rose-100'}`}>
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs sm:text-sm font-extrabold">Today's Entries</span>
                    <Activity size={20} className="text-emerald-500" />  
                  </div>
                  <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{todayPatientsCount}</span>  
                    <span className="text-xs font-semibold text-slate-400">Added on current date</span>
                </div>

                <div className={`p-5 rounded-2xl border flex flex-col gap-2.5 ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-rose-50/30 border-rose-100'}`}>
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs sm:text-sm font-extrabold">Avg. Per Patient</span>
                    <TrendingUp size={20} className="text-indigo-500" />  
                  </div>
                  <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">Rs. {avgRevenuePerPatient.toLocaleString()}</span>  
                  <span className="text-xs font-semibold text-slate-400">Average ticket size</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                
                <div className={`p-5 rounded-3xl border flex flex-col gap-4 ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-rose-50/20 border-rose-100'}`}>
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-sm sm:text-base flex items-center gap-2">
                      <BarChart3 size={18} className="text-rose-500" /> Revenue & Patient Overview  
                    </h4>
                    <span className="text-xs font-bold text-slate-400">Metric Representation</span>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span>Database Records Volume</span>
                        <span className="text-teal-500">{totalPatientsCount} Total</span>  
                      </div>
                      <div className={`w-full h-3 rounded-full overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-rose-100'}`}>
                        <div 
                          className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500" 
                          style={{ width: `${Math.min(totalPatientsCount, 100)}%` }}  
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span>Today's Workload Ratio</span>
                        <span className="text-rose-500">{totalPatientsCount > 0 ? Math.round((todayPatientsCount / totalPatientsCount) * 100) : 0}%</span>  
                      </div>
                      <div className={`w-full h-3 rounded-full overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-rose-100'}`}>
                        <div 
                          className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full transition-all duration-500" 
                          style={{ width: `${totalPatientsCount > 0 ? Math.min(Math.round((todayPatientsCount / totalPatientsCount) * 100), 100) : 0}%` }}  
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 text-xs font-semibold text-slate-400 leading-relaxed">
                    * Metrics are automatically calculated from all {totalPatientsCount} entries stored in your Supabase database table.  
                  </div>
                </div>

                <div className={`p-5 rounded-3xl border flex flex-col justify-between ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-rose-50/20 border-rose-100'}`}>
                  <div className="space-y-3">
                    <h4 className="font-black text-sm sm:text-base flex items-center gap-2">
                      <ShieldCheck size={18} className="text-indigo-500" /> Database & System Health  
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-semibold leading-relaxed">
                      Supabase connection is fully active. All historical patient records are loaded without restriction, ensuring complete reporting for Hakim Amjad Maqsood's clinic.  
                    </p>
                  </div>

                  <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${darkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-white/80 border-rose-100'}`}>
                    <span className="text-xs font-bold">Real-time Data Sync</span>
                    <span className="text-xs font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">Operational</span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* SETTINGS TAB VIEW */}
          {activeTab === 'settings' && (
            <div className={`flex-1 border rounded-3xl p-4 sm:p-6 flex flex-col gap-6 overflow-y-auto shadow-lg ${  
              darkMode ? 'bg-[#181e22]/90 border-slate-800' : 'bg-white/80 border-rose-100/60 shadow-rose-500/5 backdrop-blur-md'  
            }`}>
              <div className="flex items-center gap-3.5 pb-3.5 border-b border-rose-100/60">
                <SettingsIcon size={24} className="text-rose-500" />  
                <h3 className="font-black text-base sm:text-lg">Application Settings</h3>  
              </div>

              <div className="space-y-4 max-w-xl">
                <div className={`p-5 rounded-2xl border flex items-center justify-between ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-rose-50/30 border-rose-100'}`}>
                  <div>
                    <h4 className="font-black text-sm sm:text-base">Appearance Mode</h4>
                    <p className="text-xs text-slate-400 font-semibold">Switch between dark and light themes</p>
                  </div>
                  <button 
                    onClick={() => setDarkMode(!darkMode)}  
                    className="px-4 py-2 rounded-xl font-bold text-xs sm:text-sm bg-rose-500 text-white shadow-md shadow-rose-500/20"
                  >
                    {darkMode ? 'Dark Enabled' : 'Light Enabled'}
                  </button>
                </div>

                <div className={`p-5 rounded-2xl border flex items-center justify-between ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-rose-50/30 border-rose-100'}`}>
                  <div>
                    <h4 className="font-black text-sm sm:text-base">Database Connection</h4>
                    <p className="text-xs text-slate-400 font-semibold">Supabase tables & schemas</p>
                  </div>
                  <span className="text-xs font-black text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">Connected</span>
                </div>

                <div className={`p-5 rounded-2xl border flex flex-col gap-2.5 ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-rose-50/30 border-rose-100'}`}>
                  <h4 className="font-black text-sm sm:text-base">Clinic Information</h4>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bold">M Mehmood Unani Dawakhana — Gulshan-e-Iqbal, Karachi</p>  
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bold">Hakeem Amjad Maqsood (+92 300 7071814)</p>  
                </div>
              </div>
            </div>
          )}

        </main>

      </div>
    </div>
  );
}
