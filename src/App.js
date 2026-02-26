import React, { useState, useEffect, useCallback, useRef } from "react";

const buildVintageCurve = (start, growth) =>
  Array.from({ length: 36 }, (_, i) => Number((start + i * growth + Math.sin(i / 3) * 0.08).toFixed(2)));

const DPD_BUCKET_COLORS = ["#10E8C4", "#4F8EF7", "#FBBF24", "#F97316", "#EF4444", "#7F1D1D"];
const DUE_DATE_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
const DUE_DATE_COLLECTION_ROWS = [
  "EMIs due",
  "EMIs collected in advance",
  "EMIs on time",
  "Within 3 days",
  "Within 5 days",
  "Within 10 days",
  "Within 15 days",
  "Within 30 days",
  "Within 60 days",
  "Within 90 days",
  "Collected post 90 days",
  "Uncollected as on date",
];
const DUE_DATE_DELINQUENCY_ROWS = [
  "POS due",
  "0+ DPD (% Amount)",
  "3+ DPD (% Amount)",
  "5+ DPD (% Amount)",
  "10+ DPD (% Amount)",
  "30+ DPD (% Amount)",
  "60+ DPD (% Amount)",
  "90+ DPD (% Amount)",
];

const DUE_DATE_COLLECTION_SAMPLE = {
  value: {
    "EMIs due": ["52,840", "54,120", "55,480", "56,710", "58,090", "59,430", "60,980", "62,310", "63,540", "64,920", "66,380"],
    "EMIs collected in advance": ["2,680", "2,790", "2,910", "3,020", "3,160", "3,260", "3,390", "3,510", "3,640", "3,780", "3,940"],
    "EMIs on time": ["41,920", "42,980", "44,050", "45,120", "46,310", "47,280", "48,410", "49,560", "50,470", "51,620", "52,810"],
    "Within 3 days": ["3,910", "4,020", "4,090", "4,160", "4,280", "4,340", "4,460", "4,590", "4,680", "4,770", "4,850"],
    "Within 5 days": ["1,890", "1,930", "1,980", "2,040", "2,110", "2,140", "2,180", "2,250", "2,290", "2,330", "2,390"],
    "Within 10 days": ["1,320", "1,360", "1,390", "1,430", "1,470", "1,500", "1,530", "1,580", "1,620", "1,660", "1,710"],
    "Within 15 days": ["840", "860", "880", "900", "930", "950", "970", "990", "1,010", "1,030", "1,060"],
    "Within 30 days": ["610", "630", "650", "670", "690", "710", "730", "750", "770", "790", "810"],
    "Within 60 days": ["420", "430", "440", "460", "470", "480", "490", "500", "510", "520", "540"],
    "Within 90 days": ["260", "270", "280", "290", "300", "310", "320", "330", "340", "350", "360"],
    "Collected post 90 days": ["190", "200", "210", "220", "230", "240", "250", "260", "270", "280", "290"],
    "Uncollected as on date": ["-180", "-150", "-140", "-145", "-155", "-165", "-175", "-185", "-200", "-220", "-260"],
  },
  volume: {
    "EMIs due": ["₹128.4 Cr", "₹133.1 Cr", "₹136.8 Cr", "₹140.2 Cr", "₹145.5 Cr", "₹149.9 Cr", "₹154.1 Cr", "₹159.8 Cr", "₹162.6 Cr", "₹167.3 Cr", "₹171.9 Cr"],
    "EMIs collected in advance": ["₹5.8 Cr", "₹6.1 Cr", "₹6.4 Cr", "₹6.9 Cr", "₹7.2 Cr", "₹7.6 Cr", "₹8.0 Cr", "₹8.3 Cr", "₹8.7 Cr", "₹9.0 Cr", "₹9.5 Cr"],
    "EMIs on time": ["₹104.5 Cr", "₹107.2 Cr", "₹109.6 Cr", "₹112.8 Cr", "₹116.1 Cr", "₹119.4 Cr", "₹122.0 Cr", "₹126.4 Cr", "₹128.8 Cr", "₹132.1 Cr", "₹135.0 Cr"],
    "Within 3 days": ["₹7.6 Cr", "₹8.0 Cr", "₹8.1 Cr", "₹8.3 Cr", "₹8.7 Cr", "₹8.8 Cr", "₹9.0 Cr", "₹9.4 Cr", "₹9.6 Cr", "₹9.8 Cr", "₹10.1 Cr"],
    "Within 5 days": ["₹4.2 Cr", "₹4.3 Cr", "₹4.5 Cr", "₹4.8 Cr", "₹5.0 Cr", "₹5.1 Cr", "₹5.2 Cr", "₹5.4 Cr", "₹5.5 Cr", "₹5.7 Cr", "₹5.9 Cr"],
    "Within 10 days": ["₹3.0 Cr", "₹3.2 Cr", "₹3.4 Cr", "₹3.5 Cr", "₹3.7 Cr", "₹3.8 Cr", "₹3.9 Cr", "₹4.1 Cr", "₹4.2 Cr", "₹4.4 Cr", "₹4.6 Cr"],
    "Within 15 days": ["₹1.8 Cr", "₹1.9 Cr", "₹2.0 Cr", "₹2.1 Cr", "₹2.2 Cr", "₹2.3 Cr", "₹2.4 Cr", "₹2.5 Cr", "₹2.6 Cr", "₹2.7 Cr", "₹2.9 Cr"],
    "Within 30 days": ["₹1.2 Cr", "₹1.3 Cr", "₹1.4 Cr", "₹1.5 Cr", "₹1.6 Cr", "₹1.7 Cr", "₹1.8 Cr", "₹1.9 Cr", "₹2.0 Cr", "₹2.1 Cr", "₹2.2 Cr"],
    "Within 60 days": ["₹0.9 Cr", "₹1.0 Cr", "₹1.0 Cr", "₹1.1 Cr", "₹1.1 Cr", "₹1.2 Cr", "₹1.2 Cr", "₹1.3 Cr", "₹1.3 Cr", "₹1.4 Cr", "₹1.5 Cr"],
    "Within 90 days": ["₹0.5 Cr", "₹0.6 Cr", "₹0.6 Cr", "₹0.6 Cr", "₹0.7 Cr", "₹0.7 Cr", "₹0.8 Cr", "₹0.8 Cr", "₹0.8 Cr", "₹0.9 Cr", "₹0.9 Cr"],
    "Collected post 90 days": ["₹0.4 Cr", "₹0.4 Cr", "₹0.5 Cr", "₹0.5 Cr", "₹0.5 Cr", "₹0.6 Cr", "₹0.6 Cr", "₹0.6 Cr", "₹0.7 Cr", "₹0.7 Cr", "₹0.8 Cr"],
    "Uncollected as on date": ["₹-1.5 Cr", "₹-1.2 Cr", "₹-1.1 Cr", "₹-1.2 Cr", "₹-1.3 Cr", "₹-1.3 Cr", "₹-1.4 Cr", "₹-1.5 Cr", "₹-1.6 Cr", "₹-1.8 Cr", "₹-2.1 Cr"],
  },
};

const DUE_DATE_DELINQUENCY_SAMPLE = {
  "POS due": ["3,140", "3,220 ", "3,280 ", "3,350 ", "3,430", "3,510", "3,620 ", "3,710 ", "3,790 ", "3,880 ", "3,960 "],
  "0+ DPD (% Amount)": ["4.8%", "4.9%", "5.1%", "5.0%", "5.2%", "5.3%", "5.4%", "5.5%", "5.6%", "5.8%", "5.9%"],
  "3+ DPD (% Amount)": ["3.9%", "4.0%", "4.1%", "4.2%", "4.3%", "4.4%", "4.5%", "4.6%", "4.7%", "4.8%", "4.9%"],
  "5+ DPD (% Amount)": ["3.4%", "3.5%", "3.6%", "3.7%", "3.8%", "3.9%", "4.0%", "4.1%", "4.2%", "4.3%", "4.4%"],
  "10+ DPD (% Amount)": ["2.8%", "2.9%", "3.0%", "3.1%", "3.1%", "3.2%", "3.3%", "3.4%", "3.5%", "3.6%", "3.7%"],
  "30+ DPD (% Amount)": ["2.1%", "2.2%", "2.3%", "2.3%", "2.4%", "2.5%", "2.6%", "2.7%", "2.8%", "2.9%", "3.0%"],
  "60+ DPD (% Amount)": ["1.5%", "1.6%", "1.6%", "1.7%", "1.8%", "1.8%", "1.9%", "2.0%", "2.1%", "2.2%", "2.3%"],
  "90+ DPD (% Amount)": ["1.1%", "1.1%", "1.2%", "1.2%", "1.3%", "1.4%", "1.4%", "1.5%", "1.6%", "1.6%", "1.7%"],
};

const parseDueDateNumeric = (rawValue) => {
  const cleaned = String(rawValue ?? "").replace(/,/g, "");
  const matched = cleaned.match(/-?\d*\.?\d+/);
  return matched ? Number(matched[0]) : 0;
};

const formatDueDateCollectionCell = (view, rowLabel, monthIndex) => {
  const currentValue = DUE_DATE_COLLECTION_SAMPLE[view]?.[rowLabel]?.[monthIndex];
  if (currentValue === undefined) return "—";

  if (rowLabel === DUE_DATE_COLLECTION_ROWS[0]) return currentValue;

  const baseValue = DUE_DATE_COLLECTION_SAMPLE[view]?.[DUE_DATE_COLLECTION_ROWS[0]]?.[monthIndex];
  const denominator = parseDueDateNumeric(baseValue);
  if (!denominator) return "0.0%";

  const pct = (parseDueDateNumeric(currentValue) / denominator) * 100;
  return `${pct.toFixed(1)}%`;
};

const DpdAgingView = ({ title, subtitle, rows, valueFormatter, theme }) => (
  <Panel title={title} subtitle={subtitle} theme={theme}>
    {rows.map((row, i) => {
      const maxValue = Math.max(...rows.map((r) => Number(r.value) || 0), 1);
      const barWidth = ((Number(row.value) || 0) / maxValue) * 100;
      return (
        <div key={`${title}-${row.bucket}`} style={{ marginBottom: 14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom: 5 }}>
            <span style={{ fontSize: 12, color: theme.subtext, fontWeight: 500 }}>{row.bucket}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: DPD_BUCKET_COLORS[i] }}>
              {valueFormatter(row.value)}
            </span>
          </div>
          <div style={{ background: theme.trackBg, borderRadius: 6, height: 7, overflow:"hidden" }}>
            <div style={{ width:`${barWidth}%`, background: `linear-gradient(90deg, ${DPD_BUCKET_COLORS[i]}cc, ${DPD_BUCKET_COLORS[i]})`, height:"100%", borderRadius: 6, transition: "width 0.6s ease" }} />
          </div>
        </div>
      );
    })}
  </Panel>
);

// ─── DEFAULT DATA ────────────────────────────────────────────────────────────
const DEFAULT_DATA = {
  meta: { companyName: "Instacash LSP Dashboard", reportDate: "Feb 2026" },
  portfolio: {
    totalAUM: 4820.5, totalAUMGrowth: 18.4,
    disbursed: 1240.2, disbursedGrowth: 22.1,
    outstanding: 3890.4, outstandingGrowth: 15.8,
    activeLoans: 24680, activeLoansGrowth: 12.3,
  },
  lenderData: {
    ALL: {
      creditQuality: { gnpa: 3.42, nnpa: 1.87, par30: 6.21, par60: 4.18, par90: 3.42, pcr: 68.4, writeOff: 0.92, creditCost: 2.1 },
      agingBucket: [
        { bucket: "Current", pct: 86.1 },
        { bucket: "1-30 DPD", pct: 6.2 },
        { bucket: "31-60 DPD", pct: 3.7 },
        { bucket: "61-90 DPD", pct: 2.1 },
        { bucket: "91-180 DPD", pct: 1.3 },
        { bucket: "180+ DPD", pct: 0.6 },
      ],
      agingBucketVolumeCr: [
        { bucket: "Current", value: 3349.8 },
        { bucket: "1-30 DPD", value: 241.2 },
        { bucket: "31-60 DPD", value: 143.9 },
        { bucket: "61-90 DPD", value: 81.7 },
        { bucket: "91-180 DPD", value: 50.6 },
        { bucket: "180+ DPD", value: 23.3 },
      ],
      agingBucketValueCount: [
        { bucket: "Current", value: 21254 },
        { bucket: "1-30 DPD", value: 1530 },
        { bucket: "31-60 DPD", value: 913 },
        { bucket: "61-90 DPD", value: 518 },
        { bucket: "91-180 DPD", value: 321 },
        { bucket: "180+ DPD", value: 144 },
      ],
    },
    CS: {
      creditQuality: { gnpa: 2.85, nnpa: 1.52, par30: 5.42, par60: 3.65, par90: 2.85, pcr: 72.1, writeOff: 0.78, creditCost: 1.85 },
      agingBucket: [
        { bucket: "Current", pct: 88.3 },
        { bucket: "1-30 DPD", pct: 5.4 },
        { bucket: "31-60 DPD", pct: 3.2 },
        { bucket: "61-90 DPD", pct: 1.8 },
        { bucket: "91-180 DPD", pct: 0.9 },
        { bucket: "180+ DPD", pct: 0.4 },
      ],
      agingBucketVolumeCr: [
        { bucket: "Current", value: 1923.6 },
        { bucket: "1-30 DPD", value: 117.6 },
        { bucket: "31-60 DPD", value: 69.7 },
        { bucket: "61-90 DPD", value: 39.2 },
        { bucket: "91-180 DPD", value: 19.8 },
        { bucket: "180+ DPD", value: 8.7 },
      ],
      agingBucketValueCount: [
        { bucket: "Current", value: 9492 },
        { bucket: "1-30 DPD", value: 581 },
        { bucket: "31-60 DPD", value: 344 },
        { bucket: "61-90 DPD", value: 194 },
        { bucket: "91-180 DPD", value: 97 },
        { bucket: "180+ DPD", value: 43 },
      ],
    },
    IDFC: {
      creditQuality: { gnpa: 3.98, nnpa: 2.21, par30: 7.12, par60: 4.82, par90: 3.98, pcr: 64.5, writeOff: 1.08, creditCost: 2.42 },
      agingBucket: [
        { bucket: "Current", pct: 84.2 },
        { bucket: "1-30 DPD", pct: 7.1 },
        { bucket: "31-60 DPD", pct: 4.3 },
        { bucket: "61-90 DPD", pct: 2.5 },
        { bucket: "91-180 DPD", pct: 1.4 },
        { bucket: "180+ DPD", pct: 0.5 },
      ],
      agingBucketVolumeCr: [
        { bucket: "Current", value: 1331.8 },
        { bucket: "1-30 DPD", value: 112.3 },
        { bucket: "31-60 DPD", value: 68.0 },
        { bucket: "61-90 DPD", value: 39.5 },
        { bucket: "91-180 DPD", value: 22.1 },
        { bucket: "180+ DPD", value: 7.9 },
      ],
      agingBucketValueCount: [
        { bucket: "Current", value: 7675 },
        { bucket: "1-30 DPD", value: 647 },
        { bucket: "31-60 DPD", value: 392 },
        { bucket: "61-90 DPD", value: 228 },
        { bucket: "91-180 DPD", value: 127 },
        { bucket: "180+ DPD", value: 45 },
      ],
    },
    LTF: {
      creditQuality: { gnpa: 4.21, nnpa: 2.38, par30: 7.85, par60: 5.21, par90: 4.21, pcr: 61.8, writeOff: 1.15, creditCost: 2.68 },
      agingBucket: [
        { bucket: "Current", pct: 82.5 },
        { bucket: "1-30 DPD", pct: 7.8 },
        { bucket: "31-60 DPD", pct: 4.9 },
        { bucket: "61-90 DPD", pct: 2.8 },
        { bucket: "91-180 DPD", pct: 1.6 },
        { bucket: "180+ DPD", pct: 0.4 },
      ],
      agingBucketVolumeCr: [
        { bucket: "Current", value: 443.1 },
        { bucket: "1-30 DPD", value: 41.9 },
        { bucket: "31-60 DPD", value: 26.3 },
        { bucket: "61-90 DPD", value: 15.0 },
        { bucket: "91-180 DPD", value: 8.6 },
        { bucket: "180+ DPD", value: 2.1 },
      ],
      agingBucketValueCount: [
        { bucket: "Current", value: 4087 },
        { bucket: "1-30 DPD", value: 386 },
        { bucket: "31-60 DPD", value: 243 },
        { bucket: "61-90 DPD", value: 139 },
        { bucket: "91-180 DPD", value: 79 },
        { bucket: "180+ DPD", value: 20 },
      ],
    },
  },
  creditQuality: {
    gnpa: 3.42, nnpa: 1.87, par30: 6.21,
    par60: 4.18, par90: 3.42, pcr: 68.4,
    writeOff: 0.92, creditCost: 2.1,
  },
  profitability: {
    nim: 8.4, roa: 2.8, roe: 18.2,
    costOfFunds: 9.2, yield: 17.6, spread: 8.4,
  },
  collections: {
    efficiency: 96.8, resolution: 72.4,
    rollback: 34.2, contactability: 88.6,
    firstBounce: 8.2, ptp: 64.3,
    ptpHonored: 71.8, fieldEff: 82.4,
  },
  collectionsMonthly: [
    { month: "Feb", disbursal: 320, femi: 7.8, currentPOS: 2850, bucketX: 185, bucket1: 98, bucket2: 54, bucket3: 42, contactability: 87.5 },
    { month: "Mar", disbursal: 420, femi: 8.2, currentPOS: 3120, bucketX: 205, bucket1: 112, bucket2: 62, bucket3: 48, contactability: 88.1 },
    { month: "Apr", disbursal: 380, femi: 7.5, currentPOS: 3340, bucketX: 198, bucket1: 105, bucket2: 58, bucket3: 45, contactability: 88.8 },
    { month: "May", disbursal: 510, femi: 8.5, currentPOS: 3680, bucketX: 242, bucket1: 128, bucket2: 71, bucket3: 52, contactability: 89.2 },
    { month: "Jun", disbursal: 480, femi: 8.1, currentPOS: 3920, bucketX: 235, bucket1: 121, bucket2: 68, bucket3: 49, contactability: 88.9 },
    { month: "Jul", disbursal: 560, femi: 8.7, currentPOS: 4180, bucketX: 268, bucket1: 142, bucket2: 78, bucket3: 58, contactability: 88.4 },
    { month: "Aug", disbursal: 620, femi: 9.1, currentPOS: 4520, bucketX: 295, bucket1: 158, bucket2: 87, bucket3: 64, contactability: 87.9 },
    { month: "Sep", disbursal: 580, femi: 8.4, currentPOS: 4680, bucketX: 278, bucket1: 148, bucket2: 82, bucket3: 61, contactability: 88.6 },
    { month: "Oct", disbursal: 640, femi: 8.9, currentPOS: 4850, bucketX: 305, bucket1: 162, bucket2: 89, bucket3: 66, contactability: 88.2 },
    { month: "Nov", disbursal: 710, femi: 9.3, currentPOS: 5120, bucketX: 332, bucket1: 176, bucket2: 97, bucket3: 72, contactability: 87.8 },
    { month: "Dec", disbursal: 680, femi: 8.6, currentPOS: 5280, bucketX: 318, bucket1: 169, bucket2: 93, bucket3: 69, contactability: 88.5 },
    { month: "Jan", disbursal: 750, femi: 9.0, currentPOS: 5480, bucketX: 348, bucket1: 184, bucket2: 102, bucket3: 76, contactability: 88.3 },
  ],
  creditQualityCustomQuery: [
    { disbursement_month: "2023-01-01", loans: 1620, users: 1305, disbursed_value_cr: 21.59, disbursed_value: 215930324, m: [0.00, 0.26, 0.47, 0.63, 0.78, 1.12, 1.33, 1.47, 1.58, 2.04, 2.11, 2.58, 3.03, 3.29, 3.48, 3.54, 3.56, 3.79, 3.89, 4.14, 4.41, 4.38, 4.63, 4.88, 4.99, 5.20, 5.26, 5.36, 5.50, 5.50, 5.52, 5.57, 5.52, 5.57, 5.56, 5.73] },
    { disbursement_month: "2023-02-01", loans: 2211, users: 1745, disbursed_value_cr: 27.38, disbursed_value: 273791890.65, m: buildVintageCurve(0.10, 0.15) },
    { disbursement_month: "2023-03-01", loans: 2727, users: 2151, disbursed_value_cr: 30.51, disbursed_value: 305122421, m: buildVintageCurve(0.23, 0.16) },
    { disbursement_month: "2023-04-01", loans: 3920, users: 3026, disbursed_value_cr: 44.25, disbursed_value: 442488748, m: buildVintageCurve(0.38, 0.14) },
    { disbursement_month: "2023-05-01", loans: 4779, users: 3643, disbursed_value_cr: 48.22, disbursed_value: 482211575, m: buildVintageCurve(0.23, 0.145) },
    { disbursement_month: "2023-06-01", loans: 5893, users: 4415, disbursed_value_cr: 54.14, disbursed_value: 541359728, m: buildVintageCurve(0.21, 0.14) },
  ],
  creditQualitySummaryMonthly: [
    { month: "Jan", disbursalAmount: 750, femi: 9.0, firstEmi30Plus: 4.8, nonStarterPct: 2.3 },
    { month: "Feb", disbursalAmount: 320, femi: 7.8, firstEmi30Plus: 4.1, nonStarterPct: 1.8 },
    { month: "Mar", disbursalAmount: 420, femi: 8.2, firstEmi30Plus: 4.3, nonStarterPct: 1.9 },
    { month: "Apr", disbursalAmount: 380, femi: 7.5, firstEmi30Plus: 4.0, nonStarterPct: 1.7 },
    { month: "May", disbursalAmount: 510, femi: 8.5, firstEmi30Plus: 4.6, nonStarterPct: 2.0 },
    { month: "Jun", disbursalAmount: 480, femi: 8.1, firstEmi30Plus: 4.4, nonStarterPct: 1.9 },
    { month: "Jul", disbursalAmount: 560, femi: 8.7, firstEmi30Plus: 4.9, nonStarterPct: 2.1 },
    { month: "Aug", disbursalAmount: 620, femi: 9.1, firstEmi30Plus: 5.2, nonStarterPct: 2.4 },
    { month: "Sep", disbursalAmount: 580, femi: 8.4, firstEmi30Plus: 4.8, nonStarterPct: 2.2 },
    { month: "Oct", disbursalAmount: 640, femi: 8.9, firstEmi30Plus: 5.1, nonStarterPct: 2.3 },
    { month: "Nov", disbursalAmount: 710, femi: 9.3, firstEmi30Plus: 5.4, nonStarterPct: 2.5 },
    { month: "Dec", disbursalAmount: 680, femi: 8.6, firstEmi30Plus: 5.0, nonStarterPct: 2.2 },
  ],
  creditQualityPosMonthly: [
    { month: "Jan", currentPOS: 5480, currentBucket: 4770, bucketX: 348, bucket1: 184, bucket2: 102, bucket3: 76 },
    { month: "Feb", currentPOS: 2850, currentBucket: 2465, bucketX: 185, bucket1: 98, bucket2: 54, bucket3: 42 },
    { month: "Mar", currentPOS: 3120, currentBucket: 2693, bucketX: 205, bucket1: 112, bucket2: 62, bucket3: 48 },
    { month: "Apr", currentPOS: 3340, currentBucket: 2934, bucketX: 198, bucket1: 105, bucket2: 58, bucket3: 45 },
    { month: "May", currentPOS: 3680, currentBucket: 3187, bucketX: 242, bucket1: 128, bucket2: 71, bucket3: 52 },
    { month: "Jun", currentPOS: 3920, currentBucket: 3447, bucketX: 235, bucket1: 121, bucket2: 68, bucket3: 49 },
    { month: "Jul", currentPOS: 4180, currentBucket: 3634, bucketX: 268, bucket1: 142, bucket2: 78, bucket3: 58 },
    { month: "Aug", currentPOS: 4520, currentBucket: 3916, bucketX: 295, bucket1: 158, bucket2: 87, bucket3: 64 },
    { month: "Sep", currentPOS: 4680, currentBucket: 4111, bucketX: 278, bucket1: 148, bucket2: 82, bucket3: 61 },
    { month: "Oct", currentPOS: 4850, currentBucket: 4228, bucketX: 305, bucket1: 162, bucket2: 89, bucket3: 66 },
    { month: "Nov", currentPOS: 5120, currentBucket: 4443, bucketX: 332, bucket1: 176, bucket2: 97, bucket3: 72 },
    { month: "Dec", currentPOS: 5280, currentBucket: 4631, bucketX: 318, bucket1: 169, bucket2: 93, bucket3: 69 },
  ],
  collectionSummaryTable: [
    { appScore: "1. Total", disbursedCount: "12,827", disbursedCountShare: "12827 (100%)", disbursedAmountShare: "263.7 (100%)", ats: "206k", averageCreditLimit: "317k", averageCreditUtilisation: "64.9%", averageRoi: "17.3", averageTenure: "34.7", currentOsCount: "9,851", currentOsAmount: "190 (100%)", currentOsAverageRoi: "14.9" },
    { appScore: "2. 0-1", disbursedCount: "907", disbursedCountShare: "907 (7.1%)", disbursedAmountShare: "20.2 (7.7%)", ats: "223k", averageCreditLimit: "389k", averageCreditUtilisation: "57.3%", averageRoi: "16", averageTenure: "33.7", currentOsCount: "594", currentOsAmount: "12 (6.6%)", currentOsAverageRoi: "12.6" },
    { appScore: "3. 1-2", disbursedCount: "1,987", disbursedCountShare: "1987 (15.5%)", disbursedAmountShare: "46.2 (17.5%)", ats: "232k", averageCreditLimit: "368k", averageCreditUtilisation: "63.1%", averageRoi: "16.2", averageTenure: "35.3", currentOsCount: "1,447", currentOsAmount: "32 (16.7%)", currentOsAverageRoi: "13.4" },
    { appScore: "4. 2-3", disbursedCount: "1,603", disbursedCountShare: "1603 (12.5%)", disbursedAmountShare: "35.4 (13.4%)", ats: "221k", averageCreditLimit: "342k", averageCreditUtilisation: "64.7%", averageRoi: "16.9", averageTenure: "34.5", currentOsCount: "1,230", currentOsAmount: "25 (13.3%)", currentOsAverageRoi: "14.5" },
    { appScore: "5. 3-5", disbursedCount: "2,712", disbursedCountShare: "2712 (21.1%)", disbursedAmountShare: "56 (21.2%)", ats: "207k", averageCreditLimit: "315k", averageCreditUtilisation: "65.6%", averageRoi: "17.4", averageTenure: "35.1", currentOsCount: "2,133", currentOsAmount: "42 (21.9%)", currentOsAverageRoi: "15.5" },
    { appScore: "6. 5-7", disbursedCount: "1,939", disbursedCountShare: "1939 (15.1%)", disbursedAmountShare: "39.6 (15%)", ats: "204k", averageCreditLimit: "303k", averageCreditUtilisation: "67.4%", averageRoi: "17.7", averageTenure: "34.8", currentOsCount: "1,521", currentOsAmount: "29 (15.2%)", currentOsAverageRoi: "15.4" },
    { appScore: "7. 7-10", disbursedCount: "1,675", disbursedCountShare: "1675 (13.1%)", disbursedAmountShare: "31 (11.7%)", ats: "185k", averageCreditLimit: "279k", averageCreditUtilisation: "66.2%", averageRoi: "18", averageTenure: "34", currentOsCount: "1,317", currentOsAmount: "23 (11.9%)", currentOsAverageRoi: "15.8" },
    { appScore: "8. >10", disbursedCount: "2,004", disbursedCountShare: "2004 (15.6%)", disbursedAmountShare: "35.3 (13.4%)", ats: "176k", averageCreditLimit: "261k", averageCreditUtilisation: "67.6%", averageRoi: "18.2", averageTenure: "34.6", currentOsCount: "1,609", currentOsAmount: "27 (14.3%)", currentOsAverageRoi: "16.5" },
  ],
  productMix: [
    { product: "Home Loans", aum: 1420, pct: 29.5, npa: 2.1 },
    { product: "Business Loans", aum: 980, pct: 20.3, npa: 4.2 },
    { product: "Personal Loans", aum: 760, pct: 15.8, npa: 5.8 },
    { product: "Two-Wheeler", aum: 640, pct: 13.3, npa: 3.9 },
    { product: "Gold Loans", aum: 520, pct: 10.8, npa: 1.4 },
    { product: "Microfinance", aum: 500, pct: 10.3, npa: 7.2 },
  ],
  agingBucket: [
    { bucket: "Current", pct: 86.1 },
    { bucket: "1-30 DPD", pct: 6.2 },
    { bucket: "31-60 DPD", pct: 3.7 },
    { bucket: "61-90 DPD", pct: 2.1 },
    { bucket: "91-180 DPD", pct: 1.3 },
    { bucket: "180+ DPD", pct: 0.6 },
  ],
  monthly: [320, 420, 380, 510, 480, 560, 620, 580, 640, 710, 680, 750],
  months: ["Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan"],
  monthlyAUM: [3200, 3420, 3680, 3890, 4120, 4280, 4350, 4480, 4620, 4720, 4780, 4820],
  monthlyAUMByLender: {
    CS: [1446.4, 1545.8, 1663.4, 1758.3, 1862.2, 1934.6, 1966.2, 2025.0, 2088.2, 2133.4, 2160.6, 2178.6],
    IDFC: [1049.6, 1121.8, 1207.0, 1275.9, 1351.4, 1403.8, 1426.8, 1469.4, 1515.4, 1548.2, 1567.8, 1581.0],
  },
  monthlyROI: [16.8, 17.0, 17.2, 17.3, 17.5, 17.6, 17.6, 17.7, 17.6, 17.6, 17.5, 17.6],
  lenderMix: [
    { lender: "CS (CreditSaison)", share: 45.2 },
    { lender: "IDFC", share: 32.8 },
    { lender: "LTF", share: 15.4 },
    { lender: "Others", share: 6.6 },
  ],
  newVsRepeat: [
    { month: "Feb", new: 180, repeat: 140 },
    { month: "Mar", new: 240, repeat: 180 },
    { month: "Apr", new: 210, repeat: 170 },
    { month: "May", new: 290, repeat: 220 },
    { month: "Jun", new: 270, repeat: 210 },
    { month: "Jul", new: 310, repeat: 250 },
    { month: "Aug", new: 350, repeat: 270 },
    { month: "Sep", new: 320, repeat: 260 },
    { month: "Oct", new: 360, repeat: 280 },
    { month: "Nov", new: 400, repeat: 310 },
    { month: "Dec", new: 380, repeat: 300 },
    { month: "Jan", new: 420, repeat: 330 },
  ],
  userWhitelistedByLender: [
    { lender: "Total", users: 58240 },
    { lender: "CS", users: 26390 },
    { lender: "IDFC", users: 19120 },
    { lender: "LTF", users: 8970 },
    { lender: "Others", users: 3760 },
  ],
  liquidity: {
    car: 19.4, tier1: 16.2, lcr: 142,
    debtEquity: 4.8, borrowingCost: 9.2,
    bankLines: 42.6, ncd: 38.2, ecb: 10.8, cp: 8.4,
  },
  callingFeedback: [
    { userId: "U100231", agent: "Ritika Sharma", calledAt: "2026-02-10 11:12", response: "PTP", timesCalled: 2, maxDpd: 41, amountOverdue: 0.38, totalOutstanding: 2.14 },
    { userId: "U100498", agent: "Vikas Mehta", calledAt: "2026-02-10 12:46", response: "RNR", timesCalled: 3, maxDpd: 58, amountOverdue: 0.62, totalOutstanding: 3.71 },
    { userId: "U100774", agent: "Aman Verma", calledAt: "2026-02-10 14:09", response: "Paid", timesCalled: 1, maxDpd: 24, amountOverdue: 0.19, totalOutstanding: 1.62 },
    { userId: "U101023", agent: "Ritika Sharma", calledAt: "2026-02-10 16:31", response: "PTP", timesCalled: 4, maxDpd: 73, amountOverdue: 0.91, totalOutstanding: 4.86 },
    { userId: "U101447", agent: "Neha Soni", calledAt: "2026-02-11 10:03", response: "RNR", timesCalled: 2, maxDpd: 35, amountOverdue: 0.44, totalOutstanding: 2.58 },
    { userId: "U101908", agent: "Vikas Mehta", calledAt: "2026-02-11 11:28", response: "Paid", timesCalled: 1, maxDpd: 19, amountOverdue: 0.12, totalOutstanding: 1.27 },
  ],
  userLevelCollections: [
    { userId: "U100231", timesCalled: 2, maxDpd: 41, amountOverdue: 0.38, totalOutstanding: 2.14, lastAgentCalled: "Ritika Sharma", callDateTime: "2026-02-10 11:12", userResponse: "PTP" },
    { userId: "U100498", timesCalled: 3, maxDpd: 58, amountOverdue: 0.62, totalOutstanding: 3.71, lastAgentCalled: "Vikas Mehta", callDateTime: "2026-02-10 12:46", userResponse: "RNR" },
    { userId: "U100774", timesCalled: 1, maxDpd: 24, amountOverdue: 0.19, totalOutstanding: 1.62, lastAgentCalled: "Aman Verma", callDateTime: "2026-02-10 14:09", userResponse: "Paid" },
    { userId: "U101023", timesCalled: 4, maxDpd: 73, amountOverdue: 0.91, totalOutstanding: 4.86, lastAgentCalled: "Ritika Sharma", callDateTime: "2026-02-10 16:31", userResponse: "PTP" },
  ],
  agentPerformance: [
    { agentName: "Ritika Sharma", casesGiven: 124, usersConnected: 91, amountRecovered: 1.94 },
    { agentName: "Vikas Mehta", casesGiven: 108, usersConnected: 76, amountRecovered: 1.41 },
    { agentName: "Aman Verma", casesGiven: 96, usersConnected: 63, amountRecovered: 1.09 },
    { agentName: "Neha Soni", casesGiven: 88, usersConnected: 58, amountRecovered: 0.94 },
  ],
  fieldAgencyCollectionsPerformance: [
    { city: "Mumbai", agencyName: "Aegis Recoveries", dpdBucket: "31-60", casesShared: 215, amountGivenToBeCollected: 3.42, amountCollected: 2.16 },
    { city: "Delhi", agencyName: "Urban Collect", dpdBucket: "61-90", casesShared: 178, amountGivenToBeCollected: 2.96, amountCollected: 1.68 },
    { city: "Bengaluru", agencyName: "Swift Resolve", dpdBucket: "1-30", casesShared: 142, amountGivenToBeCollected: 2.18, amountCollected: 1.41 },
    { city: "Pune", agencyName: "Prime Field Ops", dpdBucket: "90+", casesShared: 101, amountGivenToBeCollected: 1.37, amountCollected: 0.72 },
  ],
  panelVisibility: {
    kpiCards: true, disbursementChart: true, productMix: true,
    agingBucket: true, creditQuality: true,
    collections: true, liquidity: true, callingFeedback: true,
  },
  selectedLender: "ALL",
};

const LS_DATA_KEY = "nbfc_dashboard_data_v9";
const LS_THEME_KEY = "nbfc_dashboard_theme_v2";

function lsGet(key) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; }
}
function lsSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ─── THEMES ─────────────────────────────────────────────────────────────────
// New beautiful "Aurora" theme added as default
const THEMES = {
  aurora: {
    bg: "#060B14",
    card: "#0D1525",
    border: "#1C2A40",
    text: "#EDF2F9",
    subtext: "#8CA0BC",
    accent: "#10E8C4",
    accent2: "#4F8EF7",
    name: "Aurora",
    trackBg: "#1C2A40",
    headerBg: "#08101D",
    rowHover: "#101F33",
    tabActive: "#10E8C4",
    badgeGreen: "#0D3B2E",
    badgeGreenText: "#10E8C4",
  },
  dark: {
    bg: "#080E18", card: "#0C1624", border: "#1A2535", text: "#E5E9F0", subtext: "#6B7280",
    accent: "#00D4AA", accent2: "#3B82F6", name: "Dark Ocean", trackBg: "#1A2535",
    headerBg: "#060C14", rowHover: "#0F1E30", tabActive: "#00D4AA",
    badgeGreen: "#0A2E22", badgeGreenText: "#00D4AA",
  },
  midnight: {
    bg: "#0A0A14", card: "#12121E", border: "#1E1E32", text: "#E0E0F0", subtext: "#5A5A7A",
    accent: "#A78BFA", accent2: "#60A5FA", name: "Midnight Purple", trackBg: "#1E1E32",
    headerBg: "#07070F", rowHover: "#161628", tabActive: "#A78BFA",
    badgeGreen: "#1A1030", badgeGreenText: "#A78BFA",
  },
  slate: {
    bg: "#0F1117", card: "#161B22", border: "#21262D", text: "#E6EDF3", subtext: "#7D8590",
    accent: "#58A6FF", accent2: "#3FB950", name: "GitHub Slate", trackBg: "#21262D",
    headerBg: "#0C1017", rowHover: "#1B222C", tabActive: "#58A6FF",
    badgeGreen: "#0D2818", badgeGreenText: "#3FB950",
  },
  ember: {
    bg: "#0D0905", card: "#150F08", border: "#2A1F12", text: "#F5E6D0", subtext: "#8B7355",
    accent: "#F97316", accent2: "#EAB308", name: "Ember Gold", trackBg: "#2A1F12",
    headerBg: "#090703", rowHover: "#1D150A", tabActive: "#F97316",
    badgeGreen: "#1D1000", badgeGreenText: "#EAB308",
  },
  forest: {
    bg: "#050D0A", card: "#0A1610", border: "#14261E", text: "#D4EDDA", subtext: "#4A7C59",
    accent: "#22C55E", accent2: "#06B6D4", name: "Forest Green", trackBg: "#14261E",
    headerBg: "#030805", rowHover: "#0D1E14", tabActive: "#22C55E",
    badgeGreen: "#0A2010", badgeGreenText: "#22C55E",
  },
  indmoney: {
    bg: "#041512", card: "#0A221C", border: "#1A3B33", text: "#EAFBF6", subtext: "#8FB8AB",
    accent: "#FFD60A", accent2: "#D4A017", name: "INDmoney", trackBg: "#1A3B33",
    headerBg: "#020E0C", rowHover: "#0C2820", tabActive: "#FFD60A",
    badgeGreen: "#0A2010", badgeGreenText: "#FFD60A",
  },
};

const COLLECTIONS_SUMMARY_MONTHS = [
  { label: "May 25", date: "2025-05-01" },
  { label: "Jun 25", date: "2025-06-01" },
  { label: "Jul 25", date: "2025-07-01" },
  { label: "Aug 25", date: "2025-08-01" },
  { label: "Sep 25", date: "2025-09-01" },
  { label: "Oct 25", date: "2025-10-01" },
  { label: "Nov 25", date: "2025-11-01" },
  { label: "Dec 25", date: "2025-12-01" },
  { label: "Jan 26", date: "2026-01-01" },
];

const ROLLBACK_ROLLFORWARD_NO_DPD_ROWS = [
  { srNo: "1", label: "1. Month Start user count", values: ["558 (100%)", "1536 (100%)", "2359 (100%)", "3217 (100%)", "3947 (100%)", "4732 (100%)", "5481 (100%)", "6156 (100%)", "6770 (100%)"] },
  { srNo: "2", label: "3. Stable", values: ["539 (96.6%)", "1484 (96.6%)", "2285 (96.9%)", "3102 (96.4%)", "3813 (96.6%)", "4612 (97.5%)", "5296 (96.6%)", "6007 (97.6%)", "6571 (97.1%)"] },
  { srNo: "3", label: "4. Roll forward", values: ["19 (3.4%)", "52 (3.4%)", "74 (3.1%)", "115 (3.6%)", "134 (3.4%)", "120 (2.5%)", "185 (3.4%)", "149 (2.4%)", "199 (2.9%)"] },
];

const ROLLBACK_ROLLFORWARD_DPD_1_30_ROWS = [
  { srNo: "1", label: "1. Month Start user count", values: ["7 (100%)", "58 (100%)", "90 (100%)", "125 (100%)", "167 (100%)", "222 (100%)", "201 (100%)", "288 (100%)", "251 (100%)"] },
  { srNo: "2", label: "2a. Roll back no DPD", values: ["6 (85.7%)", "39 (67.2%)", "57 (63.3%)", "84 (67.2%)", "96 (57.5%)", "143 (64.4%)", "99 (49.3%)", "160 (55.6%)", "124 (49.4%)"] },
  { srNo: "3", label: "4. Roll forward", values: ["1 (14.3%)", "5 (8.6%)", "5 (5.6%)", "12 (9.6%)", "16 (9.6%)", "15 (6.8%)", "14 (7%)", "33 (11.5%)", "26 (10.4%)"] },
  { srNo: "4", label: "3. Stable", values: ["(%)", "14 (24.1%)", "28 (31.1%)", "29 (23.2%)", "55 (32.9%)", "64 (28.8%)", "88 (43.8%)", "95 (33%)", "101 (40.2%)"] },
];

const CREDIT_QUALITY_DPD_SUMMARY_COLUMNS = [
  "App Score", "Disbursed Count", "Femi Default %", "Femi Default Value %",
  "DPD0 Default %", "DPD0 Default Value %", "DPD30 Default %", "DPD30 Default Value %",
  "DPD60 Default %", "DPD60 Default Value %", "DPD90 Default %", "DPD90 Default Value %",
];

const CREDIT_QUALITY_DPD_SUMMARY_ROWS = [
  ["1. Total", "12,789", "2.54%", "1.96%", "10.93%", "8.91%", "1.75%", "1.47%", "1.06%", "0.92%", "0.79%", "0.72%"],
  ["2. 0-1", "905", "1.08%", "1.09%", "6.34%", "6.08%", "0.12%", "0.05%", "0.00%", "0.00%", "0.00%", "0.00%"],
  ["3. 1-2", "1,979", "1.84%", "1.76%", "8.32%", "7.42%", "1.23%", "1.33%", "0.84%", "0.84%", "0.61%", "0.64%"],
  ["4. 2-3", "1,600", "2.37%", "1.91%", "10.17%", "8.34%", "1.11%", "0.97%", "0.56%", "0.52%", "0.42%", "0.34%"],
  ["5. 3-5", "2,704", "2.65%", "2.00%", "11.62%", "9.81%", "1.88%", "1.73%", "1.10%", "0.95%", "0.90%", "0.80%"],
  ["6. 5-7", "1,937", "2.68%", "1.78%", "11.63%", "8.97%", "1.77%", "1.28%", "1.20%", "0.69%", "0.80%", "0.56%"],
  ["7. 7-10", "1,669", "3.41%", "2.90%", "13.59%", "11.51%", "2.56%", "2.14%", "1.51%", "1.64%", "1.05%", "1.13%"],
  ["8. >10", "1,995", "3.05%", "2.10%", "12.38%", "9.32%", "2.67%", "2.17%", "1.61%", "1.52%", "1.28%", "1.35%"],
];

const COLLECTIONS_DPD_SUMMARY_TABLES = [
  {
    title: "DPD Summary — Pincode / City",
    subtitle: "Pincode/city-wise default percentages",
    rows: [
      ["1. Total", "12,789", "2.54%", "1.96%", "10.93%", "8.91%", "1.75%", "1.47%", "1.06%", "0.92%", "0.79%", "0.72%"],
      ["2. Metro", "4,462", "1.82%", "1.51%", "8.12%", "6.84%", "1.05%", "0.91%", "0.62%", "0.58%", "0.44%", "0.40%"],
      ["3. Tier-1", "3,208", "2.31%", "1.79%", "10.31%", "8.44%", "1.56%", "1.31%", "0.93%", "0.79%", "0.72%", "0.66%"],
      ["4. Tier-2", "2,647", "2.88%", "2.22%", "12.24%", "9.98%", "2.06%", "1.75%", "1.34%", "1.12%", "1.02%", "0.89%"],
      ["5. Tier-3 / Rural", "2,472", "3.36%", "2.71%", "14.41%", "11.63%", "2.51%", "2.08%", "1.72%", "1.38%", "1.31%", "1.14%"],
    ],
  },
  {
    title: "DPD Summary — Ticket Size",
    subtitle: "Ticket-size-wise default percentages",
    rows: [
      ["1. Total", "12,789", "2.54%", "1.96%", "10.93%", "8.91%", "1.75%", "1.47%", "1.06%", "0.92%", "0.79%", "0.72%"],
      ["2. <₹25K", "2,184", "3.22%", "2.66%", "13.92%", "11.21%", "2.68%", "2.23%", "1.84%", "1.52%", "1.42%", "1.23%"],
      ["3. ₹25K-₹50K", "4,361", "2.74%", "2.18%", "11.74%", "9.58%", "1.96%", "1.65%", "1.18%", "1.03%", "0.88%", "0.79%"],
      ["4. ₹50K-₹100K", "3,990", "2.19%", "1.67%", "9.75%", "7.92%", "1.42%", "1.19%", "0.81%", "0.72%", "0.59%", "0.55%"],
      ["5. >₹100K", "2,254", "1.73%", "1.28%", "7.48%", "6.24%", "0.94%", "0.83%", "0.54%", "0.48%", "0.36%", "0.31%"],
    ],
  },
  {
    title: "DPD Summary — Age",
    subtitle: "Age-wise default percentages",
    rows: [
      ["1. Total", "12,789", "2.54%", "1.96%", "10.93%", "8.91%", "1.75%", "1.47%", "1.06%", "0.92%", "0.79%", "0.72%"],
      ["2. 18-25", "2,907", "3.41%", "2.72%", "14.37%", "11.64%", "2.63%", "2.21%", "1.78%", "1.44%", "1.29%", "1.11%"],
      ["3. 26-35", "4,880", "2.64%", "2.03%", "11.12%", "9.02%", "1.79%", "1.49%", "1.07%", "0.92%", "0.78%", "0.70%"],
      ["4. 36-45", "2,841", "2.21%", "1.71%", "9.41%", "7.71%", "1.42%", "1.18%", "0.85%", "0.71%", "0.61%", "0.53%"],
      ["5. 46+", "2,161", "2.08%", "1.58%", "8.95%", "7.26%", "1.33%", "1.10%", "0.78%", "0.64%", "0.57%", "0.49%"],
    ],
  },
  {
    title: "DPD Summary — Tenure",
    subtitle: "Tenure-wise default percentages",
    rows: [
      ["1. Total", "12,789", "2.54%", "1.96%", "10.93%", "8.91%", "1.75%", "1.47%", "1.06%", "0.92%", "0.79%", "0.72%"],
      ["2. <=6M", "3,508", "3.12%", "2.51%", "13.24%", "10.71%", "2.29%", "1.91%", "1.58%", "1.28%", "1.15%", "1.00%"],
      ["3. 7-12M", "4,732", "2.71%", "2.09%", "11.36%", "9.24%", "1.86%", "1.57%", "1.11%", "0.95%", "0.80%", "0.73%"],
      ["4. 13-18M", "2,621", "2.19%", "1.66%", "9.62%", "7.86%", "1.41%", "1.16%", "0.79%", "0.67%", "0.56%", "0.51%"],
      ["5. >18M", "1,928", "1.94%", "1.47%", "8.46%", "6.87%", "1.18%", "0.99%", "0.69%", "0.57%", "0.48%", "0.43%"],
    ],
  },
  {
    title: "DPD Summary — Vintage",
    subtitle: "Vintage-wise default percentages",
    rows: [
      ["1. Total", "12,789", "2.54%", "1.96%", "10.93%", "8.91%", "1.75%", "1.47%", "1.06%", "0.92%", "0.79%", "0.72%"],
      ["2. 0-3M", "2,490", "3.36%", "2.79%", "14.28%", "11.81%", "2.48%", "2.09%", "1.74%", "1.42%", "1.31%", "1.13%"],
      ["3. 4-6M", "3,117", "2.84%", "2.21%", "11.86%", "9.64%", "1.97%", "1.66%", "1.19%", "1.01%", "0.88%", "0.81%"],
      ["4. 7-12M", "3,826", "2.41%", "1.82%", "10.14%", "8.23%", "1.58%", "1.34%", "0.92%", "0.79%", "0.66%", "0.58%"],
      ["5. >12M", "3,356", "1.89%", "1.40%", "8.12%", "6.63%", "1.04%", "0.88%", "0.57%", "0.48%", "0.39%", "0.35%"],
    ],
  },
  {
    title: "DPD Summary — MF AUM",
    subtitle: "MF AUM-wise default percentages",
    rows: [
      ["1. Total", "12,789", "2.54%", "1.96%", "10.93%", "8.91%", "1.75%", "1.47%", "1.06%", "0.92%", "0.79%", "0.72%"],
      ["2. <₹50K", "3,632", "3.18%", "2.55%", "13.46%", "10.95%", "2.32%", "1.96%", "1.62%", "1.30%", "1.20%", "1.02%"],
      ["3. ₹50K-₹2L", "4,145", "2.68%", "2.07%", "11.33%", "9.17%", "1.84%", "1.55%", "1.09%", "0.95%", "0.79%", "0.73%"],
      ["4. ₹2L-₹5L", "2,887", "2.17%", "1.67%", "9.44%", "7.70%", "1.36%", "1.13%", "0.79%", "0.67%", "0.55%", "0.50%"],
      ["5. >₹5L", "2,125", "1.71%", "1.25%", "7.19%", "5.88%", "0.89%", "0.75%", "0.50%", "0.44%", "0.34%", "0.30%"],
    ],
  },
];

// ─── EDITABLE VALUE ──────────────────────────────────────────────────────────
function EditableValue({ value, onChange, prefix = "", suffix = "", fontSize = 26, color = "#fff" }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const ref = useRef(null);
  useEffect(() => { if (editing && ref.current) ref.current.focus(); }, [editing]);
  const commit = () => {
    const n = parseFloat(draft);
    if (!isNaN(n)) onChange(n);
    setEditing(false);
  };
  if (editing) return (
    <input ref={ref} value={draft} onChange={e => setDraft(e.target.value)}
      onBlur={commit} onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); }}
      style={{ fontSize, fontWeight: 800, color, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 6, padding: "2px 6px", width: Math.max(60, String(draft).length * (fontSize * 0.62)), outline: "none" }} />
  );
  return (
    <span onClick={() => { setDraft(String(value)); setEditing(true); }} title="Click to edit"
      style={{ cursor: "text", borderBottom: "1px dashed rgba(255,255,255,0.2)", paddingBottom: 1 }}>
      {prefix}{typeof value === "number" ? (Number.isInteger(value) ? value.toLocaleString() : value.toFixed(1)) : value}{suffix}
    </span>
  );
}

// ─── EDITABLE TEXT ───────────────────────────────────────────────────────────
function EditableText({ value, onChange, style = {} }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef(null);
  useEffect(() => { if (editing && ref.current) ref.current.focus(); }, [editing]);
  const commit = () => { if (draft.trim()) onChange(draft.trim()); setEditing(false); };
  if (editing) return (
    <input ref={ref} value={draft} onChange={e => setDraft(e.target.value)} onBlur={commit}
      onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); }}
      style={{ background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.35)", color: "inherit", fontSize: "inherit", fontWeight: "inherit", outline: "none", width: "100%", ...style }} />
  );
  return (
    <span onClick={() => { setDraft(value); setEditing(true); }}
      style={{ cursor: "text", borderBottom: "1px dashed rgba(255,255,255,0.12)", ...style }}>
      {value}
    </span>
  );
}

// ─── PANEL ───────────────────────────────────────────────────────────────────
function Panel({ title, subtitle, children, theme, onHide, style = {} }) {
  return (
    <div style={{
      background: theme.card,
      borderRadius: 16,
      padding: "20px 22px",
      border: `1px solid ${theme.border}`,
      position: "relative",
      boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
      ...style
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: theme.text, letterSpacing: "-0.2px" }}>{title}</div>
          {subtitle && <div style={{ fontSize: 11, color: theme.subtext, marginTop: 3, lineHeight: 1.4 }}>{subtitle}</div>}
        </div>
        {onHide && (
          <button onClick={onHide} style={{ background: "none", border: "none", cursor: "pointer", color: theme.subtext, fontSize: 14, padding: "0 2px", opacity: 0.6 }}>✕</button>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── TABLE HELPERS ────────────────────────────────────────────────────────────
const Th = ({ children, theme, style = {} }) => (
  <th style={{
    padding: "14px 16px",
    textAlign: "left",
    color: theme.subtext,
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    whiteSpace: "nowrap",
    background: theme.headerBg || theme.bg,
    borderBottom: `1px solid ${theme.border}`,
    ...style
  }}>{children}</th>
);

const Td = ({ children, theme, bold, style = {} }) => (
  <td style={{
    padding: "14px 16px",
    color: bold ? theme.text : theme.subtext,
    fontWeight: bold ? 600 : 400,
    fontSize: 13,
    whiteSpace: "nowrap",
    borderBottom: `1px solid ${theme.border}`,
    ...style
  }}>{children}</td>
);

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function App() {
  const [data, setData] = useState(null);
  const [themeName, setThemeName] = useState("aurora");
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dueDateTopView, setDueDateTopView] = useState("value");

  const theme = THEMES[themeName];

  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
    * { box-sizing: border-box; }
    body { margin: 0; }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.18); }
    tr:hover td { background: rgba(255,255,255,0.018) !important; }
  `;

  useEffect(() => {
    const saved = lsGet(LS_DATA_KEY);
    const hydratedData = saved ? { ...DEFAULT_DATA, ...saved, userWhitelistedByLender: saved.userWhitelistedByLender || DEFAULT_DATA.userWhitelistedByLender } : DEFAULT_DATA;
    setData(hydratedData);
    const savedTheme = lsGet(LS_THEME_KEY);
    if (savedTheme && THEMES[savedTheme]) setThemeName(savedTheme);
  }, []);

  const save = useCallback((d) => {
    lsSet(LS_DATA_KEY, d);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }, []);

  const update = useCallback((path, value) => {
    setData(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) {
        const arrayMatch = keys[i].match(/^(\w+)\[(\d+)\]$/);
        if (arrayMatch) obj = obj[arrayMatch[1]][parseInt(arrayMatch[2])];
        else obj = obj[keys[i]];
      }
      const lastKey = keys[keys.length - 1];
      const lastMatch = lastKey.match(/^(\w+)\[(\d+)\]$/);
      if (lastMatch) obj[lastMatch[1]][parseInt(lastMatch[2])] = value;
      else obj[lastKey] = value;
      save(next);
      return next;
    });
  }, [save]);

  const updateTheme = (t) => { setThemeName(t); lsSet(LS_THEME_KEY, t); };
  const togglePanel = (key) => update(`panelVisibility.${key}`, !data.panelVisibility[key]);
  const resetAll = () => { setData(DEFAULT_DATA); lsSet(LS_DATA_KEY, DEFAULT_DATA); };
  const growthColor = (v) => v >= 0 ? theme.accent : "#EF4444";

  if (!data) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#060B14", color: "#8CA0BC", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 10 }}>⏳</div>
        <div style={{ fontSize: 14 }}>Loading dashboard…</div>
      </div>
    </div>
  );

  const pv = data.panelVisibility;
  const creditQualityRows = data.creditQualityCustomQuery || DEFAULT_DATA.creditQualityCustomQuery || [];
  const monthOrder = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const creditQualitySummaryRows = data.creditQualitySummaryMonthly || DEFAULT_DATA.creditQualitySummaryMonthly || [];
  const creditQualityPosRows = data.creditQualityPosMonthly || DEFAULT_DATA.creditQualityPosMonthly || [];
  const summaryByMonth = monthOrder.map((m) => creditQualitySummaryRows.find((r) => r.month === m) || {});
  const posByMonth = monthOrder.map((m) => creditQualityPosRows.find((r) => r.month === m) || {});
  const collectionSummaryRows = data.collectionSummaryTable || DEFAULT_DATA.collectionSummaryTable || [];
  const callingFeedbackRows = data.callingFeedback || DEFAULT_DATA.callingFeedback || [];
  const userLevelCollectionRows = data.userLevelCollections || DEFAULT_DATA.userLevelCollections || [];
  const agentPerformanceRows = data.agentPerformance || DEFAULT_DATA.agentPerformance || [];
  const fieldAgencyRows = data.fieldAgencyCollectionsPerformance || DEFAULT_DATA.fieldAgencyCollectionsPerformance || [];
  const collectionsMonthlyRows = data.collectionsMonthly || DEFAULT_DATA.collectionsMonthly || [];
  const selectedLenderData = data.lenderData[data.selectedLender] || {};
  const toPctRows = (rows = []) => {
    const total = rows.reduce((sum, row) => sum + (Number(row.value) || 0), 0);
    return rows.map((row) => ({
      ...row,
      value: total > 0 ? ((Number(row.value) || 0) / total) * 100 : 0,
    }));
  };
  const agingBucketVolumePctRows = toPctRows(selectedLenderData.agingBucketVolumeCr || []);
  const agingBucketCountPctRows = toPctRows(selectedLenderData.agingBucketValueCount || []);
  const collectionBucketTrendPct = collectionsMonthlyRows.map((row, idx) => ({
    month: row.month,
    bucketX: Math.max(0, Math.min(100, 90 + ((idx % 3) - 1) * 1.5)),
    bucket1: Math.max(0, Math.min(100, 60 + ((idx % 3) - 1) * 1.2)),
    bucket2: Math.max(0, Math.min(100, 30 + ((idx % 3) - 1) * 1.0)),
    bucket3: Math.max(0, Math.min(100, 10 + ((idx % 3) - 1) * 0.8)),
  }));
  const userWhitelistedRows = data.userWhitelistedByLender || DEFAULT_DATA.userWhitelistedByLender || [];
  const NAV_TABS = ["Overview", "Credit Quality", "Collections", "Due Date Monitoring", "Agent Performance", "Field Agency", "Calling Feedback"];

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif", background: theme.bg, minHeight: "100vh", color: theme.text }}>
      <style>{globalStyles}</style>

      {/* ── HEADER ── */}
      <div style={{
        padding: "0 24px",
        borderBottom: `1px solid ${theme.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 10,
        position: "sticky", top: 0,
        background: theme.headerBg || theme.bg,
        zIndex: 100,
        height: 60,
        backdropFilter: "blur(12px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* Logo mark */}
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: `linear-gradient(135deg, ${theme.accent}22, ${theme.accent2}44)`,
            border: `1px solid ${theme.accent}44`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 15, fontWeight: 900, color: theme.accent,
          }}>N</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: "-0.4px", color: theme.text }}>
              <EditableText value={data.meta.companyName} onChange={v => update("meta.companyName", v)} />
            </div>
            <div style={{ fontSize: 10, color: theme.subtext, letterSpacing: "0.09em", textTransform: "uppercase", marginTop: 1 }}>
              Lending Intelligence · <EditableText value={data.meta.reportDate} onChange={v => update("meta.reportDate", v)} style={{ fontSize: 10 }} />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {saved && (
            <span style={{ fontSize: 11, color: theme.accent, background: `${theme.accent}18`, padding: "5px 12px", borderRadius: 20, fontWeight: 600 }}>✓ Saved</span>
          )}
          <button onClick={() => setEditMode(e => !e)} style={{
            padding: "7px 14px", borderRadius: 8, fontSize: 11, fontWeight: 700, border: `1px solid ${editMode ? theme.accent + "80" : theme.border}`,
            cursor: "pointer", background: editMode ? `${theme.accent}18` : "transparent", color: editMode ? theme.accent : theme.subtext, transition: "all .2s",
          }}>✏️ {editMode ? "Editing ON" : "Edit"}</button>
          <button onClick={() => setShowSettings(s => !s)} style={{
            padding: "7px 14px", borderRadius: 8, fontSize: 11, fontWeight: 700, border: `1px solid ${theme.border}`,
            cursor: "pointer", background: showSettings ? `${theme.accent2}18` : "transparent", color: theme.subtext,
          }}>⚙️ Settings</button>
          <button onClick={resetAll} style={{
            padding: "7px 14px", borderRadius: 8, fontSize: 11, fontWeight: 700, border: `1px solid ${theme.border}`,
            cursor: "pointer", background: "transparent", color: theme.subtext,
          }}>↺ Reset</button>
        </div>
      </div>

      {/* ── EDIT BANNER ── */}
      {editMode && (
        <div style={{ background: `${theme.accent}12`, borderBottom: `1px solid ${theme.accent}30`, padding: "8px 24px", fontSize: 11, color: theme.accent }}>
          ✏️ <strong>Edit Mode Active</strong> — Click any number or label to edit it. Changes auto-save to localStorage.
        </div>
      )}

      {/* ── SETTINGS ── */}
      {showSettings && (
        <div style={{ background: theme.card, borderBottom: `1px solid ${theme.border}`, padding: "18px 24px" }}>
          <div style={{ display: "flex", gap: 36, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: theme.subtext, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Color Theme</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {Object.entries(THEMES).map(([key, t]) => (
                  <button key={key} onClick={() => updateTheme(key)} style={{
                    padding: "7px 14px", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer",
                    border: themeName === key ? `2px solid ${t.accent}` : `1px solid ${theme.border}`,
                    background: t.bg, color: t.text, transition: "all 0.15s",
                  }}>
                    <span style={{ color: t.accent }}>●</span> {t.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: theme.subtext, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Panels</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {Object.entries(pv).filter(([key]) => !["productMix", "liquidity"].includes(key)).map(([key, vis]) => (
                  <button key={key} onClick={() => togglePanel(key)} style={{
                    padding: "5px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer",
                    border: `1px solid ${theme.border}`, background: vis ? `${theme.accent}18` : "transparent", color: vis ? theme.accent : theme.subtext,
                  }}>
                    {vis ? "✓" : "○"} {key.replace(/([A-Z])/g, " $1").trim()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "20px 20px 40px" }}>

        {/* ── TAB BAR ── */}
        <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${theme.border}`, marginBottom: 22, overflowX: "auto" }}>
          {NAV_TABS.map((tab, i) => (
            <button key={i} onClick={() => setActiveTab(i)} style={{
              padding: "11px 20px", fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer",
              background: "transparent", whiteSpace: "nowrap",
              color: activeTab === i ? theme.accent : theme.subtext,
              borderBottom: activeTab === i ? `2px solid ${theme.accent}` : "2px solid transparent",
              transition: "all 0.15s",
              letterSpacing: "0.01em",
            }}>{tab}</button>
          ))}
        </div>

        {/* ════════════════════════════════════════
            TAB 0 — OVERVIEW
        ════════════════════════════════════════ */}
        {activeTab === 0 && (
          <div>
            {/* KPI Cards */}
            {pv.kpiCards && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14, marginBottom: 20 }}>
                {[
                  { label: "Total AUM", field: "portfolio.totalAUM", gField: "portfolio.totalAUMGrowth", icon: "🏦", color: theme.accent, pfx: "₹", sfx: " Cr" },
                  { label: "Monthly Disbursal", field: "portfolio.disbursed", gField: "portfolio.disbursedGrowth", icon: "💸", color: theme.accent2, pfx: "₹", sfx: " Cr" },
                  { label: "Outstanding", field: "portfolio.outstanding", gField: "portfolio.outstandingGrowth", icon: "📊", color: "#A78BFA", pfx: "₹", sfx: " Cr" },
                  { label: "Active Accounts", field: "portfolio.activeLoans", gField: "portfolio.activeLoansGrowth", icon: "👥", color: "#FBBF24", pfx: "", sfx: "", noDecimal: true },
                ].map((k, i) => {
                  const val = k.field.split(".").reduce((o, p) => o[p], data);
                  const growth = k.gField.split(".").reduce((o, p) => o[p], data);
                  return (
                    <div key={i} style={{
                      background: theme.card,
                      borderRadius: 16,
                      padding: "22px 22px 18px",
                      border: `1px solid ${theme.border}`,
                      borderTop: `3px solid ${k.color}`,
                      boxShadow: `0 8px 32px rgba(0,0,0,0.2), 0 0 0 0 ${k.color}`,
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                        <div style={{ fontSize: 10, color: theme.subtext, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, lineHeight: 1.4 }}>{k.label}</div>
                        <div style={{ fontSize: 20, opacity: 0.9 }}>{k.icon}</div>
                      </div>
                      <div style={{ fontSize: 28, fontWeight: 800, color: k.color, marginBottom: 6, letterSpacing: "-0.5px" }}>
                        {k.pfx}
                        <EditableValue value={k.noDecimal ? Math.round(val) : val} onChange={v => update(k.field, v)} fontSize={24} color={k.color} />
                        {k.sfx}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <span style={{ fontSize: 11, color: growthColor(growth), fontWeight: 600 }}>{growth >= 0 ? "▲" : "▼"}</span>
                        <span style={{ fontSize: 12, color: growthColor(growth), fontWeight: 600 }}>
                          <EditableValue value={Math.abs(growth)} onChange={v => update(k.gField, v)} fontSize={12} color={growthColor(growth)} suffix="% YoY" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Charts Row 1 */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              {[
                { title: "Monthly AUM Trend", subtitle: "Last 12 months — ₹ Crores", dataKey: "monthlyAUM", updateKey: "monthlyAUM" },
                { title: "Monthly Disbursement", subtitle: "Last 12 months — ₹ Crores", dataKey: "monthly", updateKey: "monthly" },
              ].map(({ title, subtitle, dataKey, updateKey }) => {
                const series = data[dataKey];
                const max = Math.max(...series);
                return (
                  <Panel key={title} title={title} subtitle={subtitle} theme={theme}>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 220, paddingBottom: 24, position: "relative" }}>
                      {series.map((v, i) => {
                        const h = Math.max(6, (v / max) * 175);
                        const last = i === series.length - 1;
                        return (
                          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <div style={{ fontSize: 11, color: theme.text, marginBottom: 4, fontFamily: "'JetBrains Mono', monospace" }}>
                              {v >= 1000 ? `${(v/1000).toFixed(1)}k` : v}
                            </div>
                            <div style={{
                              width: "80%", height: h,
                              background: last
                                ? `linear-gradient(180deg, ${theme.accent}, ${theme.accent}88)`
                                : `linear-gradient(180deg, ${theme.accent2}60, ${theme.accent2}20)`,
                              borderRadius: "4px 4px 0 0",
                              minHeight: 4,
                              transition: "height 0.4s ease",
                            }} />
                            <div style={{ fontSize: 7.5, color: theme.subtext, marginTop: 4, position: "absolute", bottom: 0 }}></div>
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: -16 }}>
                      {data.months.map((m, i) => (
                        <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 10, color: theme.subtext }}>{m}</div>
                      ))}
                    </div>
                  </Panel>
                );
              })}
            </div>

            {/* Lender AUM */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              {[{ key: "CS", label: "CS (CreditSaison)" }, { key: "IDFC", label: "IDFC" }].map(({ key, label }) => {
                const series = data.monthlyAUMByLender?.[key] || [];
                const max = Math.max(...(series.length ? series : [1]));
                return (
                  <Panel key={key} title={`${label} — AUM Trend`} subtitle="Month-wise ₹ Crores" theme={theme}>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 220, paddingBottom: 24 }}>
                      {data.months.map((month, i) => {
                        const value = series[i] ?? 0;
                        const h = Math.max(6, (value / max) * 175);
                        const last = i === data.months.length - 1;
                        return (
                          <div key={`${key}-${i}`} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <div style={{ fontSize: 11, color: theme.text, marginBottom: 4, fontFamily: "'JetBrains Mono', monospace" }}>
                              {value >= 1000 ? `${(value/1000).toFixed(1)}k` : value}
                            </div>
                            <div style={{
                              width: "80%", height: h,
                              background: last
                                ? `linear-gradient(180deg, ${theme.accent}, ${theme.accent}77)`
                                : `linear-gradient(180deg, ${theme.accent2}55, ${theme.accent2}18)`,
                              borderRadius: "4px 4px 0 0", minHeight: 4,
                            }} />
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      {data.months.map((m, i) => <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 10, color: theme.subtext }}>{m}</div>)}
                    </div>
                  </Panel>
                );
              })}
            </div>

            {/* Lender Mix + New vs Repeat + Whitelisted */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <Panel title="Lender-wise Disbursal amount" subtitle="Month-wise stacked contribution" theme={theme}>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 220 }}>
                  {data.monthly.map((total, mi) => {
                    const maxTotal = Math.max(...data.monthly);
                    const h = (total / maxTotal) * 175;
                    const clrs = [theme.accent, theme.accent2, "#FBBF24", "#EF4444", "#A78BFA"];
                    return (
                      <div key={mi} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ fontSize: 11, color: theme.text, marginBottom: 4 }}>₹{total}</div>
                        <div style={{ width: "88%", height: h, display: "flex", flexDirection: "column-reverse", borderRadius: "4px 4px 0 0", overflow: "hidden", background: theme.border }}>
                          {data.lenderMix.map((l, li) => (
                            <div key={li} title={`${l.lender}: ${(total * l.share / 100).toFixed(1)} Cr`} style={{ height: `${l.share}%`, background: clrs[li % clrs.length] }} />
                          ))}
                        </div>
                        <div style={{ fontSize: 10, color: theme.subtext, marginTop: 5 }}>{data.months[mi]}</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
                  {data.lenderMix.map((p, i) => {
                    const clrs = [theme.accent, theme.accent2, "#FBBF24", "#EF4444", "#A78BFA"];
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <div style={{ width: 8, height: 8, borderRadius: 2, background: clrs[i % clrs.length] }} />
                        <span style={{ fontSize: 10, color: theme.subtext }}>
                          <EditableText value={p.lender} onChange={v => update(`lenderMix[${i}].lender`, v)} style={{ fontSize: 10 }} />
                        </span>
                        <span style={{ fontSize: 10, color: theme.text, fontFamily: "'JetBrains Mono', monospace" }}>
                          (<EditableValue value={p.share} onChange={v => update(`lenderMix[${i}].share`, v)} fontSize={10} color={theme.text} suffix="%" />)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Panel>

              <Panel title="New vs Repeat Disbursals" subtitle="Monthly customer acquisition breakdown" theme={theme}>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 220 }}>
                  {data.newVsRepeat.map((d, i) => {
                    const total = d.new + d.repeat;
                    const maxTotal = Math.max(...data.newVsRepeat.map(x => x.new + x.repeat));
                    const h = (total / maxTotal) * 175;
                    return (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ fontSize: 11, color: theme.text, marginBottom: 4 }}>{total}</div>
                        <div style={{ width: "88%", height: h, display: "flex", flexDirection: "column-reverse", borderRadius: "4px 4px 0 0", overflow: "hidden" }}>
                          <div style={{ height: `${(d.repeat/total)*100}%`, background: theme.accent2 }} />
                          <div style={{ height: `${(d.new/total)*100}%`, background: theme.accent }} />
                        </div>
                        <div style={{ fontSize: 10, color: theme.subtext, marginTop: 5 }}>{d.month}</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: "flex", gap: 14, marginTop: 14, justifyContent: "center", fontSize: 11 }}>
                  {[{ label: "New", color: theme.accent }, { label: "Repeat", color: theme.accent2 }].map(({ label, color }) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 10, height: 10, background: color, borderRadius: 3 }} />
                      <span style={{ color: theme.subtext }}>{label} Customers</span>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel title="Users Whitelisted by Lender" subtitle="Total users — lender-wise breakdown" theme={theme}>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 220 }}>
                  {(() => {
                    const maxUsers = Math.max(...data.userWhitelistedByLender.map(x => x.users), 1);
                    return data.userWhitelistedByLender.map((entry, i) => {
                      const h = Math.max(8, (entry.users / maxUsers) * 175);
                      const clrs = [theme.accent, theme.accent2, "#FBBF24", "#A78BFA", "#EF4444"];
                      return (
                        <div key={`${entry.lender}-${i}`} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                          <div style={{ fontSize: 10, color: theme.text, marginBottom: 5, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
                            {entry.users.toLocaleString()}
                          </div>
                          <div style={{ width: "75%", height: h, borderRadius: "5px 5px 0 0", background: `linear-gradient(180deg, ${clrs[i % clrs.length]}, ${clrs[i % clrs.length]}77)`, minHeight: 8 }} />
                          <div style={{ fontSize: 9, color: theme.subtext, marginTop: 6, textAlign: "center" }}>
                            <EditableText value={entry.lender} onChange={v => update(`userWhitelistedByLender[${i}].lender`, v)} style={{ fontSize: 9 }} />
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </Panel>

              {/* ROI Trend */}
              <Panel title="Average ROI Trend" subtitle="Monthly ROI progression (%)" theme={theme}>
                <div style={{ height: 180, position: "relative" }}>
                  <svg width="100%" height="180" viewBox="0 0 360 160" style={{ overflow: "visible" }}>
                    <defs>
                      <linearGradient id="roiGrad2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={theme.accent} stopOpacity="0.25" />
                        <stop offset="100%" stopColor={theme.accent} stopOpacity="0.02" />
                      </linearGradient>
                    </defs>
                    {(() => {
                      const min = Math.min(...data.monthlyROI);
                      const max = Math.max(...data.monthlyROI);
                      const range = max - min || 1;
                      const pts = data.monthlyROI.map((v, i) =>
                        `${(i / (data.monthlyROI.length - 1)) * 340 + 10},${140 - ((v - min) / range) * 120}`
                      ).join(" ");
                      const area = `10,140 ${pts} 350,140`;
                      return (
                        <>
                          <polygon points={area} fill="url(#roiGrad2)" />
                          <polyline points={pts} fill="none" stroke={theme.accent} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                          {data.monthlyROI.map((v, i) => {
                            const x = (i / (data.monthlyROI.length - 1)) * 340 + 10;
                            const y = 140 - ((v - min) / range) * 120;
                            return (
                              <g key={i}>
                                <circle cx={x} cy={y} r="4" fill={theme.accent} stroke={theme.card} strokeWidth="1.5" />
                                <text x={x} y={y - 10} textAnchor="middle" fill={theme.text} fontSize="10" fontWeight="600" fontFamily="JetBrains Mono, monospace">{v}%</text>
                              </g>
                            );
                          })}
                        </>
                      );
                    })()}
                  </svg>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  {data.months.map((m, i) => <span key={i} style={{ fontSize: 10, color: theme.subtext }}>{m}</span>)}
                </div>
                <div style={{ marginTop: 10, padding: "8px 14px", background: `${theme.accent}10`, borderRadius: 8, fontSize: 12, color: theme.text, textAlign: "center", border: `1px solid ${theme.accent}22` }}>
                  Current ROI: <strong style={{ color: theme.accent, fontFamily: "'JetBrains Mono', monospace" }}>{data.monthlyROI[data.monthlyROI.length - 1]}%</strong>
                </div>
              </Panel>
            </div>

            {/* Disbursal Mix Table */}
            <Panel title="Disbursal Mix by App Score" subtitle="App score-wise collections distribution" theme={theme} style={{ marginTop: 4 }}>
              <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${theme.border}` }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 1700 }}>
                  <thead>
                    <tr>
                      {["App Score","Disbursed Count","Disbursed Count Share","Disbursed Amount Share (₹ Cr)","ATS","Avg Credit Limit","Avg Credit Utilisation","Avg ROI","Avg Tenure","Current OS Count","Current OS Amount (₹ Cr)","Current OS Avg ROI"].map((h) => (
                        <Th key={h} theme={theme}>{h}</Th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {collectionSummaryRows.map((row, i) => (
                      <tr key={`${row.appScore}-${i}`}>
                        <Td theme={theme} bold>{row.appScore}</Td>
                        <Td theme={theme}>{row.disbursedCount}</Td>
                        <Td theme={theme}>{row.disbursedCountShare}</Td>
                        <Td theme={theme}>{row.disbursedAmountShare}</Td>
                        <Td theme={theme}>{row.ats}</Td>
                        <Td theme={theme}>{row.averageCreditLimit}</Td>
                        <Td theme={theme}>{row.averageCreditUtilisation}</Td>
                        <Td theme={theme}>{row.averageRoi}</Td>
                        <Td theme={theme}>{row.averageTenure}</Td>
                        <Td theme={theme}>{row.currentOsCount}</Td>
                        <Td theme={theme}>{row.currentOsAmount}</Td>
                        <Td theme={theme}>{row.currentOsAverageRoi}</Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>
        )}

        {/* ════════════════════════════════════════
            TAB 1 — CREDIT QUALITY
        ════════════════════════════════════════ */}
        {activeTab === 1 && pv.creditQuality && (
          <div>
            {/* Lender Filter */}
            <div style={{ marginBottom: 20, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, color: theme.subtext, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Filter by Lender:</span>
              <div style={{ position: "relative" }}>
                <select value={data.selectedLender} onChange={e => update("selectedLender", e.target.value)} style={{
                  padding: "9px 36px 9px 14px", borderRadius: 10, fontSize: 12, fontWeight: 600,
                  border: `1px solid ${theme.border}`, background: theme.card, color: theme.text,
                  cursor: "pointer", outline: "none", appearance: "none",
                }}>
                  <option value="ALL">All Lenders</option>
                  <option value="CS">CS (CreditSaison)</option>
                  <option value="IDFC">IDFC</option>
                  <option value="LTF">LTF</option>
                </select>
                <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: theme.subtext, fontSize: 10 }}>▼</div>
              </div>
              <div style={{ fontSize: 11, color: theme.accent, background: `${theme.accent}15`, padding: "7px 14px", borderRadius: 8, fontWeight: 600, border: `1px solid ${theme.accent}30` }}>
                Showing: {data.selectedLender === "ALL" ? "All Lenders" : data.selectedLender}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16, marginBottom: 16 }}>
              <DpdAgingView
                title="DPD Aging by Volume (%)"
                subtitle={`Lender: ${data.selectedLender === "ALL" ? "All" : data.selectedLender}`}
                rows={agingBucketVolumePctRows}
                valueFormatter={(value) => `${Number(value).toFixed(1)}%`}
                theme={theme}
              />
              <DpdAgingView
                title="DPD Aging by Count (%)"
                subtitle={`Lender: ${data.selectedLender === "ALL" ? "All" : data.selectedLender}`}
                rows={agingBucketCountPctRows}
                valueFormatter={(value) => `${Number(value).toFixed(1)}%`}
                theme={theme}
              />
            </div>
            <Panel title="POS Bucket Split" subtitle="Month-wise current POS and DPD bucket distribution" theme={theme} style={{ marginTop: 16 }}>
              <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${theme.border}` }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 1600 }}>
                  <thead>
                    <tr>
                      <Th theme={theme} style={{ position: "sticky", left: 0, zIndex: 2 }}>Metric</Th>
                      {monthOrder.map(m => <Th key={m} theme={theme}>{m}</Th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: "Current POS", key: "currentPOS" },
                      { label: "POS — No DPD (Current Bucket)", key: "currentBucket" },
                      { label: "POS — DPD 1-30 (Bucket X)", key: "bucketX" },
                      { label: "POS — DPD 31-60 (Bucket 1)", key: "bucket1" },
                      { label: "POS — DPD 61-90 (Bucket 2)", key: "bucket2" },
                      { label: "POS — DPD 90+ (Bucket 3)", key: "bucket3" },
                    ].map((metric) => (
                      <tr key={metric.key}>
                        <Td theme={theme} bold style={{ position: "sticky", left: 0, background: theme.card, zIndex: 1 }}>{metric.label}</Td>
                        {posByMonth.map((row, i) => (
                          <Td key={`${metric.key}-${monthOrder[i]}`} theme={theme} style={{ textAlign: "center" }}>
                            {typeof row[metric.key] === "number"
                              ? metric.key === "currentPOS"
                                ? row[metric.key].toLocaleString()
                                : `${((row[metric.key] / (row.currentPOS || 1)) * 100).toFixed(1)}%`
                              : "—"}
                          </Td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>


            <Panel title="Summary" subtitle="Month-wise disbursal and first EMI quality metrics" theme={theme} style={{ marginTop: 16 }}>
              <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${theme.border}` }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 1400 }}>
                  <thead>
                    <tr>
                      <Th theme={theme} style={{ position: "sticky", left: 0, zIndex: 2 }}>Metric</Th>
                      {monthOrder.map(m => <Th key={m} theme={theme}>{m}</Th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: "Disbursal Amount (Cr)", key: "disbursalAmount", suffix: "" },
                      { label: "FEMI", key: "femi", suffix: "%" },
                      { label: "First EMI 30+", key: "firstEmi30Plus", suffix: "%" },
                      { label: "Non Starter %", key: "nonStarterPct", suffix: "%" },
                    ].map((metric) => (
                      <tr key={metric.key}>
                        <Td theme={theme} bold style={{ position: "sticky", left: 0, background: theme.card, zIndex: 1 }}>{metric.label}</Td>
                        {summaryByMonth.map((row, i) => (
                          <Td key={`${metric.key}-${monthOrder[i]}`} theme={theme} style={{ textAlign: "center" }}>
                            {typeof row[metric.key] === "number" ? `${row[metric.key].toFixed(metric.suffix ? 1 : 0)}${metric.suffix}` : "—"}
                          </Td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>


            <Panel title="Custom Query View" subtitle="Credit quality vintage by disbursement month" theme={theme}>
              <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${theme.border}` }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 2600, fontSize: 11 }}>
                  <thead>
                    <tr>
                      {["disbursement_month","loans","users","disbursed_value_cr",...Array.from({ length: 36 }, (_, idx) => `m${idx+1}`)].map((h) => (
                        <Th key={h} theme={theme}>{h}</Th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {creditQualityRows.map((row, ri) => (
                      <tr key={`${row.disbursement_month || "row"}-${ri}`}>
                        <Td theme={theme} bold>{row.disbursement_month}</Td>
                        <Td theme={theme}>{row.loans.toLocaleString()}</Td>
                        <Td theme={theme}>{row.users.toLocaleString()}</Td>
                        <Td theme={theme}>{row.disbursed_value_cr.toFixed(2)}</Td>
                        {Array.from({ length: 36 }, (_, mi) => row.m?.[mi]).map((value, mi) => (
                          <Td key={mi} theme={theme}>{value || value === 0 ? Number(value).toFixed(2) : ""}</Td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>

            

            <Panel title="DPD Summary" subtitle="App score-wise default percentages" theme={theme} style={{ marginTop: 16 }}>
              <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${theme.border}` }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 1550 }}>
                  <thead>
                    <tr>
                      {CREDIT_QUALITY_DPD_SUMMARY_COLUMNS.map((col, idx) => (
                        <Th key={col} theme={theme} style={{ position: idx === 0 ? "sticky" : "static", left: idx === 0 ? 0 : undefined, zIndex: idx === 0 ? 2 : 1 }}>{col}</Th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {CREDIT_QUALITY_DPD_SUMMARY_ROWS.map((row, rowIdx) => (
                      <tr key={`dpd-summary-row-${rowIdx}`}>
                        {row.map((cell, cellIdx) => (
                          <Td key={`dpd-summary-cell-${rowIdx}-${cellIdx}`} theme={theme} bold={cellIdx === 0}
                            style={{ position: cellIdx === 0 ? "sticky" : "static", left: cellIdx === 0 ? 0 : undefined, background: cellIdx === 0 ? theme.card : "transparent", zIndex: cellIdx === 0 ? 1 : 0 }}>
                            {cell}
                          </Td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>

            {/* DPD Summary Views by Segment */}
            {COLLECTIONS_DPD_SUMMARY_TABLES.map(({ title, subtitle, rows }) => (
              <Panel key={title} title={title} subtitle={subtitle} theme={theme} style={{ marginTop: 16 }}>
                <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${theme.border}` }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 1550 }}>
                    <thead>
                      <tr>
                        {CREDIT_QUALITY_DPD_SUMMARY_COLUMNS.map((col, idx) => (
                          <Th key={`${title}-${col}`} theme={theme} style={{ position: idx === 0 ? "sticky" : "static", left: idx === 0 ? 0 : undefined, zIndex: idx === 0 ? 2 : 1 }}>{col}</Th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, rowIdx) => (
                        <tr key={`${title}-row-${rowIdx}`}>
                          {row.map((cell, cellIdx) => (
                            <Td
                              key={`${title}-cell-${rowIdx}-${cellIdx}`}
                              theme={theme}
                              bold={cellIdx === 0}
                              style={{ position: cellIdx === 0 ? "sticky" : "static", left: cellIdx === 0 ? 0 : undefined, background: cellIdx === 0 ? theme.card : "transparent", zIndex: cellIdx === 0 ? 1 : 0 }}
                            >
                              {cell}
                            </Td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Panel>
            ))}

            
          </div>
        )}

        {/* ════════════════════════════════════════
            TAB 2 — COLLECTIONS
        ════════════════════════════════════════ */}
        {activeTab === 2 && pv.collections && (
          <div>
            {/* Collection Funnel */}


            <Panel title="Collections Bucket Trend" subtitle="Bucket-wise month-on-month trend (%)" theme={theme} style={{ marginTop: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[
                  { label: "Bucket X — DPD 1-30", key: "bucketX", color: theme.accent },
                  { label: "Bucket 1 — DPD 31-60", key: "bucket1", color: theme.accent2 },
                  { label: "Bucket 2 — DPD 61-90", key: "bucket2", color: "#FBBF24" },
                  { label: "Bucket 3 — DPD 90+", key: "bucket3", color: "#EF4444" },
                ].map((cfg, ci) => {
                  const maxValue = Math.max(...collectionBucketTrendPct.map(r => r[cfg.key] || 0), 1);
                  return (
                    <div key={ci} style={{ background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 12, padding: "14px 14px 12px" }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: cfg.color, marginBottom: 10 }}>{cfg.label}</div>
                      <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 210 }}>
                        {collectionBucketTrendPct.map((row, i) => {
                          const pct = row[cfg.key] || 0;
                          const h = Math.max(8, (pct / maxValue) * 170);
                          return (
                            <div key={`${cfg.key}-${i}`} style={{ flex: 1, minWidth: 28, display: "flex", flexDirection: "column", alignItems: "center" }}>
                              <div style={{ fontSize: 8, color: theme.subtext, marginBottom: 3 }}>{pct.toFixed(1)}%</div>
                              <div title={`${row.month}: ${pct.toFixed(1)}%`} style={{
                                width: "80%", height: h,
                                background: `linear-gradient(180deg, ${cfg.color}, ${cfg.color}66)`,
                                borderRadius: "5px 5px 2px 2px",
                              }} />
                              <div style={{ fontSize: 10, color: theme.subtext, marginTop: 5 }}>{row.month}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Panel>

            
            {/* Bucket Trends */}
           
            {/* Collections Table */}
            <Panel title="Collections Month-wise Table" subtitle="Metrics vs Months" theme={theme} style={{ marginTop: 16 }}>
              <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${theme.border}` }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 1200 }}>
                  <thead>
                    <tr>
                      <Th theme={theme} style={{ position: "sticky", left: 0, zIndex: 10, borderRight: `1px solid ${theme.border}` }}>Metric</Th>
                      {data.collectionsMonthly.map((row, i) => (
                        <Th key={i} theme={theme}>
                          <EditableText value={row.month} onChange={v => update(`collectionsMonthly[${i}].month`, v)} style={{ fontSize: 11 }} />
                        </Th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: "Disbursal Amount", key: "disbursal", prefix: "₹", suffix: "" },
                      { label: "FEMI % (First Bounce)", key: "femi", prefix: "", suffix: "%" },
                      { label: "Current POS", key: "currentPOS", prefix: "₹", suffix: "" },
                      { label: "Bucket X (1-30 DPD)", key: "bucketX", prefix: "", suffix: "" },
                      { label: "Bucket 1 (31-60 DPD)", key: "bucket1", prefix: "", suffix: "" },
                      { label: "Bucket 2 (61-90 DPD)", key: "bucket2", prefix: "", suffix: "" },
                      { label: "Bucket 3 (90+ DPD)", key: "bucket3", prefix: "", suffix: "" },
                      { label: "Contactability", key: "contactability", prefix: "", suffix: "%" },
                    ].map((metric) => (
                      <tr key={metric.key}>
                        <Td theme={theme} bold style={{ position: "sticky", left: 0, background: theme.card, zIndex: 5, borderRight: `1px solid ${theme.border}` }}>{metric.label}</Td>
                        {data.collectionsMonthly.map((row, i) => (
                          <Td key={i} theme={theme} style={{ textAlign: "center" }}>
                            {metric.prefix}
                            <EditableValue value={row[metric.key]} onChange={v => update(`collectionsMonthly[${i}].${metric.key}`, v)} fontSize={12} color={theme.subtext} suffix={metric.suffix} />
                          </Td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>

            {/* DPD Summary Views by Segment */}
            {COLLECTIONS_DPD_SUMMARY_TABLES.map(({ title, subtitle, rows }) => (
              <Panel key={title} title={title} subtitle={subtitle} theme={theme} style={{ marginTop: 16 }}>
                <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${theme.border}` }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 1550 }}>
                    <thead>
                      <tr>
                        {CREDIT_QUALITY_DPD_SUMMARY_COLUMNS.map((col, idx) => (
                          <Th key={`${title}-${col}`} theme={theme} style={{ position: idx === 0 ? "sticky" : "static", left: idx === 0 ? 0 : undefined, zIndex: idx === 0 ? 2 : 1 }}>{col}</Th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, rowIdx) => (
                        <tr key={`${title}-row-${rowIdx}`}>
                          {row.map((cell, cellIdx) => (
                            <Td
                              key={`${title}-cell-${rowIdx}-${cellIdx}`}
                              theme={theme}
                              bold={cellIdx === 0}
                              style={{ position: cellIdx === 0 ? "sticky" : "static", left: cellIdx === 0 ? 0 : undefined, background: cellIdx === 0 ? theme.card : "transparent", zIndex: cellIdx === 0 ? 1 : 0 }}
                            >
                              {cell}
                            </Td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Panel>
            ))}




            {/* Rollback/Rollforward Tables */}
            {[
              { title: "Rollback / Rollforward — No DPD", rows: ROLLBACK_ROLLFORWARD_NO_DPD_ROWS },
              { title: "Rollback / Rollforward — DPD 1-30", rows: ROLLBACK_ROLLFORWARD_DPD_1_30_ROWS },
            ].map(({ title, rows }) => (
              <Panel key={title} title={title} subtitle="Reference table from shared snapshot" theme={theme} style={{ marginTop: 16 }}>
                <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${theme.border}` }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 1200 }}>
                    <thead>
                      <tr>
                        <Th theme={theme} style={{ width: 40 }}>#</Th>
                        <Th theme={theme} style={{ minWidth: 190 }}>Status</Th>
                        {COLLECTIONS_SUMMARY_MONTHS.map(month => (
                          <Th key={month.label} theme={theme} style={{ minWidth: 118 }}>
                            {month.label}<div style={{ fontSize: 9, fontWeight: 400, marginTop: 2, color: theme.subtext, textTransform: "none", letterSpacing: "normal" }}>{month.date}</div>
                          </Th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row) => (
                        <tr key={row.srNo}>
                          <Td theme={theme}>{row.srNo}</Td>
                          <Td theme={theme} bold>{row.label}</Td>
                          {row.values.map((value, idx) => (
                            <Td key={`${row.srNo}-${idx}`} theme={theme}>{value}</Td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Panel>
            ))}
          </div>
        )}
<Panel title="Collection Funnel" subtitle="5 monthly column charts across key funnel stages" theme={theme}>
              {(() => {
                const monthlyFunnel = collectionsMonthlyRows.map((row) => {
                  const totalDemand = Math.max(0, row.currentPOS || 0);
                  const contactable = Math.max(0, Math.min(totalDemand, totalDemand * (row.contactability || 0) / 100));
                  const ptpReceived = Math.max(0, Math.min(totalDemand, contactable * (data.collections.ptp || 0) / 100));
                  const ptpHonored = Math.max(0, Math.min(totalDemand, ptpReceived * (data.collections.ptpHonored || 0) / 100));
                  const finallyCollectedPct = Math.max(0, Math.min(100, (row.contactability || 0) - (row.femi || 0) * 1.35));
                  const finallyCollected = Math.max(0, Math.min(totalDemand, totalDemand * finallyCollectedPct / 100));
                  return { month: row.month, totalDemand, contactable, ptpReceived, ptpHonored, finallyCollected };
                });

                const charts = [
                  { label: "Total overdue users", key: "totalDemand", color: theme.accent2 },
                  { label: "Contactable", key: "contactable", color: "#FBBF24" },
                  { label: "PTP Received", key: "ptpReceived", color: "#A78BFA" },
                  { label: "PTP Honored", key: "ptpHonored", color: "#F97316" },
                  { label: "Finally Collected", key: "finallyCollected", color: theme.accent },
                ];

                return (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
                    {charts.map((chart) => {
                      const maxValue = Math.max(...monthlyFunnel.map(r => r[chart.key] || 0), 1);
                      return (
                        <div key={chart.key} style={{ background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 12, padding: "14px 14px 12px" }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: chart.color, marginBottom: 12 }}>{chart.label}</div>
                          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 220 }}>
                            {monthlyFunnel.map((row, i) => {
                              const value = row[chart.key] || 0;
                              const height = Math.max(8, (value / maxValue) * 175);
                              return (
                                <div key={`${chart.key}-${i}`} style={{ flex: 1, minWidth: 20, display: "flex", flexDirection: "column", alignItems: "center" }}>
                                  <div style={{ fontSize: 11, color: theme.text, marginBottom: 4, fontFamily: "'JetBrains Mono', monospace" }}>{Math.round(value / 1000 * 10) / 10}k</div>
                                  <div title={`${row.month}: ${Math.round(value).toLocaleString()}`} style={{
                                    width: "78%", height,
                                    background: `linear-gradient(180deg, ${chart.color}, ${chart.color}77)`,
                                    borderRadius: "5px 5px 2px 2px",
                                  }} />
                                  <div style={{ fontSize: 10, color: theme.subtext, marginTop: 5 }}>{row.month}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </Panel>


        {/* ════════════════════════════════════════
            TAB 3 — DUE DATE MONITORING
        ════════════════════════════════════════ */}
        {activeTab === 3 && (
          <div>
            <Panel title="Due Date Based Monitoring" subtitle="Month level collections and delinquency tracking" theme={theme}>
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                {[{ key: "value", label: "By Value" }, { key: "volume", label: "By Volume" }].map(opt => (
                  <button key={opt.key} onClick={() => setDueDateTopView(opt.key)} style={{
                    padding: "7px 16px", borderRadius: 8, fontSize: 11, fontWeight: 700, border: `1px solid ${theme.border}`,
                    cursor: "pointer", background: dueDateTopView === opt.key ? `${theme.accent}18` : "transparent",
                    color: dueDateTopView === opt.key ? theme.accent : theme.subtext,
                    transition: "all 0.15s",
                  }}>{opt.label}</button>
                ))}
              </div>
              <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${theme.border}` }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 1100 }}>
                  <thead>
                    <tr>
                      <Th theme={theme}>Month level collections ({dueDateTopView === "value" ? "By Value" : "By Volume"})</Th>
                      {DUE_DATE_MONTHS.map(month => <Th key={`due-month-${month}`} theme={theme}>{month}</Th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {DUE_DATE_COLLECTION_ROWS.map(label => (
                      <tr key={`due-row-${label}`}>
                        <Td theme={theme} bold>{label}</Td>
                        {DUE_DATE_MONTHS.map(month => (
                          <Td key={`due-cell-${label}-${month}`} theme={theme}>{formatDueDateCollectionCell(dueDateTopView, label, DUE_DATE_MONTHS.indexOf(month))}</Td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>

            <Panel title="Month Level Delinquency" subtitle="By Value" theme={theme} style={{ marginTop: 16 }}>
              <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${theme.border}` }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 1100 }}>
                  <thead>
                    <tr>
                      <Th theme={theme}>Metric</Th>
                      {DUE_DATE_MONTHS.map(month => <Th key={`delinq-month-${month}`} theme={theme}>{month}</Th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {DUE_DATE_DELINQUENCY_ROWS.map(label => (
                      <tr key={`delinq-row-${label}`}>
                        <Td theme={theme} bold>{label}</Td>
                        {DUE_DATE_MONTHS.map(month => (
                          <Td key={`delinq-cell-${label}-${month}`} theme={theme}>{DUE_DATE_DELINQUENCY_SAMPLE[label]?.[DUE_DATE_MONTHS.indexOf(month)] ?? "—"}</Td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>
        )}

        {/* ════════════════════════════════════════
            TAB 4 — AGENT PERFORMANCE
        ════════════════════════════════════════ */}
        {activeTab === 4 && (
          <div>
            <Panel title="Agent Performance" subtitle="Agent-wise collections performance overview" theme={theme}>
              <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${theme.border}` }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr>
                      {["Agent Name", "Cases Given", "Users Connected", "Amount Recovered (₹ Cr)"].map(h => (
                        <Th key={h} theme={theme}>{h}</Th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {agentPerformanceRows.map((row, i) => (
                      <tr key={`${row.agentName}-${i}`}>
                        <Td theme={theme} bold>{row.agentName}</Td>
                        <Td theme={theme}>{row.casesGiven}</Td>
                        <Td theme={theme}>{row.usersConnected}</Td>
                        <Td theme={theme}>{typeof row.amountRecovered === "number" ? row.amountRecovered.toFixed(2) : "—"}</Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>
        )}

        {/* ════════════════════════════════════════
            TAB 5 — FIELD AGENCY
        ════════════════════════════════════════ */}
        {activeTab === 5 && (
          <div>
            <Panel title="Field Agency Collections Performance" subtitle="City-wise field agency coverage and recovery" theme={theme}>
              <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${theme.border}` }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr>
                      {["City", "Agency Name", "DPD Bucket", "Cases Shared", "Amount to Collect (₹ Cr)", "Amount Collected (₹ Cr)"].map(h => (
                        <Th key={h} theme={theme}>{h}</Th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {fieldAgencyRows.map((row, i) => (
                      <tr key={`${row.city}-${i}`}>
                        <Td theme={theme} bold>{row.city}</Td>
                        <Td theme={theme}>{row.agencyName || "—"}</Td>
                        <Td theme={theme}>{row.dpdBucket || "—"}</Td>
                        <Td theme={theme}>{row.casesShared}</Td>
                        <Td theme={theme}>{typeof row.amountGivenToBeCollected === "number" ? row.amountGivenToBeCollected.toFixed(2) : "—"}</Td>
                        <Td theme={theme}>{typeof row.amountCollected === "number" ? row.amountCollected.toFixed(2) : "—"}</Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>
        )}

        {/* ════════════════════════════════════════
            TAB 6 — CALLING FEEDBACK
        ════════════════════════════════════════ */}
        {activeTab === 6 && (pv.callingFeedback ?? true) && (
          <div>
            {/* Summary Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, marginBottom: 20 }}>
              {[
                { label: "Total Calls", value: callingFeedbackRows.length, color: theme.accent2 },
                { label: "PTP", value: callingFeedbackRows.filter(r => r.response === "PTP").length, color: "#FBBF24" },
                { label: "Paid", value: callingFeedbackRows.filter(r => r.response === "Paid").length, color: theme.accent },
                { label: "RNR", value: callingFeedbackRows.filter(r => r.response === "RNR").length, color: "#EF4444" },
              ].map((k, i) => (
                <div key={i} style={{
                  background: theme.card, border: `1px solid ${k.color}30`, borderTop: `3px solid ${k.color}`,
                  borderRadius: 16, padding: "18px 20px",
                }}>
                  <div style={{ fontSize: 10, color: theme.subtext, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>{k.label}</div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: k.color, marginTop: 8, fontFamily: "'JetBrains Mono', monospace" }}>{k.value}</div>
                </div>
              ))}
            </div>

            <Panel title="Calling Feedback" subtitle="Agent-wise call outcomes and customer responses" theme={theme}>
              <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${theme.border}` }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr>
                      {["User ID", "Agent Called", "Date & Time", "Response", "Times Called", "Max DPD", "Amount Overdue (₹ Cr)", "Total O/S (₹ Cr)"].map(h => (
                        <Th key={h} theme={theme}>{h}</Th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {callingFeedbackRows.map((row, i) => {
                      const responseColor = row.response === "Paid" ? theme.accent : row.response === "PTP" ? "#FBBF24" : "#EF4444";
                      return (
                        <tr key={`${row.userId}-${i}`}>
                          <Td theme={theme} bold>{row.userId}</Td>
                          <Td theme={theme}>{row.agent}</Td>
                          <Td theme={theme}>{row.calledAt}</Td>
                          <td style={{ padding: "14px 16px", borderBottom: `1px solid ${theme.border}` }}>
                            <span style={{
                              background: `${responseColor}18`, color: responseColor,
                              padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                              border: `1px solid ${responseColor}30`,
                            }}>{row.response}</span>
                          </td>
                          <Td theme={theme}>{row.timesCalled ?? "—"}</Td>
                          <Td theme={theme}>{row.maxDpd ?? "—"}</Td>
                          <Td theme={theme}>{typeof row.amountOverdue === "number" ? row.amountOverdue.toFixed(2) : "—"}</Td>
                          <Td theme={theme}>{typeof row.totalOutstanding === "number" ? row.totalOutstanding.toFixed(2) : "—"}</Td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Panel>

            
          </div>
        )}

        {/* FOOTER */}
        <div style={{
          padding: "18px 0 6px",
          borderTop: `1px solid ${theme.border}`,
          marginTop: 28,
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10,
        }}>
          <div style={{ fontSize: 11, color: theme.subtext }}>
            © 2026 <EditableText value={data.meta.companyName} onChange={v => update("meta.companyName", v)} style={{ fontSize: 11, color: theme.subtext }} /> · All figures in ₹ Crores unless stated
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {["🟢 Live Data", "RBI Compliant", "IRAC Norms"].map(t => (
              <span key={t} style={{ fontSize: 10, color: theme.subtext, background: theme.card, padding: "4px 10px", borderRadius: 6, border: `1px solid ${theme.border}` }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
