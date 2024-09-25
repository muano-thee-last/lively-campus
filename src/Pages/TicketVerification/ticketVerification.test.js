import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TicketVerification from "./ticketVerification";
// Mocking the TicketInfo component
jest.mock("./ticketDetails", () => ({ ticket }) => (
  <div>{ticket ? `Ticket: ${ticket.userName}` : "No ticket info"}</div>
));

describe("TicketVerification Component", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("renders input and button", () => {
    render(<TicketVerification />);

    // Check that input field and button are in the document
    expect(screen.getByPlaceholderText(/Enter ticket code/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Verify/i })).toBeInTheDocument();
  });

  test("updates input field value when typing", () => {
    render(<TicketVerification />);
    const input = screen.getByPlaceholderText(/Enter ticket code/i);

    fireEvent.change(input, { target: { value: "ABC123" } });
    expect(input.value).toBe("ABC123");
  });

  test("displays loading state when verifying ticket", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ price: 100, userName: "John Doe", purchaseDate: "2023-09-01", ticketCode: "ABC123" }),
    });

    render(<TicketVerification />);

    const button = screen.getByRole("button", { name: /Verify/i });
    fireEvent.click(button);

    // Check that button displays "Verifying..." while loading
    expect(screen.getByText(/Verifying.../i)).toBeInTheDocument();

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  });

  test("displays ticket information on successful verification", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ price: 100, userName: "John Doe", purchaseDate: "2023-09-01", ticketCode: "ABC123" }),
    });

    render(<TicketVerification />);

    fireEvent.change(screen.getByPlaceholderText(/Enter ticket code/i), { target: { value: "ABC123" } });
    fireEvent.click(screen.getByRole("button", { name: /Verify/i }));

    await waitFor(() => screen.getByText(/Ticket: John Doe/i));

    expect(screen.getByText(/Ticket: John Doe/i)).toBeInTheDocument();
  });

  test("displays error message on failed ticket verification", async () => {
    fetch.mockRejectedValueOnce(new Error("API Error"));

    render(<TicketVerification />);

    fireEvent.change(screen.getByPlaceholderText(/Enter ticket code/i), { target: { value: "XYZ456" } });
    fireEvent.click(screen.getByRole("button", { name: /Verify/i }));

    await waitFor(() => screen.getByText(/Unable to verify ticket/i));

    // Check that error message is displayed
    expect(screen.getByText(/Unable to verify ticket/i)).toBeInTheDocument();
  });

  test("disables button while loading", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ price: 100, userName: "John Doe", purchaseDate: "2023-09-01", ticketCode: "ABC123" }),
    });

    render(<TicketVerification />);

    const button = screen.getByRole("button", { name: /Verify/i });
    fireEvent.click(button);

    expect(button).toBeDisabled();

    await waitFor(() => expect(button).not.toBeDisabled());
  });
});
