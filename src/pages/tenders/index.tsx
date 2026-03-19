import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/router";
import {
  Search,
  Filter,
  X,
  ChevronUp,
  ChevronDown,
  Download,
  Trash2,
  FileText,
  MoreVertical,
  CheckSquare,
  Square,
} from "lucide-react";
import Link from "next/link";

interface Tender {
  id: string;
  title: string;
  authority: string;
  location: string;
  deadline: string;
  value: number | string | null;
  service_type: string;
  status: string;
  created_at: string;
  score?: number;
  ai_score?: number | null;
  category?: string | null;
  decision?: string | null;
  dedup_key?: string | null;
  description?: string | null;
  link?: string | null;
}

export default function TendersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [filteredTenders, setFilteredTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTenders, setSelectedTenders] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all");

  // Sort states
  const [sortField, setSortField] = useState<string>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    if (user) {
      fetchTenders();
    }
  }, [user]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [
    tenders,
    searchQuery,
    statusFilter,
    locationFilter,
    serviceTypeFilter,
    scoreFilter,
    sortField,
    sortDirection,
  ]);

  const fetchTenders = async () => {
    try {
      const { data: userData } = await supabase
        .from("users")
        .select("organisation_id")
        .eq("id", user?.id)
        .single();

      if (!userData?.organisation_id) {
        return;
      }

      const { data: tendersData, error } = await supabase
        .from("tenders")
        .select(`
          *,
          tender_scores (
            total_score
          )
        `)
        .eq("organisation_id", userData.organisation_id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const tendersWithScores = tendersData.map((tender) => ({
        ...tender,
        score: tender.tender_scores?.[0]?.total_score || null,
      }));

      setTenders(tendersWithScores);
      setFilteredTenders(tendersWithScores);
    } catch (error) {
      console.error("Error fetching tenders:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...tenders];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (tender) =>
          tender.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tender.authority.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tender.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((tender) => tender.status === statusFilter);
    }

    // Location filter
    if (locationFilter !== "all") {
      filtered = filtered.filter((tender) => tender.location === locationFilter);
    }

    // Service type filter
    if (serviceTypeFilter !== "all") {
      filtered = filtered.filter(
        (tender) => tender.service_type === serviceTypeFilter
      );
    }

    // Score filter
    if (scoreFilter !== "all") {
      filtered = filtered.filter((tender) => {
        if (!tender.score) return scoreFilter === "none";
        if (scoreFilter === "high") return tender.score >= 80;
        if (scoreFilter === "medium") return tender.score >= 60 && tender.score < 80;
        if (scoreFilter === "low") return tender.score < 60;
        return true;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sortField as keyof Tender];
      let bValue: any = b[sortField as keyof Tender];

      if (sortField === "score") {
        aValue = a.score || 0;
        bValue = b.score || 0;
      }

      if (sortField === "deadline" || sortField === "created_at") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (typeof aValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    });

    setFilteredTenders(filtered);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setLocationFilter("all");
    setServiceTypeFilter("all");
    setScoreFilter("all");
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedTenders(new Set());
    } else {
      setSelectedTenders(new Set(filteredTenders.map((t) => t.id)));
    }
    setSelectAll(!selectAll);
  };

  const toggleSelectTender = (id: string) => {
    const newSelected = new Set(selectedTenders);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedTenders(newSelected);
    setSelectAll(newSelected.size === filteredTenders.length);
  };

  const handleBulkAction = async (action: string) => {
    if (selectedTenders.size === 0) return;

    try {
      const tenderIds = Array.from(selectedTenders);

      switch (action) {
        case "export":
          await exportTendersToCSV(tenderIds);
          break;
        case "delete":
          if (confirm(`Delete ${tenderIds.length} tender(s)?`)) {
            await bulkDeleteTenders(tenderIds);
          }
          break;
        case "mark-bid":
          await bulkUpdateStatus(tenderIds, "bid");
          break;
        case "mark-no-bid":
          await bulkUpdateStatus(tenderIds, "no_bid");
          break;
        case "mark-review":
          await bulkUpdateStatus(tenderIds, "review");
          break;
      }

      setSelectedTenders(new Set());
      setSelectAll(false);
    } catch (error) {
      console.error("Bulk action error:", error);
      alert("Failed to complete bulk action");
    }
  };

  const exportTendersToCSV = async (tenderIds: string[]) => {
    const tendersToExport = tenders.filter((t) => tenderIds.includes(t.id));

    const csvHeaders = [
      "Title",
      "Authority",
      "Location",
      "Service Type",
      "Value",
      "Deadline",
      "Status",
      "AI Score",
      "Created Date",
    ];

    const csvRows = tendersToExport.map((tender) => [
      tender.title,
      tender.authority,
      tender.location,
      tender.service_type,
      tender.value?.toString() || "N/A",
      new Date(tender.deadline).toLocaleDateString(),
      tender.status,
      tender.score?.toString() || "N/A",
      new Date(tender.created_at).toLocaleDateString(),
    ]);

    const csvContent = [
      csvHeaders.join(","),
      ...csvRows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tenders-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const bulkDeleteTenders = async (tenderIds: string[]) => {
    const { error } = await supabase
      .from("tenders")
      .delete()
      .in("id", tenderIds);

    if (error) throw error;
    await fetchTenders();
  };

  const bulkUpdateStatus = async (tenderIds: string[], status: string) => {
    const { error } = await supabase
      .from("tenders")
      .update({ status })
      .in("id", tenderIds);

    if (error) throw error;
    await fetchTenders();
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      new: "default",
      review: "secondary",
      bid: "default",
      no_bid: "destructive",
      submitted: "default",
      awarded: "default",
      lost: "destructive",
    };

    return (
      <Badge variant={variants[status] || "default"}>
        {status.replace("_", " ").toUpperCase()}
      </Badge>
    );
  };

  const getScoreBadge = (score: number | null) => {
    if (!score) return <Badge variant="outline">No Score</Badge>;
    if (score >= 80) return <Badge className="bg-green-500">High ({score}%)</Badge>;
    if (score >= 60) return <Badge className="bg-yellow-500">Medium ({score}%)</Badge>;
    return <Badge className="bg-red-500">Low ({score}%)</Badge>;
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="ml-1 h-4 w-4 inline" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4 inline" />
    );
  };

  const activeFiltersCount =
    (searchQuery ? 1 : 0) +
    (statusFilter !== "all" ? 1 : 0) +
    (locationFilter !== "all" ? 1 : 0) +
    (serviceTypeFilter !== "all" ? 1 : 0) +
    (scoreFilter !== "all" ? 1 : 0);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tenders</h1>
            <p className="text-muted-foreground">
              Manage and track all tender opportunities
            </p>
          </div>
          <Button onClick={() => router.push("/tenders/new")}>
            <FileText className="mr-2 h-4 w-4" />
            New Tender
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tenders by title, authority, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="bid">Bid</SelectItem>
                    <SelectItem value="no_bid">No Bid</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="awarded">Awarded</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="w-[140px]">
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

                <Select
                  value={serviceTypeFilter}
                  onValueChange={setServiceTypeFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Service Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    <SelectItem value="Adult Social Care">Adult Social Care</SelectItem>
                    <SelectItem value="Domiciliary Care">Domiciliary Care</SelectItem>
                    <SelectItem value="Learning Disabilities">
                      Learning Disabilities
                    </SelectItem>
                    <SelectItem value="Mental Health">Mental Health</SelectItem>
                    <SelectItem value="Residential Care">Residential Care</SelectItem>
                    <SelectItem value="Supported Living">Supported Living</SelectItem>
                    <SelectItem value="Childrens Services">
                      Children's Services
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select value={scoreFilter} onValueChange={setScoreFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="AI Score" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Scores</SelectItem>
                    <SelectItem value="high">High (80%+)</SelectItem>
                    <SelectItem value="medium">Medium (60-79%)</SelectItem>
                    <SelectItem value="low">Low (&lt;60%)</SelectItem>
                    <SelectItem value="none">No Score</SelectItem>
                  </SelectContent>
                </Select>

                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="gap-1"
                  >
                    <X className="h-4 w-4" />
                    Clear ({activeFiltersCount})
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Bulk Actions */}
            {selectedTenders.size > 0 && (
              <div className="mb-4 flex items-center gap-2 p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">
                  {selectedTenders.size} selected
                </span>
                <div className="flex-1" />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Bulk Actions
                      <MoreVertical className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleBulkAction("mark-bid")}>
                      Mark as Bid
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction("mark-no-bid")}>
                      Mark as No Bid
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction("mark-review")}>
                      Mark as Review
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleBulkAction("export")}>
                      <Download className="mr-2 h-4 w-4" />
                      Export to CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleBulkAction("delete")}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {/* Results Count */}
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {filteredTenders.length} of {tenders.length} tenders
            </div>

            {/* Table */}
            {loading ? (
              <div className="text-center py-8">Loading tenders...</div>
            ) : filteredTenders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No tenders found. Try adjusting your filters.
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12 sticky left-0 bg-background z-10">
                        <Checkbox
                          checked={selectAll}
                          onCheckedChange={toggleSelectAll}
                        />
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50 min-w-[200px] sticky left-12 bg-background z-10"
                        onClick={() => handleSort("title")}
                      >
                        Title
                        <SortIcon field="title" />
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50 min-w-[150px]"
                        onClick={() => handleSort("authority")}
                      >
                        Authority
                        <SortIcon field="authority" />
                      </TableHead>
                      <TableHead className="min-w-[120px]">Location</TableHead>
                      <TableHead className="min-w-[150px]">Service Type</TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50 min-w-[100px]"
                        onClick={() => handleSort("deadline")}
                      >
                        Deadline
                        <SortIcon field="deadline" />
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50 min-w-[100px]"
                        onClick={() => handleSort("value")}
                      >
                        Value
                        <SortIcon field="value" />
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50 min-w-[120px]"
                        onClick={() => handleSort("score")}
                      >
                        AI Score
                        <SortIcon field="score" />
                      </TableHead>
                      <TableHead className="min-w-[100px]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTenders.map((tender) => (
                      <TableRow
                        key={tender.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={(e) => {
                          if ((e.target as HTMLElement).closest("input[type=checkbox]")) {
                            return;
                          }
                          router.push(`/tenders/${tender.id}`);
                        }}
                      >
                        <TableCell onClick={(e) => e.stopPropagation()} className="sticky left-0 bg-background">
                          <Checkbox
                            checked={selectedTenders.has(tender.id)}
                            onCheckedChange={() => toggleSelectTender(tender.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium sticky left-12 bg-background">
                          {tender.title}
                        </TableCell>
                        <TableCell>{tender.authority}</TableCell>
                        <TableCell>{tender.location}</TableCell>
                        <TableCell>{tender.service_type}</TableCell>
                        <TableCell>
                          {new Date(tender.deadline).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {typeof tender.value === 'number' ? `£${tender.value.toLocaleString()}` : tender.value || "N/A"}
                        </TableCell>
                        <TableCell>{getScoreBadge(tender.score)}</TableCell>
                        <TableCell>{getStatusBadge(tender.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}