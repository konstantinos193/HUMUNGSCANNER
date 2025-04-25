import type { Holder } from "./api";

interface Token {
  id: string;
  name: string;
  ticker: string;
  price: number;
  marketcap: number;
  volume: number;
  holder_count: number;
  created_time: string;
  creator: string;
  total_supply: string;
  creator_balance?: string;
  creator_tokens_count?: number;
}

interface RiskAssessment {
  level: string;
  color: string;
  message: string;
  warning: string;
  stats?: {
    devPercentage: number;
    top5Percentage: number;
    top10Percentage: number;
  };
}

// List of trusted developers that get special risk assessment
const TRUSTED_DEVELOPERS = [
  'vv5jb-7sm7u-vn3nq-6nflf-dghis-fd7ji-cx764-xunni-zosog-eqvpw-oae'
];

export const calculateRiskLevel = (token: any, holders: any[]) => {
  // Calculate developer holdings
  const devHolder = holders.find(h => h.user === token.creator);
  const devBalance = devHolder ? Number(devHolder.balance) : 0;
  const totalSupply = Number(token.total_supply);
  const devPercentage = (devBalance / totalSupply) * 100;

  // Calculate top holder percentages
  const sortedHolders = [...holders].sort((a, b) => Number(b.balance) - Number(a.balance));
  const top5Balance = sortedHolders.slice(0, 5).reduce((sum, h) => sum + Number(h.balance), 0);
  const top5Percentage = (top5Balance / totalSupply) * 100;
  
  const top10Balance = sortedHolders.slice(0, 10).reduce((sum, h) => sum + Number(h.balance), 0);
  const top10Percentage = (top10Balance / totalSupply) * 100;

  // Determine risk level
  let riskLevel;
  let message;
  let warning;

  if (devBalance === 0) {
    riskLevel = "EXTREME RISK";
    message = "Developer has abandoned the token";
    warning = "DANGER: Developer has sold their entire position (0 holders)";
  } else if (devPercentage >= 50 || top5Percentage >= 70) {
    riskLevel = "EXTREME RISK";
    message = "Extremely high centralization. High probability of price manipulation.";
    warning = `Developer holds ${devPercentage.toFixed(2)}% of supply. Top 5 holders control ${top5Percentage.toFixed(2)}%`;
  } else if (devPercentage >= 30 || top5Percentage >= 50) {
    riskLevel = "HIGH RISK";
    message = "High centralization detected. Major price manipulation risk.";
    warning = `Developer holds ${devPercentage.toFixed(2)}% of supply. Top 5 holders control ${top5Percentage.toFixed(2)}%`;
  } else if (devPercentage >= 20 || top5Percentage >= 40) {
    riskLevel = "MEDIUM RISK";
    message = "Moderate centralization. Exercise caution.";
    warning = `Developer holds ${devPercentage.toFixed(2)}% of supply. Top 5 holders control ${top5Percentage.toFixed(2)}%`;
  } else {
    riskLevel = "LOW RISK";
    message = "Good distribution of tokens. Standard market risks apply.";
    warning = `Developer holds ${devPercentage.toFixed(2)}% of supply. Top 5 holders control ${top5Percentage.toFixed(2)}%`;
  }

  return {
    level: riskLevel,
    message,
    warning,
    stats: {
      devPercentage,
      top5Percentage,
      top10Percentage
    }
  };
}; 