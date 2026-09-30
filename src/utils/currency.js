// Qatar Currency Utility (QAR - Qatari Riyal)
export const CURRENCY = "QAR";

export const formatPrice = (amount) => {
  const num = Number(amount || 0);
  return `QAR ${num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })}`;
};
