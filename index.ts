import { z } from "zod";
import { subYears, differenceInYears } from "date-fns";

const treatmentOptions = z.union( [
  z.literal("A"),
  z.literal("B"),
  z.literal("Z"),
  ] );

type TreatmentOption = z.infer<typeof treatmentOptions>

const maxDob = (treatment: TreatmentOption, now: Date) => {
  switch (treatment) {
    case "A":
    case "B":
      const minus18Years = subYears(now, 18);
      return z.coerce.date().max(minus18Years, "Not old enough for treatment A or B");
    case "Z":
      const minus21Years = subYears(now, 21);
      return z.coerce.date().max(minus21Years, "Not old enough for treatment Z");
  }
};
  
export const parser = (now: Date) =>
  z.object({
    treatment: treatmentOptions,
    birth_year: z.coerce.date()
  }).superRefine( (form, ctx) => {
     let result = maxDob(form.treatment, now).safeParse(form.birth_year);
     if (!result.success) {
       result.error.issues.forEach( (issue) => ctx.addIssue(issue) );
     } 
   })
      
;


