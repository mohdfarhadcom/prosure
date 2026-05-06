'use client'

function BathroomCleaning() {
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bc-bg" x1="0" y1="0" x2=".5" y2="1"><stop offset="0%" stopColor="#1A3A5C"/><stop offset="100%" stopColor="#071425"/></linearGradient>
        <linearGradient id="bc-cera" x1="0" y1="0" x2=".4" y2="1"><stop offset="0%" stopColor="#F0F9FF"/><stop offset="60%" stopColor="#BAE6FD"/><stop offset="100%" stopColor="#7DD3FC"/></linearGradient>
        <linearGradient id="bc-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FDE68A"/><stop offset="50%" stopColor="#F59E0B"/><stop offset="100%" stopColor="#92400E"/></linearGradient>
        <linearGradient id="bc-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1E3A8A"/><stop offset="100%" stopColor="#0F1E4A"/></linearGradient>
        <radialGradient id="bc-bub" cx="30%" cy="30%" r="70%"><stop offset="0%" stopColor="white" stopOpacity=".5"/><stop offset="100%" stopColor="#93C5FD" stopOpacity=".1"/></radialGradient>
      </defs>
      <rect width="200" height="200" fill="url(#bc-bg)"/>
      <rect x="0" y="152" width="200" height="48" fill="url(#bc-floor)"/>
      <line x1="0" y1="152" x2="200" y2="152" stroke="#3B82F6" strokeWidth="1.5" strokeOpacity=".7"/>
      <line x1="50" y1="152" x2="50" y2="200" stroke="#1D4ED8" strokeWidth=".8" strokeOpacity=".4"/>
      <line x1="100" y1="152" x2="100" y2="200" stroke="#1D4ED8" strokeWidth=".8" strokeOpacity=".4"/>
      <line x1="150" y1="152" x2="150" y2="200" stroke="#1D4ED8" strokeWidth=".8" strokeOpacity=".4"/>
      <line x1="0" y1="176" x2="200" y2="176" stroke="#1D4ED8" strokeWidth=".8" strokeOpacity=".4"/>
      <ellipse cx="100" cy="158" rx="50" ry="6" fill="#000" fillOpacity=".5"/>
      <rect x="58" y="66" width="84" height="54" rx="12" fill="url(#bc-cera)"/>
      <rect x="58" y="66" width="84" height="6" rx="3" fill="white" fillOpacity=".45"/>
      <rect x="62" y="72" width="5" height="30" rx="2.5" fill="white" fillOpacity=".35"/>
      <ellipse cx="100" cy="80" rx="14" ry="5" fill="#60A5FA"/>
      <ellipse cx="96" cy="79" rx="6" ry="2.5" fill="white" fillOpacity=".6"/>
      <ellipse cx="100" cy="120" rx="52" ry="16" fill="#60A5FA"/>
      <ellipse cx="100" cy="118" rx="52" ry="16" fill="url(#bc-cera)"/>
      <ellipse cx="82" cy="114" rx="14" ry="5" fill="white" fillOpacity=".35"/>
      <path d="M50 120 Q46 158 100 164 Q154 158 150 120 Z" fill="url(#bc-cera)"/>
      <ellipse cx="100" cy="150" rx="28" ry="9" fill="#BFDBFE" fillOpacity=".45"/>
      <rect x="152" y="86" width="10" height="66" rx="5" fill="url(#bc-gold)"/>
      <rect x="152" y="86" width="5" height="66" rx="2.5" fill="white" fillOpacity=".2"/>
      <ellipse cx="157" cy="88" rx="16" ry="12" fill="#F59E0B"/>
      <ellipse cx="152" cy="83" rx="8" ry="7" fill="#FDE68A"/>
      <circle cx="34" cy="88" r="13" fill="url(#bc-bub)" stroke="#60A5FA" strokeWidth="1.5" strokeOpacity=".7"/>
      <circle cx="32" cy="83" r="4" fill="white" fillOpacity=".3"/>
      <circle cx="50" cy="70" r="9" fill="url(#bc-bub)" stroke="#93C5FD" strokeWidth="1.5" strokeOpacity=".6"/>
      <circle cx="22" cy="74" r="6" fill="url(#bc-bub)" stroke="#60A5FA" strokeWidth="1" strokeOpacity=".5"/>
      <circle cx="170" cy="78" r="10" fill="url(#bc-bub)" stroke="#93C5FD" strokeWidth="1.5" strokeOpacity=".5"/>
    </svg>
  )
}

function FridgeCleaning() {
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fc-bg" x1="0" y1="0" x2=".5" y2="1"><stop offset="0%" stopColor="#064E3B"/><stop offset="100%" stopColor="#012418"/></linearGradient>
        <linearGradient id="fc-m" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#F8FAFC"/><stop offset="40%" stopColor="#E2E8F0"/><stop offset="100%" stopColor="#94A3B8"/></linearGradient>
        <linearGradient id="fc-s" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#94A3B8"/><stop offset="100%" stopColor="#64748B"/></linearGradient>
        <linearGradient id="fc-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#ECFDF5" stopOpacity=".9"/><stop offset="100%" stopColor="#6EE7B7" stopOpacity=".4"/></linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#fc-bg)"/>
      <rect x="148" y="22" width="20" height="162" fill="url(#fc-s)"/>
      <rect x="32" y="22" width="116" height="162" rx="12" fill="url(#fc-m)"/>
      <line x1="34" y1="92" x2="146" y2="92" stroke="#CBD5E1" strokeWidth="2"/>
      <rect x="42" y="30" width="96" height="55" rx="6" fill="url(#fc-g)"/>
      <rect x="42" y="30" width="36" height="55" rx="6" fill="white" fillOpacity=".3"/>
      <rect x="46" y="34" width="5" height="22" rx="2.5" fill="white" fillOpacity=".5"/>
      <rect x="52" y="38" width="28" height="8" rx="3" fill="#BAE6FD"/>
      <rect x="52" y="50" width="18" height="8" rx="3" fill="#7DD3FC"/>
      <rect x="74" y="50" width="14" height="8" rx="3" fill="#FDE68A"/>
      <rect x="52" y="63" width="22" height="8" rx="3" fill="#A7F3D0"/>
      <rect x="42" y="100" width="96" height="77" rx="6" fill="url(#fc-g)"/>
      <rect x="42" y="100" width="36" height="77" rx="6" fill="white" fillOpacity=".25"/>
      <rect x="46" y="104" width="5" height="30" rx="2.5" fill="white" fillOpacity=".5"/>
      <line x1="44" y1="128" x2="136" y2="128" stroke="#A7F3D0" strokeWidth="1.5" strokeOpacity=".7"/>
      <line x1="44" y1="152" x2="136" y2="152" stroke="#A7F3D0" strokeWidth="1.5" strokeOpacity=".7"/>
      <rect x="52" y="106" width="18" height="20" rx="4" fill="#FCA5A5"/>
      <ellipse cx="88" cy="116" rx="12" ry="12" fill="#86EFAC"/>
      <rect x="104" y="107" width="14" height="18" rx="3" fill="#FDE68A"/>
      <rect x="52" y="132" width="24" height="16" rx="4" fill="#93C5FD"/>
      <rect x="80" y="133" width="16" height="15" rx="3" fill="#C4B5FD"/>
      <rect x="52" y="156" width="30" height="16" rx="4" fill="#FCA5A5"/>
      <rect x="134" y="100" width="8" height="42" rx="4" fill="#34D399"/>
      <rect x="134" y="98" width="8" height="8" rx="4" fill="#6EE7B7"/>
      <ellipse cx="36" cy="105" rx="3" ry="14" fill="white" fillOpacity=".15"/>
    </svg>
  )
}

function PackingUnpacking() {
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pu-bg" x1="0" y1="0" x2=".5" y2="1"><stop offset="0%" stopColor="#7C2D12"/><stop offset="100%" stopColor="#1A0500"/></linearGradient>
        <linearGradient id="pu-f" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FEF9C3"/><stop offset="100%" stopColor="#FDE68A"/></linearGradient>
        <linearGradient id="pu-s" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#FDE68A"/><stop offset="100%" stopColor="#D97706"/></linearGradient>
        <linearGradient id="pu-t" x1="0" y1="0" x2=".3" y2="1"><stop offset="0%" stopColor="#FEF9C3"/><stop offset="100%" stopColor="#FEF3C7"/></linearGradient>
        <linearGradient id="pu-tape" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#A78BFA"/><stop offset="100%" stopColor="#6D28D9"/></linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#pu-bg)"/>
      <rect x="0" y="168" width="200" height="32" fill="#1A0800" fillOpacity=".8"/>
      <line x1="0" y1="168" x2="200" y2="168" stroke="#92400E" strokeWidth="1" strokeOpacity=".6"/>
      <ellipse cx="90" cy="173" rx="70" ry="6" fill="#000" fillOpacity=".5"/>
      <rect x="130" y="100" width="32" height="72" fill="url(#pu-s)"/>
      <rect x="32" y="100" width="98" height="72" rx="4" fill="url(#pu-f)"/>
      <path d="M32 100 L62 76 L162 76 L130 100 Z" fill="url(#pu-t)"/>
      <path d="M32 100 L62 76 L62 56 L32 82 Z" fill="#FEF9C3"/>
      <path d="M130 100 L162 76 L162 56 L130 82 Z" fill="#FDE68A"/>
      <rect x="32" y="130" width="98" height="9" fill="url(#pu-tape)" fillOpacity=".8"/>
      <rect x="130" y="130" width="32" height="9" fill="#5B21B6" fillOpacity=".7"/>
      <rect x="36" y="104" width="4" height="40" rx="2" fill="white" fillOpacity=".3"/>
      <rect x="36" y="104" width="60" height="4" rx="2" fill="white" fillOpacity=".2"/>
      <rect x="72" y="154" width="24" height="7" rx="3.5" fill="#D97706"/>
      <rect x="142" y="130" width="14" height="42" fill="url(#pu-s)"/>
      <rect x="130" y="130" width="12" height="42" fill="url(#pu-f)"/>
      <rect x="130" y="120" width="26" height="12" fill="url(#pu-t)"/>
      <circle cx="28" cy="88" r="16" fill="none" stroke="#A78BFA" strokeWidth="8"/>
      <circle cx="28" cy="88" r="7" fill="#4C1D95"/>
    </svg>
  )
}

function UtensilsCleaning() {
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="uc-bg" x1="0" y1="0" x2=".5" y2="1"><stop offset="0%" stopColor="#1E1B4B"/><stop offset="100%" stopColor="#07061A"/></linearGradient>
        <linearGradient id="uc-sv" x1="0" y1="0" x2=".3" y2="1"><stop offset="0%" stopColor="#F8FAFC"/><stop offset="50%" stopColor="#CBD5E1"/><stop offset="100%" stopColor="#64748B"/></linearGradient>
        <linearGradient id="uc-pl" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F8FAFC"/><stop offset="100%" stopColor="#E2E8F0"/></linearGradient>
        <linearGradient id="uc-wt" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#312E81"/><stop offset="100%" stopColor="#1E1B4B"/></linearGradient>
        <radialGradient id="uc-bub" cx="30%" cy="25%" r="65%"><stop offset="0%" stopColor="white" stopOpacity=".6"/><stop offset="100%" stopColor="#818CF8" stopOpacity="0"/></radialGradient>
      </defs>
      <rect width="200" height="200" fill="url(#uc-bg)"/>
      <rect x="22" y="108" width="156" height="72" rx="12" fill="url(#uc-wt)"/>
      <ellipse cx="100" cy="116" rx="68" ry="9" fill="#4338CA" fillOpacity=".4"/>
      <path d="M34 116 Q70 110 100 116 Q130 122 166 116" stroke="#6366F1" strokeWidth="1.5" fill="none" strokeOpacity=".6"/>
      <rect x="90" y="68" width="20" height="44" rx="10" fill="url(#uc-sv)"/>
      <rect x="68" y="80" width="64" height="10" rx="5" fill="url(#uc-sv)"/>
      <rect x="68" y="78" width="64" height="5" rx="2.5" fill="white" fillOpacity=".4"/>
      <ellipse cx="90" cy="112" rx="48" ry="6" fill="#000" fillOpacity=".4"/>
      <ellipse cx="90" cy="108" rx="46" ry="10" fill="url(#uc-pl)" stroke="#CBD5E1" strokeWidth="1"/>
      <ellipse cx="90" cy="100" rx="46" ry="10" fill="url(#uc-pl)" stroke="#CBD5E1" strokeWidth="1"/>
      <ellipse cx="90" cy="92" rx="46" ry="10" fill="url(#uc-pl)" stroke="#CBD5E1" strokeWidth="1"/>
      <ellipse cx="90" cy="84" rx="46" ry="10" fill="url(#uc-pl)" stroke="#CBD5E1" strokeWidth="1"/>
      <ellipse cx="78" cy="80" rx="14" ry="4" fill="white" fillOpacity=".4"/>
      <rect x="148" y="46" width="7" height="65" rx="3.5" fill="url(#uc-sv)"/>
      <rect x="144" y="46" width="3" height="22" rx="1.5" fill="url(#uc-sv)"/>
      <rect x="153" y="46" width="3" height="22" rx="1.5" fill="url(#uc-sv)"/>
      <rect x="157" y="46" width="3" height="22" rx="1.5" fill="url(#uc-sv)"/>
      <rect x="164" y="65" width="7" height="50" rx="3.5" fill="url(#uc-sv)"/>
      <ellipse cx="167" cy="55" rx="10" ry="14" fill="url(#uc-sv)" stroke="#94A3B8" strokeWidth="1"/>
      <ellipse cx="165" cy="51" rx="5" ry="7" fill="white" fillOpacity=".4"/>
      <circle cx="44" cy="125" r="14" fill="url(#uc-bub)" stroke="#818CF8" strokeWidth="1.5" strokeOpacity=".7"/>
      <circle cx="41" cy="120" r="4" fill="white" fillOpacity=".3"/>
      <circle cx="64" cy="138" r="10" fill="url(#uc-bub)" stroke="#6366F1" strokeWidth="1.5" strokeOpacity=".6"/>
      <circle cx="128" cy="122" r="12" fill="url(#uc-bub)" stroke="#818CF8" strokeWidth="1.5" strokeOpacity=".6"/>
      <circle cx="144" cy="136" r="8" fill="url(#uc-bub)" stroke="#6366F1" strokeWidth="1" strokeOpacity=".5"/>
    </svg>
  )
}

function KitchenPrep() {
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="kp-bg" x1="0" y1="0" x2=".5" y2="1"><stop offset="0%" stopColor="#14532D"/><stop offset="100%" stopColor="#052010"/></linearGradient>
        <linearGradient id="kp-bd" x1="0" y1="0" x2=".3" y2="1"><stop offset="0%" stopColor="#FEF9C3"/><stop offset="60%" stopColor="#FDE68A"/><stop offset="100%" stopColor="#D97706"/></linearGradient>
        <linearGradient id="kp-bs" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#D97706"/><stop offset="100%" stopColor="#92400E"/></linearGradient>
        <linearGradient id="kp-ca" x1="0" y1="0" x2=".3" y2="1"><stop offset="0%" stopColor="#FED7AA"/><stop offset="50%" stopColor="#FB923C"/><stop offset="100%" stopColor="#C2410C"/></linearGradient>
        <radialGradient id="kp-to" cx="35%" cy="30%" r="65%"><stop offset="0%" stopColor="#FCA5A5"/><stop offset="50%" stopColor="#EF4444"/><stop offset="100%" stopColor="#991B1B"/></radialGradient>
        <linearGradient id="kp-kn" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#F1F5F9"/><stop offset="100%" stopColor="#64748B"/></linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#kp-bg)"/>
      <rect x="0" y="155" width="200" height="45" fill="#1A3A1A"/>
      <rect x="0" y="153" width="200" height="5" fill="#166534"/>
      <ellipse cx="95" cy="160" rx="72" ry="7" fill="#000" fillOpacity=".5"/>
      <rect x="28" y="142" width="144" height="18" rx="4" fill="url(#kp-bs)"/>
      <rect x="24" y="78" width="144" height="68" rx="8" fill="url(#kp-bd)"/>
      <rect x="28" y="82" width="5" height="48" rx="2.5" fill="white" fillOpacity=".3"/>
      <rect x="28" y="82" width="100" height="4" rx="2" fill="white" fillOpacity=".2"/>
      <rect x="162" y="98" width="26" height="14" rx="7" fill="url(#kp-bs)"/>
      <path d="M62 130 Q58 100 68 86 Q78 100 74 130 Z" fill="url(#kp-ca)"/>
      <path d="M65 86 Q60 74 55 66" stroke="#4ADE80" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M65 86 Q62 72 64 62" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M66 86 Q72 74 78 68" stroke="#4ADE80" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <circle cx="118" cy="116" r="24" fill="url(#kp-to)"/>
      <circle cx="108" cy="104" r="8" fill="#FCA5A5" fillOpacity=".3"/>
      <path d="M114 94 Q118 86 122 92" stroke="#4ADE80" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M118 94 Q114 87 108 90" stroke="#16A34A" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M24 74 L154 68 L154 78 L24 80 Z" fill="url(#kp-kn)"/>
      <rect x="154" y="66" width="28" height="14" rx="5" fill="#92400E"/>
      <rect x="28" y="70" width="4" height="8" rx="2" fill="white" fillOpacity=".5"/>
    </svg>
  )
}

function DustingWiping() {
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="dw-bg" x1="0" y1="0" x2=".5" y2="1"><stop offset="0%" stopColor="#3B0764"/><stop offset="100%" stopColor="#0F0320"/></linearGradient>
        <linearGradient id="dw-bt" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#22D3EE"/><stop offset="50%" stopColor="#0891B2"/><stop offset="100%" stopColor="#0E4A6E"/></linearGradient>
        <linearGradient id="dw-cp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#A5F3FC"/><stop offset="100%" stopColor="#0891B2"/></linearGradient>
        <linearGradient id="dw-gd" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FDE68A"/><stop offset="50%" stopColor="#F59E0B"/><stop offset="100%" stopColor="#92400E"/></linearGradient>
        <radialGradient id="dw-ms" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#A5F3FC" stopOpacity=".5"/><stop offset="100%" stopColor="#22D3EE" stopOpacity="0"/></radialGradient>
      </defs>
      <rect width="200" height="200" fill="url(#dw-bg)"/>
      <rect x="0" y="80" width="200" height="10" rx="4" fill="#4C1D95"/>
      <rect x="0" y="78" width="200" height="5" rx="2.5" fill="#6D28D9" fillOpacity=".7"/>
      <rect x="14" y="36" width="16" height="44" rx="3" fill="#7C3AED"/>
      <rect x="14" y="34" width="16" height="5" rx="2" fill="#A78BFA"/>
      <rect x="32" y="42" width="13" height="38" rx="3" fill="#C4B5FD"/>
      <rect x="47" y="30" width="18" height="50" rx="3" fill="#5B21B6"/>
      <rect x="47" y="28" width="18" height="5" rx="2" fill="#7C3AED"/>
      <ellipse cx="114" cy="178" rx="28" ry="5" fill="#000" fillOpacity=".5"/>
      <rect x="88" y="96" width="46" height="80" rx="10" fill="url(#dw-bt)"/>
      <rect x="88" y="96" width="20" height="80" rx="10" fill="white" fillOpacity=".2"/>
      <rect x="92" y="100" width="5" height="40" rx="2.5" fill="white" fillOpacity=".35"/>
      <rect x="90" y="148" width="42" height="26" rx="8" fill="#0E7490" fillOpacity=".6"/>
      <rect x="96" y="80" width="30" height="20" rx="6" fill="url(#dw-cp)"/>
      <rect x="96" y="78" width="30" height="6" rx="3" fill="#A5F3FC" fillOpacity=".6"/>
      <rect x="122" y="85" width="28" height="9" rx="4.5" fill="#0E7490"/>
      <rect x="122" y="83" width="28" height="5" rx="2.5" fill="#22D3EE" fillOpacity=".5"/>
      <circle cx="158" cy="78" r="12" fill="url(#dw-ms)"/>
      <circle cx="168" cy="68" r="8" fill="url(#dw-ms)"/>
      <circle cx="162" cy="60" r="6" fill="url(#dw-ms)"/>
      <circle cx="174" cy="78" r="5" fill="url(#dw-ms)"/>
      <ellipse cx="44" cy="182" rx="22" ry="4" fill="#000" fillOpacity=".4"/>
      <rect x="40" y="110" width="10" height="72" rx="5" fill="url(#dw-gd)"/>
      <rect x="40" y="110" width="5" height="72" rx="2.5" fill="white" fillOpacity=".2"/>
      <ellipse cx="45" cy="105" rx="30" ry="16" fill="#F59E0B"/>
      <ellipse cx="22" cy="98" rx="18" ry="12" fill="#FDE68A"/>
      <ellipse cx="68" cy="98" rx="16" ry="12" fill="#FBBF24"/>
      <ellipse cx="45" cy="90" rx="22" ry="16" fill="#FDE68A" fillOpacity=".8"/>
    </svg>
  )
}

function SweepingMopping() {
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sm-bg" x1="0" y1="0" x2=".5" y2="1"><stop offset="0%" stopColor="#0C1445"/><stop offset="100%" stopColor="#030712"/></linearGradient>
        <linearGradient id="sm-bk" x1="0" y1="0" x2=".3" y2="1"><stop offset="0%" stopColor="#FDE68A"/><stop offset="50%" stopColor="#F59E0B"/><stop offset="100%" stopColor="#92400E"/></linearGradient>
        <linearGradient id="sm-fl" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1E3A8A" stopOpacity=".6"/><stop offset="100%" stopColor="#0F1E40"/></linearGradient>
        <linearGradient id="sm-mh" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#F0F9FF"/><stop offset="100%" stopColor="#93C5FD"/></linearGradient>
        <linearGradient id="sm-br" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#FDE68A"/><stop offset="100%" stopColor="#F59E0B"/></linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#sm-bg)"/>
      <rect x="0" y="158" width="200" height="42" fill="url(#sm-fl)"/>
      <line x1="0" y1="158" x2="200" y2="158" stroke="#3B82F6" strokeWidth="1.5" strokeOpacity=".6"/>
      <line x1="50" y1="158" x2="50" y2="200" stroke="#1D4ED8" strokeWidth=".8" strokeOpacity=".3"/>
      <line x1="100" y1="158" x2="100" y2="200" stroke="#1D4ED8" strokeWidth=".8" strokeOpacity=".3"/>
      <line x1="150" y1="158" x2="150" y2="200" stroke="#1D4ED8" strokeWidth=".8" strokeOpacity=".3"/>
      <line x1="0" y1="179" x2="200" y2="179" stroke="#1D4ED8" strokeWidth=".8" strokeOpacity=".3"/>
      <ellipse cx="44" cy="164" rx="30" ry="5" fill="#000" fillOpacity=".5"/>
      <path d="M58 130 L70 165 L82 165 L70 130 Z" fill="#B45309"/>
      <path d="M18 128 L28 165 L70 165 L60 128 Z" fill="url(#sm-bk)"/>
      <rect x="18" y="122" width="44" height="12" rx="5" fill="url(#sm-bk)"/>
      <rect x="18" y="120" width="44" height="6" rx="3" fill="#FDE68A" fillOpacity=".6"/>
      <rect x="22" y="128" width="5" height="30" rx="2.5" fill="white" fillOpacity=".25"/>
      <path d="M26 122 Q40 105 56 122" fill="none" stroke="#D97706" strokeWidth="3" strokeLinecap="round"/>
      <ellipse cx="44" cy="154" rx="22" ry="7" fill="#3B82F6" fillOpacity=".5"/>
      <rect x="106" y="16" width="10" height="128" rx="5" fill="#92400E"/>
      <rect x="106" y="16" width="5" height="128" rx="2.5" fill="white" fillOpacity=".15"/>
      <rect x="92" y="138" width="38" height="12" rx="4" fill="#1E40AF"/>
      <rect x="92" y="136" width="38" height="5" rx="2.5" fill="#3B82F6" fillOpacity=".5"/>
      <line x1="96" y1="150" x2="94" y2="174" stroke="url(#sm-mh)" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="103" y1="150" x2="101" y2="174" stroke="url(#sm-mh)" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="110" y1="150" x2="108" y2="174" stroke="url(#sm-mh)" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="117" y1="150" x2="115" y2="174" stroke="url(#sm-mh)" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="124" y1="150" x2="122" y2="174" stroke="url(#sm-mh)" strokeWidth="2.5" strokeLinecap="round"/>
      <rect x="150" y="22" width="10" height="112" rx="5" fill="#F59E0B" transform="rotate(12 155 78)"/>
      <rect x="142" y="140" width="48" height="12" rx="4" fill="url(#sm-br)"/>
      <rect x="142" y="138" width="48" height="6" rx="3" fill="#FDE68A" fillOpacity=".5"/>
      <line x1="146" y1="152" x2="144" y2="168" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="152" y1="152" x2="150" y2="168" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="158" y1="152" x2="156" y2="168" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="164" y1="152" x2="162" y2="168" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="170" y1="152" x2="168" y2="168" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="176" y1="152" x2="174" y2="168" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round"/>
      <ellipse cx="28" cy="130" rx="8" ry="3" fill="white" fillOpacity=".3"/>
    </svg>
  )
}

function CompleteWardrobe() {
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cw-bg" x1="0" y1="0" x2=".5" y2="1"><stop offset="0%" stopColor="#4A044E"/><stop offset="100%" stopColor="#120014"/></linearGradient>
        <linearGradient id="cw-wd" x1="0" y1="0" x2=".3" y2="1"><stop offset="0%" stopColor="#FEF3C7"/><stop offset="40%" stopColor="#D97706"/><stop offset="100%" stopColor="#78350F"/></linearGradient>
        <linearGradient id="cw-ws" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#78350F"/><stop offset="100%" stopColor="#451A03"/></linearGradient>
        <linearGradient id="cw-rd" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E2E8F0"/><stop offset="100%" stopColor="#64748B"/></linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#cw-bg)"/>
      <ellipse cx="100" cy="192" rx="80" ry="6" fill="#000" fillOpacity=".5"/>
      <rect x="168" y="18" width="18" height="172" fill="url(#cw-ws)"/>
      <path d="M14 18 L32 12 L186 12 L168 18 Z" fill="#FEF3C7" fillOpacity=".7"/>
      <rect x="14" y="18" width="154" height="172" rx="6" fill="url(#cw-wd)"/>
      <rect x="89" y="20" width="6" height="168" fill="#B45309"/>
      <rect x="16" y="52" width="71" height="5" rx="2" fill="#92400E" fillOpacity=".6"/>
      <rect x="97" y="52" width="69" height="5" rx="2" fill="#92400E" fillOpacity=".6"/>
      <rect x="20" y="60" width="67" height="5" rx="2.5" fill="url(#cw-rd)"/>
      <rect x="97" y="60" width="69" height="5" rx="2.5" fill="url(#cw-rd)"/>
      <rect x="22" y="24" width="32" height="10" rx="3" fill="#FCA5A5"/>
      <rect x="22" y="36" width="32" height="10" rx="3" fill="#93C5FD"/>
      <rect x="22" y="24" width="10" height="10" rx="3" fill="white" fillOpacity=".2"/>
      <rect x="100" y="24" width="30" height="10" rx="3" fill="#86EFAC"/>
      <rect x="100" y="36" width="30" height="10" rx="3" fill="#FDE68A"/>
      <path d="M29 65 L22 74 L22 112 L38 112 L38 74 Z" fill="#FCA5A5"/>
      <rect x="22" y="74" width="5" height="38" rx="2.5" fill="white" fillOpacity=".15"/>
      <path d="M49 65 L42 74 L42 115 L58 115 L58 74 Z" fill="#C4B5FD"/>
      <rect x="42" y="74" width="5" height="38" rx="2.5" fill="white" fillOpacity=".15"/>
      <path d="M71 65 L64 74 L64 112 L80 112 L80 74 Z" fill="#86EFAC"/>
      <rect x="64" y="74" width="5" height="38" rx="2.5" fill="white" fillOpacity=".15"/>
      <path d="M111 65 L104 75 L104 118 L122 118 L122 75 Z" fill="#FDE68A"/>
      <rect x="104" y="75" width="5" height="43" rx="2.5" fill="white" fillOpacity=".15"/>
      <path d="M133 65 L126 75 L126 120 L144 120 L144 75 Z" fill="#FCA5A5"/>
      <rect x="126" y="75" width="5" height="43" rx="2.5" fill="white" fillOpacity=".15"/>
      <path d="M157 65 L150 75 L150 118 L168 118 L168 75 Z" fill="#93C5FD"/>
      <rect x="150" y="75" width="5" height="43" rx="2.5" fill="white" fillOpacity=".15"/>
      <rect x="18" y="148" width="67" height="36" rx="4" fill="#92400E"/>
      <rect x="18" y="148" width="67" height="8" rx="4" fill="#B45309" fillOpacity=".5"/>
      <rect x="42" y="162" width="18" height="7" rx="3.5" fill="#FDE68A"/>
      <rect x="97" y="148" width="69" height="36" rx="4" fill="#92400E"/>
      <rect x="97" y="148" width="69" height="8" rx="4" fill="#B45309" fillOpacity=".5"/>
      <rect x="122" y="162" width="18" height="7" rx="3.5" fill="#FDE68A"/>
      <rect x="18" y="22" width="5" height="80" rx="2.5" fill="white" fillOpacity=".2"/>
    </svg>
  )
}

function IroningFolding() {
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="if-bg" x1="0" y1="0" x2=".5" y2="1"><stop offset="0%" stopColor="#042F2E"/><stop offset="100%" stopColor="#010F0F"/></linearGradient>
        <linearGradient id="if-bo" x1="0" y1="0" x2=".3" y2="1"><stop offset="0%" stopColor="#4ADE80"/><stop offset="100%" stopColor="#166534"/></linearGradient>
        <linearGradient id="if-ir" x1="0" y1="0" x2=".3" y2="1"><stop offset="0%" stopColor="#475569"/><stop offset="60%" stopColor="#1E293B"/><stop offset="100%" stopColor="#0F172A"/></linearGradient>
        <linearGradient id="if-pl" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#CBD5E1"/><stop offset="100%" stopColor="#94A3B8"/></linearGradient>
        <linearGradient id="if-lg" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#6EE7B7"/><stop offset="100%" stopColor="#0D9488"/></linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#if-bg)"/>
      <line x1="46" y1="140" x2="32" y2="188" stroke="url(#if-lg)" strokeWidth="5" strokeLinecap="round"/>
      <line x1="154" y1="140" x2="168" y2="188" stroke="url(#if-lg)" strokeWidth="5" strokeLinecap="round"/>
      <line x1="78" y1="140" x2="86" y2="188" stroke="url(#if-lg)" strokeWidth="4" strokeLinecap="round"/>
      <line x1="130" y1="140" x2="122" y2="188" stroke="url(#if-lg)" strokeWidth="4" strokeLinecap="round"/>
      <ellipse cx="100" cy="188" rx="72" ry="6" fill="#000" fillOpacity=".6"/>
      <path d="M18 124 Q18 140 46 140 L154 140 Q182 140 182 132 Q182 124 154 120 L18 120 Z" fill="url(#if-bo)"/>
      <path d="M18 120 Q10 128 18 140" fill="#2D6A4F" stroke="#4ADE80" strokeWidth="1"/>
      <rect x="40" y="112" width="112" height="28" rx="4" fill="white" fillOpacity=".9"/>
      <rect x="40" y="112" width="112" height="8" rx="3" fill="#99F6E4" fillOpacity=".5"/>
      <ellipse cx="125" cy="108" rx="40" ry="8" fill="#000" fillOpacity=".5"/>
      <path d="M86 68 Q82 68 82 80 L82 106 L168 106 Q178 106 178 94 Q178 78 168 68 Z" fill="url(#if-ir)"/>
      <path d="M86 68 Q82 68 82 80 L82 88 L168 82 Q178 80 178 74 Q174 68 168 68 Z" fill="white" fillOpacity=".1"/>
      <path d="M82 106 L168 106 Q178 106 178 112 L164 118 L82 118 Z" fill="url(#if-pl)"/>
      <rect x="84" y="108" width="5" height="10" rx="2.5" fill="white" fillOpacity=".5"/>
      <circle cx="96" cy="111" r="2.5" fill="#166534"/>
      <circle cx="108" cy="111" r="2.5" fill="#166534"/>
      <circle cx="120" cy="111" r="2.5" fill="#166534"/>
      <circle cx="132" cy="111" r="2.5" fill="#166534"/>
      <circle cx="144" cy="111" r="2.5" fill="#166534"/>
      <circle cx="156" cy="111" r="2.5" fill="#166534"/>
      <path d="M108 68 Q108 50 128 50 Q148 50 148 68" fill="none" stroke="#475569" strokeWidth="9" strokeLinecap="round"/>
      <path d="M108 68 Q108 50 128 50 Q148 50 148 68" fill="none" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round"/>
      <path d="M96 60 Q92 48 96 36" stroke="#99F6E4" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeOpacity=".8"/>
      <path d="M116 58 Q112 44 116 30" stroke="#6EE7B7" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeOpacity=".7"/>
      <path d="M136 58 Q132 45 136 32" stroke="#99F6E4" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeOpacity=".6"/>
      <rect x="16" y="152" width="50" height="12" rx="3" fill="#FCA5A5"/>
      <rect x="16" y="166" width="50" height="12" rx="3" fill="#93C5FD"/>
      <rect x="16" y="180" width="50" height="12" rx="3" fill="#86EFAC"/>
    </svg>
  )
}

function WindowCleaning() {
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wc-bg" x1="0" y1="0" x2=".5" y2="1"><stop offset="0%" stopColor="#0C4A6E"/><stop offset="100%" stopColor="#020F1A"/></linearGradient>
        <linearGradient id="wc-sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#38BDF8"/><stop offset="100%" stopColor="#0284C7"/></linearGradient>
        <linearGradient id="wc-fr" x1="0" y1="0" x2=".3" y2="1"><stop offset="0%" stopColor="#F8FAFC"/><stop offset="100%" stopColor="#CBD5E1"/></linearGradient>
        <linearGradient id="wc-sq" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#FDE68A"/><stop offset="100%" stopColor="#D97706"/></linearGradient>
        <radialGradient id="wc-su" cx="40%" cy="35%" r="60%"><stop offset="0%" stopColor="#FEF9C3"/><stop offset="50%" stopColor="#FDE68A"/><stop offset="100%" stopColor="#F59E0B"/></radialGradient>
        <linearGradient id="wc-fs" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#94A3B8"/><stop offset="100%" stopColor="#475569"/></linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#wc-bg)"/>
      <rect x="162" y="16" width="14" height="168" fill="url(#wc-fs)"/>
      <ellipse cx="100" cy="190" rx="80" ry="5" fill="#000" fillOpacity=".5"/>
      <rect x="18" y="16" width="144" height="168" rx="8" fill="url(#wc-fr)"/>
      <rect x="84" y="16" width="10" height="168" fill="url(#wc-fr)"/>
      <rect x="18" y="96" width="144" height="10" fill="url(#wc-fr)"/>
      <rect x="22" y="20" width="58" height="72" rx="4" fill="url(#wc-sk)"/>
      <circle cx="52" cy="50" r="20" fill="url(#wc-su)"/>
      <circle cx="46" cy="44" r="8" fill="white" fillOpacity=".3"/>
      <line x1="52" y1="26" x2="52" y2="18" stroke="#FEF9C3" strokeWidth="2.5" strokeLinecap="round" strokeOpacity=".9"/>
      <line x1="68" y1="32" x2="74" y2="26" stroke="#FEF9C3" strokeWidth="2.5" strokeLinecap="round" strokeOpacity=".9"/>
      <line x1="74" y1="50" x2="82" y2="50" stroke="#FEF9C3" strokeWidth="2.5" strokeLinecap="round" strokeOpacity=".9"/>
      <line x1="68" y1="68" x2="74" y2="74" stroke="#FEF9C3" strokeWidth="2.5" strokeLinecap="round" strokeOpacity=".9"/>
      <line x1="36" y1="32" x2="30" y2="26" stroke="#FEF9C3" strokeWidth="2.5" strokeLinecap="round" strokeOpacity=".9"/>
      <line x1="30" y1="50" x2="22" y2="50" stroke="#FEF9C3" strokeWidth="2.5" strokeLinecap="round" strokeOpacity=".9"/>
      <rect x="98" y="20" width="60" height="72" rx="4" fill="url(#wc-sk)" fillOpacity=".8"/>
      <rect x="98" y="20" width="60" height="72" rx="4" fill="#F8FAFC" fillOpacity=".15"/>
      <rect x="22" y="110" width="58" height="70" rx="4" fill="url(#wc-sk)" fillOpacity=".7"/>
      <rect x="98" y="110" width="60" height="70" rx="4" fill="url(#wc-sk)" fillOpacity=".6"/>
      <rect x="26" y="24" width="4" height="28" rx="2" fill="white" fillOpacity=".5"/>
      <rect x="26" y="24" width="24" height="4" rx="2" fill="white" fillOpacity=".4"/>
      <rect x="102" y="114" width="4" height="22" rx="2" fill="white" fillOpacity=".4"/>
      <rect x="148" y="22" width="12" height="90" rx="6" fill="url(#wc-sq)" transform="rotate(18 154 70)"/>
      <rect x="148" y="22" width="6" height="90" rx="3" fill="white" fillOpacity=".25" transform="rotate(18 154 70)"/>
      <rect x="152" y="88" width="36" height="12" rx="4" fill="#1E293B" transform="rotate(18 170 94)"/>
      <path d="M170 106 Q168 118 166 130 Q164 142 162 158" stroke="#7DD3FC" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeOpacity=".7"/>
    </svg>
  )
}

function Laundry() {
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="la-bg" x1="0" y1="0" x2=".5" y2="1"><stop offset="0%" stopColor="#1E1B4B"/><stop offset="100%" stopColor="#060515"/></linearGradient>
        <linearGradient id="la-mc" x1="0" y1="0" x2=".3" y2="1"><stop offset="0%" stopColor="#334155"/><stop offset="50%" stopColor="#1E293B"/><stop offset="100%" stopColor="#0F172A"/></linearGradient>
        <linearGradient id="la-pn" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1E3A8A"/><stop offset="100%" stopColor="#1E1B4B"/></linearGradient>
        <radialGradient id="la-gl" cx="35%" cy="32%" r="65%"><stop offset="0%" stopColor="#BAE6FD" stopOpacity=".9"/><stop offset="60%" stopColor="#3B82F6" stopOpacity=".6"/><stop offset="100%" stopColor="#1D4ED8" stopOpacity=".8"/></radialGradient>
      </defs>
      <rect width="200" height="200" fill="url(#la-bg)"/>
      <rect x="162" y="22" width="16" height="168" fill="#0F172A"/>
      <path d="M22 22 L38 16 L178 16 L162 22 Z" fill="#475569" fillOpacity=".7"/>
      <rect x="22" y="22" width="140" height="168" rx="14" fill="url(#la-mc)"/>
      <rect x="22" y="22" width="140" height="52" rx="14" fill="url(#la-pn)"/>
      <rect x="22" y="60" width="140" height="14" fill="url(#la-pn)"/>
      <rect x="80" y="32" width="56" height="28" rx="6" fill="#0F172A"/>
      <rect x="82" y="34" width="52" height="24" rx="4" fill="#0C1445"/>
      <text x="108" y="51" fontSize="14" fill="#60A5FA" textAnchor="middle" fontFamily="monospace" fontWeight="bold">30°</text>
      <circle cx="50" cy="46" r="16" fill="#0F172A"/>
      <circle cx="50" cy="46" r="12" fill="#1E3A8A"/>
      <circle cx="50" cy="46" r="6" fill="#3B82F6"/>
      <circle cx="50" cy="40" r="3" fill="#93C5FD"/>
      <circle cx="154" cy="38" r="8" fill="#0F172A"/>
      <circle cx="154" cy="38" r="5" fill="#1D4ED8"/>
      <circle cx="154" cy="56" r="8" fill="#0F172A"/>
      <circle cx="154" cy="56" r="5" fill="#6D28D9"/>
      <circle cx="100" cy="128" r="62" fill="none" stroke="#334155" strokeWidth="4"/>
      <circle cx="100" cy="128" r="56" fill="none" stroke="#1E3A8A" strokeWidth="3"/>
      <circle cx="100" cy="128" r="50" fill="url(#la-gl)"/>
      <path d="M78 112 Q100 96 122 112 Q132 124 122 140 Q100 158 78 140 Q68 128 78 112 Z" fill="#FCA5A5" fillOpacity=".85"/>
      <path d="M72 125 Q80 145 100 148" stroke="#60A5FA" strokeWidth="16" strokeLinecap="round" fill="none" strokeOpacity=".65"/>
      <ellipse cx="82" cy="110" rx="16" ry="8" fill="white" fillOpacity=".25"/>
      <circle cx="82" cy="108" r="6" fill="white" fillOpacity=".3"/>
      <circle cx="118" cy="106" r="5" fill="white" fillOpacity=".25"/>
      <circle cx="130" cy="120" r="4" fill="white" fillOpacity=".2"/>
      <rect x="150" y="122" width="16" height="10" rx="5" fill="#60A5FA"/>
      <rect x="150" y="120" width="16" height="5" rx="2.5" fill="#93C5FD" fillOpacity=".6"/>
    </svg>
  )
}

function KitchenCleaning() {
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="kc-bg" x1="0" y1="0" x2=".5" y2="1"><stop offset="0%" stopColor="#451A03"/><stop offset="100%" stopColor="#0F0500"/></linearGradient>
        <linearGradient id="kc-st" x1="0" y1="0" x2=".3" y2="1"><stop offset="0%" stopColor="#334155"/><stop offset="60%" stopColor="#1E293B"/><stop offset="100%" stopColor="#0F172A"/></linearGradient>
        <linearGradient id="kc-sf" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#475569"/><stop offset="100%" stopColor="#1E293B"/></linearGradient>
        <radialGradient id="kc-bn" cx="40%" cy="35%" r="60%"><stop offset="0%" stopColor="#475569"/><stop offset="60%" stopColor="#334155"/><stop offset="100%" stopColor="#0F172A"/></radialGradient>
        <radialGradient id="kc-fl" cx="50%" cy="70%" r="50%"><stop offset="0%" stopColor="#FEF9C3"/><stop offset="40%" stopColor="#FDE68A"/><stop offset="70%" stopColor="#F59E0B"/><stop offset="100%" stopColor="#DC2626" stopOpacity="0"/></radialGradient>
        <linearGradient id="kc-sp" x1="0" y1="0" x2=".3" y2="1"><stop offset="0%" stopColor="#4ADE80"/><stop offset="100%" stopColor="#166534"/></linearGradient>
        <linearGradient id="kc-ct" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#64748B"/><stop offset="100%" stopColor="#334155"/></linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#kc-bg)"/>
      <rect x="0" y="148" width="200" height="52" fill="url(#kc-ct)"/>
      <rect x="0" y="146" width="200" height="6" fill="#94A3B8"/>
      <rect x="0" y="144" width="200" height="4" fill="white" fillOpacity=".2"/>
      <rect x="156" y="82" width="18" height="68" fill="#0F172A"/>
      <rect x="22" y="82" width="134" height="68" rx="10" fill="url(#kc-st)"/>
      <rect x="24" y="84" width="130" height="64" rx="8" fill="url(#kc-sf)"/>
      <circle cx="66" cy="104" r="24" fill="url(#kc-bn)"/>
      <circle cx="66" cy="104" r="16" fill="#0F172A"/>
      <circle cx="66" cy="104" r="10" fill="#1E293B"/>
      <circle cx="66" cy="104" r="5" fill="#0F172A"/>
      <ellipse cx="66" cy="98" rx="14" ry="18" fill="url(#kc-fl)" fillOpacity=".9"/>
      <ellipse cx="63" cy="94" rx="6" ry="10" fill="#FEF9C3" fillOpacity=".5"/>
      <circle cx="130" cy="104" r="24" fill="url(#kc-bn)"/>
      <circle cx="130" cy="104" r="16" fill="#0F172A"/>
      <circle cx="130" cy="104" r="10" fill="#1E293B"/>
      <circle cx="130" cy="104" r="5" fill="#0F172A"/>
      <path d="M128 84 Q124 72 128 60" stroke="#F97316" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeOpacity=".7"/>
      <path d="M134 84 Q138 72 134 60" stroke="#FB923C" strokeWidth="2" fill="none" strokeLinecap="round" strokeOpacity=".6"/>
      <circle cx="38" cy="136" r="8" fill="#0F172A"/>
      <circle cx="38" cy="136" r="5" fill="#1E293B"/>
      <circle cx="38" cy="132" r="2" fill="#F59E0B" fillOpacity=".8"/>
      <circle cx="62" cy="136" r="8" fill="#0F172A"/>
      <circle cx="62" cy="136" r="5" fill="#1E293B"/>
      <circle cx="62" cy="132" r="2" fill="#F59E0B" fillOpacity=".8"/>
      <circle cx="86" cy="136" r="8" fill="#0F172A"/>
      <circle cx="86" cy="136" r="5" fill="#1E293B"/>
      <circle cx="86" cy="132" r="2" fill="#F59E0B" fillOpacity=".8"/>
      <rect x="152" y="148" width="38" height="26" rx="8" fill="url(#kc-sp)"/>
      <rect x="152" y="148" width="38" height="12" rx="8" fill="#FDE68A" fillOpacity=".7"/>
      <rect x="155" y="150" width="5" height="10" rx="2.5" fill="white" fillOpacity=".2"/>
      <line x1="160" y1="148" x2="160" y2="174" stroke="#166534" strokeWidth="1.5" strokeOpacity=".5"/>
      <line x1="168" y1="148" x2="168" y2="174" stroke="#166534" strokeWidth="1.5" strokeOpacity=".5"/>
      <line x1="176" y1="148" x2="176" y2="174" stroke="#166534" strokeWidth="1.5" strokeOpacity=".5"/>
      <rect x="26" y="86" width="4" height="30" rx="2" fill="white" fillOpacity=".15"/>
    </svg>
  )
}

function BalconyCleaning() {
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bal-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0369A1"/><stop offset="60%" stopColor="#0C4A6E"/><stop offset="100%" stopColor="#052030"/></linearGradient>
        <linearGradient id="bal-fl" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1E3A5F"/><stop offset="100%" stopColor="#0F2040"/></linearGradient>
        <linearGradient id="bal-pt" x1="0" y1="0" x2=".3" y2="1"><stop offset="0%" stopColor="#FED7AA"/><stop offset="50%" stopColor="#EA580C"/><stop offset="100%" stopColor="#9A3412"/></linearGradient>
        <linearGradient id="bal-rl" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#CBD5E1"/><stop offset="100%" stopColor="#475569"/></linearGradient>
        <linearGradient id="bal-bm" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FDE68A"/><stop offset="100%" stopColor="#92400E"/></linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#bal-bg)"/>
      <ellipse cx="160" cy="28" rx="24" ry="24" fill="#FEF9C3" fillOpacity=".4"/>
      <ellipse cx="160" cy="28" rx="16" ry="16" fill="#FDE68A" fillOpacity=".5"/>
      <rect x="0" y="148" width="200" height="52" fill="url(#bal-fl)"/>
      <line x1="0" y1="148" x2="200" y2="148" stroke="#3B82F6" strokeWidth="1.5" strokeOpacity=".5"/>
      <line x1="50" y1="148" x2="50" y2="200" stroke="#1D4ED8" strokeWidth="1" strokeOpacity=".3"/>
      <line x1="100" y1="148" x2="100" y2="200" stroke="#1D4ED8" strokeWidth="1" strokeOpacity=".3"/>
      <line x1="150" y1="148" x2="150" y2="200" stroke="#1D4ED8" strokeWidth="1" strokeOpacity=".3"/>
      <line x1="0" y1="174" x2="200" y2="174" stroke="#1D4ED8" strokeWidth="1" strokeOpacity=".3"/>
      <rect x="0" y="100" width="200" height="10" rx="4" fill="url(#bal-rl)"/>
      <rect x="0" y="98" width="200" height="5" rx="2.5" fill="white" fillOpacity=".3"/>
      <rect x="0" y="138" width="200" height="12" rx="4" fill="url(#bal-rl)"/>
      <rect x="0" y="136" width="200" height="5" rx="2.5" fill="white" fillOpacity=".2"/>
      <rect x="12" y="100" width="8" height="50" rx="4" fill="url(#bal-rl)"/>
      <rect x="32" y="100" width="8" height="50" rx="4" fill="url(#bal-rl)"/>
      <rect x="52" y="100" width="8" height="50" rx="4" fill="url(#bal-rl)"/>
      <rect x="72" y="100" width="8" height="50" rx="4" fill="url(#bal-rl)"/>
      <rect x="92" y="100" width="8" height="50" rx="4" fill="url(#bal-rl)"/>
      <rect x="112" y="100" width="8" height="50" rx="4" fill="url(#bal-rl)"/>
      <rect x="132" y="100" width="8" height="50" rx="4" fill="url(#bal-rl)"/>
      <rect x="152" y="100" width="8" height="50" rx="4" fill="url(#bal-rl)"/>
      <rect x="172" y="100" width="8" height="50" rx="4" fill="url(#bal-rl)"/>
      <ellipse cx="56" cy="152" rx="28" ry="5" fill="#000" fillOpacity=".4"/>
      <path d="M30 148 L22 108 L90 108 L82 148 Z" fill="url(#bal-pt)"/>
      <ellipse cx="56" cy="108" rx="34" ry="9" fill="#FED7AA"/>
      <rect x="24" y="116" width="8" height="32" rx="2" fill="white" fillOpacity=".15"/>
      <ellipse cx="56" cy="78" rx="30" ry="32" fill="#166534"/>
      <ellipse cx="36" cy="88" rx="20" ry="24" fill="#15803D"/>
      <ellipse cx="76" cy="86" rx="18" ry="22" fill="#14532D"/>
      <ellipse cx="56" cy="62" rx="16" ry="24" fill="#16A34A"/>
      <path d="M54 108 L54 72" stroke="#14532D" strokeWidth="4" strokeLinecap="round"/>
      <ellipse cx="142" cy="152" rx="20" ry="4" fill="#000" fillOpacity=".4"/>
      <path d="M122 148 L118 120 L166 120 L162 148 Z" fill="url(#bal-pt)"/>
      <ellipse cx="142" cy="120" rx="24" ry="7" fill="#FED7AA"/>
      <circle cx="142" cy="102" r="20" fill="#166534"/>
      <circle cx="132" cy="108" r="13" fill="#15803D"/>
      <circle cx="152" cy="106" r="12" fill="#14532D"/>
      <ellipse cx="175" cy="192" rx="14" ry="4" fill="#000" fillOpacity=".4"/>
      <rect x="168" y="30" width="10" height="118" rx="5" fill="url(#bal-bm)" transform="rotate(8 173 90)"/>
      <rect x="168" y="30" width="5" height="118" rx="2.5" fill="white" fillOpacity=".2" transform="rotate(8 173 90)"/>
      <rect x="156" y="148" width="42" height="13" rx="5" fill="#FDE68A"/>
      <rect x="156" y="146" width="42" height="6" rx="3" fill="white" fillOpacity=".2"/>
      <line x1="159" y1="161" x2="157" y2="175" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="165" y1="161" x2="163" y2="175" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="171" y1="161" x2="169" y2="175" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="177" y1="161" x2="175" y2="175" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="183" y1="161" x2="181" y2="175" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="189" y1="161" x2="187" y2="175" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
}

function FanCleaning() {
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fan-bg" x1="0" y1="0" x2=".5" y2="1"><stop offset="0%" stopColor="#0C1445"/><stop offset="100%" stopColor="#030712"/></linearGradient>
        <linearGradient id="fan-cl" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1E3A8A"/><stop offset="100%" stopColor="#1E1B4B"/></linearGradient>
        <linearGradient id="fan-bl" x1="0" y1="0" x2=".3" y2="1"><stop offset="0%" stopColor="#F1F5F9"/><stop offset="50%" stopColor="#CBD5E1"/><stop offset="100%" stopColor="#64748B"/></linearGradient>
        <linearGradient id="fan-hb" x1="0" y1="0" x2=".3" y2="1"><stop offset="0%" stopColor="#CBD5E1"/><stop offset="60%" stopColor="#94A3B8"/><stop offset="100%" stopColor="#334155"/></linearGradient>
        <linearGradient id="fan-rd" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#94A3B8"/><stop offset="100%" stopColor="#475569"/></linearGradient>
        <linearGradient id="fan-du" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FDE68A"/><stop offset="50%" stopColor="#F59E0B"/><stop offset="100%" stopColor="#B45309"/></linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#fan-bg)"/>
      <rect x="0" y="0" width="200" height="32" fill="url(#fan-cl)"/>
      <line x1="0" y1="32" x2="200" y2="32" stroke="#3B82F6" strokeWidth="1.5" strokeOpacity=".5"/>
      <circle cx="100" cy="16" r="18" fill="#1E3A8A"/>
      <circle cx="100" cy="16" r="12" fill="#2D4ED8"/>
      <circle cx="100" cy="16" r="6" fill="#3B82F6"/>
      <rect x="94" y="28" width="12" height="36" rx="6" fill="url(#fan-rd)"/>
      <rect x="94" y="28" width="6" height="36" rx="3" fill="white" fillOpacity=".2"/>
      {/* Blades BEFORE hub */}
      <path d="M100 64 Q76 38 52 48 Q62 66 78 68 Q92 68 100 64 Z" fill="url(#fan-bl)"/>
      <rect x="58" y="52" width="4" height="14" rx="2" fill="white" fillOpacity=".3" transform="rotate(-30 60 60)"/>
      <path d="M120 80 Q146 56 136 32 Q120 44 118 60 Q116 72 120 80 Z" fill="url(#fan-bl)"/>
      <rect x="126" y="38" width="4" height="14" rx="2" fill="white" fillOpacity=".3" transform="rotate(60 128 45)"/>
      <path d="M100 96 Q124 122 148 112 Q138 94 122 92 Q108 92 100 96 Z" fill="url(#fan-bl)"/>
      <rect x="130" y="100" width="4" height="14" rx="2" fill="white" fillOpacity=".3" transform="rotate(150 132 107)"/>
      <path d="M80 80 Q54 104 64 128 Q80 116 82 100 Q84 88 80 80 Z" fill="url(#fan-bl)"/>
      <rect x="62" y="108" width="4" height="14" rx="2" fill="white" fillOpacity=".3" transform="rotate(240 64 115)"/>
      {/* Hub AFTER blades */}
      <circle cx="100" cy="80" r="22" fill="url(#fan-hb)"/>
      <circle cx="100" cy="80" r="14" fill="#1E293B"/>
      <circle cx="100" cy="80" r="8" fill="#0F172A"/>
      <circle cx="100" cy="80" r="4" fill="#334155"/>
      <ellipse cx="94" cy="74" rx="6" ry="4" fill="white" fillOpacity=".2"/>
      {/* Dust */}
      <ellipse cx="54" cy="50" rx="8" ry="4" fill="#94A3B8" fillOpacity=".5" transform="rotate(-30 54 50)"/>
      <ellipse cx="134" cy="34" rx="7" ry="3" fill="#94A3B8" fillOpacity=".4" transform="rotate(60 134 34)"/>
      <circle cx="40" cy="60" r="2.5" fill="#CBD5E1" fillOpacity=".6"/>
      <circle cx="32" cy="72" r="2" fill="#94A3B8" fillOpacity=".5"/>
      <circle cx="158" cy="38" r="2.5" fill="#CBD5E1" fillOpacity=".6"/>
      {/* Duster */}
      <rect x="128" y="120" width="10" height="70" rx="5" fill="url(#fan-du)"/>
      <rect x="128" y="120" width="5" height="70" rx="2.5" fill="white" fillOpacity=".2"/>
      <ellipse cx="133" cy="118" rx="28" ry="16" fill="#F59E0B"/>
      <ellipse cx="110" cy="112" rx="16" ry="12" fill="#FDE68A"/>
      <ellipse cx="156" cy="112" rx="14" ry="11" fill="#FBBF24"/>
      <ellipse cx="133" cy="104" rx="20" ry="14" fill="#FDE68A" fillOpacity=".8"/>
      <path d="M38 90 Q100 130 162 90" stroke="#3B82F6" strokeWidth="2" fill="none" strokeDasharray="6,5" strokeOpacity=".3"/>
    </svg>
  )
}

function KitchenCabinets() {
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="kb-bg" x1="0" y1="0" x2=".5" y2="1"><stop offset="0%" stopColor="#431407"/><stop offset="100%" stopColor="#0F0300"/></linearGradient>
        <linearGradient id="kb-wd" x1="0" y1="0" x2=".3" y2="1"><stop offset="0%" stopColor="#FEF3C7"/><stop offset="40%" stopColor="#D97706"/><stop offset="100%" stopColor="#78350F"/></linearGradient>
        <linearGradient id="kb-ws" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#78350F"/><stop offset="100%" stopColor="#451A03"/></linearGradient>
        <linearGradient id="kb-ct" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#94A3B8"/><stop offset="100%" stopColor="#334155"/></linearGradient>
        <linearGradient id="kb-gl" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#ECFEFF" stopOpacity=".7"/><stop offset="100%" stopColor="#A5F3FC" stopOpacity=".2"/></linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#kb-bg)"/>
      <rect x="0" y="148" width="200" height="52" fill="url(#kb-ct)"/>
      <rect x="0" y="146" width="200" height="6" fill="#CBD5E1"/>
      <rect x="0" y="144" width="200" height="4" fill="white" fillOpacity=".2"/>
      <rect x="94" y="14" width="14" height="112" fill="url(#kb-ws)"/>
      <path d="M8 14 L22 8 L108 8 L94 14 Z" fill="#FEF9C3" fillOpacity=".6"/>
      <rect x="8" y="14" width="86" height="112" rx="6" fill="url(#kb-wd)"/>
      <line x1="51" y1="16" x2="51" y2="124" stroke="#92400E" strokeWidth="1.5"/>
      <rect x="10" y="30" width="6" height="12" rx="2" fill="#F59E0B"/>
      <rect x="10" y="86" width="6" height="12" rx="2" fill="#F59E0B"/>
      <rect x="54" y="30" width="6" height="12" rx="2" fill="#F59E0B"/>
      <rect x="54" y="86" width="6" height="12" rx="2" fill="#F59E0B"/>
      <rect x="42" y="64" width="7" height="18" rx="3.5" fill="#FDE68A"/>
      <rect x="52" y="64" width="7" height="18" rx="3.5" fill="#FDE68A"/>
      <rect x="12" y="18" width="4" height="48" rx="2" fill="white" fillOpacity=".25"/>
      <rect x="186" y="14" width="12" height="112" fill="url(#kb-ws)"/>
      <path d="M108 14 L122 8 L198 8 L186 14 Z" fill="#FEF9C3" fillOpacity=".6"/>
      <rect x="108" y="14" width="78" height="112" rx="6" fill="#78350F"/>
      <rect x="72" y="14" width="36" height="82" rx="5" fill="url(#kb-wd)"/>
      <rect x="72" y="14" width="36" height="82" rx="5" fill="url(#kb-gl)"/>
      <rect x="74" y="18" width="4" height="30" rx="2" fill="white" fillOpacity=".35"/>
      <rect x="74" y="91" width="8" height="5" rx="2.5" fill="#F59E0B"/>
      <rect x="110" y="58" width="74" height="4" rx="2" fill="#D97706"/>
      <rect x="110" y="96" width="74" height="4" rx="2" fill="#D97706"/>
      <rect x="114" y="20" width="14" height="36" rx="4" fill="#93C5FD"/>
      <rect x="114" y="18" width="14" height="6" rx="2" fill="#60A5FA"/>
      <rect x="132" y="24" width="12" height="32" rx="4" fill="#86EFAC"/>
      <rect x="132" y="22" width="12" height="6" rx="2" fill="#4ADE80"/>
      <rect x="148" y="20" width="12" height="36" rx="4" fill="#FCA5A5"/>
      <rect x="148" y="18" width="12" height="6" rx="2" fill="#F87171"/>
      <rect x="164" y="22" width="16" height="34" rx="4" fill="#C4B5FD"/>
      <rect x="166" y="22" width="6" height="34" rx="3" fill="white" fillOpacity=".2"/>
      <rect x="114" y="64" width="18" height="28" rx="4" fill="#FDE68A"/>
      <rect x="114" y="62" width="18" height="5" rx="2" fill="#F59E0B"/>
      <rect x="136" y="64" width="16" height="28" rx="4" fill="#FCA5A5"/>
      <rect x="156" y="66" width="22" height="26" rx="4" fill="#DBEAFE"/>
      <rect x="158" y="66" width="8" height="26" rx="3" fill="white" fillOpacity=".25"/>
      <rect x="114" y="102" width="24" height="22" rx="4" fill="#FEF9C3" stroke="#D97706" strokeWidth="1"/>
      <rect x="142" y="102" width="20" height="22" rx="4" fill="#FEF9C3" stroke="#D97706" strokeWidth="1"/>
      <rect x="166" y="104" width="14" height="20" rx="3" fill="#D1FAE5"/>
      <rect x="12" y="134" width="20" height="14" rx="4" fill="#FDE68A"/>
      <circle cx="50" cy="139" r="9" fill="#FCA5A5"/>
      <circle cx="46" cy="135" r="3" fill="white" fillOpacity=".3"/>
      <rect x="112" y="16" width="4" height="40" rx="2" fill="white" fillOpacity=".15"/>
    </svg>
  )
}

const ILLUSTRATIONS: Record<string, () => JSX.Element> = {
  'bathroom-cleaning': BathroomCleaning,
  'fridge-cleaning': FridgeCleaning,
  'packing-unpacking': PackingUnpacking,
  'utensils-cleaning': UtensilsCleaning,
  'kitchen-prep': KitchenPrep,
  'dusting-wiping': DustingWiping,
  'sweeping-mopping': SweepingMopping,
  'complete-wardrobe': CompleteWardrobe,
  'ironing-folding': IroningFolding,
  'window-cleaning': WindowCleaning,
  'laundry': Laundry,
  'kitchen-cleaning': KitchenCleaning,
  'balcony-cleaning': BalconyCleaning,
  'fan-cleaning': FanCleaning,
  'kitchen-cabinets': KitchenCabinets,
}

export default function ServiceIllustration({ slug }: { slug: string }) {
  const Illustration = ILLUSTRATIONS[slug]
  if (!Illustration) return null
  return <Illustration />
}
