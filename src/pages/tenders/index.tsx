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
import { Plus, Search, Filter, FileText, X, ArrowUpDown } from "lucide-react";
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
  created_at: string;
}

type SortField = "deadline" | "value" | "ai_score" | "created_at" | "title";
type SortOrder = "asc" | "desc";

export default function TendersPage() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [sortField, setSortField] = useState<SortField>("deadline");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  useEffect(() => {
    fetchTenders();
  }, [statusFilter, locationFilter, serviceTypeFilter, scoreFilter, sortField, sortOrder]);

  async function fetchTenders() {
    try {
      let query = supabase
        .from("tenders")
        .select("*");

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      if (locationFilter !== "all") {
        query = query.eq("location", locationFilter);
      }

      if (serviceTypeFilter !== "all") {
        query = query.eq("service_type", serviceTypeFilter);
      }

      if (scoreFilter !== "all") {
        if (scoreFilter === "high") {
          query = query.gte("ai_score", 80);
        } else if (scoreFilter === "medium") {
          query = query.gte("ai_score", 60).lt("ai_score", 80);
        } else if (scoreFilter === "low") {
          query = query.lt("ai_score", 60);
        }
      }

      query = query.order(sortField, { ascending: sortOrder === "asc" });

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

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  }

  function clearFilters() {
    setSearchQuery("");
    setStatusFilter("all");
    setLocationFilter("all");
    setServiceTypeFilter("all");
    setScoreFilter("all");
    setSortField("deadline");
    setSortOrder("asc");
  }

  const activeFilterCount = [
    statusFilter !== "all",
    locationFilter !== "all",
    serviceTypeFilter !== "all",
    scoreFilter !== "all",
    searchQuery !== ""
  ].filter(Boolean).length;

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
          <div className="space-y-4">
            {/* Search and Clear */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search tenders by title or authority..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              {activeFilterCount > 0 && (
                <Button variant="outline" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-2" />
                  Clear All ({activeFilterCount})
                </Button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  <SelectItem value="Liverpool">Liverpool</SelectItem>
                  <SelectItem value="Newcastle">Newcastle</SelectItem>
                  <SelectItem value="Bristol">Bristol</SelectItem>
                  <SelectItem value="Sheffield">Sheffield</SelectItem>
                </SelectContent>
              </Select>

              <Select value={serviceTypeFilter} onValueChange={setServiceTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Service Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  <SelectItem value="Adult Social Care">Adult Social Care</SelectItem>
                  <SelectItem value="Domiciliary Care">Domiciliary Care</SelectItem>
                  <SelectItem value="Learning Disabilities">Learning Disabilities</SelectItem>
                  <SelectItem value="Mental Health">Mental Health</SelectItem>
                  <SelectItem value="Residential Care">Residential Care</SelectItem>
                  <SelectItem value="Supported Living">Supported Living</SelectItem>
                  <SelectItem value="Children's Services">Children&apos;s Services</SelectItem>
                </SelectContent>
              </Select>

              <Select value={scoreFilter} onValueChange={setScoreFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="AI Score" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Scores</SelectItem>
                  <SelectItem value="high">High (80%+)</SelectItem>
                  <SelectItem value="medium">Medium (60-79%)</SelectItem>
                  <SelectItem value="low">Low (&lt;60%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Filter Chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    Search: {searchQuery}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery("")} />
                  </Badge>
                )}
                {statusFilter !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Status: {statusFilter}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setStatusFilter("all")} />
                  </Badge>
                )}
                {locationFilter !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Location: {locationFilter}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setLocationFilter("all")} />
                  </Badge>
                )}
                {serviceTypeFilter !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Service: {serviceTypeFilter}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setServiceTypeFilter("all")} />
                  </Badge>
                )}
                {scoreFilter !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Score: {scoreFilter}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setScoreFilter("all")} />
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredTenders.length} of {tenders.length} tenders
          </p>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border border-border shadow-medium overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">
                  <button
                    onClick={() => toggleSort("title")}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    Tender
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead className="font-semibold">Authority</TableHead>
                <TableHead className="font-semibold">
                  <button
                    onClick={() => toggleSort("deadline")}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    Deadline
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead className="font-semibold">
                  <button
                    onClick={() => toggleSort("value")}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    Value
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead className="font-semibold">
                  <button
                    onClick={() => toggleSort("ai_score")}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    AI Score
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
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