import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, Filter, FileText } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Tender {
  id: string;
  title: string;
  authority: string;
  deadline: string;
  value: number;
  ai_score: number;
  decision: string | null;
  status: string;
  location: string;
  service_type: string;
}

export default function TendersPage() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  useEffect(() => {
    fetchTenders();
  }, [statusFilter, locationFilter]);

  async function fetchTenders() {
    try {
      let query = supabase
        .from("tenders")
        .select("*")
        .order("deadline", { ascending: true });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      if (locationFilter !== "all") {
        query = query.eq("location", locationFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setTenders(data || []);
    } catch (error) {
      console.error("Error fetching tenders:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredTenders = tenders.filter((tender) =>
    tender.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tender.authority.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function getScoreColor(score: number) {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  }

  function getDecisionBadge(decision: string | null) {
    if (!decision) return <Badge variant="secondary">Review</Badge>;
    if (decision === "bid") return <Badge className="bg-green-600">Bid</Badge>;
    if (decision === "no_bid") return <Badge variant="destructive">No Bid</Badge>;
    return <Badge variant="secondary">Review</Badge>;
  }

  return (
    <Layout>
      <SEO
        title="Tenders - TenderFlow AI"
        description="Manage and analyse care sector tenders with AI"
      />

      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold mb-2">Tenders</h1>
            <p className="text-muted-foreground">
              AI-powered tender discovery and analysis
            </p>
          </div>
          <Link href="/tenders/new">
            <Button size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              Add Tender
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-lg border border-border p-6 mb-6 shadow-soft">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search tenders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="bid">Bid</SelectItem>
                <SelectItem value="no_bid">No Bid</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
              </SelectContent>
            </Select>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="London">London</SelectItem>
                <SelectItem value="Manchester">Manchester</SelectItem>
                <SelectItem value="Birmingham">Birmingham</SelectItem>
                <SelectItem value="Leeds">Leeds</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border border-border shadow-medium overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Tender</TableHead>
                <TableHead className="font-semibold">Authority</TableHead>
                <TableHead className="font-semibold">Deadline</TableHead>
                <TableHead className="font-semibold">Value</TableHead>
                <TableHead className="font-semibold">AI Score</TableHead>
                <TableHead className="font-semibold">Decision</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Loading tenders...
                  </TableCell>
                </TableRow>
              ) : filteredTenders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-muted-foreground font-medium">No tenders found</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Try adjusting your filters or add a new tender
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTenders.map((tender) => (
                  <TableRow key={tender.id} className="hover:bg-muted/50 cursor-pointer">
                    <TableCell>
                      <Link href={`/tenders/${tender.id}`} className="hover:underline">
                        <div className="font-medium">{tender.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {tender.service_type} • {tender.location}
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm">{tender.authority}</TableCell>
                    <TableCell className="text-sm">
                      {new Date(tender.deadline).toLocaleDateString("en-GB")}
                    </TableCell>
                    <TableCell className="font-medium">
                      {tender.value ? new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(tender.value) : "N/A"}
                    </TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getScoreColor(
                          tender.ai_score
                        )}`}
                      >
                        {tender.ai_score}%
                      </div>
                    </TableCell>
                    <TableCell>{getDecisionBadge(tender.decision)}</TableCell>
                    <TableCell>
                      <Link href={`/tenders/${tender.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
}