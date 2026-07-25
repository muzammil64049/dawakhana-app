"use client";
import React, { useState, useEffect } from 'react';
import { Mail, Lock, MapPin, Phone, Sparkles, Activity, Leaf, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DawakhanaApp() {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    if (localStorage.getItem('isLoggedIn') === 'true') {
      router.push('/');
    }
  }, [router]);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setTimeout(() => {
      setAuthLoading(false);
      localStorage.setItem('isLoggedIn', 'true');
      router.push('/');
    }, 1000);
  };

  return (
    <div suppressHydrationWarning style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #ffedd5 0%, #bae6fd 35%, #fce7f3 70%, #dcfce7 100%)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Poppins', 'Segoe UI', Roboto, sans-serif",
      padding: '24px 16px',
      position: 'relative',
      overflowX: 'hidden',
      overflowY: 'auto',
      justifyContent: 'center',
      alignItems: 'center',
      boxSizing: 'border-box'
    }}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        body, html { margin: 0; padding: 0; width: 100%; min-height: 100%; }

        @keyframes floatSlow {
          0% { transform: translateY(0px) scale(1) rotate(0deg); }
          50% { transform: translateY(-12px) scale(1.02) rotate(2deg); }
          100% { transform: translateY(0px) scale(1) rotate(0deg); }
        }
        @keyframes multiFloat1 {
          0% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0.8; }
          50% { transform: translateY(-35px) translateX(25px) rotate(15deg); opacity: 1; }
          100% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0.8; }
        }
        @keyframes multiFloat2 {
          0% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0.8; }
          50% { transform: translateY(35px) translateX(-25px) rotate(-15deg); opacity: 1; }
          100% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0.8; }
        }
        @keyframes textShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes marqueeLeft {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        @keyframes singleUpDownBlink {
          0% { transform: translateY(-25px); opacity: 0.3; }
          50% { transform: translateY(25px); opacity: 1; }
          100% { transform: translateY(-25px); opacity: 0.3; }
        }
        .animated-title {
          background: linear-gradient(90deg, #059669 0%, #0284c7 35%, #db2777 70%, #059669 100%);
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: textShimmer 4s linear infinite;
        }
        .hover-scale:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 35px rgba(2, 132, 199, 0.3) !important;
        }
        .input-glow:focus-within {
          border-color: #0284c7 !important;
          box-shadow: 0 0 0 4px rgba(2, 132, 199, 0.15);
          background: #ffffff !important;
        }
        .info-box-hover:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(2, 132, 199, 0.2) !important;
          border-color: rgba(2, 132, 199, 0.4) !important;
        }

        @media (max-width: 900px) {
          .side-decoration { display: none !important; }
        }
      `}} />

      {/* Top Header Marquee */}
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '68px',
        background: 'rgba(255, 255, 255, 0.95)', borderBottom: '3px solid rgba(2, 132, 199, 0.3)',
        overflow: 'hidden', display: 'flex', alignItems: 'center', zIndex: 100, backdropFilter: 'blur(12px)',
        boxShadow: '0 6px 20px rgba(0,0,0,0.08)'
      }}>
        <div style={{ display: 'flex', width: '200%', animation: 'marqueeLeft 26s linear infinite', whiteSpace: 'nowrap', alignItems: 'center' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '25px', paddingRight: '70px' }}>
              <img src="/pngwing.png" alt="icon" style={{ width: '38px', height: '38px', objectFit: 'contain' }} />
              <span style={{ color: '#dc2626', fontSize: '20px', fontWeight: '800', letterSpacing: '1px' }}>
                ✨ ہوالشافی ✨ &nbsp;&nbsp; ایم محمود یونانی دواخانہ &nbsp;&nbsp; — &nbsp;&nbsp; حکیم امجد مقصود
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Footer Marquee */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, width: '100%', height: '68px',
        background: 'rgba(255, 255, 255, 0.95)', borderTop: '3px solid rgba(219, 39, 119, 0.3)',
        overflow: 'hidden', display: 'flex', alignItems: 'center', zIndex: 100, backdropFilter: 'blur(12px)',
        boxShadow: '0 -6px 20px rgba(0,0,0,0.08)'
      }}>
        <div style={{ display: 'flex', width: '200%', animation: 'marqueeRight 26s linear infinite', whiteSpace: 'nowrap', alignItems: 'center' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '25px', paddingRight: '70px' }}>
              <img src="/pngwing.png" alt="icon" style={{ width: '38px', height: '38px', objectFit: 'contain' }} />
              <span style={{ color: '#be185d', fontSize: '20px', fontWeight: '800', letterSpacing: '1px' }}>
                🌿 ایم محمود یونانی دواخانہ &nbsp;&nbsp; — &nbsp;&nbsp; گلشن اقبال، کراچی &nbsp;&nbsp; ✨ ہوالشافی ✨
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Left Side Large Blinking Text */}
      <div className="side-decoration" style={{
        position: 'fixed', left: '15px', top: '50%', transform: 'translateY(-50%)', width: '180px',
        height: '400px', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, pointerEvents: 'none'
      }}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
          animation: 'singleUpDownBlink 3.5s ease-in-out infinite', lineHeight: '1.6'
        }}>
          <span style={{ color: '#dc2626', fontSize: '26px', fontWeight: '800', textShadow: '0 0 14px rgba(220,38,38,0.4)', marginBottom: '12px' }}>ہو الشافی</span>
          <span style={{ color: '#059669', fontSize: '22px', fontWeight: '800', textShadow: '0 0 14px rgba(5,150,105,0.4)' }}>ایم محمود</span>
          <span style={{ color: '#059669', fontSize: '22px', fontWeight: '800', textShadow: '0 0 14px rgba(5,150,105,0.4)' }}>یونانی</span>
          <span style={{ color: '#059669', fontSize: '22px', fontWeight: '800', textShadow: '0 0 14px rgba(5,150,105,0.4)' }}>دواخانہ</span>
        </div>
      </div>

      {/* Right Side Large Blinking Text */}
      <div className="side-decoration" style={{
        position: 'fixed', right: '15px', top: '50%', transform: 'translateY(-50%)', width: '180px',
        height: '400px', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, pointerEvents: 'none'
      }}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
          animation: 'singleUpDownBlink 3.5s ease-in-out infinite', lineHeight: '1.6'
        }}>
          <span style={{ color: '#dc2626', fontSize: '26px', fontWeight: '800', textShadow: '0 0 14px rgba(220,38,38,0.4)', marginBottom: '12px' }}>ہو الشافی</span>
          <span style={{ color: '#be185d', fontSize: '22px', fontWeight: '800', textShadow: '0 0 14px rgba(190,24,93,0.4)' }}>ایم محمود</span>
          <span style={{ color: '#be185d', fontSize: '22px', fontWeight: '800', textShadow: '0 0 14px rgba(190,24,93,0.4)' }}>یونانی</span>
          <span style={{ color: '#be185d', fontSize: '22px', fontWeight: '800', textShadow: '0 0 14px rgba(190,24,93,0.4)' }}>دواخانہ</span>
        </div>
      </div>

      {/* Floating Background Icons */}
      {isMounted && [
        { icon: Leaf, top: '15%', left: '15%', color: '#059669', size: 38, anim: 'multiFloat1', dur: '5s' },
        { icon: Sparkles, top: '18%', left: '82%', color: '#db2777', size: 34, anim: 'multiFloat2', dur: '6s' },
        { icon: Activity, top: '75%', left: '80%', color: '#0284c7', size: 40, anim: 'multiFloat1', dur: '7s' },
        { icon: Leaf, top: '78%', left: '15%', color: '#d97706', size: 36, anim: 'multiFloat2', dur: '5.5s' }
      ].map((item, i) => {
        const IconComponent = item.icon;
        return (
          <div key={i} className="side-decoration" style={{
            position: 'fixed',
            top: item.top,
            left: item.left,
            animation: `${item.anim} ${item.dur} ease-in-out infinite`,
            zIndex: 0,
            pointerEvents: 'none',
            color: item.color,
            filter: `drop-shadow(0 0 12px ${item.color}55)`
          }}>
            <IconComponent size={item.size} />
          </div>
        );
      })}

      {/* Main Responsive Card Wrapper with Restored Height & Padding */}
      <div style={{
        width: '100%', maxWidth: '980px', 
        minHeight: '520px',
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(30px)', borderRadius: '32px', 
        padding: '3px',
        backgroundImage: 'linear-gradient(135deg, #fed7aa, #bae6fd, #fbcfe8, #a7f3d0)',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.12), 0 0 30px rgba(2, 132, 199, 0.15)',
        display: 'flex', flexDirection: 'row', flexWrap: 'wrap', overflow: 'hidden', 
        zIndex: 5, margin: '90px auto 90px auto', boxSizing: 'border-box'
      }}>
        
        {/* Inner Container */}
        <div style={{
          width: '100%', display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
          borderRadius: '30px', overflow: 'hidden', background: '#ffffff'
        }}>
          
          {/* Left Multi-Color Brand Panel */}
          <div style={{
            flex: '1 1 300px',
            background: 'linear-gradient(135deg, #ffedd5 0%, #e0f2fe 50%, #fae8ff 100%)',
            color: '#0f172a', padding: '45px 28px', display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden',
            minHeight: '400px', boxSizing: 'border-box', borderRight: '1px solid rgba(0, 0, 0, 0.05)'
          }}>
            {/* Glowing Logo Container */}
            <div style={{
              width: '160px', height: '160px', borderRadius: '50%', overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px',
              animation: 'floatSlow 4s ease-in-out infinite', zIndex: 1,
              boxShadow: '0 15px 35px rgba(2, 132, 199, 0.18), 0 0 25px rgba(255, 255, 255, 0.9)', 
              border: '3px solid #ffffff',
              background: '#ffffff', flexShrink: 0
            }}>
              <img src="/M mehmood unani dawakhhana.gif" alt="Dawakhana Logo" style={{ width: '170%', height: '170%', objectFit: 'cover' }} />
            </div>

            {/* Animated Title */}
            <h2 className="animated-title" style={{ 
              fontSize: '24px', fontWeight: '800', textAlign: 'center', 
              marginBottom: '16px', zIndex: 1, lineHeight: '1.3'
            }}>
              M Mehmood Unani<br />Dawakhana
            </h2>

            {/* Info Box */}
            <div className="info-box-hover" style={{
              zIndex: 1, display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', 
              color: '#334155', textAlign: 'center', 
              background: 'rgba(255, 255, 255, 0.8)',
              padding: '14px 18px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.9)',
              marginTop: '6px', width: '100%', maxWidth: '280px', boxSizing: 'border-box',
              backdropFilter: 'blur(12px)', transition: 'all 0.3s ease',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.04)'
            }}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#0284c7', fontWeight: '600'}}><MapPin size={14} /> Gulshan-e-Iqbal, Karachi</div>
              <div style={{fontSize: '13px', fontWeight: '800', color: '#059669', marginTop: '2px'}}>Hakim Amjad Maqsood</div>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#db2777', fontWeight: '600'}}><Phone size={14} /> +92 300 7071814</div>
            </div>
          </div>

          {/* Right Form Panel */}
          <div style={{
            flex: '1 1 300px', 
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', 
            padding: '45px 36px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 2, boxSizing: 'border-box',
            minHeight: '400px'
          }}>
            <div style={{display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: '#0284c7', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px'}}>
              <ShieldCheck size={16} /> Secure Portal Access
            </div>
            
            <h3 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', marginBottom: '6px', letterSpacing: '-0.5px' }}>
              Welcome Back
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '26px', fontWeight: '500' }}>
              Please log in to manage your clinic records.
            </p>

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px', letterSpacing: '0.5px' }}>Email Address</label>
                <div className="input-glow" style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%', borderRadius: '14px', border: '1px solid #cbd5e1', background: '#f8fafc', transition: 'all 0.3s ease' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '14px', color: '#0284c7', zIndex: 1 }} />
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@dawakhana.com"
                    required
                    style={{
                      width: '100%', padding: '14px 14px 14px 44px', borderRadius: '14px',
                      border: 'none', background: 'transparent', outline: 'none',
                      fontSize: '13px', color: '#0f172a', fontWeight: '500', boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '26px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px', letterSpacing: '0.5px' }}>Password</label>
                <div className="input-glow" style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%', borderRadius: '14px', border: '1px solid #cbd5e1', background: '#f8fafc', transition: 'all 0.3s ease' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '14px', color: '#0284c7', zIndex: 1 }} />
                  <input 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    style={{
                      width: '100%', padding: '14px 14px 14px 44px', borderRadius: '14px',
                      border: 'none', background: 'transparent', outline: 'none',
                      fontSize: '13px', color: '#0f172a', fontWeight: '500', boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={authLoading}
                className="hover-scale"
                style={{
                  width: '100%', padding: '15px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #059669 50%, #db2777 100%)',
                  color: '#ffffff', border: 'none', borderRadius: '14px', fontWeight: '700',
                  fontSize: '14px', cursor: 'pointer', boxShadow: '0 10px 25px rgba(2, 132, 199, 0.3)',
                  transition: 'all 0.3s ease', boxSizing: 'border-box', letterSpacing: '0.5px'
                }}
              >
                {authLoading ? 'Verifying...' : 'Sign In to Dashboard'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}