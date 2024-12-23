import { z } from "zod";

export const PagedList = <T extends z.ZodType>(itemSchema: T) =>
    z.object({
        currentPage: z.number(),
        totalPages: z.number(),
        totalItems: z.number(),
        hasMore: z.boolean(),
        items: z.array(itemSchema),
    });
