import { render, screen } from "@testing-library/react";
import SummaryForm from "../SummaryForm";
import userEvent from "@testing-library/user-event";
test("initial conditions", () => {
  render(<SummaryForm />);
  const checkbox = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });
  expect(checkbox).not.toBeChecked();

  const confirmButton = screen.getByRole("button", { name: /confirm order/i });
  expect(confirmButton).toBeDisabled();
});

test("checkbox enables button on first click and disables on second click", async () => {
  const user = userEvent.setup();

  render(<SummaryForm />);
  const checkbox = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });
  //Asserts that clicking checkbox to enable the button
  await user.click(checkbox);
  const confirmButton = screen.getByRole("button", { name: /confirm order/i });
  expect(confirmButton).toBeEnabled();
  //Asserts that unclicking the checkbox disables the button
  await user.click(checkbox);
  expect(confirmButton).toBeDisabled();
});

test("popover responds to hover", async () => {
  const user = userEvent.setup();
  render(<SummaryForm />);
  // Assert that popover starts out hidden
  const nullPopover = screen.queryByText(
    //here we use queryBy because we want it to return null without throwing an error.
    /no ice cream will actually be delivered/i
  );
  expect(nullPopover).not.toBeInTheDocument();
  // popover appears on mouseover of checkbox label
  const termsAndConditions = screen.getByText(/terms and conditions/i);
  await user.hover(termsAndConditions);
  const popoverText = screen.getByText(
    //here we use getBy because we want it to return a single match, and throw an error if it returns 0 or multiple matches.
    /no ice cream will actually be delivered/i
  );
  expect(popoverText).toBeInTheDocument();

  // popover dissappears when we mouse out
  await user.unhover(termsAndConditions);
  expect(popoverText).not.toBeInTheDocument();
});
