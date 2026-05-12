import React from 'react';

const base = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

const iconClass = (className) => `admin-icon${className ? ` ${className}` : ''}`;

export const IconScale = (props) => (
  <svg {...base} width={props.size || 18} height={props.size || 18} className={iconClass(props.className)}>
    <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
    <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
    <path d="M7 21h10" />
    <path d="M12 3v18" />
  </svg>
);

export const IconBell = (props) => (
  <svg {...base} width={14} height={14} className={iconClass(props.className)}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

export const IconArrowLeft = (props) => (
  <svg {...base} className={iconClass(props.className)}>
    <path d="m15 18-6-6 6-6" />
    <path d="M4 12h16" />
  </svg>
);

export const IconChevronDown = (props) => (
  <svg {...base} className={iconClass(props.className)}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const IconSearch = (props) => (
  <svg {...base} className={iconClass(props.className)}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export const IconCheck = (props) => (
  <svg {...base} width={14} height={14} className={iconClass(props.className)}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const IconTrash = (props) => (
  <svg {...base} className={iconClass(props.className)}>
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

export const IconLayoutGrid = (props) => (
  <svg {...base} width={18} height={18} className={iconClass(props.className)}>
    <rect width="7" height="7" x="3" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="14" rx="1" />
    <rect width="7" height="7" x="3" y="14" rx="1" />
  </svg>
);

export const IconUsers = (props) => (
  <svg {...base} width={18} height={18} className={iconClass(props.className)}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const IconFileType = (props) => (
  <svg {...base} width={18} height={18} className={iconClass(props.className)}>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M10 9H8" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
  </svg>
);

export const IconFileText = (props) => (
  <svg {...base} width={18} height={18} className={iconClass(props.className)}>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M10 9H8" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
    <path d="M10 5H8" />
  </svg>
);

export const IconCheckSquare = (props) => (
  <svg {...base} width={18} height={18} className={iconClass(props.className)}>
    <path d="m9 11 3 3L22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);

export const IconShoppingCart = (props) => (
  <svg {...base} width={18} height={18} className={iconClass(props.className)}>
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </svg>
);

export const IconPlus = (props) => (
  <svg {...base} className={iconClass(props.className)}>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

export const IconRefresh = (props) => (
  <svg {...base} width={16} height={16} className={iconClass(props.className)}>
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
    <path d="M16 21h5v-5" />
  </svg>
);

export const IconEdit2 = (props) => (
  <svg {...base} className={iconClass(props.className)}>
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);

export const IconFileX = (props) => (
  <svg {...base} width={32} height={32} className={iconClass(props.className)}>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="m14.5 12.5-5 5" />
    <path d="m9.5 12.5 5 5" />
  </svg>
);

export const IconX = (props) => (
  <svg {...base} className={iconClass(props.className)}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

export const IconMenu = (props) => (
  <svg {...base} width={20} height={20} className={iconClass(props.className)}>
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

export const IconFilter = (props) => (
  <svg {...base} width={16} height={16} className={iconClass(props.className)}>
    <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
  </svg>
);

export const IconDownload = (props) => (
  <svg {...base} width={14} height={14} className={iconClass(props.className)}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </svg>
);

export const IconEye = (props) => (
  <svg {...base} width={14} height={14} className={iconClass(props.className)}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const IconMoreVertical = (props) => (
  <svg {...base} width={14} height={14} className={iconClass(props.className)}>
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
);

export const IconAlertTriangle = (props) => (
  <svg {...base} width={20} height={20} className={iconClass(props.className)}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);
