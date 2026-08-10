"use client";

import { Reveal } from "@/components/ui/Reveal";
import {
  allocationDemoData,
  screeningDemoData,
} from "@/data/opportunities";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

type View = "matrix" | "allocation";

export function Intelligence() {
  const [view, setView] = useState<View>("matrix");

  return (
    <section id="intelligence" className="section-pad">
      <div className="container-page">
        <Reveal className="mb-10 max-w-2xl">
          <p className="eyebrow mb-5">Investment intelligence</p>
          <h2 className="heading-lg">
            Better decisions start with better information.
          </h2>
          <p className="body-lg mt-4">
            Sample visualization of how we think about screening categories —
            demo data only until live models are connected.
          </p>
        </Reveal>

        <Reveal>
          <div className="surface-card p-5 md:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-[0.14em] text-text-muted">
                Sample / demo data
              </p>
              <div className="flex gap-2">
                {(
                  [
                    ["matrix", "Risk vs Opportunity"],
                    ["allocation", "Capital allocation"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setView(key)}
                    className={cn(
                      "rounded-full border px-3.5 py-2 text-xs transition",
                      view === key
                        ? "border-accent/40 bg-accent-soft text-text-primary"
                        : "border-border text-text-secondary hover:text-text-primary",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[320px] w-full md:h-[380px]">
              {view === "matrix" ? (
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                    <XAxis
                      type="number"
                      dataKey="risk"
                      name="Risk"
                      domain={[0, 100]}
                      tick={{ fill: "#71717A", fontSize: 12 }}
                      axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                      tickLine={false}
                      label={{
                        value: "Risk →",
                        position: "insideBottom",
                        offset: -2,
                        fill: "#A1A1AA",
                        fontSize: 12,
                      }}
                    />
                    <YAxis
                      type="number"
                      dataKey="opportunity"
                      name="Opportunity"
                      domain={[0, 100]}
                      tick={{ fill: "#71717A", fontSize: 12 }}
                      axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                      tickLine={false}
                      label={{
                        value: "Opportunity →",
                        angle: -90,
                        position: "insideLeft",
                        fill: "#A1A1AA",
                        fontSize: 12,
                      }}
                    />
                    <ZAxis type="number" dataKey="size" range={[80, 400]} />
                    <Tooltip
                      cursor={{ strokeDasharray: "3 3" }}
                      contentStyle={{
                        background: "#111113",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 8,
                        color: "#F5F5F5",
                      }}
                      formatter={(value, name) => [
                        value ?? "",
                        String(name),
                      ]}
                      labelFormatter={(_, payload) =>
                        payload?.[0]?.payload?.name || ""
                      }
                    />
                    <Scatter data={screeningDemoData} fill="#C9A96E">
                      {screeningDemoData.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill="#C9A96E"
                          fillOpacity={0.85}
                        />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={allocationDemoData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={120}
                      paddingAngle={3}
                    >
                      {allocationDemoData.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "#111113",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 8,
                        color: "#F5F5F5",
                      }}
                      formatter={(value) => [`${value}%`, "Allocation"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <ul className="mt-4 flex flex-wrap gap-4 text-xs text-text-secondary">
              {(view === "matrix" ? screeningDemoData : allocationDemoData).map(
                (item) => (
                  <li key={item.name} className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-accent" />
                    {item.name}
                  </li>
                ),
              )}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
