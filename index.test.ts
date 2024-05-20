import { parser  } from "./index";

// Our test run on a fixed date:
const parser2023 = parser(new Date("2023-12-25T00:00:00"));

test.each`
  treatment | dob             | expected | description
  ${"A"}    | ${"2005-12-25"} | ${true}  | ${"18 and over is allowed on treatment A"}
  ${"A"}    | ${"2006-12-25"} | ${false} | ${"Under 18 cannot be on treatment A"}
  ${"Z"}    | ${"2006-12-25"} | ${false} | ${"Under 21 cannot be on treatment Z"}
  ${"Z"}    | ${"2002-12-25"} | ${true}  | ${"21 and over can be on treatment Z"}
  `("$description",  ( {treatment, dob, expected, _description} ) => {
    let form = {
      "treatment": treatment,
      "birth_year": dob,
      };
    let result = parser2023.safeParse(form);
    expect(result.success).toBe(expected);
});

