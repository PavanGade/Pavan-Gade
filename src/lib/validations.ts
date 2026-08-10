import { z } from "zod";

export const leadFormSchema = z.object({
  fullName: z
    .string()
    .min(2, "Please enter your full name")
    .max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(8, "Please enter a valid phone number")
    .max(20, "Phone number is too long")
    .regex(/^[+\d\s()-]+$/, "Please enter a valid phone number"),
  city: z.string().max(80).optional().or(z.literal("")),
  investmentInterest: z.enum(
    [
      "Real Estate",
      "Private Businesses",
      "Startups",
      "Alternative Investments",
      "General Investor Network",
    ],
    { message: "Please select an investment interest" },
  ),
  investmentRange: z
    .enum([
      "₹10L–₹25L",
      "₹25L–₹50L",
      "₹50L–₹1Cr",
      "₹1Cr+",
      "Prefer to discuss",
      "",
    ])
    .optional(),
  message: z.string().max(2000).optional().or(z.literal("")),
});

export type LeadFormSchema = z.infer<typeof leadFormSchema>;

export const investmentInterestOptions = [
  "Real Estate",
  "Private Businesses",
  "Startups",
  "Alternative Investments",
  "General Investor Network",
] as const;

export const investmentRangeOptions = [
  "₹10L–₹25L",
  "₹25L–₹50L",
  "₹50L–₹1Cr",
  "₹1Cr+",
  "Prefer to discuss",
] as const;
