import { parser  } from "./index";

// Our test run on a fixed date:
const parser2023 = parser(new Date("2023-12-25T00:00:00"));

test.each`
  treatment | dob             | expected | description
  ${"A"}    | ${"2005-12-25"} | ${true}  | ${"18 and over can enroll on treatment A"}
  ${"A"}    | ${"2006-12-25"} | ${false} | ${"Under 18 cannot enroll on treatment A"}
  ${"Z"}    | ${"2006-12-25"} | ${false} | ${"Under 21 cannot enroll on treatment Z"}
  ${"Z"}    | ${"2002-12-25"} | ${true}  | ${"21 and over can enroll on treatment Z"}
  `("$description",  ( {treatment, dob, expected, _description} ) => {
    let form = {
      "treatment": treatment,
      "birth_year": dob,
      };
    let result = parser2023.safeParse(form);
    expect(result.success).toBe(expected);
});

test("must select a treatment and give DOB", () => {
  expect(() => parser2023.parse({})).toThrow();
});

test("must fail on missing dob", () => {
  expect(() => parser2023.parse({ "treatment": "A"})).toThrow(/birth_year/);
});

test("must give correct error for treatment Z ", () => {
  let form = { "treatment": "Z", "birth_year": "2006-12-25" };
  expect(() => parser2023.parse(form)).toThrow(/Not old enough for treatment Z/);
});
