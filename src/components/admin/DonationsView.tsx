import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const DonationsView = () => {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDonations();

    // Subscribe to real-time updates for donations
    const channel = supabase
      .channel('donations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'donations'
        },
        () => {
          loadDonations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadDonations = async () => {
    const { data } = await supabase
      .from("donations")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setDonations(data);
    setLoading(false);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <div className="text-foreground">Loading donations...</div>;
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Donations</h2>
      
      <div className="mb-6 grid grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Donations</p>
          <p className="text-2xl font-bold text-foreground">{donations.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Amount</p>
          <p className="text-2xl font-bold text-foreground">
            {formatAmount(donations.reduce((sum, d) => sum + Number(d.amount), 0))}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Successful</p>
          <p className="text-2xl font-bold text-foreground">
            {donations.filter(d => d.status === "succeeded").length}
          </p>
        </Card>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Donor</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {donations.map((donation) => (
            <TableRow key={donation.id}>
              <TableCell className="font-medium">{donation.donor_name}</TableCell>
              <TableCell>{donation.email}</TableCell>
              <TableCell>{formatAmount(Number(donation.amount))}</TableCell>
              <TableCell>
                <Badge variant={donation.status === "succeeded" ? "default" : "secondary"}>
                  {donation.status}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(donation.created_at)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {donations.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No donations yet
        </div>
      )}
    </Card>
  );
};
