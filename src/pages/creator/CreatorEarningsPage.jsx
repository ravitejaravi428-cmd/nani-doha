import React, { useState, useMemo } from "react";
import { 
  DollarSign, 
  ArrowUpRight, 
  CheckCircle2, 
  Building2, 
  Smartphone, 
  X
} from "lucide-react";
import { useCreator } from "../../context/CreatorContext";
import { useOrders } from "../../context/OrderContext";

export const CreatorEarningsPage = () => {
  const { creator, payouts, requestPayout } = useCreator();
  const { orders } = useOrders();

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("upi"); // "upi" | "bank"

  // Financial calculations
  const finance = useMemo(() => {
    const grossSales = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
    const platformFee = grossSales * (creator.commissionRate || 0.05);
    const netEarnings = grossSales - platformFee;

    const totalPaidOut = payouts
      .filter((p) => p.status === "Completed")
      .reduce((sum, p) => sum + Number(p.netAmount), 0);

    const availableBalance = Math.max(0, netEarnings - totalPaidOut);

    return {
      grossSales: grossSales.toFixed(2),
      platformFee: platformFee.toFixed(2),
      netEarnings: netEarnings.toFixed(2),
      totalPaidOut: totalPaidOut.toFixed(2),
      availableBalance: availableBalance.toFixed(2)
    };
  }, [orders, payouts, creator]);

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    const success = requestPayout(withdrawAmount, withdrawMethod);
    if (success) {
      setIsWithdrawModalOpen(false);
      setWithdrawAmount("");
    }
  };

  return (
    <div style={{ background: "#0b0f19", minHeight: "calc(100vh - 120px)", color: "#f8fafc", padding: "32px 20px 80px" }}>
      <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "28px" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "#ffffff" }}>
              Seller Earnings & Payout Management
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: "0.875rem", color: "#94a3b8" }}>
              Track order revenue, platform commission deductions, and withdraw funds directly to your bank or UPI
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsWithdrawModalOpen(true)}
            style={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "#ffffff",
              padding: "10px 22px",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "0.875rem",
              border: "none",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 14px rgba(16, 185, 129, 0.4)"
            }}
          >
            <ArrowUpRight size={18} />
            <span>Withdraw Earnings (QAR {finance.availableBalance})</span>
          </button>
        </div>

        {/* 4 Cards Overview */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "20px",
          marginBottom: "32px"
        }}>
          {/* Available to Withdraw */}
          <div style={{
            background: "linear-gradient(135deg, #064e3b 0%, #0f172a 100%)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            borderRadius: "16px",
            padding: "24px"
          }}>
            <div style={{ fontSize: "0.875rem", color: "#6ee7b7", fontWeight: 600, marginBottom: "8px" }}>
              Available Payout Balance
            </div>
            <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "#ffffff" }}>
              QAR {finance.availableBalance}
            </div>
            <div style={{ fontSize: "0.8125rem", color: "#a7f3d0", marginTop: "6px" }}>
              Instant withdrawal via UPI / Fast Bank
            </div>
          </div>

          {/* Gross Order Revenue */}
          <div style={{
            background: "#131b2e",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            padding: "24px"
          }}>
            <div style={{ fontSize: "0.875rem", color: "#94a3b8", fontWeight: 600, marginBottom: "8px" }}>
              Total Gross Sales
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#ffffff" }}>
              QAR {finance.grossSales}
            </div>
            <div style={{ fontSize: "0.8125rem", color: "#94a3b8", marginTop: "6px" }}>
              Across {orders.length} completed orders
            </div>
          </div>

          {/* Platform Commission */}
          <div style={{
            background: "#131b2e",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            padding: "24px"
          }}>
            <div style={{ fontSize: "0.875rem", color: "#94a3b8", fontWeight: 600, marginBottom: "8px" }}>
              Platform Fee (5%)
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#f87171" }}>
              - QAR {finance.platformFee}
            </div>
            <div style={{ fontSize: "0.8125rem", color: "#94a3b8", marginTop: "6px" }}>
              Includes hosting, payment processing & catalog CDN
            </div>
          </div>

          {/* Total Disbursed */}
          <div style={{
            background: "#131b2e",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            padding: "24px"
          }}>
            <div style={{ fontSize: "0.875rem", color: "#94a3b8", fontWeight: 600, marginBottom: "8px" }}>
              Total Paid Out
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#38bdf8" }}>
              QAR {finance.totalPaidOut}
            </div>
            <div style={{ fontSize: "0.8125rem", color: "#94a3b8", marginTop: "6px" }}>
              {payouts.length} past payout transfers
            </div>
          </div>
        </div>

        {/* Banking Accounts Configured */}
        <div style={{
          background: "#131b2e",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "32px"
        }}>
          <h2 style={{ fontSize: "1.15rem", fontWeight: 700, margin: "0 0 16px", color: "#ffffff" }}>
            Configured Payout Destination Accounts
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {/* UPI Account */}
            <div style={{
              background: "#0b0f19",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: "12px",
              padding: "16px",
              display: "flex",
              alignItems: "center",
              gap: "14px"
            }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: "rgba(16, 185, 129, 0.15)", color: "#34d399", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Smartphone size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.75rem", color: "#94a3b8", textTransform: "uppercase", fontWeight: 700 }}>
                  Instant UPI VPA
                </div>
                <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#ffffff", marginTop: "2px" }}>
                  {creator.upiId}
                </div>
                <div style={{ fontSize: "0.75rem", color: "#10b981", marginTop: "2px" }}>
                  ✓ Primary Instant Payout
                </div>
              </div>
            </div>

            {/* Bank Account */}
            <div style={{
              background: "#0b0f19",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: "12px",
              padding: "16px",
              display: "flex",
              alignItems: "center",
              gap: "14px"
            }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: "rgba(99, 102, 241, 0.15)", color: "#818cf8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Building2 size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.75rem", color: "#94a3b8", textTransform: "uppercase", fontWeight: 700 }}>
                  Direct Bank Wire
                </div>
                <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#ffffff", marginTop: "2px" }}>
                  {creator.bankName} ({creator.bankAccount})
                </div>
                <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "2px" }}>
                  Daily settlement batches
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payout History Table */}
        <div style={{
          background: "#131b2e",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "16px",
          overflow: "hidden"
        }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
            <h2 style={{ fontSize: "1.15rem", fontWeight: 700, margin: 0, color: "#ffffff" }}>
              Payout Transaction History
            </h2>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#0b0f19", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", color: "#94a3b8", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                <th style={{ padding: "14px 20px" }}>Payout ID & Ref</th>
                <th style={{ padding: "14px 16px" }}>Date</th>
                <th style={{ padding: "14px 16px" }}>Gross Amount</th>
                <th style={{ padding: "14px 16px" }}>Net Disbursed</th>
                <th style={{ padding: "14px 16px" }}>Method</th>
                <th style={{ padding: "14px 20px", textAlign: "right" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((p) => (
                <tr key={p.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ fontWeight: 700, color: "#ffffff", fontSize: "0.875rem" }}>{p.id}</div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{p.referenceId}</div>
                  </td>
                  <td style={{ padding: "16px", fontSize: "0.8125rem", color: "#cbd5e1" }}>
                    {new Date(p.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </td>
                  <td style={{ padding: "16px", fontSize: "0.875rem", color: "#cbd5e1" }}>
                    QAR {Number(p.amount).toFixed(2)}
                  </td>
                  <td style={{ padding: "16px", fontSize: "0.9375rem", fontWeight: 700, color: "#34d399" }}>
                    QAR {Number(p.netAmount).toFixed(2)}
                  </td>
                  <td style={{ padding: "16px", fontSize: "0.8125rem", color: "#94a3b8" }}>
                    {p.method}
                  </td>
                  <td style={{ padding: "16px 20px", textAlign: "right" }}>
                    <span style={{
                      background: "rgba(16, 185, 129, 0.15)",
                      color: "#34d399",
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                      padding: "3px 10px",
                      borderRadius: "12px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px"
                    }}>
                      <CheckCircle2 size={12} /> {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Withdrawal Modal */}
        {isWithdrawModalOpen && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 1000
          }}>
            <div style={{
              background: "#131b2e",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "20px",
              width: "100%",
              maxWidth: "480px",
              padding: "28px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#ffffff" }}>
                  Withdraw Creator Earnings
                </h2>
                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(false)}
                  style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleWithdrawSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ background: "#0b0f19", padding: "14px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                  <span style={{ fontSize: "0.8125rem", color: "#94a3b8" }}>Available Balance:</span>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#34d399", marginTop: "2px" }}>
                    QAR {finance.availableBalance}
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "6px" }}>
                    Withdrawal Amount (QAR) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    max={finance.availableBalance}
                    placeholder={`Max ${finance.availableBalance}`}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    style={{
                      width: "100%",
                      background: "#0b0f19",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                      padding: "10px 14px",
                      color: "#ffffff",
                      fontSize: "1.1rem",
                      fontWeight: 700
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "6px" }}>
                    Payout Destination
                  </label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <label style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      background: withdrawMethod === "upi" ? "rgba(99, 102, 241, 0.2)" : "#0b0f19",
                      border: `1px solid ${withdrawMethod === "upi" ? "#6366f1" : "rgba(255, 255, 255, 0.1)"}`,
                      padding: "12px",
                      borderRadius: "8px",
                      cursor: "pointer"
                    }}>
                      <input
                        type="radio"
                        name="method"
                        value="upi"
                        checked={withdrawMethod === "upi"}
                        onChange={() => setWithdrawMethod("upi")}
                      />
                      <div>
                        <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#ffffff" }}>Instant UPI Transfer</div>
                        <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{creator.upiId}</div>
                      </div>
                    </label>

                    <label style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      background: withdrawMethod === "bank" ? "rgba(99, 102, 241, 0.2)" : "#0b0f19",
                      border: `1px solid ${withdrawMethod === "bank" ? "#6366f1" : "rgba(255, 255, 255, 0.1)"}`,
                      padding: "12px",
                      borderRadius: "8px",
                      cursor: "pointer"
                    }}>
                      <input
                        type="radio"
                        name="method"
                        value="bank"
                        checked={withdrawMethod === "bank"}
                        onChange={() => setWithdrawMethod("bank")}
                      />
                      <div>
                        <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#ffffff" }}>Direct Bank Transfer</div>
                        <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{creator.bankName} ({creator.bankAccount})</div>
                      </div>
                    </label>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
                  <button
                    type="button"
                    onClick={() => setIsWithdrawModalOpen(false)}
                    style={{
                      background: "rgba(255, 255, 255, 0.08)",
                      border: "none",
                      color: "#cbd5e1",
                      padding: "10px 18px",
                      borderRadius: "8px",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      border: "none",
                      color: "#ffffff",
                      padding: "10px 24px",
                      borderRadius: "8px",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                  >
                    Confirm Payout
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
