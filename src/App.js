import React, { useState, useEffect, useCallback, useRef } from "react";

const buildVintageCurve = (start, growth) =>
  Array.from({ length: 36 }, (_, i) => Number((start + i * growth + Math.sin(i / 3) * 0.08).toFixed(2)));

const DPD_BUCKET_COLORS = ["#00D4AA", "#3B82F6", "#F59E0B", "#F97316", "#EF4444", "#7F1D1D"];

const DpdAgingView = ({ title, subtitle, rows, valueFormatter, theme }) => (
  <Panel title={title} subtitle={subtitle} theme={theme}>
    {rows.map((row, i) => {
      const barWidth = rows[0]?.value ? (row.value / rows[0].value) * 100 : 0;
      return (
        <div key={`${title}-${row.bucket}`} style={{ marginBottom:10 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
            <span style={{ fontSize:11, color: theme.subtext }}>{row.bucket}</span>
            <span style={{ fontSize:11, fontWeight:700, color: DPD_BUCKET_COLORS[i] }}>
              {valueFormatter(row.value)}
            </span>
          </div>
          <div style={{ background: theme.border, borderRadius:4, height:6, overflow:"hidden" }}>
            <div style={{ width:`${barWidth}%`, background: DPD_BUCKET_COLORS[i], height:"100%", borderRadius:4 }} />
          </div>
        </div>
      );
    })}
  </Panel>
);

// ─── DEFAULT DATA ────────────────────────────────────────────────────────────
const DEFAULT_DATA = {
  meta: { companyName: "INDmoney NBFC Ltd", reportDate: "Feb 2026" },
  portfolio: {
    totalAUM: 4820.5, totalAUMGrowth: 18.4,
    disbursed: 1240.2, disbursedGrowth: 22.1,
    outstanding: 3890.4, outstandingGrowth: 15.8,
    activeLoans: 24680, activeLoansGrowth: 12.3,
  },
  // Lender-specific breakdowns
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
    { product: "Home Loans",      aum: 1420, pct: 29.5, npa: 2.1 },
    { product: "Business Loans",  aum: 980,  pct: 20.3, npa: 4.2 },
    { product: "Personal Loans",  aum: 760,  pct: 15.8, npa: 5.8 },
    { product: "Two-Wheeler",     aum: 640,  pct: 13.3, npa: 3.9 },
    { product: "Gold Loans",      aum: 520,  pct: 10.8, npa: 1.4 },
    { product: "Microfinance",    aum: 500,  pct: 10.3, npa: 7.2 },
  ],
  agingBucket: [
    { bucket: "Current",     pct: 86.1 },
    { bucket: "1-30 DPD",   pct: 6.2  },
    { bucket: "31-60 DPD",  pct: 3.7  },
    { bucket: "61-90 DPD",  pct: 2.1  },
    { bucket: "91-180 DPD", pct: 1.3  },
    { bucket: "180+ DPD",   pct: 0.6  },
  ],
  monthly: [320, 420, 380, 510, 480, 560, 620, 580, 640, 710, 680, 750],
  months:  ["Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan"],
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
    { userId: "U100498", agent: "Vikas Mehta",   calledAt: "2026-02-10 12:46", response: "RNR", timesCalled: 3, maxDpd: 58, amountOverdue: 0.62, totalOutstanding: 3.71 },
    { userId: "U100774", agent: "Aman Verma",    calledAt: "2026-02-10 14:09", response: "Paid", timesCalled: 1, maxDpd: 24, amountOverdue: 0.19, totalOutstanding: 1.62 },
    { userId: "U101023", agent: "Ritika Sharma", calledAt: "2026-02-10 16:31", response: "PTP", timesCalled: 4, maxDpd: 73, amountOverdue: 0.91, totalOutstanding: 4.86 },
    { userId: "U101447", agent: "Neha Soni",     calledAt: "2026-02-11 10:03", response: "RNR", timesCalled: 2, maxDpd: 35, amountOverdue: 0.44, totalOutstanding: 2.58 },
    { userId: "U101908", agent: "Vikas Mehta",   calledAt: "2026-02-11 11:28", response: "Paid", timesCalled: 1, maxDpd: 19, amountOverdue: 0.12, totalOutstanding: 1.27 },
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
  selectedLender: "ALL", // ALL / CS / IDFC / LTF
};

// ─── localStorage HELPERS ────────────────────────────────────────────────────
const LS_DATA_KEY  = "nbfc_dashboard_data_v4";
const LS_THEME_KEY = "nbfc_dashboard_theme_v2";

function lsGet(key) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; }
  catch { return null; }
}
function lsSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ─── THEMES ──────────────────────────────────────────────────────────────────
const THEMES = {
  dark:     { bg:"#080E18", card:"#0C1624", border:"#1A2535", text:"#E5E9F0", subtext:"#6B7280", accent:"#00D4AA", accent2:"#3B82F6", name:"Dark Ocean"       },
  midnight: { bg:"#0A0A14", card:"#12121E", border:"#1E1E32", text:"#E0E0F0", subtext:"#5A5A7A", accent:"#A78BFA", accent2:"#60A5FA", name:"Midnight Purple"   },
  slate:    { bg:"#0F1117", card:"#161B22", border:"#21262D", text:"#E6EDF3", subtext:"#7D8590", accent:"#58A6FF", accent2:"#3FB950", name:"GitHub Slate"       },
  ember:    { bg:"#0D0905", card:"#150F08", border:"#2A1F12", text:"#F5E6D0", subtext:"#8B7355", accent:"#F97316", accent2:"#EAB308", name:"Ember Gold"         },
  forest:   { bg:"#050D0A", card:"#0A1610", border:"#14261E", text:"#D4EDDA", subtext:"#4A7C59", accent:"#22C55E", accent2:"#06B6D4", name:"Forest Green"       },
  indmoney: { bg:"#041512", card:"#0A221C", border:"#1A3B33", text:"#EAFBF6", subtext:"#8FB8AB", accent:"#FFD60A", accent2:"#D4A017", name:"INDmoney"           },
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
  "App Score",
  "Disbursed Count",
  "Femi Default Percent",
  "Femi Default Value Percent",
  "DPD0 Default Percent",
  "DPD0 Default Value Percent",
  "DPD30 Default Percent",
  "DPD30 Default Value Percent",
  "DPD60 Default Percent",
  "DPD60 Default Value Percent",
  "DPD90 Default Percent",
  "DPD90 Default Value Percent",
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

// ─── INLINE EDITABLE NUMBER ───────────────────────────────────────────────────
function EditableValue({ value, onChange, prefix="", suffix="", fontSize=26, color="#fff" }) {
  const [editing, setEditing] = useState(false);
  const [draft,   setDraft]   = useState(String(value));
  const ref = useRef(null);

  useEffect(() => { if (editing && ref.current) ref.current.focus(); }, [editing]);

  const commit = () => {
    const n = parseFloat(draft);
    if (!isNaN(n)) onChange(n);
    setEditing(false);
  };

  if (editing) return (
    <input
      ref={ref}
      value={draft}
      onChange={e => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); }}
      style={{
        fontSize, fontWeight: 800, color,
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.3)",
        borderRadius: 6, padding: "2px 6px",
        width: Math.max(60, String(draft).length * (fontSize * 0.62)),
        outline: "none",
      }}
    />
  );

  return (
    <span
      onClick={() => { setDraft(String(value)); setEditing(true); }}
      title="Click to edit"
      style={{ cursor: "text", borderBottom: "1px dashed rgba(255,255,255,0.25)", paddingBottom: 1 }}
    >
      {prefix}{typeof value === "number" ? (Number.isInteger(value) ? value.toLocaleString() : value.toFixed(1)) : value}{suffix}
    </span>
  );
}

// ─── INLINE EDITABLE TEXT ────────────────────────────────────────────────────
function EditableText({ value, onChange, style = {} }) {
  const [editing, setEditing] = useState(false);
  const [draft,   setDraft]   = useState(value);
  const ref = useRef(null);

  useEffect(() => { if (editing && ref.current) ref.current.focus(); }, [editing]);

  const commit = () => { if (draft.trim()) onChange(draft.trim()); setEditing(false); };

  if (editing) return (
    <input
      ref={ref} value={draft}
      onChange={e => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); }}
      style={{ background:"transparent", border:"none", borderBottom:"1px solid rgba(255,255,255,0.4)", color:"inherit", fontSize:"inherit", fontWeight:"inherit", outline:"none", width:"100%", ...style }}
    />
  );

  return (
    <span
      onClick={() => { setDraft(value); setEditing(true); }}
      style={{ cursor:"text", borderBottom:"1px dashed rgba(255,255,255,0.15)", ...style }}
    >
      {value}
    </span>
  );
}

// ─── DONUT CHART ─────────────────────────────────────────────────────────────
function Donut({ segments, size = 110, accent, accent2 }) {
  const clrs = [accent, accent2, "#F59E0B", "#EF4444", "#A855F7", "#EC4899"];
  const total = segments.reduce((a, b) => a + (b.value || 0), 0) || 1;
  const cx = size / 2, cy = size / 2, r = size / 2 - 10;
  let angle = -90;
  return (
    <svg width={size} height={size}>
      {segments.map((seg, i) => {
        const sweep = (seg.value / total) * 359.99;
        const x1 = cx + r * Math.cos((angle * Math.PI) / 180);
        const y1 = cy + r * Math.sin((angle * Math.PI) / 180);
        angle += sweep;
        const x2 = cx + r * Math.cos((angle * Math.PI) / 180);
        const y2 = cy + r * Math.sin((angle * Math.PI) / 180);
        return (
          <path
            key={i}
            d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${sweep > 180 ? 1 : 0} 1 ${x2},${y2}Z`}
            fill={clrs[i % clrs.length]}
            opacity={0.85}
          />
        );
      })}
      <circle cx={cx} cy={cy} r={r * 0.55} fill="#0F1923" />
    </svg>
  );
}

// ─── PANEL WRAPPER ────────────────────────────────────────────────────────────
function Panel({ title, subtitle, children, theme, onHide, style = {} }) {
  return (
    <div style={{ background: theme.card, borderRadius: 14, padding: 18, border: `1px solid ${theme.border}`, position: "relative", ...style }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: theme.text }}>{title}</div>
          {subtitle && <div style={{ fontSize: 10, color: theme.subtext, marginTop: 2 }}>{subtitle}</div>}
        </div>
        {onHide && (
          <button onClick={onHide} title="Hide panel" style={{ background:"none", border:"none", cursor:"pointer", color: theme.subtext, fontSize: 14, padding:"0 2px" }}>✕</button>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [data,        setData]        = useState(null);
  const [themeName,   setThemeName]   = useState("dark");
  const [activeTab,   setActiveTab]   = useState(0);
  const [editMode,    setEditMode]    = useState(false);
  const [showSettings,setShowSettings]= useState(false);
  const [saved,       setSaved]       = useState(false);

  const theme = THEMES[themeName];

  // ── Load from localStorage on mount ──
  useEffect(() => {
    const saved = lsGet(LS_DATA_KEY);
    const hydratedData = saved
      ? {
          ...DEFAULT_DATA,
          ...saved,
          userWhitelistedByLender: saved.userWhitelistedByLender || DEFAULT_DATA.userWhitelistedByLender,
        }
      : DEFAULT_DATA;
    setData(hydratedData);
    const savedTheme = lsGet(LS_THEME_KEY);
    if (savedTheme && THEMES[savedTheme]) setThemeName(savedTheme);
  }, []);

  // ── Save helper ──
  const save = useCallback((d) => {
    lsSet(LS_DATA_KEY, d);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }, []);

  // ── Deep update by dot-path ──
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
  const resetAll    = () => { setData(DEFAULT_DATA); lsSet(LS_DATA_KEY, DEFAULT_DATA); };
  const growthColor = (v) => v >= 0 ? theme.accent : "#EF4444";

  if (!data) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"#080E18", color:"#6B7280", fontFamily:"system-ui" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>⏳</div>
        <div>Loading dashboard…</div>
      </div>
    </div>
  );

  const pv   = data.panelVisibility;
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
  const userWhitelistedRows = data.userWhitelistedByLender || DEFAULT_DATA.userWhitelistedByLender || [];
  const NAV_TABS = ["Overview","Credit Quality","Collections","Agent Performance","Field agency collections performance","Calling feedback"];

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily:"'DM Sans','Segoe UI',sans-serif", background: theme.bg, minHeight:"100vh", color: theme.text }}>

      {/* ── HEADER ── */}
      <div style={{
        padding:"14px 20px", borderBottom:`1px solid ${theme.border}`,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        flexWrap:"wrap", gap:10, position:"sticky", top:0, background: theme.bg, zIndex:100,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:38, height:38, borderRadius:10, background:`linear-gradient(135deg,${theme.accent},${theme.accent2})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:900, color:"#fff" }}>N</div>
          <div>
            <div style={{ fontSize:16, fontWeight:800, letterSpacing:"-0.3px" }}>
              <EditableText value={data.meta.companyName} onChange={v => update("meta.companyName", v)} />
            </div>
            <div style={{ fontSize:10, color: theme.subtext, letterSpacing:"0.08em", textTransform:"uppercase" }}>
              Lending Intelligence •{" "}
              <EditableText value={data.meta.reportDate} onChange={v => update("meta.reportDate", v)} style={{ fontSize:10 }} />
            </div>
          </div>
        </div>

        <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
          {saved && <span style={{ fontSize:11, color: theme.accent, background: theme.accent+"22", padding:"4px 10px", borderRadius:6 }}>✓ Saved</span>}
          <button onClick={() => setEditMode(e => !e)} style={{ padding:"7px 14px", borderRadius:8, fontSize:12, fontWeight:700, border:"none", cursor:"pointer", background: editMode ? theme.accent : theme.card, color: editMode ? "#fff" : theme.subtext, transition:"all .2s" }}>
            ✏️ {editMode ? "Editing ON" : "Edit Mode"}
          </button>
          <button onClick={() => setShowSettings(s => !s)} style={{ padding:"7px 14px", borderRadius:8, fontSize:12, fontWeight:700, border:`1px solid ${theme.border}`, cursor:"pointer", background: showSettings ? theme.card : "transparent", color: theme.subtext }}>
            ⚙️ Settings
          </button>
          <button onClick={resetAll} style={{ padding:"7px 14px", borderRadius:8, fontSize:12, fontWeight:700, border:`1px solid ${theme.border}`, cursor:"pointer", background:"transparent", color: theme.subtext }}>
            ↺ Reset
          </button>
        </div>
      </div>

      {/* ── EDIT MODE BANNER ── */}
      {editMode && (
        <div style={{ background: theme.accent+"18", borderBottom:`1px solid ${theme.accent}44`, padding:"8px 20px", fontSize:11, color: theme.accent }}>
          ✏️ <strong>Edit Mode Active</strong> — Click any number or label to edit it. All changes auto-save to localStorage.
        </div>
      )}

      {/* ── SETTINGS DRAWER ── */}
      {showSettings && (
        <div style={{ background: theme.card, borderBottom:`1px solid ${theme.border}`, padding:"16px 20px" }}>
          <div style={{ display:"flex", gap:32, flexWrap:"wrap" }}>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color: theme.subtext, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Color Theme</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {Object.entries(THEMES).map(([key, t]) => (
                  <button key={key} onClick={() => updateTheme(key)} style={{ padding:"6px 12px", borderRadius:8, fontSize:11, fontWeight:600, cursor:"pointer", border: themeName === key ? `2px solid ${t.accent}` : `1px solid ${theme.border}`, background: t.bg, color: t.text }}>
                    <span style={{ color: t.accent }}>●</span> {t.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color: theme.subtext, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Panel Visibility</div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {Object.entries(pv).filter(([key]) => !["productMix", "liquidity"].includes(key)).map(([key, vis]) => (
                  <button key={key} onClick={() => togglePanel(key)} style={{ padding:"5px 12px", borderRadius:6, fontSize:11, fontWeight:600, cursor:"pointer", border:`1px solid ${theme.border}`, background: vis ? theme.accent+"22" : "transparent", color: vis ? theme.accent : theme.subtext }}>
                    {vis ? "✓" : "○"} {key.replace(/([A-Z])/g, " $1").trim()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth:1400, margin:"0 auto", padding:"16px 16px 32px" }}>

        {/* ── TAB BAR ── */}
        <div style={{ display:"flex", gap:0, borderBottom:`1px solid ${theme.border}`, marginBottom:18, overflowX:"auto" }}>
          {NAV_TABS.map((tab, i) => (
            <button key={i} onClick={() => setActiveTab(i)} style={{ padding:"10px 18px", fontSize:12, fontWeight:600, border:"none", cursor:"pointer", background:"transparent", whiteSpace:"nowrap", color: activeTab===i ? theme.accent : theme.subtext, borderBottom: activeTab===i ? `2px solid ${theme.accent}` : "2px solid transparent" }}>
              {tab}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════
            TAB 0 — OVERVIEW (UPDATED)
        ══════════════════════════════════════════════ */}
        {activeTab === 0 && (
          <div>
            {/* KPI Cards */}
            {pv.kpiCards && (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))", gap:12, marginBottom:16 }}>
                {[
                  { label:"Total AUM",         field:"portfolio.totalAUM",       gField:"portfolio.totalAUMGrowth",     icon:"🏦", color: theme.accent,  pfx:"₹", sfx:"Cr" },
                  { label:"Monthly Disburse",  field:"portfolio.disbursed",      gField:"portfolio.disbursedGrowth",    icon:"💸", color: theme.accent2, pfx:"₹", sfx:"Cr" },
                  { label:"Outstanding",       field:"portfolio.outstanding",    gField:"portfolio.outstandingGrowth",  icon:"📊", color:"#A855F7",       pfx:"₹", sfx:"Cr" },
                  { label:"Active Accounts",   field:"portfolio.activeLoans",    gField:"portfolio.activeLoansGrowth",  icon:"👥", color:"#F59E0B",       pfx:"",  sfx:"",  noDecimal:true },
                ].map((k, i) => {
                  const val    = k.field.split(".").reduce((o,p)=>o[p], data);
                  const growth = k.gField.split(".").reduce((o,p)=>o[p], data);
                  return (
                    <div key={i} style={{ background: theme.card, borderRadius:14, padding:"18px 20px", border:`1px solid ${k.color}22`, borderTop:`3px solid ${k.color}` }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                        <div style={{ fontSize:10, color: theme.subtext, textTransform:"uppercase", letterSpacing:"0.06em", fontWeight:600 }}>{k.label}</div>
                        <span style={{ fontSize:18 }}>{k.icon}</span>
                      </div>
                      <div style={{ fontSize:26, fontWeight:800, color: k.color, marginBottom:4 }}>
                        {k.pfx}
                        <EditableValue value={k.noDecimal ? Math.round(val) : val} onChange={v=>update(k.field,v)} fontSize={22} color={k.color} />
                        {k.sfx}
                      </div>
                      <div style={{ fontSize:12, color: growthColor(growth), display:"flex", alignItems:"center", gap:4 }}>
                        {growth>=0?"▲":"▼"}
                        <EditableValue value={Math.abs(growth)} onChange={v=>update(k.gField,v)} fontSize={12} color={growthColor(growth)} suffix="% YoY" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Row: Monthly AUM + Monthly Disbursement */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
              <Panel title="Monthly AUM Trend (₹ Cr)" subtitle="Last 12 months AUM progression" theme={theme}>
                <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:130 }}>
                  {data.monthlyAUM.map((v, i) => {
                    const max  = Math.max(...data.monthlyAUM);
                    const h    = (v / max) * 110;
                    const last = i === data.monthlyAUM.length - 1;
                    return (
                      <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center" }}>
                        <div style={{ fontSize:7, color: theme.subtext, marginBottom:2 }}>
                          <EditableValue value={v} onChange={val=>update(`monthlyAUM[${i}]`,val)} fontSize={7} color={theme.subtext} />
                        </div>
                        <div style={{ width:"90%", height: h, background: last ? `linear-gradient(0deg,${theme.accent},${theme.accent}88)` : `${theme.accent2}44`, borderRadius:"3px 3px 0 0", minHeight:4 }} />
                        <div style={{ fontSize:7, color: theme.subtext, marginTop:3 }}>{data.months[i]}</div>
                      </div>
                    );
                  })}
                </div>
              </Panel>

              <Panel title="Monthly Disbursement (₹ Cr)" subtitle="Last 12 months disbursement run-rate" theme={theme}>
                <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:130 }}>
                  {data.monthly.map((v, i) => {
                    const max  = Math.max(...data.monthly);
                    const h    = (v / max) * 110;
                    const last = i === data.monthly.length - 1;
                    return (
                      <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center" }}>
                        <div style={{ fontSize:7, color: theme.subtext, marginBottom:2 }}>
                          <EditableValue value={v} onChange={val=>update(`monthly[${i}]`,val)} fontSize={7} color={theme.subtext} />
                        </div>
                        <div style={{ width:"90%", height: h, background: last ? `linear-gradient(0deg,${theme.accent},${theme.accent}88)` : `${theme.accent2}44`, borderRadius:"3px 3px 0 0", minHeight:4 }} />
                        <div style={{ fontSize:7, color: theme.subtext, marginTop:3 }}>{data.months[i]}</div>
                      </div>
                    );
                  })}
                </div>
              </Panel>
            </div>

            {/* Row: Lender-wise AUM Trend */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
              {[{ key:"CS", label:"CS" }, { key:"IDFC", label:"IDFC" }].map(({ key, label }) => {
                const lenderSeries = data.monthlyAUMByLender?.[key] || [];
                const max = Math.max(...(lenderSeries.length ? lenderSeries : [1]));
                return (
                  <Panel key={key} title={`${label} Monthly AUM Trend (₹ Cr)`} subtitle="Month-wise lender AUM progression" theme={theme}>
                    <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:130 }}>
                      {data.months.map((month, i) => {
                        const value = lenderSeries[i] ?? 0;
                        const h = max ? (value / max) * 110 : 0;
                        const last = i === data.months.length - 1;
                        return (
                          <div key={`${key}-${month}-${i}`} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center" }}>
                            <div style={{ fontSize:7, color: theme.subtext, marginBottom:2 }}>
                              <EditableValue value={value} onChange={val=>update(`monthlyAUMByLender.${key}[${i}]`,val)} fontSize={7} color={theme.subtext} />
                            </div>
                            <div style={{ width:"90%", height: h, background: last ? `linear-gradient(0deg,${theme.accent},${theme.accent}88)` : `${theme.accent2}44`, borderRadius:"3px 3px 0 0", minHeight:4 }} />
                            <div style={{ fontSize:7, color: theme.subtext, marginTop:3 }}>{month}</div>
                          </div>
                        );
                      })}
                    </div>
                  </Panel>
                );
              })}
            </div>

            {/* Row: Lender Mix + New vs Repeat */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
              <Panel title="Lender-wise Portfolio Mix" subtitle="Month-wise stacked lender contribution" theme={theme}>
                <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:150 }}>
                  {data.monthly.map((total, mi) => {
                    const maxTotal = Math.max(...data.monthly);
                    const h = (total / maxTotal) * 120;
                    const clrs = [theme.accent, theme.accent2, "#F59E0B", "#EF4444", "#A855F7"];
                    return (
                      <div key={mi} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center" }}>
                        <div style={{ fontSize:7, color: theme.subtext, marginBottom:2 }}>₹{total}</div>
                        <div style={{ width:"88%", height:h, display:"flex", flexDirection:"column-reverse", borderRadius:"4px 4px 0 0", overflow:"hidden", background: theme.border }}>
                          {data.lenderMix.map((l, li) => (
                            <div key={li} title={`${l.lender}: ${(total * l.share / 100).toFixed(1)} Cr`} style={{ height:`${l.share}%`, background: clrs[li % clrs.length] }} />
                          ))}
                        </div>
                        <div style={{ fontSize:7, color: theme.subtext, marginTop:3 }}>{data.months[mi]}</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginTop:10 }}>
                  {data.lenderMix.map((p, i) => {
                    const clrs = [theme.accent, theme.accent2, "#F59E0B", "#EF4444", "#A855F7"];
                    return (
                      <div key={i} style={{ display:"flex", alignItems:"center", gap:5 }}>
                        <div style={{ width:9, height:9, borderRadius:2, background: clrs[i % clrs.length] }} />
                        <span style={{ fontSize:10, color: theme.subtext }}>
                          <EditableText value={p.lender} onChange={v=>update(`lenderMix[${i}].lender`,v)} style={{ fontSize:10, color: theme.subtext }} />
                        </span>
                        <span style={{ fontSize:10, color: theme.text }}>(<EditableValue value={p.share} onChange={v=>update(`lenderMix[${i}].share`,v)} fontSize={10} color={theme.text} suffix="%" />)</span>
                      </div>
                    );
                  })}
                </div>
              </Panel>

              <Panel title="New vs Repeat Disbursals" subtitle="Monthly customer acquisition breakdown" theme={theme}>
                <div style={{ display:"flex", alignItems:"flex-end", gap:3, height:130 }}>
                  {data.newVsRepeat.map((d, i) => {
                    const total = d.new + d.repeat;
                    const maxTotal = Math.max(...data.newVsRepeat.map(x => x.new + x.repeat));
                    const h = (total / maxTotal) * 110;
                    return (
                      <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center" }}>
                        <div style={{ fontSize:7, color: theme.subtext, marginBottom:2 }}>{total}</div>
                        <div style={{ width:"90%", height: h, display:"flex", flexDirection:"column-reverse", borderRadius:"3px 3px 0 0", overflow:"hidden" }}>
                          <div style={{ height: `${(d.repeat/total)*100}%`, background: theme.accent2 }} />
                          <div style={{ height: `${(d.new/total)*100}%`, background: theme.accent }} />
                        </div>
                        <div style={{ fontSize:7, color: theme.subtext, marginTop:3 }}>{d.month}</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display:"flex", gap:12, marginTop:12, justifyContent:"center", fontSize:10 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                    <div style={{ width:10, height:10, background: theme.accent, borderRadius:2 }} />
                    <span style={{ color: theme.subtext }}>New Customers</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                    <div style={{ width:10, height:10, background: theme.accent2, borderRadius:2 }} />
                    <span style={{ color: theme.subtext }}>Repeat Customers</span>
                  </div>
                </div>
              </Panel>

              <Panel title="Users Whitelisted by Lender" subtitle="Total users followed by lender-wise break-up" theme={theme}>
                <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:150 }}>
                  {(() => {
                    const maxUsers = Math.max(...data.userWhitelistedByLender.map((x) => x.users), 1);
                    return data.userWhitelistedByLender.map((entry, i) => {
                      const h = (entry.users / maxUsers) * 115;
                      return (
                        <div key={`${entry.lender}-${i}`} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center" }}>
                          <div style={{ fontSize:10, color: theme.text, marginBottom:4, fontWeight:600 }}>
                            <EditableValue
                              value={entry.users}
                              onChange={(v)=>update(`userWhitelistedByLender[${i}].users`, v)}
                              fontSize={10}
                              color={theme.text}
                              noDecimal
                            />
                          </div>
                          <div style={{ width:"80%", height:h, borderRadius:"4px 4px 0 0", background: i===0 ? theme.accent : theme.accent2, minHeight:8 }} />
                          <div style={{ fontSize:9, color: theme.subtext, marginTop:5, textAlign:"center", lineHeight:1.2 }}>
                            <EditableText value={entry.lender} onChange={(v)=>update(`userWhitelistedByLender[${i}].lender`, v)} style={{ fontSize:9, color: theme.subtext }} />
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </Panel>
            </div>

            {/* Row: ROI Trend + Profitability */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              <Panel title="Average ROI Trend (%)" subtitle="Monthly ROI progression" theme={theme}>
                <div style={{ height:100, position:"relative", display:"flex", alignItems:"flex-end", paddingBottom:20 }}>
                  <svg width="100%" height="100" viewBox="0 0 360 100" style={{ overflow:"visible" }}>
                    <defs>
                      <linearGradient id="roiGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={theme.accent} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={theme.accent} stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {(() => {
                      const min = Math.min(...data.monthlyROI);
                      const max = Math.max(...data.monthlyROI);
                      const range = max - min || 1;
                      const pts = data.monthlyROI.map((v, i) => 
                        `${(i / (data.monthlyROI.length - 1)) * 340 + 10},${90 - ((v - min) / range) * 70}`
                      ).join(" ");
                      const area = `${pts} 350,90 10,90`;
                      return (
                        <>
                          <polygon points={area} fill="url(#roiGrad)" />
                          <polyline points={pts} fill="none" stroke={theme.accent} strokeWidth="2.5" strokeLinejoin="round" />
                          {data.monthlyROI.map((v, i) => {
                            const x = (i / (data.monthlyROI.length - 1)) * 340 + 10;
                            const y = 90 - ((v - min) / range) * 70;
                            return <circle key={i} cx={x} cy={y} r="3" fill={theme.accent} />;
                          })}
                        </>
                      );
                    })()}
                  </svg>
                  <div style={{ position:"absolute", bottom:0, left:0, right:0, display:"flex", justifyContent:"space-between", paddingTop:8 }}>
                    {data.months.map((m, i) => (
                      <span key={i} style={{ fontSize:7, color: theme.subtext }}>{m}</span>
                    ))}
                  </div>
                </div>
                <div style={{ marginTop:8, padding:"8px 12px", background:`${theme.accent}11`, borderRadius:8, fontSize:11, color: theme.text, textAlign:"center" }}>
                  Current ROI: <strong style={{ color: theme.accent }}>{data.monthlyROI[data.monthlyROI.length-1]}%</strong>
                </div>
              </Panel>

            </div>

            <Panel title="Disbursal mix by App score" subtitle="App score-wise collections distribution" theme={theme} style={{ marginTop:14 }}>
              <div style={{ overflowX:"auto", border:`1px solid ${theme.border}`, borderRadius:10 }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12, minWidth:1700 }}>
                  <thead>
                    <tr style={{ borderBottom:`2px solid ${theme.border}` }}>
                      {[
                        "App Score",
                        "Disbursed Count",
                        "Disbursed Count Share",
                        "Disbursed Amount Share (in cr)",
                        "ATS",
                        "Average Credit Limit",
                        "Average Credit Utilisation",
                        "Average ROI",
                        "Average Tenure",
                        "Current OS count",
                        "Current OS Amount (in cr)",
                        "Current OS Average ROI",
                      ].map((h) => (
                        <th key={h} style={{ padding:"10px 12px", textAlign:"left", color:theme.subtext, fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.04em", whiteSpace:"nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {collectionSummaryRows.map((row, i) => (
                      <tr key={`${row.appScore}-${i}`} style={{ borderBottom:`1px solid ${theme.border}` }}>
                        <td style={{ padding:"10px 12px", color:theme.text, fontWeight:600, whiteSpace:"nowrap" }}>{row.appScore}</td>
                        <td style={{ padding:"10px 12px", color:theme.subtext, whiteSpace:"nowrap" }}>{row.disbursedCount}</td>
                        <td style={{ padding:"10px 12px", color:theme.subtext, whiteSpace:"nowrap" }}>{row.disbursedCountShare}</td>
                        <td style={{ padding:"10px 12px", color:theme.subtext, whiteSpace:"nowrap" }}>{row.disbursedAmountShare}</td>
                        <td style={{ padding:"10px 12px", color:theme.subtext, whiteSpace:"nowrap" }}>{row.ats}</td>
                        <td style={{ padding:"10px 12px", color:theme.subtext, whiteSpace:"nowrap" }}>{row.averageCreditLimit}</td>
                        <td style={{ padding:"10px 12px", color:theme.subtext, whiteSpace:"nowrap" }}>{row.averageCreditUtilisation}</td>
                        <td style={{ padding:"10px 12px", color:theme.subtext, whiteSpace:"nowrap" }}>{row.averageRoi}</td>
                        <td style={{ padding:"10px 12px", color:theme.subtext, whiteSpace:"nowrap" }}>{row.averageTenure}</td>
                        <td style={{ padding:"10px 12px", color:theme.subtext, whiteSpace:"nowrap" }}>{row.currentOsCount}</td>
                        <td style={{ padding:"10px 12px", color:theme.subtext, whiteSpace:"nowrap" }}>{row.currentOsAmount}</td>
                        <td style={{ padding:"10px 12px", color:theme.subtext, whiteSpace:"nowrap" }}>{row.currentOsAverageRoi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>

          </div>
        )}

        {/* ══════════════════════════════════════════════
            TAB 1 — CREDIT QUALITY (UPDATED with DPD aging + lender filter)
        ══════════════════════════════════════════════ */}
        {activeTab === 1 && pv.creditQuality && (
          <div>
            {/* Lender Dropdown Filter */}
            <div style={{ marginBottom:16, display:"flex", gap:12, alignItems:"center" }}>
              <span style={{ fontSize:11, color: theme.subtext, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>Filter by Lender:</span>
              <div style={{ position:"relative" }}>
                <select
                  value={data.selectedLender}
                  onChange={(e) => update("selectedLender", e.target.value)}
                  style={{
                    padding:"8px 36px 8px 14px",
                    borderRadius:8,
                    fontSize:12,
                    fontWeight:600,
                    border:`1px solid ${theme.border}`,
                    background: theme.card,
                    color: theme.text,
                    cursor:"pointer",
                    outline:"none",
                    appearance:"none",
                  }}
                >
                  <option value="ALL">All Lenders</option>
                  <option value="CS">CS (CreditSaison)</option>
                  <option value="IDFC">IDFC</option>
                  <option value="LTF">LTF</option>
                </select>
                <div style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none", color: theme.subtext }}>▼</div>
              </div>
              <div style={{ fontSize:11, color: theme.accent, background: theme.accent+"22", padding:"6px 12px", borderRadius:6 }}>
                Showing: <strong>{data.selectedLender === "ALL" ? "All Lenders" : data.selectedLender}</strong>
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(3, minmax(0, 1fr))", gap:14, marginBottom:14 }}>
              {/* DPD Aging Bucket (moved from Overview) - now reactive to lender */}
              {pv.agingBucket && (
                <Panel title="DPD Aging Bucket" subtitle={`Overdue distribution for ${data.selectedLender === "ALL" ? "all lenders" : data.selectedLender}`} theme={theme} onHide={()=>togglePanel("agingBucket")}>
                  {data.lenderData[data.selectedLender].agingBucket.map((b, i) => (
                    <div key={i} style={{ marginBottom:10 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                        <span style={{ fontSize:11, color: theme.subtext }}>{b.bucket}</span>
                        <span style={{ fontSize:11, fontWeight:700, color: DPD_BUCKET_COLORS[i] }}>{b.pct.toFixed(1)}%</span>
                      </div>
                      <div style={{ background: theme.border, borderRadius:4, height:6, overflow:"hidden" }}>
                        <div style={{ width:`${b.pct}%`, background: DPD_BUCKET_COLORS[i], height:"100%", borderRadius:4 }} />
                      </div>
                    </div>
                  ))}
                </Panel>
              )}

              <DpdAgingView
                title="DPD Aging Bucket by Volume"
                subtitle={`Overdue distribution in ₹ Cr for ${data.selectedLender === "ALL" ? "all lenders" : data.selectedLender}`}
                rows={data.lenderData[data.selectedLender].agingBucketVolumeCr}
                valueFormatter={(value) => `₹${value.toFixed(1)} Cr`}
                theme={theme}
              />

              <DpdAgingView
                title="DPD Aging Bucket by Value"
                subtitle={`Overdue distribution by loan count for ${data.selectedLender === "ALL" ? "all lenders" : data.selectedLender}`}
                rows={data.lenderData[data.selectedLender].agingBucketValueCount}
                valueFormatter={(value) => Number(value).toLocaleString()}
                theme={theme}
              />
            </div>

            <Panel title="Custom Query View" subtitle="Credit quality vintage by disbursement month" theme={theme}>
              <div style={{ overflowX:"auto", border:`1px solid ${theme.border}`, borderRadius:10 }}>
                <table style={{ width:"100%", borderCollapse:"collapse", minWidth:2600, fontSize:11 }}>
                  <thead>
                    <tr style={{ borderBottom:`1px solid ${theme.border}`, background: theme.bg }}>
                      {["disbursement_month", "loans", "users", "disbursed_value_cr", "disbursed_value", ...Array.from({ length: 36 }, (_, idx) => `m${idx + 1}`)].map((h) => (
                        <th key={h} style={{ padding:"10px 10px", textAlign:"left", color:theme.subtext, fontWeight:700, whiteSpace:"nowrap", position:"sticky", top:0, background:theme.bg }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {creditQualityRows.map((row, ri) => (
                      <tr key={`${row.disbursement_month || "row"}-${ri}`} style={{ borderBottom:`1px solid ${theme.border}` }}>
                        <td style={{ padding:"9px 10px", color:theme.text, whiteSpace:"nowrap" }}>{row.disbursement_month}</td>
                        <td style={{ padding:"9px 10px", color:theme.subtext, whiteSpace:"nowrap" }}>{row.loans.toLocaleString()}</td>
                        <td style={{ padding:"9px 10px", color:theme.subtext, whiteSpace:"nowrap" }}>{row.users.toLocaleString()}</td>
                        <td style={{ padding:"9px 10px", color:theme.subtext, whiteSpace:"nowrap" }}>{row.disbursed_value_cr.toFixed(2)}</td>
                        <td style={{ padding:"9px 10px", color:theme.subtext, whiteSpace:"nowrap" }}>{row.disbursed_value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        {Array.from({ length: 36 }, (_, mi) => row.m?.[mi]).map((value, mi) => (
                          <td key={mi} style={{ padding:"9px 10px", color:theme.subtext, whiteSpace:"nowrap" }}>{value || value === 0 ? Number(value).toFixed(2) : ""}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>

            <Panel title="Summary" subtitle="Month-wise disbursal and first EMI quality metrics" theme={theme} style={{ marginTop:14 }}>
              <div style={{ overflowX:"auto", border:`1px solid ${theme.border}`, borderRadius:10 }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11, minWidth:1400 }}>
                  <thead>
                    <tr style={{ borderBottom:`1px solid ${theme.border}`, background: theme.bg }}>
                      <th style={{ padding:"10px 12px", textAlign:"left", color:theme.subtext, fontWeight:700, whiteSpace:"nowrap", position:"sticky", left:0, background:theme.bg, zIndex:2 }}>Metric</th>
                      {monthOrder.map((m) => (
                        <th key={m} style={{ padding:"10px 12px", textAlign:"center", color:theme.subtext, fontWeight:700, whiteSpace:"nowrap" }}>{m}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label:"Disbursal amount (Cr)", key:"disbursalAmount", suffix:"" },
                      { label:"FEMI", key:"femi", suffix:"%" },
                      { label:"First EMI 30+", key:"firstEmi30Plus", suffix:"%" },
                      { label:"Non starter %", key:"nonStarterPct", suffix:"%" },
                    ].map((metric) => (
                      <tr key={metric.key} style={{ borderBottom:`1px solid ${theme.border}` }}>
                        <td style={{ padding:"10px 12px", color:theme.text, fontWeight:600, position:"sticky", left:0, background:theme.card, zIndex:1, whiteSpace:"nowrap" }}>{metric.label}</td>
                        {summaryByMonth.map((row, i) => (
                          <td key={`${metric.key}-${monthOrder[i]}`} style={{ padding:"10px 12px", textAlign:"center", color:theme.subtext, whiteSpace:"nowrap" }}>
                            {typeof row[metric.key] === "number" ? `${row[metric.key].toFixed(metric.suffix ? 1 : 0)}${metric.suffix}` : "-"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>


            <Panel title="DPD summary" subtitle="App score-wise default percentages" theme={theme} style={{ marginTop:14 }}>
              <div style={{ overflowX:"auto", border:`1px solid ${theme.border}`, borderRadius:10 }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11, minWidth:1550 }}>
                  <thead>
                    <tr style={{ borderBottom:`1px solid ${theme.border}`, background: theme.bg }}>
                      {CREDIT_QUALITY_DPD_SUMMARY_COLUMNS.map((column, idx) => (
                        <th key={column} style={{ padding:"10px 8px", textAlign:"left", color:theme.subtext, fontWeight:700, whiteSpace:"nowrap", position: idx === 0 ? "sticky" : "static", left: idx === 0 ? 0 : undefined, background: idx === 0 ? theme.bg : theme.bg, zIndex: idx === 0 ? 2 : 1 }}>
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {CREDIT_QUALITY_DPD_SUMMARY_ROWS.map((row, rowIdx) => (
                      <tr key={`dpd-summary-row-${rowIdx}`} style={{ borderBottom:`1px solid ${theme.border}` }}>
                        {row.map((cell, cellIdx) => (
                          <td key={`dpd-summary-cell-${rowIdx}-${cellIdx}`} style={{ padding:"8px", color: cellIdx === 0 ? theme.text : theme.subtext, fontWeight: cellIdx === 0 ? 600 : 500, whiteSpace:"nowrap", position: cellIdx === 0 ? "sticky" : "static", left: cellIdx === 0 ? 0 : undefined, background: cellIdx === 0 ? theme.card : "transparent", zIndex: cellIdx === 0 ? 1 : 0 }}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>

            <Panel title="POS Bucket Split" subtitle="Month-wise current POS and DPD bucket distribution" theme={theme} style={{ marginTop:14 }}>
              <div style={{ overflowX:"auto", border:`1px solid ${theme.border}`, borderRadius:10 }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11, minWidth:1600 }}>
                  <thead>
                    <tr style={{ borderBottom:`1px solid ${theme.border}`, background: theme.bg }}>
                      <th style={{ padding:"10px 12px", textAlign:"left", color:theme.subtext, fontWeight:700, whiteSpace:"nowrap", position:"sticky", left:0, background:theme.bg, zIndex:2 }}>Metric</th>
                      {monthOrder.map((m) => (
                        <th key={m} style={{ padding:"10px 12px", textAlign:"center", color:theme.subtext, fontWeight:700, whiteSpace:"nowrap" }}>{m}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label:"Current POS", key:"currentPOS" },
                      { label:"POS - No DPD (Current Bucket)", key:"currentBucket" },
                      { label:"POS - DPD 1 - 30 (Bucket X)", key:"bucketX" },
                      { label:"POS - DPD 31 - 60 (Bucket 1)", key:"bucket1" },
                      { label:"POS - DPD 61 - 90 (Bucket 2)", key:"bucket2" },
                      { label:"POS - DPD 90+ (Bucket 3)", key:"bucket3" },
                    ].map((metric) => (
                      <tr key={metric.key} style={{ borderBottom:`1px solid ${theme.border}` }}>
                        <td style={{ padding:"10px 12px", color:theme.text, fontWeight:600, position:"sticky", left:0, background:theme.card, zIndex:1, whiteSpace:"nowrap" }}>{metric.label}</td>
                        {posByMonth.map((row, i) => (
                          <td key={`${metric.key}-${monthOrder[i]}`} style={{ padding:"10px 12px", textAlign:"center", color:theme.subtext, whiteSpace:"nowrap" }}>
                            {typeof row[metric.key] === "number" ? row[metric.key].toLocaleString() : "-"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>
        )}

        {/* ══════════════════════════════════════════════
            TAB 2 — COLLECTIONS (unchanged)
        ══════════════════════════════════════════════ */}
        {/* ══════════════════════════════════════════════
            TAB 2 — COLLECTIONS (Fixed)
        ══════════════════════════════════════════════ */}
        {activeTab === 2 && pv.collections && (
          <div>
            {/* KPI Cards */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:12, marginBottom:16 }}>
              {[
                { label:"Collection Efficiency", field:"collections.efficiency",   target:97, lowerBad:true,  icon:"✅", color: theme.accent,  desc:"Actual vs demand"  },
                { label:"Resolution Rate",       field:"collections.resolution",    target:75, lowerBad:true,  icon:"🔄", color: theme.accent2, desc:"NPA resolved"       },
                { label:"Rollback Rate",         field:"collections.rollback",      target:40, lowerBad:true,  icon:"↩️", color:"#A855F7",        desc:"NPA cured"          },
                { label:"Contactability",        field:"collections.contactability",target:90,lowerBad:true,  icon:"📞", color:"#F59E0B",        desc:"Customers reached" },
                { label:"First Bounce",          field:"collections.firstBounce",   target:8,  lowerBad:false, icon:"🏓", color:"#EF4444",        desc:"EMI bounce rate"   },
                { label:"PTP Rate",              field:"collections.ptp",           target:70, lowerBad:true,  icon:"🤝", color: theme.accent2, desc:"Promise to pay"     },
                { label:"PTP Honored",           field:"collections.ptpHonored",    target:75, lowerBad:true,  icon:"💯", color: theme.accent,  desc:"Promises kept"      },
                { label:"Field Efficiency",      field:"collections.fieldEff",      target:85, lowerBad:true,  icon:"🚗", color:"#F97316",        desc:"Field conversion"  },
              ].map((k, i) => {
                const val     = k.field.split(".").reduce((o,p)=>o[p], data);
                const onTrack = k.lowerBad ? val >= k.target : val <= k.target;
                return (
                  <div key={i} style={{ background: theme.card, borderRadius:14, padding:"16px 18px", border:`1px solid ${onTrack?k.color+"33":"#EF444433"}` }}>
                    <div style={{ display:"flex", justifyContent:"space-between" }}>
                      <div style={{ fontSize:9, color: theme.subtext, textTransform:"uppercase", letterSpacing:"0.06em", fontWeight:600, lineHeight:1.4 }}>{k.label}</div>
                      <span style={{ fontSize:14 }}>{k.icon}</span>
                    </div>
                    <div style={{ fontSize:22, fontWeight:800, color: onTrack?k.color:"#EF4444", margin:"8px 0 2px" }}>
                      <EditableValue value={val} onChange={v=>update(k.field,v)} fontSize={20} color={onTrack?k.color:"#EF4444"} suffix="%" />
                    </div>
                    <div style={{ fontSize:10, color: theme.subtext, marginBottom:6 }}>{k.desc}</div>
                    <div style={{ background: theme.border, borderRadius:4, height:4, overflow:"hidden" }}>
                      <div style={{ width:`${val}%`, background: onTrack?k.color:"#EF4444", height:"100%", borderRadius:4 }} />
                    </div>
                    <div style={{ fontSize:9, color: theme.subtext, marginTop:3 }}>Target: {k.target}% • {onTrack?"✅":"❌"}</div>
                  </div>
                );
              })}
            </div>

            {/* Collection Funnel */}
            <Panel title="Collection Funnel" subtitle="5 monthly column charts across key funnel stages" theme={theme}>
              {(() => {
                const monthlyFunnel = collectionsMonthlyRows.map((row) => {
                  const totalDemand = Math.max(0, row.currentPOS || 0);
                  const contactable = Math.max(0, Math.min(totalDemand, totalDemand * (row.contactability || 0) / 100));
                  const ptpReceived = Math.max(0, Math.min(totalDemand, contactable * (data.collections.ptp || 0) / 100));
                  const ptpHonored = Math.max(0, Math.min(totalDemand, ptpReceived * (data.collections.ptpHonored || 0) / 100));
                  const finallyCollectedPct = Math.max(0, Math.min(100, (row.contactability || 0) - (row.femi || 0) * 1.35));
                  const finallyCollected = Math.max(0, Math.min(totalDemand, totalDemand * finallyCollectedPct / 100));

                  return {
                    month: row.month,
                    totalDemand,
                    contactable,
                    ptpReceived,
                    ptpHonored,
                    finallyCollected,
                  };
                });

                const charts = [
                  { label:"Total Demand", key:"totalDemand", color:theme.accent2 },
                  { label:"Contactable", key:"contactable", color:"#F59E0B" },
                  { label:"PTP Received", key:"ptpReceived", color:"#A855F7" },
                  { label:"PTP Honored", key:"ptpHonored", color:"#F97316" },
                  { label:"Finally Collected", key:"finallyCollected", color:theme.accent },
                ];

                const chartRows = [charts.slice(0, 2), charts.slice(2)];

                return (
                  <div style={{ display:"grid", gap:14 }}>
                    {chartRows.map((rowCharts, rowIndex) => (
                      <div
                        key={`row-${rowIndex}`}
                        style={{
                          display:"grid",
                          gridTemplateColumns:`repeat(${rowCharts.length}, minmax(320px, 1fr))`,
                          gap:14,
                        }}
                      >
                        {rowCharts.map((chart) => {
                        const maxValue = Math.max(...monthlyFunnel.map((row) => row[chart.key] || 0), 1);
                        return (
                          <div key={chart.key} style={{ background:theme.bg, border:`1px solid ${theme.border}`, borderRadius:12, padding:"12px 12px 10px" }}>
                            <div style={{ fontSize:12, fontWeight:800, color:chart.color, marginBottom:10 }}>{chart.label}</div>
                            <div style={{ fontSize:9, color:theme.subtext, marginBottom:8 }}>Y Axis: Value</div>
                            <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:220, borderBottom:`1px solid ${theme.border}`, paddingBottom:8 }}>
                              {monthlyFunnel.map((row, i) => {
                                const value = row[chart.key] || 0;
                                const height = Math.max(10, (value / maxValue) * 170);
                                return (
                                  <div key={`${chart.key}-${i}`} style={{ flex:1, minWidth:22, display:"flex", flexDirection:"column", alignItems:"center" }}>
                                    <div style={{ fontSize:9, color:theme.subtext, marginBottom:4 }}>{Math.round(value).toLocaleString()}</div>
                                    <div title={`${row.month}: ${Math.round(value).toLocaleString()}`} style={{ width:"78%", height, background:chart.color, borderRadius:"6px 6px 2px 2px", boxShadow:`0 4px 10px ${chart.color}33` }} />
                                    <div style={{ fontSize:9, color:theme.subtext, marginTop:4, textAlign:"center", lineHeight:1.2 }}>{row.month}</div>
                                  </div>
                                );
                              })}
                            </div>
                            <div style={{ fontSize:9, color:theme.subtext, marginTop:6 }}>X Axis: Months</div>
                          </div>
                        );
                        })}
                      </div>
                    ))}
                  </div>
                );
              })()}
            </Panel>

            {/* Bucket Trends (Column View) */}
            <Panel title="Collections Bucket Trend — Monthly Column View" subtitle="Bucket-wise month-on-month users" theme={theme} style={{ marginTop:14 }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                {[
                  { label:"Bucket X (DPD 1-30)", key:"bucketX", color: theme.accent },
                  { label:"Bucket 1 (DPD 31-60)", key:"bucket1", color: theme.accent2 },
                  { label:"Bucket 2 (DPD 61-90)", key:"bucket2", color: "#F59E0B" },
                  { label:"Bucket 3 (DPD 90+)", key:"bucket3", color: "#EF4444" },
                ].map((cfg, ci) => {
                  const maxValue = Math.max(...collectionsMonthlyRows.map(r => r[cfg.key] || 0), 1);
                  return (
                    <div key={ci} style={{ background:theme.bg, border:`1px solid ${theme.border}`, borderRadius:12, padding:"10px 10px 8px" }}>
                      <div style={{ fontSize:11, fontWeight:700, color: cfg.color, marginBottom:8 }}>{cfg.label}</div>
                      <div style={{ overflowX:"auto" }}>
                        <div style={{ display:"flex", alignItems:"flex-end", gap:8, minWidth:460, height:170 }}>
                          {collectionsMonthlyRows.map((row, i) => {
                            const users = row[cfg.key] || 0;
                            const h = Math.max(8, (users / maxValue) * 130);
                            return (
                              <div key={`${cfg.key}-${i}`} style={{ flex:1, minWidth:30, display:"flex", flexDirection:"column", alignItems:"center" }}>
                                <div style={{ fontSize:9, color: theme.subtext, marginBottom:4 }}>{users}</div>
                                <div title={`${row.month}: ${users} users`} style={{ width:"75%", height:h, background:cfg.color, borderRadius:"6px 6px 2px 2px", boxShadow:`0 4px 10px ${cfg.color}33` }} />
                                <div style={{ fontSize:9, color: theme.subtext, marginTop:4 }}>{row.month}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Panel>

            {/* Main Table */}
           {/* Transposed Main Table */}
           <Panel title="Collections Month-wise Table" subtitle="Metrics (Rows) vs Months (Columns)" theme={theme} style={{ marginTop:14 }}>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12, minWidth:1200 }}>
                  <thead>
                    <tr style={{ borderBottom:`2px solid ${theme.border}` }}>
                      {/* Frozen First Column Header */}
                      <th style={{ padding:"10px 12px", textAlign:"left", color: theme.subtext, fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.04em", whiteSpace:"nowrap", position:"sticky", left:0, background: theme.card, zIndex:10, borderRight:`1px solid ${theme.border}` }}>
                        Metric
                      </th>
                      {/* Month Headers */}
                      {data.collectionsMonthly.map((row, i) => (
                        <th key={i} style={{ padding:"10px 12px", textAlign:"center", color: theme.subtext, fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.04em", whiteSpace:"nowrap" }}>
                          <EditableText value={row.month} onChange={v=>update(`collectionsMonthly[${i}].month`,v)} style={{ fontSize:10, fontWeight:700, textAlign:"center" }} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label:"Disbursal Amount",      key:"disbursal",      prefix:"₹", suffix:"" },
                      { label:"FEMI % (First Bounce)", key:"femi",           prefix:"",  suffix:"%" },
                      { label:"Current POS",           key:"currentPOS",     prefix:"₹", suffix:"" },
                      { label:"Bucket X (1-30 DPD)",   key:"bucketX",        prefix:"",  suffix:"" },
                      { label:"Bucket 1 (31-60 DPD)",  key:"bucket1",        prefix:"",  suffix:"" },
                      { label:"Bucket 2 (61-90 DPD)",  key:"bucket2",        prefix:"",  suffix:"" },
                      { label:"Bucket 3 (90+ DPD)",    key:"bucket3",        prefix:"",  suffix:"" },
                      { label:"Contactability",        key:"contactability", prefix:"",  suffix:"%" },
                    ].map((metric, mi) => (
                      <tr key={metric.key} style={{ borderBottom:`1px solid ${theme.border}` }}>
                        {/* Frozen First Column Label */}
                        <td style={{ padding:"10px 12px", color: theme.text, fontWeight:600, whiteSpace:"nowrap", position:"sticky", left:0, background: theme.card, zIndex:10, borderRight:`1px solid ${theme.border}` }}>
                          {metric.label}
                        </td>
                        {/* Data Cells */}
                        {data.collectionsMonthly.map((row, i) => (
                          <td key={i} style={{ padding:"10px 12px", color: theme.subtext, textAlign:"center", whiteSpace:"nowrap" }}>
                            {metric.prefix}
                            <EditableValue
                              value={row[metric.key]}
                              onChange={v=>update(`collectionsMonthly[${i}].${metric.key}`,v)}
                              fontSize={12}
                              color={theme.subtext}
                              suffix={metric.suffix}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>

            <Panel title="Rollback/Rollforward - No DPD summary" subtitle="Reference table from shared snapshot" theme={theme} style={{ marginTop:14 }}>
              <div style={{ overflowX:"auto", border:`1px solid ${theme.border}`, borderRadius:10 }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12, minWidth:1200 }}>
                  <thead>
                    <tr style={{ borderBottom:`1px solid ${theme.border}`, background: theme.bg }}>
                      <th style={{ padding:"10px 8px", textAlign:"center", color:theme.subtext, fontWeight:700, width:42 }}>#</th>
                      <th style={{ padding:"10px 12px", textAlign:"left", color:theme.subtext, fontWeight:700, minWidth:190 }}>Month</th>
                      {COLLECTIONS_SUMMARY_MONTHS.map((month) => (
                        <th key={month.label} style={{ padding:"10px 12px", textAlign:"left", color:theme.subtext, fontWeight:700, minWidth:118 }}>
                          <div>{month.label}</div>
                          <div style={{ marginTop:6 }}>{month.date}</div>
                        </th>
                      ))}
                    </tr>
                    <tr style={{ borderBottom:`1px solid ${theme.border}`, background: theme.bg }}>
                      <th style={{ padding:"8px" }} />
                      <th style={{ padding:"8px 12px", textAlign:"left", color:theme.text, fontWeight:700 }}>Status Fin</th>
                      {COLLECTIONS_SUMMARY_MONTHS.map((month) => (
                        <th key={`${month.label}-users`} style={{ padding:"8px 12px", textAlign:"left", color:theme.text, fontWeight:700 }}>User Count</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ROLLBACK_ROLLFORWARD_NO_DPD_ROWS.map((row) => (
                      <tr key={row.srNo} style={{ borderBottom:`1px solid ${theme.border}` }}>
                        <td style={{ padding:"8px", textAlign:"center", color:theme.subtext }}>{row.srNo}</td>
                        <td style={{ padding:"8px 12px", color:theme.text }}>{row.label}</td>
                        {row.values.map((value, idx) => (
                          <td key={`${row.srNo}-${idx}`} style={{ padding:"8px 12px", color:theme.subtext, whiteSpace:"nowrap" }}>{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>

            <Panel title="Rollback/Rollforward - DPD 1-30 summary" subtitle="Reference table from shared snapshot" theme={theme} style={{ marginTop:14 }}>
              <div style={{ overflowX:"auto", border:`1px solid ${theme.border}`, borderRadius:10 }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12, minWidth:1200 }}>
                  <thead>
                    <tr style={{ borderBottom:`1px solid ${theme.border}`, background: theme.bg }}>
                      <th style={{ padding:"10px 8px", textAlign:"center", color:theme.subtext, fontWeight:700, width:42 }}>#</th>
                      <th style={{ padding:"10px 12px", textAlign:"left", color:theme.subtext, fontWeight:700, minWidth:190 }}>Month</th>
                      {COLLECTIONS_SUMMARY_MONTHS.map((month) => (
                        <th key={`dpd-${month.label}`} style={{ padding:"10px 12px", textAlign:"left", color:theme.subtext, fontWeight:700, minWidth:118 }}>
                          <div>{month.label}</div>
                          <div style={{ marginTop:6 }}>{month.date}</div>
                        </th>
                      ))}
                    </tr>
                    <tr style={{ borderBottom:`1px solid ${theme.border}`, background: theme.bg }}>
                      <th style={{ padding:"8px" }} />
                      <th style={{ padding:"8px 12px", textAlign:"left", color:theme.text, fontWeight:700 }}>Status Fin</th>
                      {COLLECTIONS_SUMMARY_MONTHS.map((month) => (
                        <th key={`dpd-${month.label}-users`} style={{ padding:"8px 12px", textAlign:"left", color:theme.text, fontWeight:700 }}>User Count</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ROLLBACK_ROLLFORWARD_DPD_1_30_ROWS.map((row) => (
                      <tr key={`dpd-row-${row.srNo}`} style={{ borderBottom:`1px solid ${theme.border}` }}>
                        <td style={{ padding:"8px", textAlign:"center", color:theme.subtext }}>{row.srNo}</td>
                        <td style={{ padding:"8px 12px", color:theme.text }}>{row.label}</td>
                        {row.values.map((value, idx) => (
                          <td key={`dpd-${row.srNo}-${idx}`} style={{ padding:"8px 12px", color:theme.subtext, whiteSpace:"nowrap" }}>{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>
        )}
        {/* ══════════════════════════════════════════════
            TAB 4 — AGENT PERFORMANCE
        ══════════════════════════════════════════════ */}
        {activeTab === 3 && (
          <div>
            <Panel title="Agent Performance" subtitle="Agent-wise collections performance" theme={theme}>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12, minWidth:900 }}>
                  <thead>
                    <tr style={{ borderBottom:`2px solid ${theme.border}` }}>
                      {["Agent Name", "Cases given", "Users connected", "Amount recovered"].map((h) => (
                        <th key={h} style={{ padding:"10px 12px", textAlign:"left", color: theme.subtext, fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em", whiteSpace:"nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {agentPerformanceRows.map((row, i) => (
                      <tr key={`${row.agentName}-${i}`} style={{ borderBottom:`1px solid ${theme.border}` }}>
                        <td style={{ padding:"12px", color: theme.text, fontWeight:600 }}>{row.agentName}</td>
                        <td style={{ padding:"12px", color: theme.subtext }}>{row.casesGiven}</td>
                        <td style={{ padding:"12px", color: theme.subtext }}>{row.usersConnected}</td>
                        <td style={{ padding:"12px", color: theme.subtext }}>{typeof row.amountRecovered === "number" ? row.amountRecovered.toFixed(2) : "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>
        )}

        {/* ══════════════════════════════════════════════
            TAB 5 — FIELD AGENCY COLLECTIONS PERFORMANCE
        ══════════════════════════════════════════════ */}
        {activeTab === 4 && (
          <div>
            <Panel title="Field agency collections performance" subtitle="City-wise field agency coverage" theme={theme}>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12, minWidth:900 }}>
                  <thead>
                    <tr style={{ borderBottom:`2px solid ${theme.border}` }}>
                      {[
                        "City",
                        "Agency Name",
                        "DPD bucket",
                        "Number cases shared",
                        "Amount given to be collected",
                        "Amount collected",
                      ].map((h) => (
                        <th key={h} style={{ padding:"10px 12px", textAlign:"left", color: theme.subtext, fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em", whiteSpace:"nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {fieldAgencyRows.map((row, i) => (
                      <tr key={`${row.city}-${row.agencyName || "agency"}-${i}`} style={{ borderBottom:`1px solid ${theme.border}` }}>
                        <td style={{ padding:"12px", color: theme.text, fontWeight:600 }}>{row.city}</td>
                        <td style={{ padding:"12px", color: theme.subtext }}>{row.agencyName || "-"}</td>
                        <td style={{ padding:"12px", color: theme.subtext }}>{row.dpdBucket || "-"}</td>
                        <td style={{ padding:"12px", color: theme.subtext }}>{row.casesShared}</td>
                        <td style={{ padding:"12px", color: theme.subtext }}>{typeof row.amountGivenToBeCollected === "number" ? row.amountGivenToBeCollected.toFixed(2) : "-"}</td>
                        <td style={{ padding:"12px", color: theme.subtext }}>{typeof row.amountCollected === "number" ? row.amountCollected.toFixed(2) : "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>
        )}

        {/* ══════════════════════════════════════════════
            TAB 5 — CALLING FEEDBACK
        ══════════════════════════════════════════════ */}
        {activeTab === 5 && (pv.callingFeedback ?? true) && (
          <div>
            <Panel title="Calling Feedback" subtitle="Agent-wise call outcomes and customer response" theme={theme}>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                  <thead>
                    <tr style={{ borderBottom:`2px solid ${theme.border}` }}>
                      {[
                        "User ID",
                        "Agent called",
                        "Calling date and time",
                        "User response (RNR / PTP / Paid)",
                        "No. of times called",
                        "Current max DPD",
                        "Amount overdue (₹ Cr)",
                        "Total amount O/S (₹ Cr)",
                      ]
                        .map((h) => (
                          <th key={h} style={{ padding:"10px 12px", textAlign:"left", color: theme.subtext, fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em", whiteSpace:"nowrap" }}>{h}</th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {callingFeedbackRows.map((row, i) => {
                      const responseColor = row.response === "Paid" ? theme.accent : row.response === "PTP" ? "#F59E0B" : "#EF4444";
                      return (
                        <tr key={`${row.userId}-${i}`} style={{ borderBottom:`1px solid ${theme.border}` }}>
                          <td style={{ padding:"12px", color: theme.text, fontWeight:600 }}>{row.userId}</td>
                          <td style={{ padding:"12px", color: theme.subtext }}>{row.agent}</td>
                          <td style={{ padding:"12px", color: theme.subtext, whiteSpace:"nowrap" }}>{row.calledAt}</td>
                          <td style={{ padding:"12px" }}>
                            <span style={{ background:`${responseColor}22`, color: responseColor, padding:"4px 10px", borderRadius:999, fontSize:11, fontWeight:700 }}>{row.response}</span>
                          </td>
                          <td style={{ padding:"12px", color: theme.subtext }}>{row.timesCalled ?? "-"}</td>
                          <td style={{ padding:"12px", color: theme.subtext }}>{row.maxDpd ?? "-"}</td>
                          <td style={{ padding:"12px", color: theme.subtext }}>
                            {typeof row.amountOverdue === "number" ? row.amountOverdue.toFixed(2) : "-"}
                          </td>
                          <td style={{ padding:"12px", color: theme.subtext }}>
                            {typeof row.totalOutstanding === "number" ? row.totalOutstanding.toFixed(2) : "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Panel>

            <Panel title="User level collection" subtitle="User-wise collections and calling summary" theme={theme} style={{ marginTop:14 }}>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12, minWidth:1200 }}>
                  <thead>
                    <tr style={{ borderBottom:`2px solid ${theme.border}` }}>
                      {[
                        "User ID",
                        "Number of times called",
                        "Current max DPD",
                        "Amount overdue",
                        "Total Amount o/s",
                        "Last agent called",
                        "Call date and time",
                        "User response",
                      ].map((h) => (
                        <th key={h} style={{ padding:"10px 12px", textAlign:"left", color: theme.subtext, fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em", whiteSpace:"nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {userLevelCollectionRows.map((row, i) => (
                      <tr key={`${row.userId}-${i}`} style={{ borderBottom:`1px solid ${theme.border}` }}>
                        <td style={{ padding:"12px", color: theme.text, fontWeight:600 }}>{row.userId}</td>
                        <td style={{ padding:"12px", color: theme.subtext }}>{row.timesCalled}</td>
                        <td style={{ padding:"12px", color: theme.subtext }}>{row.maxDpd}</td>
                        <td style={{ padding:"12px", color: theme.subtext }}>{typeof row.amountOverdue === "number" ? row.amountOverdue.toFixed(2) : "-"}</td>
                        <td style={{ padding:"12px", color: theme.subtext }}>{typeof row.totalOutstanding === "number" ? row.totalOutstanding.toFixed(2) : "-"}</td>
                        <td style={{ padding:"12px", color: theme.subtext }}>{row.lastAgentCalled}</td>
                        <td style={{ padding:"12px", color: theme.subtext, whiteSpace:"nowrap" }}>{row.callDateTime}</td>
                        <td style={{ padding:"12px", color: theme.subtext }}>{row.userResponse}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:12, marginTop:14 }}>
              {[
                { label:"Total Calls", value: callingFeedbackRows.length, color: theme.accent2, suffix: "" },
                { label:"PTP", value: callingFeedbackRows.filter(r => r.response === "PTP").length, color: "#F59E0B", suffix: "" },
                { label:"Paid", value: callingFeedbackRows.filter(r => r.response === "Paid").length, color: theme.accent, suffix: "" },
                { label:"RNR", value: callingFeedbackRows.filter(r => r.response === "RNR").length, color: "#EF4444", suffix: "" },
              ].map((k, i) => (
                <div key={i} style={{ background: theme.card, border:`1px solid ${k.color}33`, borderRadius:12, padding:"14px 16px" }}>
                  <div style={{ fontSize:10, color: theme.subtext, textTransform:"uppercase", letterSpacing:"0.06em", fontWeight:700 }}>{k.label}</div>
                  <div style={{ fontSize:24, fontWeight:800, color: k.color, marginTop:6 }}>{k.value}{k.suffix}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div style={{ padding:"16px 0 4px", borderTop:`1px solid ${theme.border}`, marginTop:20, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
          <div style={{ fontSize:10, color: theme.subtext }}>
            © 2026 <EditableText value={data.meta.companyName} onChange={v=>update("meta.companyName",v)} style={{ fontSize:10, color: theme.subtext }} /> · All figures in ₹ Crores unless stated
          </div>
          <div style={{ display:"flex", gap:6 }}>
            {["🟢 Live Data","RBI Compliant","IRAC Norms"].map(t=>(
              <span key={t} style={{ fontSize:9, color: theme.subtext, background: theme.card, padding:"3px 8px", borderRadius:4, border:`1px solid ${theme.border}` }}>{t}</span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
