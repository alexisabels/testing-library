import { useState } from "react";
import Container from "react-bootstrap/Container";

import OrderConfirmation from "./pages/confirmation/OrderConfirmation";
import OrderEntry from "./pages/entry/OrderEntry";
import OrderSummary from "./pages/summary/OrderSummary";

import { OrderDetailsProvider } from "./contexts/OrderDetails";

export default function App() {
  return (
    <OrderDetailsProvider>
      <Container>
        <OrderEntry />
      </Container>
    </OrderDetailsProvider>
  );
}
