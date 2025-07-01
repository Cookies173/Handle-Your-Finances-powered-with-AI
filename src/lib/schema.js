import { z } from "zod";

export const accountSchema = z.object({
    name: z.string().min(1, "Name is required"),
    type: z.enum(["Current", "Saving"]),
    balance: z.string(1, "Initial balance is required"),
    isDefault: z.boolean().default(false),
});

export const transactionSchema = z.object({
    type: z.enum(["income", "expense"]),
    amount: z.string().min(1, "Amount is reqired"),
    description: z.string().optional(),
    date: z.date({required_error: "Date is required"}),
    accountId: z.string().min(1, "Account is required"),
    category: z.string().min(1, "Category is required"),
    isRecurring: z.boolean().default(false),
    recurringInterval: z.enum(["daily", "weekly", "monthly", "yearly"]).optional(),
}).superRefine((data, ctx) => {
    if(data.isRecurring && !data.recurringInterval){
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Recurring Interval is required for recurring transactions",
            path: ["recurringInterval"],
        });
    }
});