import React, { useState } from "react"
import { QrReader } from "react-qr-reader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Camera } from "lucide-react"

export default function TicketVerification() {
  const [ticket, setTicket] = useState(null)
  const [ticketNum, setTicketNum] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isCameraActive, setIsCameraActive] = useState(false)

  const handleInputChange = (event) => {
    setTicketNum(event.target.value)
  }

  const verifyTicket = (code) => {
    setIsLoading(true)
    setError("")

    fetch(`https://us-central1-witslivelycampus.cloudfunctions.net/app/verifyTicket?ticketCode=${code}`)
      .then((response) => {
        setIsLoading(false)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        const ticketData = {
          price: `R${data.price}`,
          purchaseDate: data.purchaseDate,
          code: data.ticketCode,
        }
        setTicket(ticketData)
      })
      .catch((error) => {
        console.error("Error fetching ticket:", error)
        setError("Unable to verify ticket. Please try again.")
        setTicket(null)
        setIsLoading(false)
      })
  }

  const handleScan = (result) => {
    if (result) {
      setTicketNum(result)
      verifyTicket(result)
      setIsCameraActive(false)
    }
  }

  const handleError = (error) => {
    console.error(error)
    setError("Error accessing camera. Please try manual input.")
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Ticket Verification</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Enter ticket code"
            value={ticketNum}
            onChange={handleInputChange}
          />
          <Button onClick={() => verifyTicket(ticketNum)} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsCameraActive(!isCameraActive)}
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>

        {isCameraActive && (
          <div className="mt-4">
            <QrReader
              onResult={(result) => result && handleScan(result.getText())}
              onError={handleError}
              constraints={{ facingMode: "environment" }}
              className="w-full"
            />
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {ticket && (
          <Card>
            <CardHeader>
              <CardTitle>Ticket Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Price: {ticket.price}</p>
              <p>Purchase Date: {ticket.purchaseDate}</p>
              <p>Code: {ticket.code}</p>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}