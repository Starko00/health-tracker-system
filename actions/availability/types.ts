
import { z } from "zod";

export const inputAvailabilitySchema = z.object({
    start_time: z.string().nonempty("Start time is required"),
    end_time: z.string().nonempty("End time is required"),
    duration: z.number().nonnegative("Duration must be a positive number").min(1, "Duration must be a positive number"),
    daily_availability: z.object({
        monday: z.object({
            start_time: z.string(),
            end_time: z.string(),
            all_day: z.boolean(),
            disabled: z.boolean(),
        }),
        tuesday: z.object({
            start_time: z.string(),
            end_time: z.string(),
            all_day: z.boolean(),
            disabled: z.boolean(),
        }),
        wednesday: z.object({
            start_time: z.string(),
            end_time: z.string(),
            all_day: z.boolean(),
            disabled: z.boolean(),
        }),
        thursday: z.object({
            start_time: z.string(),
            end_time: z.string(),
            all_day: z.boolean(),
            disabled: z.boolean(),
        }),
        friday: z.object({
            start_time: z.string(),
            end_time: z.string(),
            all_day: z.boolean(),
            disabled: z.boolean(),
        }),
        saturday: z.object({
            start_time: z.string(),
            end_time: z.string(),
            all_day: z.boolean(),
            disabled: z.boolean(),
        }),
        sunday: z.object({
            start_time: z.string(),
            end_time: z.string(),
            all_day: z.boolean(),
            disabled: z.boolean(),
        }),
    }).required()

})