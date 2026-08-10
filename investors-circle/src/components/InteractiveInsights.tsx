import { useState } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  marketInsights,
  portfolioGrowth,
  rentalProjection,
} from "../data/content";

type Tab = "growth" | "markets" | "rental";

const tabs: { id: Tab; label: string }[] = [
  { id: "growth", label: "Portfolio Growth" },
  { id: "markets", label: "Micro-Markets" },
  { id: "rental", label: "Rental Yield" },
];

export function InteractiveInsights() {
  const [activeTab, setActiveTab] = useState<Tab>("growth");
  const [hoveredMarket, setHoveredMarket] = useState<string | null>(null);

  return (
    <section id="insights" className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-gold-400 mb-4">
            Interactive Insights
          </p>
          <h2 className="font-serif text-3xl md:text-5xl mb-4">
            Data that drives decisions
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Explore real performance metrics across Hyderabad micro-markets.
            Hover over charts for detailed breakdowns.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`glass-button rounded-full px-5 py-2 text-sm transition-all ${
                activeTab === tab.id
                  ? "!bg-gold-400/20 !border-gold-400/50 text-gold-300"
                  : "text-white/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-panel rounded-3xl p-6 md:p-8"
        >
          {activeTab === "growth" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-serif text-xl">Circle vs Retail Returns (%)</h3>
                  <p className="text-sm text-white/50 mt-1">Annualised portfolio performance</p>
                </div>
                <div className="flex gap-4 text-xs">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-gold-400" /> Circle Members
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-white/30" /> Retail Market
                  </span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={360}>
                <AreaChart data={portfolioGrowth}>
                  <defs>
                    <linearGradient id="circleGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#d4af37" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#d4af37" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="retailGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="year" stroke="rgba(255,255,255,0.4)" fontSize={12} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} unit="%" />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(11,16,30,0.92)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="circle"
                    stroke="#d4af37"
                    strokeWidth={2}
                    fill="url(#circleGrad)"
                    name="Circle"
                  />
                  <Area
                    type="monotone"
                    dataKey="retail"
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth={2}
                    fill="url(#retailGrad)"
                    name="Retail"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeTab === "markets" && (
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h3 className="font-serif text-xl mb-2">Hyderabad Micro-Markets</h3>
                <p className="text-sm text-white/50 mb-6">
                  Click a market to see detailed metrics
                </p>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={marketInsights}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="market" stroke="rgba(255,255,255,0.4)" fontSize={11} />
                    <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(11,16,30,0.92)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 12,
                      }}
                    />
                    <Bar
                      dataKey="appreciation"
                      fill="#d4af37"
                      radius={[6, 6, 0, 0]}
                      name="Appreciation %"
                      onMouseEnter={(_, index) =>
                        setHoveredMarket(marketInsights[index].market)
                      }
                      onMouseLeave={() => setHoveredMarket(null)}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4">
                {marketInsights.map((market) => {
                  const isActive = hoveredMarket === market.market;
                  return (
                    <motion.div
                      key={market.market}
                      animate={{
                        scale: isActive ? 1.02 : 1,
                        borderColor: isActive
                          ? "rgba(212,175,55,0.5)"
                          : "rgba(255,255,255,0.08)",
                      }}
                      className="glass-panel rounded-xl p-4 cursor-pointer"
                      onMouseEnter={() => setHoveredMarket(market.market)}
                      onMouseLeave={() => setHoveredMarket(null)}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-medium">{market.market}</span>
                        <span className="text-gold-400 text-sm">
                          {market.appreciation}% YoY
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-white/40 text-xs">Rental Yield</p>
                          <p className="text-white/80">{market.yield}%</p>
                        </div>
                        <div>
                          <p className="text-white/40 text-xs">Demand Index</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-accent-cyan rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${market.demand}%` }}
                                transition={{ duration: 0.8 }}
                              />
                            </div>
                            <span className="text-white/80">{market.demand}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "rental" && (
            <div>
              <div className="mb-6">
                <h3 className="font-serif text-xl">Monthly Rental Yield (%)</h3>
                <p className="text-sm text-white/50 mt-1">
                  Projected vs actual rental performance — Circle member portfolio
                </p>
              </div>
              <ResponsiveContainer width="100%" height={360}>
                <LineChart data={rentalProjection}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={12} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} unit="%" domain={[1.5, 4]} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(11,16,30,0.92)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 12,
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="projected"
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Projected"
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#00d4ff"
                    strokeWidth={2}
                    dot={{ fill: "#00d4ff", r: 4 }}
                    name="Actual"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
