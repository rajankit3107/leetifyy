import z from 'zod';

export const zodRegisterSchema = z.object({
   name: z
      .string()
      .min(4, { error: `name should be more than 4 characters` })
      .max(20, { error: `name should be less than 20 characters` }),
   email: z.email(),
   password: z
      .string()
      .min(8, { error: `password should be more than 8 characters` })
      .max(16, { error: `password should be less than 16 characters` }),
});

export const zofLoginSchema = z.object({
   email: z.email(),
   password: z
      .string()
      .min(8, { error: `password should be more than 8 characters` })
      .max(16, { error: `password should be less than 16 characters` }),
});
