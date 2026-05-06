'use client'

function BathroomCleaning() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <linearGradient id="bc-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E0F2FE" />
          <stop offset="100%" stopColor="#BAE6FD" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#bc-bg)" />
      {/* Wall tiles */}
      <rect x="0" y="0" width="200" height="110" fill="#F0F9FF" opacity="0.6" />
      <line x1="0" y1="55" x2="200" y2="55" stroke="#BAE6FD" strokeWidth="1" />
      <line x1="50" y1="0" x2="50" y2="110" stroke="#BAE6FD" strokeWidth="1" />
      <line x1="100" y1="0" x2="100" y2="110" stroke="#BAE6FD" strokeWidth="1" />
      <line x1="150" y1="0" x2="150" y2="110" stroke="#BAE6FD" strokeWidth="1" />
      {/* Floor */}
      <rect x="0" y="155" width="200" height="45" fill="#DBEAFE" />
      <line x1="0" y1="177" x2="200" y2="177" stroke="#BAE6FD" strokeWidth="1" />
      <line x1="66" y1="155" x2="66" y2="200" stroke="#BAE6FD" strokeWidth="1" />
      <line x1="133" y1="155" x2="133" y2="200" stroke="#BAE6FD" strokeWidth="1" />
      {/* Toilet tank */}
      <rect x="68" y="72" width="64" height="42" rx="8" fill="white" stroke="#93C5FD" strokeWidth="2" />
      {/* Tank handle */}
      <rect x="116" y="79" width="12" height="7" rx="3.5" fill="#60A5FA" />
      {/* Toilet seat */}
      <ellipse cx="100" cy="114" rx="46" ry="12" fill="#F0F9FF" stroke="#93C5FD" strokeWidth="2" />
      {/* Bowl rim */}
      <rect x="58" y="114" width="84" height="18" rx="4" fill="white" stroke="#93C5FD" strokeWidth="2" />
      {/* Bowl */}
      <ellipse cx="100" cy="136" rx="42" ry="19" fill="white" stroke="#93C5FD" strokeWidth="2" />
      {/* Cleaning brush */}
      <rect x="148" y="108" width="10" height="48" rx="5" fill="#F5A623" />
      <ellipse cx="153" cy="108" rx="13" ry="16" fill="#FDE68A" />
      <ellipse cx="153" cy="108" rx="8" ry="10" fill="#F5A623" />
      {/* Soap bubbles */}
      <circle cx="36" cy="38" r="14" fill="white" opacity="0.75" />
      <circle cx="56" cy="18" r="9" fill="white" opacity="0.6" />
      <circle cx="22" cy="20" r="7" fill="white" opacity="0.5" />
      <circle cx="168" cy="32" r="11" fill="white" opacity="0.65" />
      <circle cx="182" cy="14" r="7" fill="white" opacity="0.5" />
    </svg>
  )
}

function FridgeCleaning() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <linearGradient id="fc-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#DCFCE7" />
          <stop offset="100%" stopColor="#A7F3D0" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#fc-bg)" />
      {/* Fridge body */}
      <rect x="40" y="20" width="120" height="165" rx="14" fill="white" stroke="#6EE7B7" strokeWidth="2.5" />
      {/* Freezer divider */}
      <line x1="40" y1="90" x2="160" y2="90" stroke="#6EE7B7" strokeWidth="2" />
      {/* Freezer handle */}
      <rect x="130" y="48" width="8" height="26" rx="4" fill="#34D399" />
      {/* Fridge handle */}
      <rect x="130" y="108" width="8" height="40" rx="4" fill="#34D399" />
      {/* Freezer interior – shelf items */}
      <rect x="58" y="38" width="60" height="8" rx="3" fill="#CFFAFE" />
      <rect x="58" y="52" width="40" height="8" rx="3" fill="#BAE6FD" />
      <rect x="102" y="52" width="18" height="8" rx="3" fill="#FDE68A" />
      <rect x="58" y="66" width="24" height="8" rx="3" fill="#D1FAE5" />
      {/* Fridge shelf lines */}
      <line x1="52" y1="120" x2="148" y2="120" stroke="#D1FAE5" strokeWidth="1.5" />
      <line x1="52" y1="148" x2="148" y2="148" stroke="#D1FAE5" strokeWidth="1.5" />
      {/* Fridge items */}
      <rect x="58" y="126" width="18" height="18" rx="4" fill="#FCA5A5" />
      <rect x="82" y="123" width="14" height="22" rx="3" fill="#FDE68A" />
      <ellipse cx="120" cy="134" rx="12" ry="12" fill="#86EFAC" />
      <rect x="60" y="154" width="28" height="20" rx="3" fill="#BAE6FD" />
      <rect x="94" y="154" width="16" height="20" rx="3" fill="#FDE68A" />
      {/* Sparkles */}
      <text x="26" y="50" fontSize="16" fill="#34D399">✦</text>
      <text x="162" y="70" fontSize="12" fill="#6EE7B7">✦</text>
      <text x="170" y="140" fontSize="10" fill="#34D399">✦</text>
    </svg>
  )
}

function PackingUnpacking() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <linearGradient id="pu-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FEF9C3" />
          <stop offset="100%" stopColor="#FDE68A" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#pu-bg)" />
      {/* Floor shadow */}
      <ellipse cx="100" cy="178" rx="75" ry="10" fill="#FCD34D" opacity="0.3" />
      {/* Big box back */}
      <rect x="30" y="95" width="100" height="80" rx="6" fill="#D97706" opacity="0.15" />
      {/* Big box body */}
      <rect x="28" y="98" width="100" height="78" rx="6" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
      {/* Big box tape horizontal */}
      <rect x="28" y="130" width="100" height="8" fill="#FBBF24" opacity="0.6" />
      {/* Big box flaps open */}
      <path d="M28 98 L78 75 L128 98" fill="#FDE68A" stroke="#D97706" strokeWidth="2" />
      <path d="M78 98 L78 75" stroke="#D97706" strokeWidth="1.5" strokeDasharray="4,3" />
      {/* Item inside box – book */}
      <rect x="52" y="104" width="30" height="20" rx="3" fill="#60A5FA" />
      <rect x="54" y="106" width="26" height="3" rx="1.5" fill="white" opacity="0.6" />
      <rect x="54" y="112" width="20" height="3" rx="1.5" fill="white" opacity="0.6" />
      {/* Small box right */}
      <rect x="140" y="128" width="55" height="48" rx="5" fill="#FFFBEB" stroke="#D97706" strokeWidth="1.5" />
      <rect x="140" y="144" width="55" height="6" fill="#FBBF24" opacity="0.5" />
      {/* Small box flap */}
      <path d="M140 128 L167 116 L195 128" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5" />
      {/* Tape roll */}
      <circle cx="28" cy="80" r="16" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
      <circle cx="28" cy="80" r="8" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5" />
      <line x1="28" y1="64" x2="28" y2="98" stroke="none" />
      <path d="M38 72 Q52 65 55 80" stroke="#D97706" strokeWidth="1.5" fill="none" />
    </svg>
  )
}

function UtensilsCleaning() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <linearGradient id="uc-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="100%" stopColor="#FEF08A" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#uc-bg)" />
      {/* Sink basin */}
      <rect x="30" y="110" width="140" height="65" rx="10" fill="#E0F2FE" stroke="#7DD3FC" strokeWidth="2" />
      <rect x="38" y="118" width="124" height="50" rx="6" fill="#BAE6FD" opacity="0.5" />
      {/* Water ripple */}
      <ellipse cx="100" cy="155" rx="40" ry="8" fill="none" stroke="#7DD3FC" strokeWidth="1.5" />
      <ellipse cx="100" cy="155" rx="22" ry="4" fill="none" stroke="#7DD3FC" strokeWidth="1" />
      {/* Plate stack */}
      <ellipse cx="100" cy="108" rx="44" ry="10" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
      <ellipse cx="100" cy="100" rx="44" ry="10" fill="white" stroke="#94A3B8" strokeWidth="1.5" />
      <ellipse cx="100" cy="92" rx="44" ry="10" fill="white" stroke="#94A3B8" strokeWidth="1.5" />
      <ellipse cx="100" cy="84" rx="44" ry="10" fill="white" stroke="#94A3B8" strokeWidth="1.5" />
      <ellipse cx="100" cy="77" rx="30" ry="7" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
      {/* Fork */}
      <rect x="42" y="50" width="5" height="50" rx="2.5" fill="#94A3B8" />
      <rect x="40" y="50" width="2" height="18" rx="1" fill="#94A3B8" />
      <rect x="45" y="50" width="2" height="18" rx="1" fill="#94A3B8" />
      <rect x="50" y="50" width="2" height="18" rx="1" fill="#94A3B8" />
      {/* Spoon */}
      <rect x="153" y="68" width="5" height="42" rx="2.5" fill="#94A3B8" />
      <ellipse cx="155.5" cy="58" rx="9" ry="12" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1.5" />
      {/* Soap bubbles */}
      <circle cx="60" cy="35" r="13" fill="white" opacity="0.8" />
      <circle cx="80" cy="22" r="9" fill="white" opacity="0.65" />
      <circle cx="48" cy="20" r="7" fill="white" opacity="0.55" />
      <circle cx="148" cy="30" r="11" fill="white" opacity="0.7" />
      <circle cx="168" cy="16" r="7" fill="white" opacity="0.55" />
      <circle cx="130" cy="18" r="8" fill="white" opacity="0.6" />
    </svg>
  )
}

function KitchenPrep() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <linearGradient id="kp-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F0FDF4" />
          <stop offset="100%" stopColor="#BBF7D0" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#kp-bg)" />
      {/* Table surface */}
      <rect x="0" y="145" width="200" height="55" rx="0" fill="#D1FAE5" />
      <rect x="0" y="145" width="200" height="6" fill="#6EE7B7" />
      {/* Cutting board */}
      <rect x="28" y="80" width="144" height="74" rx="10" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
      {/* Board grain lines */}
      <line x1="28" y1="100" x2="172" y2="100" stroke="#FDE68A" strokeWidth="1" />
      <line x1="28" y1="116" x2="172" y2="116" stroke="#FDE68A" strokeWidth="1" />
      <line x1="28" y1="132" x2="172" y2="132" stroke="#FDE68A" strokeWidth="1" />
      {/* Board handle */}
      <rect x="162" y="107" width="26" height="14" rx="7" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
      {/* Carrot */}
      <ellipse cx="72" cy="112" rx="10" ry="28" fill="#FB923C" transform="rotate(-20 72 112)" />
      <path d="M72 86 Q65 75 60 70" stroke="#4ADE80" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M72 86 Q72 74 70 68" stroke="#4ADE80" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M72 86 Q80 76 84 70" stroke="#4ADE80" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Tomato */}
      <circle cx="120" cy="116" r="22" fill="#F87171" />
      <circle cx="120" cy="116" r="16" fill="#FCA5A5" opacity="0.5" />
      <path d="M118 96 Q120 90 122 88" stroke="#4ADE80" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M120 96 Q116 90 112 90" stroke="#4ADE80" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Knife */}
      <rect x="28" y="48" width="95" height="10" rx="2" fill="#94A3B8" />
      <path d="M28 48 L28 58 L123 58 L123 52 Z" fill="#CBD5E1" />
      <rect x="123" y="46" width="26" height="14" rx="4" fill="#D97706" />
      {/* Onion half */}
      <ellipse cx="58" cy="125" rx="14" ry="10" fill="#FEF9C3" stroke="#FDE047" strokeWidth="1.5" />
      <path d="M47 122 Q58 115 69 122" stroke="#FDE047" strokeWidth="1" fill="none" />
    </svg>
  )
}

function DustingWiping() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <linearGradient id="dw-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F5F3FF" />
          <stop offset="100%" stopColor="#DDD6FE" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#dw-bg)" />
      {/* Spray bottle */}
      <rect x="110" y="70" width="42" height="80" rx="8" fill="white" stroke="#A78BFA" strokeWidth="2" />
      <rect x="118" y="62" width="26" height="18" rx="5" fill="white" stroke="#A78BFA" strokeWidth="2" />
      {/* Spray nozzle */}
      <rect x="140" y="68" width="22" height="8" rx="4" fill="#7C3AED" />
      {/* Spray mist */}
      <circle cx="170" cy="60" r="4" fill="#C4B5FD" opacity="0.8" />
      <circle cx="178" cy="54" r="3" fill="#C4B5FD" opacity="0.6" />
      <circle cx="168" cy="50" r="3" fill="#C4B5FD" opacity="0.6" />
      <circle cx="180" cy="64" r="2.5" fill="#C4B5FD" opacity="0.5" />
      <circle cx="174" cy="44" r="2" fill="#C4B5FD" opacity="0.4" />
      {/* Bottle label */}
      <rect x="116" y="100" width="28" height="22" rx="3" fill="#EDE9FE" />
      <rect x="119" y="104" width="22" height="3" rx="1.5" fill="#A78BFA" />
      <rect x="119" y="110" width="16" height="3" rx="1.5" fill="#A78BFA" />
      {/* Liquid inside */}
      <rect x="114" y="128" width="34" height="18" rx="4" fill="#C4B5FD" opacity="0.4" />
      {/* Duster handle */}
      <rect x="56" y="90" width="12" height="85" rx="6" fill="#F5A623" />
      {/* Duster fluffy head */}
      <ellipse cx="62" cy="80" rx="28" ry="18" fill="#FDE68A" />
      <ellipse cx="42" cy="75" rx="16" ry="12" fill="#FDE68A" />
      <ellipse cx="82" cy="75" rx="16" ry="12" fill="#FDE68A" />
      <ellipse cx="62" cy="66" rx="20" ry="14" fill="#FBBF24" opacity="0.7" />
      {/* Dust sparkles */}
      <text x="14" y="48" fontSize="16" fill="#C4B5FD">✦</text>
      <text x="168" y="120" fontSize="14" fill="#A78BFA">✦</text>
      <text x="24" y="110" fontSize="12" fill="#DDD6FE">✦</text>
      <text x="158" y="160" fontSize="10" fill="#C4B5FD">✦</text>
      {/* Wipe arc marks */}
      <path d="M30 155 Q60 140 90 155" stroke="#C4B5FD" strokeWidth="2" fill="none" strokeDasharray="4,3" />
      <path d="M30 168 Q60 153 90 168" stroke="#C4B5FD" strokeWidth="1.5" fill="none" strokeDasharray="4,3" />
    </svg>
  )
}

function SweepingMopping() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <linearGradient id="sm-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#EFF6FF" />
          <stop offset="100%" stopColor="#BFDBFE" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#sm-bg)" />
      {/* Floor */}
      <rect x="0" y="155" width="200" height="45" fill="#DBEAFE" />
      <line x1="0" y1="178" x2="200" y2="178" stroke="#BFDBFE" strokeWidth="1" />
      <line x1="50" y1="155" x2="50" y2="200" stroke="#BFDBFE" strokeWidth="1" />
      <line x1="100" y1="155" x2="100" y2="200" stroke="#BFDBFE" strokeWidth="1" />
      <line x1="150" y1="155" x2="150" y2="200" stroke="#BFDBFE" strokeWidth="1" />
      {/* Mop bucket */}
      <path d="M20 138 L28 175 L68 175 L76 138 Z" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
      <rect x="20" y="133" width="56" height="10" rx="4" fill="#FDE68A" stroke="#D97706" strokeWidth="2" />
      {/* Bucket handle */}
      <path d="M30 133 Q48 118 66 133" fill="none" stroke="#D97706" strokeWidth="2" />
      {/* Water in bucket */}
      <ellipse cx="48" cy="160" rx="20" ry="6" fill="#7DD3FC" opacity="0.5" />
      {/* Mop handle */}
      <rect x="107" y="18" width="10" height="128" rx="5" fill="#D97706" />
      {/* Mop head */}
      <rect x="85" y="138" width="54" height="14" rx="4" fill="#E2E8F0" />
      <rect x="87" y="152" width="6" height="16" rx="3" fill="#94A3B8" />
      <rect x="96" y="152" width="6" height="18" rx="3" fill="#94A3B8" />
      <rect x="105" y="152" width="6" height="16" rx="3" fill="#94A3B8" />
      <rect x="114" y="152" width="6" height="18" rx="3" fill="#94A3B8" />
      <rect x="123" y="152" width="6" height="16" rx="3" fill="#94A3B8" />
      {/* Broom handle */}
      <rect x="152" y="22" width="10" height="112" rx="5" fill="#F5A623" transform="rotate(10 157 100)" />
      {/* Broom head */}
      <rect x="140" y="140" width="52" height="12" rx="4" fill="#FDE68A" />
      <rect x="140" y="152" width="6" height="12" rx="3" fill="#FBBF24" />
      <rect x="149" y="152" width="6" height="14" rx="3" fill="#FBBF24" />
      <rect x="158" y="152" width="6" height="12" rx="3" fill="#FBBF24" />
      <rect x="167" y="152" width="6" height="14" rx="3" fill="#FBBF24" />
      <rect x="176" y="152" width="6" height="12" rx="3" fill="#FBBF24" />
      {/* Dust particles */}
      <circle cx="130" cy="148" r="3" fill="#94A3B8" opacity="0.4" />
      <circle cx="118" cy="144" r="2" fill="#94A3B8" opacity="0.3" />
      <circle cx="142" cy="146" r="2.5" fill="#94A3B8" opacity="0.35" />
    </svg>
  )
}

function CompleteWardrobe() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <linearGradient id="cw-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FDF2F8" />
          <stop offset="100%" stopColor="#FBCFE8" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#cw-bg)" />
      {/* Wardrobe body */}
      <rect x="18" y="22" width="164" height="165" rx="10" fill="white" stroke="#F9A8D4" strokeWidth="2.5" />
      {/* Centre divider */}
      <line x1="100" y1="22" x2="100" y2="187" stroke="#F9A8D4" strokeWidth="2" />
      {/* Top shelf */}
      <rect x="22" y="44" width="74" height="8" rx="2" fill="#FCE7F3" />
      <rect x="104" y="44" width="74" height="8" rx="2" fill="#FCE7F3" />
      {/* Folded items on top shelf – left */}
      <rect x="28" y="36" width="28" height="8" rx="2" fill="#FCA5A5" />
      <rect x="28" y="29" width="28" height="8" rx="2" fill="#93C5FD" />
      {/* Right top shelf */}
      <rect x="110" y="36" width="26" height="8" rx="2" fill="#86EFAC" />
      <rect x="110" y="29" width="26" height="8" rx="2" fill="#FDE68A" />
      {/* Hanging rod left */}
      <rect x="26" y="56" width="70" height="4" rx="2" fill="#F9A8D4" />
      {/* Hanging rod right */}
      <rect x="104" y="56" width="70" height="4" rx="2" fill="#F9A8D4" />
      {/* Shirt left – hanger + shirt */}
      <line x1="46" y1="56" x2="46" y2="62" stroke="#E879A5" strokeWidth="1.5" />
      <path d="M36 72 L46 62 L56 72 L58 100 L34 100 Z" fill="#93C5FD" />
      <line x1="62" y1="56" x2="62" y2="62" stroke="#E879A5" strokeWidth="1.5" />
      <path d="M52 72 L62 62 L72 72 L74 115 L50 115 Z" fill="#FCA5A5" />
      <line x1="78" y1="56" x2="78" y2="62" stroke="#E879A5" strokeWidth="1.5" />
      <path d="M68 72 L78 62 L88 72 L90 105 L66 105 Z" fill="#86EFAC" />
      {/* Shirt right – hanger + shirt */}
      <line x1="120" y1="56" x2="120" y2="62" stroke="#E879A5" strokeWidth="1.5" />
      <path d="M110 72 L120 62 L130 72 L132 110 L108 110 Z" fill="#FDE68A" />
      <line x1="140" y1="56" x2="140" y2="62" stroke="#E879A5" strokeWidth="1.5" />
      <path d="M130 72 L140 62 L150 72 L152 120 L128 120 Z" fill="#C4B5FD" />
      <line x1="160" y1="56" x2="160" y2="62" stroke="#E879A5" strokeWidth="1.5" />
      <path d="M150 72 L160 62 L170 72 L172 100 L148 100 Z" fill="#FDA4AF" />
      {/* Bottom drawer left */}
      <rect x="22" y="152" width="74" height="26" rx="5" fill="#FCE7F3" stroke="#F9A8D4" strokeWidth="1.5" />
      <rect x="52" y="162" width="14" height="6" rx="3" fill="#F9A8D4" />
      {/* Bottom drawer right */}
      <rect x="104" y="152" width="74" height="26" rx="5" fill="#FCE7F3" stroke="#F9A8D4" strokeWidth="1.5" />
      <rect x="134" y="162" width="14" height="6" rx="3" fill="#F9A8D4" />
    </svg>
  )
}

function IroningFolding() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <linearGradient id="if-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#CCFBF1" />
          <stop offset="100%" stopColor="#99F6E4" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#if-bg)" />
      {/* Ironing board legs */}
      <line x1="48" y1="138" x2="38" y2="180" stroke="#5EEAD4" strokeWidth="4" strokeLinecap="round" />
      <line x1="152" y1="138" x2="162" y2="180" stroke="#5EEAD4" strokeWidth="4" strokeLinecap="round" />
      <line x1="80" y1="138" x2="88" y2="180" stroke="#5EEAD4" strokeWidth="3" strokeLinecap="round" />
      <line x1="130" y1="138" x2="122" y2="180" stroke="#5EEAD4" strokeWidth="3" strokeLinecap="round" />
      {/* Ironing board surface */}
      <path d="M22 122 Q22 138 48 138 L152 138 Q178 138 178 130 Q178 122 152 122 L22 122 Z" fill="#E0FDF4" stroke="#5EEAD4" strokeWidth="2" />
      <path d="M22 122 Q10 128 22 138" fill="#F0FDFA" stroke="#5EEAD4" strokeWidth="1.5" />
      {/* Shirt/cloth on board */}
      <rect x="42" y="110" width="96" height="28" rx="4" fill="white" opacity="0.9" />
      <rect x="42" y="110" width="96" height="6" rx="3" fill="#99F6E4" opacity="0.6" />
      {/* Iron body */}
      <path d="M90 68 L160 68 Q175 68 175 82 L175 106 L90 106 Q76 106 76 92 Z" fill="white" stroke="#5EEAD4" strokeWidth="2.5" />
      {/* Iron sole plate */}
      <path d="M90 106 L175 106 Q175 112 160 116 L90 116 Q80 116 78 112 Z" fill="#99F6E4" />
      {/* Iron handle */}
      <path d="M110 68 Q110 52 130 52 Q150 52 150 68" fill="none" stroke="#5EEAD4" strokeWidth="8" strokeLinecap="round" />
      {/* Steam holes on sole */}
      <circle cx="102" cy="110" r="2.5" fill="#5EEAD4" />
      <circle cx="116" cy="110" r="2.5" fill="#5EEAD4" />
      <circle cx="130" cy="110" r="2.5" fill="#5EEAD4" />
      <circle cx="144" cy="110" r="2.5" fill="#5EEAD4" />
      <circle cx="158" cy="110" r="2.5" fill="#5EEAD4" />
      {/* Steam wisps */}
      <path d="M100 68 Q96 56 100 44" stroke="#A7F3D0" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M120 68 Q116 54 120 40" stroke="#A7F3D0" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M140 68 Q136 56 140 42" stroke="#A7F3D0" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Folded clothes stack */}
      <rect x="20" y="150" width="46" height="10" rx="3" fill="#93C5FD" />
      <rect x="20" y="140" width="46" height="10" rx="3" fill="#FCA5A5" />
      <rect x="20" y="130" width="46" height="10" rx="3" fill="#86EFAC" />
    </svg>
  )
}

function WindowCleaning() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <linearGradient id="wc-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E0F7FA" />
          <stop offset="100%" stopColor="#B2EBF2" />
        </linearGradient>
        <linearGradient id="wc-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#BAE6FD" />
          <stop offset="100%" stopColor="#7DD3FC" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#wc-bg)" />
      {/* Window frame outer */}
      <rect x="24" y="20" width="140" height="155" rx="8" fill="white" stroke="#7DD3FC" strokeWidth="3" />
      {/* Window glass panes sky */}
      <rect x="32" y="28" width="62" height="70" rx="3" fill="url(#wc-sky)" />
      <rect x="100" y="28" width="56" height="70" rx="3" fill="url(#wc-sky)" />
      <rect x="32" y="104" width="62" height="62" rx="3" fill="url(#wc-sky)" opacity="0.7" />
      <rect x="100" y="104" width="56" height="62" rx="3" fill="url(#wc-sky)" opacity="0.7" />
      {/* Cloud in top left pane */}
      <ellipse cx="58" cy="48" rx="18" ry="10" fill="white" opacity="0.85" />
      <ellipse cx="48" cy="52" rx="12" ry="8" fill="white" opacity="0.85" />
      <ellipse cx="70" cy="52" rx="10" ry="7" fill="white" opacity="0.85" />
      {/* Shine reflections */}
      <rect x="36" y="32" width="3" height="18" rx="1.5" fill="white" opacity="0.7" />
      <rect x="41" y="32" width="2" height="10" rx="1" fill="white" opacity="0.5" />
      {/* Squeegee handle */}
      <rect x="144" y="28" width="10" height="110" rx="5" fill="#F5A623" transform="rotate(15 149 80)" />
      {/* Squeegee rubber head */}
      <rect x="148" y="90" width="36" height="12" rx="4" fill="#374151" transform="rotate(15 166 96)" />
      {/* Water streak */}
      <path d="M162 106 L158 135 L155 160" stroke="#7DD3FC" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6" />
      {/* Sparkle stars on glass */}
      <text x="104" y="55" fontSize="18" fill="white" opacity="0.9">✦</text>
      <text x="118" y="88" fontSize="12" fill="white" opacity="0.7">✦</text>
      <text x="36" y="130" fontSize="14" fill="white" opacity="0.7">✦</text>
    </svg>
  )
}

function Laundry() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <linearGradient id="la-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#EFF6FF" />
          <stop offset="100%" stopColor="#DBEAFE" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#la-bg)" />
      {/* Machine body */}
      <rect x="22" y="30" width="156" height="158" rx="14" fill="white" stroke="#93C5FD" strokeWidth="2.5" />
      {/* Top panel */}
      <rect x="22" y="30" width="156" height="42" rx="14" fill="#DBEAFE" />
      <rect x="22" y="58" width="156" height="14" fill="#DBEAFE" />
      {/* Control knob */}
      <circle cx="54" cy="52" r="14" fill="white" stroke="#93C5FD" strokeWidth="2" />
      <circle cx="54" cy="52" r="8" fill="#BFDBFE" />
      <circle cx="54" cy="44" r="3" fill="#3B82F6" />
      {/* Display panel */}
      <rect x="76" y="40" width="54" height="24" rx="5" fill="#1E3A5F" />
      <text x="103" y="57" fontSize="13" fill="#60A5FA" textAnchor="middle" fontFamily="monospace">30°</text>
      {/* Buttons */}
      <circle cx="148" cy="48" r="7" fill="white" stroke="#93C5FD" strokeWidth="1.5" />
      <circle cx="166" cy="48" r="7" fill="white" stroke="#93C5FD" strokeWidth="1.5" />
      {/* Door rim */}
      <circle cx="100" cy="130" r="58" fill="none" stroke="#93C5FD" strokeWidth="3" />
      {/* Door glass */}
      <circle cx="100" cy="130" r="50" fill="#EFF6FF" />
      <circle cx="100" cy="130" r="50" fill="#BAE6FD" opacity="0.3" />
      {/* Clothes tumbling */}
      <path d="M80 115 Q100 100 120 115 Q130 125 120 140 Q100 155 80 140 Q70 130 80 115 Z" fill="#FCA5A5" opacity="0.8" />
      <path d="M90 125 Q110 112 128 122" stroke="#F87171" strokeWidth="2" fill="none" />
      <path d="M72 125 Q80 145 100 148" stroke="#60A5FA" strokeWidth="14" strokeLinecap="round" fill="none" opacity="0.6" />
      {/* Bubbles */}
      <circle cx="85" cy="113" r="5" fill="white" opacity="0.7" />
      <circle cx="115" cy="112" r="4" fill="white" opacity="0.6" />
      <circle cx="125" cy="125" r="3.5" fill="white" opacity="0.65" />
      <circle cx="76" cy="140" r="4" fill="white" opacity="0.6" />
      {/* Door handle */}
      <rect x="148" y="126" width="14" height="8" rx="4" fill="#60A5FA" />
    </svg>
  )
}

function KitchenCleaning() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <linearGradient id="kc-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFF7ED" />
          <stop offset="100%" stopColor="#FED7AA" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#kc-bg)" />
      {/* Counter top */}
      <rect x="0" y="145" width="200" height="55" rx="0" fill="#E7E5E4" />
      <rect x="0" y="145" width="200" height="8" fill="#D6D3D1" />
      {/* Stove body */}
      <rect x="18" y="80" width="164" height="70" rx="10" fill="white" stroke="#FB923C" strokeWidth="2.5" />
      {/* Stove top surface */}
      <rect x="22" y="84" width="156" height="62" rx="8" fill="#F5F5F4" />
      {/* Left front burner */}
      <circle cx="60" cy="100" r="22" fill="#E7E5E4" stroke="#D6D3D1" strokeWidth="2" />
      <circle cx="60" cy="100" r="14" fill="#FAFAF9" stroke="#D6D3D1" strokeWidth="1.5" />
      <circle cx="60" cy="100" r="6" fill="#E7E5E4" />
      {/* Right front burner */}
      <circle cx="140" cy="100" r="22" fill="#E7E5E4" stroke="#D6D3D1" strokeWidth="2" />
      <circle cx="140" cy="100" r="14" fill="#FAFAF9" stroke="#D6D3D1" strokeWidth="1.5" />
      <circle cx="140" cy="100" r="6" fill="#E7E5E4" />
      {/* Left back burner (smaller) */}
      <circle cx="60" cy="134" r="14" fill="#E7E5E4" stroke="#D6D3D1" strokeWidth="1.5" />
      <circle cx="60" cy="134" r="8" fill="#FAFAF9" />
      {/* Right back burner */}
      <circle cx="140" cy="134" r="14" fill="#E7E5E4" stroke="#D6D3D1" strokeWidth="1.5" />
      <circle cx="140" cy="134" r="8" fill="#FAFAF9" />
      {/* Flame on left front burner */}
      <path d="M54 100 Q52 92 58 88 Q56 96 62 92 Q60 98 66 96 Q62 104 58 104 Q54 104 54 100 Z" fill="#F97316" opacity="0.8" />
      {/* Steam from right front burner */}
      <path d="M138 90 Q134 78 138 66" stroke="#FB923C" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
      <path d="M144 90 Q148 78 144 66" stroke="#FB923C" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
      {/* Sponge */}
      <rect x="148" y="152" width="36" height="24" rx="6" fill="#86EFAC" stroke="#4ADE80" strokeWidth="1.5" />
      <rect x="148" y="152" width="36" height="10" rx="6" fill="#4ADE80" opacity="0.6" />
      {/* Spray bottle */}
      <rect x="14" y="142" width="22" height="36" rx="5" fill="#FDE68A" stroke="#FBBF24" strokeWidth="1.5" />
      <rect x="18" y="136" width="14" height="12" rx="3" fill="#FDE68A" stroke="#FBBF24" strokeWidth="1.5" />
      <rect x="30" y="140" width="12" height="5" rx="2.5" fill="#F5A623" />
    </svg>
  )
}

function BalconyCleaning() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <linearGradient id="bal-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E0F2FE" />
          <stop offset="100%" stopColor="#D1FAE5" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#bal-bg)" />
      {/* Floor tiles */}
      <rect x="0" y="145" width="200" height="55" fill="#F0FDF4" />
      <line x1="0" y1="172" x2="200" y2="172" stroke="#BBF7D0" strokeWidth="1.5" />
      <line x1="50" y1="145" x2="50" y2="200" stroke="#BBF7D0" strokeWidth="1.5" />
      <line x1="100" y1="145" x2="100" y2="200" stroke="#BBF7D0" strokeWidth="1.5" />
      <line x1="150" y1="145" x2="150" y2="200" stroke="#BBF7D0" strokeWidth="1.5" />
      {/* Railing */}
      <rect x="0" y="100" width="200" height="8" rx="4" fill="#D1D5DB" />
      <rect x="20" y="100" width="6" height="50" rx="3" fill="#D1D5DB" />
      <rect x="54" y="100" width="6" height="50" rx="3" fill="#D1D5DB" />
      <rect x="88" y="100" width="6" height="50" rx="3" fill="#D1D5DB" />
      <rect x="122" y="100" width="6" height="50" rx="3" fill="#D1D5DB" />
      <rect x="156" y="100" width="6" height="50" rx="3" fill="#D1D5DB" />
      <rect x="0" y="145" width="200" height="6" rx="3" fill="#D1D5DB" />
      {/* Big terracotta pot */}
      <path d="M55 100 L48 145 L92 145 L85 100 Z" fill="#FB923C" />
      <rect x="50" y="95" width="40" height="10" rx="5" fill="#FDBA74" />
      {/* Plant leaves in big pot */}
      <ellipse cx="70" cy="75" rx="22" ry="26" fill="#4ADE80" />
      <ellipse cx="52" cy="85" rx="16" ry="18" fill="#22C55E" />
      <ellipse cx="88" cy="82" rx="14" ry="16" fill="#16A34A" />
      <path d="M68 100 L68 72" stroke="#15803D" strokeWidth="3" />
      <path d="M68 90 Q58 84 52 76" stroke="#15803D" strokeWidth="2" fill="none" />
      <path d="M70 86 Q80 80 86 72" stroke="#15803D" strokeWidth="2" fill="none" />
      {/* Small pot */}
      <path d="M130 120 L126 145 L150 145 L146 120 Z" fill="#FCA5A5" />
      <rect x="128" y="115" width="22" height="8" rx="4" fill="#FECACA" />
      {/* Small plant */}
      <ellipse cx="138" cy="100" rx="14" ry="16" fill="#86EFAC" />
      <ellipse cx="128" cy="108" rx="9" ry="10" fill="#4ADE80" />
      <ellipse cx="148" cy="105" rx="8" ry="10" fill="#22C55E" />
      {/* Broom */}
      <rect x="160" y="30" width="10" height="115" rx="5" fill="#D97706" transform="rotate(8 165 80)" />
      <rect x="155" y="145" width="38" height="12" rx="4" fill="#FBBF24" />
      <rect x="155" y="157" width="6" height="12" rx="3" fill="#D97706" />
      <rect x="164" y="157" width="6" height="14" rx="3" fill="#D97706" />
      <rect x="173" y="157" width="6" height="12" rx="3" fill="#D97706" />
      <rect x="182" y="157" width="6" height="14" rx="3" fill="#D97706" />
    </svg>
  )
}

function FanCleaning() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <linearGradient id="fan-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F0F9FF" />
          <stop offset="100%" stopColor="#BAE6FD" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#fan-bg)" />
      {/* Ceiling */}
      <rect x="0" y="0" width="200" height="30" fill="#E0F2FE" />
      {/* Fan rod */}
      <rect x="93" y="28" width="14" height="32" rx="7" fill="#94A3B8" />
      {/* Fan motor housing */}
      <circle cx="100" cy="78" r="20" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2.5" />
      <circle cx="100" cy="78" r="10" fill="#CBD5E1" />
      <circle cx="100" cy="78" r="5" fill="#94A3B8" />
      {/* Fan blades */}
      {/* Blade 1 – top */}
      <path d="M100 58 Q80 40 60 48 Q68 62 80 62 Q92 62 100 58 Z" fill="white" stroke="#CBD5E1" strokeWidth="1.5" />
      {/* Blade 2 – right */}
      <path d="M120 78 Q138 58 130 38 Q116 46 116 58 Q116 70 120 78 Z" fill="white" stroke="#CBD5E1" strokeWidth="1.5" />
      {/* Blade 3 – bottom */}
      <path d="M100 98 Q120 116 140 108 Q132 94 120 94 Q108 94 100 98 Z" fill="white" stroke="#CBD5E1" strokeWidth="1.5" />
      {/* Blade 4 – left */}
      <path d="M80 78 Q62 98 70 118 Q84 110 84 98 Q84 86 80 78 Z" fill="white" stroke="#CBD5E1" strokeWidth="1.5" />
      {/* Dust on blade tops */}
      <path d="M62 50 Q72 46 80 52" stroke="#D1D5DB" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M128 42 Q130 52 126 60" stroke="#D1D5DB" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Dust particles floating */}
      <circle cx="44" cy="55" r="3" fill="#D1D5DB" opacity="0.7" />
      <circle cx="38" cy="45" r="2" fill="#D1D5DB" opacity="0.5" />
      <circle cx="155" cy="42" r="3" fill="#D1D5DB" opacity="0.7" />
      <circle cx="162" cy="52" r="2" fill="#D1D5DB" opacity="0.5" />
      {/* Duster tool */}
      <rect x="132" y="118" width="10" height="64" rx="5" fill="#F5A623" />
      <ellipse cx="137" cy="118" rx="24" ry="16" fill="#FDE68A" />
      <ellipse cx="118" cy="112" rx="14" ry="10" fill="#FBBF24" />
      <ellipse cx="155" cy="112" rx="12" ry="9" fill="#FBBF24" />
      <ellipse cx="137" cy="106" rx="18" ry="12" fill="#FDE68A" opacity="0.8" />
      {/* Motion arc */}
      <path d="M40 100 Q100 140 160 100" stroke="#BAE6FD" strokeWidth="2" fill="none" strokeDasharray="5,4" />
    </svg>
  )
}

function KitchenCabinets() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <linearGradient id="kb-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="100%" stopColor="#FDE68A" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#kb-bg)" />
      {/* Wall */}
      <rect x="0" y="0" width="200" height="160" fill="#FEF3C7" opacity="0.4" />
      {/* Counter top */}
      <rect x="0" y="155" width="200" height="12" rx="3" fill="#D6D3D1" />
      <rect x="0" y="160" width="200" height="40" fill="#E7E5E4" />
      {/* Left cabinet (closed) */}
      <rect x="10" y="20" width="80" height="110" rx="8" fill="white" stroke="#D97706" strokeWidth="2" />
      {/* Left cabinet doors */}
      <rect x="14" y="24" width="36" height="102" rx="5" fill="#FEF9C3" stroke="#D97706" strokeWidth="1.5" />
      <rect x="54" y="24" width="32" height="102" rx="5" fill="#FEF9C3" stroke="#D97706" strokeWidth="1.5" />
      {/* Door handles */}
      <rect x="46" y="70" width="6" height="18" rx="3" fill="#D97706" />
      <rect x="52" y="70" width="6" height="18" rx="3" fill="#D97706" />
      {/* Right cabinet (open) */}
      <rect x="110" y="20" width="80" height="110" rx="8" fill="white" stroke="#D97706" strokeWidth="2" />
      {/* Open door swung out */}
      <rect x="82" y="24" width="28" height="78" rx="5" fill="#FEF9C3" stroke="#D97706" strokeWidth="1.5" />
      <rect x="84" y="60" width="5" height="14" rx="2.5" fill="#D97706" />
      {/* Cabinet interior shelves */}
      <line x1="114" y1="60" x2="186" y2="60" stroke="#FDE68A" strokeWidth="2" />
      <line x1="114" y1="95" x2="186" y2="95" stroke="#FDE68A" strokeWidth="2" />
      {/* Top shelf items: jars */}
      <rect x="118" y="36" width="16" height="22" rx="4" fill="#93C5FD" />
      <rect x="118" y="32" width="16" height="6" rx="2" fill="#60A5FA" />
      <rect x="138" y="38" width="14" height="20" rx="4" fill="#86EFAC" />
      <rect x="138" y="34" width="14" height="6" rx="2" fill="#4ADE80" />
      <rect x="156" y="36" width="12" height="22" rx="4" fill="#FCA5A5" />
      <rect x="156" y="32" width="12" height="6" rx="2" fill="#F87171" />
      <rect x="172" y="40" width="10" height="18" rx="3" fill="#FDE68A" />
      <rect x="172" y="36" width="10" height="6" rx="2" fill="#FBBF24" />
      {/* Middle shelf items */}
      <rect x="116" y="68" width="22" height="24" rx="4" fill="#FDE68A" />
      <rect x="116" y="65" width="22" height="5" rx="2" fill="#F5A623" />
      <rect x="142" y="70" width="18" height="22" rx="4" fill="#C4B5FD" />
      <rect x="163" y="70" width="18" height="22" rx="4" fill="#BAE6FD" />
      {/* Bottom shelf items */}
      <rect x="118" y="102" width="26" height="20" rx="4" fill="#FEF3C7" stroke="#D97706" strokeWidth="1" />
      <rect x="148" y="102" width="20" height="20" rx="4" fill="#FEF3C7" stroke="#D97706" strokeWidth="1" />
      <rect x="172" y="104" width="12" height="18" rx="3" fill="#D1FAE5" />
      {/* Sparkle */}
      <text x="22" y="16" fontSize="14" fill="#FBBF24">✦</text>
      <text x="170" y="16" fontSize="10" fill="#FBBF24">✦</text>
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
