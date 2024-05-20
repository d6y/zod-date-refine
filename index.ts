import { z } from "zod";
import { subYears, differenceInYears } from "date-fns";

const treatmentOptions = z.union( [
  z.literal("A"),
  z.literal("B"),
  z.literal("Z"),
  ] );

type TreatmentOption = z.infer<typeof treatmentOptions>

const limitedTreatment = (treatment: TreatmentOption, now: Date) => {

  const minus18Years = subYears(now, 18);
  const minus21Years = subYears(now, 21);

  switch (treatment) {
    case "A":
    case "B":
      return z.coerce.date().max(minus18Years, "Not old enough for treatment A or B");
    case "Z":
      return z.coerce.date().max(minus21Years, "Not old enough for treatment Z");
  }
};
  
export const parser = (now: Date) => {

  return z.object({
    treatment: treatmentOptions,
    birth_year: z.coerce.date()
  }).refine(data =>
    limitedTreatment(data.treatment, now).safeParse(data.birth_year).success
  );
  
};


