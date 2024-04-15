import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { server } from "../mocks/server";
import App from "../App";

test.only("order phases for happy path", async () => {
  const user = userEvent.setup();
  const { unmount } = render(<App />);

  // Interact with UI: select items and place an order
  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  await user.clear(vanillaInput);
  await user.type(vanillaInput, "1");

  const cherriesCheckbox = await screen.findByRole("checkbox", {
    name: "Cherries",
  });
  await user.click(cherriesCheckbox);

  const orderButton = await screen.findByRole("button", {
    name: "Order Sundae!",
  });
  await user.click(orderButton);

  // Check the summary information
  const scoopsSubtotal = screen.getByText("Scoops: $", { exact: false });
  expect(scoopsSubtotal).toHaveTextContent("2.00");
  const toppingsSubtotal = screen.getByText("Toppings: $", { exact: false });
  expect(toppingsSubtotal).toHaveTextContent("1.50");

  // Confirm the order
  const termsAndConditions = screen.getByText(/terms and conditions/i);
  await user.click(termsAndConditions);
  expect(termsAndConditions).toBeEnabled();

  const confirmOrderButton = screen.getByRole("button", {
    name: /confirm order/i,
  });
  await user.click(confirmOrderButton);

  // Expect 'Loading' to show
  const loading = screen.getByText(/loading/i);
  expect(loading).toBeInTheDocument();

  // Verify the confirmation message and order number
  // This will inherently wait for the loading to be replaced by the confirmation message
  const thankYouHeader = await screen.findByRole("heading", {
    name: /thank you!/i,
  });
  expect(thankYouHeader).toBeInTheDocument();
  const orderNumber = await screen.findByText(/order number/i);
  expect(orderNumber).toBeInTheDocument();

  // Start a new order
  const newOrderButton = screen.getByRole("button", { name: /new order/i });
  await user.click(newOrderButton);

  // Check that scoops and toppings subtotals have been reset
  const scoopsTotal = await screen.findByText("Scoops total: $0.00");
  expect(scoopsTotal).toBeInTheDocument();
  const toppingsTotal = await screen.findByText("Toppings total: $0.00");
  expect(toppingsTotal).toBeInTheDocument();
  unmount();
});

test("toppings header is not on summary page if no toppings ordered", async () => {
  const user = userEvent.setup();
  const { unmount } = render(<App />);

  // Interact with UI: select items and place an order
  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  await user.clear(vanillaInput);
  await user.type(vanillaInput, "1");

  const orderSummaryButton = screen.getByRole("button", {
    name: /order sundae/i,
  });
  await user.click(orderSummaryButton);

  // Check the summary information
  const scoopsSubtotal = screen.getByText("Scoops: $", { exact: false });
  expect(scoopsSubtotal).toHaveTextContent("2.00");

  // Confirm the order
  const termsAndConditions = screen.getByText(/terms and conditions/i);
  await user.click(termsAndConditions);
  expect(termsAndConditions).toBeEnabled();

  const confirmOrderButton = screen.getByRole("button", {
    name: /confirm order/i,
  });
  await user.click(confirmOrderButton);

  // Expect 'Loading' to show
  const loading = screen.getByText(/loading/i);
  expect(loading).toBeInTheDocument();

  // Verify the confirmation message and order number
  // This will inherently wait for the loading to be replaced by the confirmation message
  const thankYouHeader = await screen.findByRole("heading", {
    name: /thank you!/i,
  });
  expect(thankYouHeader).toBeInTheDocument();
  const orderNumber = await screen.findByText(/order number/i);
  expect(orderNumber).toBeInTheDocument();

  // Start a new order
  const newOrderButton = screen.getByRole("button", { name: /new order/i });
  await user.click(newOrderButton);

  // Check that scoops and toppings subtotals have been reset
  const scoopsHeading = screen.getByRole("heading", { name: "Scoops: $6.00" });
  expect(scoopsHeading).toBeInTheDocument();

  const toppingsHeading = screen.queryByRole("heading", { name: /toppings/i });
  expect(toppingsHeading).not.toBeInTheDocument();
  unmount();
});
