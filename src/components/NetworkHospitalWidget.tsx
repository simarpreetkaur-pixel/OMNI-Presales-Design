import { useState } from "react";
import { Search, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const hospitalData: Record<
  string,
  { name: string; distance: string; cashless: boolean }[]
> = {
  "110033": [
    { name: "Max Super Speciality, Saket", distance: "1.8 km", cashless: true },
    { name: "AIIMS, Ansari Nagar", distance: "3.2 km", cashless: true },
    { name: "Fortis Escorts Heart Institute", distance: "4.5 km", cashless: true },
    { name: "Apollo Hospital, Jasola", distance: "5.1 km", cashless: true },
    { name: "Manipal Hospital, Dwarka", distance: "8.3 km", cashless: false },
  ],
  "560001": [
    { name: "Manipal Hospital, Old Airport Rd", distance: "2.3 km", cashless: true },
    { name: "Apollo Hospital, Bannerghatta Rd", distance: "4.1 km", cashless: true },
    { name: "Fortis Hospital, Cunningham Rd", distance: "5.8 km", cashless: true },
    { name: "Narayana Health, Bommasandra", distance: "12.4 km", cashless: true },
  ],
};

const defaultResults = hospitalData["110033"];

const NetworkHospitalWidget = () => {
  const [pincode, setPincode] = useState("110033");
  const [results, setResults] = useState(defaultResults);

  const handleSearch = () => {
    const found = hospitalData[pincode];
    setResults(found || []);
  };

  return (
    <div className="border border-border rounded-xl p-5 bg-card space-y-4 flex-1">
      <div>
        <p className="font-bold text-foreground">🏥 Network Hospitals</p>
        <p className="text-sm text-muted-foreground">
          Find cashless hospitals near the customer
        </p>
      </div>

      <div className="flex gap-2">
        <Input
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          placeholder="Enter pincode"
          className="w-36"
          maxLength={6}
        />
        <Button size="sm" onClick={handleSearch} className="gap-1.5">
          <Search className="h-3.5 w-3.5" />
          Search
        </Button>
      </div>

      {results.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border">
              <TableHead className="font-semibold text-foreground">Hospital</TableHead>
              <TableHead className="font-semibold text-foreground text-center">Distance</TableHead>
              <TableHead className="font-semibold text-foreground text-center">Cashless</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((h, i) => (
              <TableRow key={i}>
                <TableCell className="text-sm text-foreground py-2.5">{h.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground text-center py-2.5">
                  {h.distance}
                </TableCell>
                <TableCell className="text-center py-2.5">
                  {h.cashless ? (
                    <Check className="h-4 w-4 text-green-600 mx-auto" />
                  ) : (
                    <X className="h-4 w-4 text-destructive mx-auto" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-sm text-muted-foreground py-2">
          No hospitals found for this pincode. Try another one.
        </p>
      )}
    </div>
  );
};

export default NetworkHospitalWidget;
