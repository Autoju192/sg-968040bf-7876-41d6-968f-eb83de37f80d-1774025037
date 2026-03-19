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
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
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
  Eye,
  Edit,
  Star,
  MessageSquare,
  Check,
  XCircle,
  Calendar,
  Settings2,
  SlidersHorizontal,
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

type FilterPreset = "all" | "my_bids" | "high_scores" | "urgent" | "review";

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
  const [scoreRange, setScoreRange] = useState([0, 100]);
  const [deadlineFilter, setDeadlineFilter] = useState("all");
  const [activePreset, setActivePreset] = useState<FilterPreset>("all");

  // UI states
  const [showFilters, setShowFilters] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    title: true,
    authority: true,
    location: true,
    service_type: true,
    deadline: true,
    value: true,
    score: true,
    status: true,
    actions: true,
  });

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
    scoreRange,
    deadlineFilter,
    activePreset,
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

    // Apply preset filters
    if (activePreset !== "all") {
      filtered = applyPreset(filtered, activePreset);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (tender) =>
          tender.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tender.authority.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tender.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tender.description?.toLowerCase().includes(searchQuery.toLowerCase())
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

    // Score range filter
    filtered = filtered.filter((tender) => {
      if (!tender.score) return scoreRange[0] === 0;
      return tender.score >= scoreRange[0] && tender.score <= scoreRange[1];
    });

    // Deadline filter
    if (deadlineFilter !== "all") {
      filtered = filterByDeadline(filtered, deadlineFilter);
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

  const applyPreset = (tenders: Tender[], preset: FilterPreset) => {
    const now = new Date();
    switch (preset) {
      case "my_bids":
        return tenders.filter((t) => t.status === "bid" || t.decision === "bid");
      case "high_scores":
        return tenders.filter((t) => (t.score || 0) >= 80);
      case "urgent":
        return tenders.filter((t) => {
          const deadline = new Date(t.deadline);
          const daysUntil = Math.floor(
            (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          );
          return daysUntil <= 7 && daysUntil >= 0;
        });
      case "review":
        return tenders.filter((t) => t.status === "review");
      default:
        return tenders;
    }
  };

  const filterByDeadline = (tenders: Tender[], filter: string) => {
    const now = new Date();
    return tenders.filter((tender) => {
      const deadline = new Date(tender.deadline);
      const daysUntil = Math.floor(
        (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      switch (filter) {
        case "today":
          return daysUntil === 0;
        case "this_week":
          return daysUntil >= 0 && daysUntil <= 7;
        case "this_month":
          return daysUntil >= 0 && daysUntil <= 30;
        case "overdue":
          return daysUntil < 0;
        default:
          return true;
      }
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setLocationFilter("all");
    setServiceTypeFilter("all");
    setScoreRange([0, 100]);
    setDeadlineFilter("all");
    setActivePreset("all");
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

  const handleQuickAction = async (tenderId: string, action: string) => {
    try {
      switch (action) {
        case "view":
          router.push(`/tenders/${tenderId}`);
          break;
        case "bid":
          await supabase
            .from("tenders")
            .update({ decision: "bid", status: "bid" })
            .eq("id", tenderId);
          await fetchTenders();
          break;
        case "no-bid":
          await supabase
            .from("tenders")
            .update({ decision: "no_bid", status: "no_bid" })
            .eq("id", tenderId);
          await fetchTenders();
          break;
        case "chat":
          router.push(`/tenders/${tenderId}?tab=chat`);
          break;
      }
    } catch (error) {
      console.error("Quick action error:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; icon: any }> = {
      new: { variant: "default", icon: null },
      review: { variant: "secondary", icon: Eye },
      bid: { variant: "default", icon: Check },
      no_bid: { variant: "destructive", icon: XCircle },
      submitted: { variant: "default", icon: FileText },
      awarded: { variant: "default", icon: Star },
      lost: { variant: "destructive", icon: XCircle },
    };

    const config = variants[status] || { variant: "default", icon: null };
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        {Icon && <Icon className="h-3 w-3" />}
        {status.replace("_", " ").toUpperCase()}
      </Badge>
    );
  };

  const getScoreBadge = (score: number | null) => {
    if (!score) return <Badge variant="outline">No Score</Badge>;
    if (score >= 80)
      return (
        <div className="flex items-center gap-2">
          <Progress value={score} className="h-2 w-16 bg-green-100" />
          <span className="text-sm font-medium text-green-600">{score}%</span>
        </div>
      );
    if (score >= 60)
      return (
        <div className="flex items-center gap-2">
          <Progress value={score} className="h-2 w-16 bg-yellow-100" />
          <span className="text-sm font-medium text-yellow-600">{score}%</span>
        </div>
      );
    return (
      <div className="flex items-center gap-2">
        <Progress value={score} className="h-2 w-16 bg-red-100" />
        <span className="text-sm font-medium text-red-600">{score}%</span>
      </div>
    );
  };

  const getDeadlineUrgency = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const daysUntil = Math.floor(
      (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntil < 0) {
      return { color: "text-red-600 font-semibold", label: "Overdue" };
    } else if (daysUntil === 0) {
      return { color: "text-red-600 font-semibold", label: "Today!" };
    } else if (daysUntil <= 3) {
      return { color: "text-orange-600 font-medium", label: `${daysUntil}d` };
    } else if (daysUntil <= 7) {
      return { color: "text-yellow-600", label: `${daysUntil}d` };
    } else {
      return { color: "text-muted-foreground", label: `${daysUntil}d` };
    }
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
    (scoreRange[0] !== 0 || scoreRange[1] !== 100 ? 1 : 0) +
    (deadlineFilter !== "all" ? 1 : 0);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
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

        {/* Filter Presets */}
        <div className="flex gap-2 flex-wrap">
          {(
            [
              { id: "all", label: "All Tenders", icon: null },
              { id: "my_bids", label: "My Bids", icon: Check },
              { id: "high_scores", label: "High Scores", icon: Star },
              { id: "urgent", label: "Urgent", icon: Calendar },
              { id: "review", label: "Review", icon: Eye },
            ] as const
          ).map((preset) => {
            const Icon = preset.icon;
            return (
              <Button
                key={preset.id}
                variant={activePreset === preset.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActivePreset(preset.id)}
                className="gap-1"
              >
                {Icon && <Icon className="h-3 w-3" />}
                {preset.label}
              </Button>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by title, authority, location, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filter Toggle & Column Settings */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-1"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Settings2 className="h-4 w-4" />
                      Columns
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {Object.entries(visibleColumns).map(([key, visible]) => (
                      <DropdownMenuCheckboxItem
                        key={key}
                        checked={visible}
                        onCheckedChange={(checked) =>
                          setVisibleColumns((prev) => ({ ...prev, [key]: checked }))
                        }
                      >
                        {key.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Status" />
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
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <Select value={locationFilter} onValueChange={setLocationFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Locations" />
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
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Service Type</label>
                    <Select value={serviceTypeFilter} onValueChange={setServiceTypeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Services" />
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
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Deadline</label>
                    <Select value={deadlineFilter} onValueChange={setDeadlineFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Deadlines" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Deadlines</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="this_week">This Week</SelectItem>
                        <SelectItem value="this_month">This Month</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">AI Score Range</label>
                    <span className="text-sm text-muted-foreground">
                      {scoreRange[0]}% - {scoreRange[1]}%
                    </span>
                  </div>
                  <Slider
                    min={0}
                    max={100}
                    step={5}
                    value={scoreRange}
                    onValueChange={setScoreRange}
                    className="w-full"
                  />
                </div>

                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="gap-1"
                  >
                    <X className="h-4 w-4" />
                    Clear All Filters ({activeFiltersCount})
                  </Button>
                )}
              </div>
            )}
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
                      <Check className="mr-2 h-4 w-4" />
                      Mark as Bid
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction("mark-no-bid")}>
                      <XCircle className="mr-2 h-4 w-4" />
                      Mark as No Bid
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction("mark-review")}>
                      <Eye className="mr-2 h-4 w-4" />
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
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{filteredTenders.length}</span> of{" "}
                <span className="font-medium">{tenders.length}</span> tenders
              </p>
              {activePreset !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  {activePreset.replace("_", " ").toUpperCase()} VIEW
                </Badge>
              )}
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
                      {visibleColumns.title && (
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50 min-w-[250px] sticky left-12 bg-background z-10"
                          onClick={() => handleSort("title")}
                        >
                          Title
                          <SortIcon field="title" />
                        </TableHead>
                      )}
                      {visibleColumns.authority && (
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50 min-w-[150px]"
                          onClick={() => handleSort("authority")}
                        >
                          Authority
                          <SortIcon field="authority" />
                        </TableHead>
                      )}
                      {visibleColumns.location && (
                        <TableHead className="min-w-[120px]">Location</TableHead>
                      )}
                      {visibleColumns.service_type && (
                        <TableHead className="min-w-[150px]">Service Type</TableHead>
                      )}
                      {visibleColumns.deadline && (
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50 min-w-[120px]"
                          onClick={() => handleSort("deadline")}
                        >
                          Deadline
                          <SortIcon field="deadline" />
                        </TableHead>
                      )}
                      {visibleColumns.value && (
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50 min-w-[120px]"
                          onClick={() => handleSort("value")}
                        >
                          Value
                          <SortIcon field="value" />
                        </TableHead>
                      )}
                      {visibleColumns.score && (
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50 min-w-[140px]"
                          onClick={() => handleSort("score")}
                        >
                          AI Score
                          <SortIcon field="score" />
                        </TableHead>
                      )}
                      {visibleColumns.status && (
                        <TableHead className="min-w-[120px]">Status</TableHead>
                      )}
                      {visibleColumns.actions && (
                        <TableHead className="min-w-[120px] sticky right-0 bg-background">
                          Actions
                        </TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTenders.map((tender) => {
                      const urgency = getDeadlineUrgency(tender.deadline);
                      return (
                        <TableRow
                          key={tender.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={(e) => {
                            if (
                              (e.target as HTMLElement).closest(
                                "input[type=checkbox], button"
                              )
                            ) {
                              return;
                            }
                            router.push(`/tenders/${tender.id}`);
                          }}
                        >
                          <TableCell
                            onClick={(e) => e.stopPropagation()}
                            className="sticky left-0 bg-background"
                          >
                            <Checkbox
                              checked={selectedTenders.has(tender.id)}
                              onCheckedChange={() => toggleSelectTender(tender.id)}
                            />
                          </TableCell>
                          {visibleColumns.title && (
                            <TableCell className="font-medium sticky left-12 bg-background">
                              <div className="flex flex-col gap-1">
                                <span className="line-clamp-1">{tender.title}</span>
                                {tender.description && (
                                  <span className="text-xs text-muted-foreground line-clamp-1">
                                    {tender.description}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                          )}
                          {visibleColumns.authority && (
                            <TableCell>{tender.authority}</TableCell>
                          )}
                          {visibleColumns.location && (
                            <TableCell>{tender.location}</TableCell>
                          )}
                          {visibleColumns.service_type && (
                            <TableCell>
                              <Badge variant="outline">{tender.service_type}</Badge>
                            </TableCell>
                          )}
                          {visibleColumns.deadline && (
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <span className={urgency.color}>
                                  {new Date(tender.deadline).toLocaleDateString()}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {urgency.label}
                                </span>
                              </div>
                            </TableCell>
                          )}
                          {visibleColumns.value && (
                            <TableCell>
                              {typeof tender.value === "number"
                                ? `£${tender.value.toLocaleString()}`
                                : tender.value || "N/A"}
                            </TableCell>
                          )}
                          {visibleColumns.score && (
                            <TableCell>{getScoreBadge(tender.score)}</TableCell>
                          )}
                          {visibleColumns.status && (
                            <TableCell>{getStatusBadge(tender.status)}</TableCell>
                          )}
                          {visibleColumns.actions && (
                            <TableCell
                              onClick={(e) => e.stopPropagation()}
                              className="sticky right-0 bg-background"
                            >
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleQuickAction(tender.id, "view")}
                                  className="h-8 w-8 p-0"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleQuickAction(tender.id, "bid")}
                                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleQuickAction(tender.id, "no-bid")}
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleQuickAction(tender.id, "chat")}
                                  className="h-8 w-8 p-0"
                                >
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })}
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