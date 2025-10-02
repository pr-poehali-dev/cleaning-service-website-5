import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";
import LoginForm from "@/components/admin/LoginForm";
import StatsCards from "@/components/admin/StatsCards";
import BookingsTable from "@/components/admin/BookingsTable";
import BookingDetailDialog from "@/components/admin/BookingDetailDialog";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import ServicesManager from "@/components/admin/ServicesManager";
import UsersManager from "@/components/admin/UsersManager";
import {
  Booking,
  User,
  API_URL,
  USERS_API_URL,
} from "@/components/admin/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number>(1);
  const [currentUserRole, setCurrentUserRole] = useState<string>("super_admin");
  const [activeTab, setActiveTab] = useState("bookings");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { toast } = useToast();

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL, {
        headers: {
          "X-User-Id": currentUserId.toString(),
          "X-User-Role": currentUserRole,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить заявки",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(USERS_API_URL);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && currentUserId) {
      fetchBookings();
      fetchUsers();
    }
  }, [isAuthenticated]);

  const updateBookingStatus = async (
    id: number,
    newStatus: Booking["status"],
  ) => {
    try {
      const response = await fetch(`${API_URL}?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setBookings(
          bookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b)),
        );
        toast({
          title: "Статус обновлён",
          description: "Изменения сохранены",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Ошибка",
          description: errorData.error || "Не удалось обновить статус",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить статус",
        variant: "destructive",
      });
    }
  };

  const updateBookingAssignee = async (
    id: number,
    assigneeId: number | null,
  ) => {
    try {
      const response = await fetch(`${API_URL}?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ assignee_id: assigneeId }),
      });

      if (response.ok) {
        await fetchBookings();
        toast({
          title: "Ответственный обновлён",
          description: assigneeId
            ? "Ответственный назначен"
            : "Ответственный удалён",
        });
        const assignee = assigneeId
          ? users.find((u) => u.id === assigneeId)
          : null;
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking({
            ...selectedBooking,
            assignee_id: assigneeId,
            assignee_name: assignee?.full_name || null,
            status: assigneeId ? "assigned" : selectedBooking.status,
          });
        }
      } else {
        const errorData = await response.json();
        toast({
          title: "Ошибка",
          description: errorData.error || "Не удалось обновить ответственного",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить ответственного",
        variant: "destructive",
      });
    }
  };

  const deleteBooking = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setBookings(bookings.filter((b) => b.id !== id));
        setSelectedBooking(null);
        toast({
          title: "Заявка удалена",
          description: "Заявка успешно удалена из системы",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Ошибка",
          description: errorData.error || "Не удалось удалить заявку",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить заявку",
        variant: "destructive",
      });
    }
  };

  const stats = {
    total: bookings.length,
    new: bookings.filter((b) => b.status === "new").length,
    assigned: bookings.filter((b) => b.status === "assigned").length,
    inProgress: bookings.filter((b) => b.status === "in-progress").length,
    completed: bookings.filter((b) => b.status === "completed").length,
  };

  if (!isAuthenticated) {
    return (
      <LoginForm
        onLogin={(userId: number, userRole: string) => {
          setCurrentUserId(userId);
          setCurrentUserRole(userRole);
          setIsAuthenticated(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Icon name="Shield" className="text-primary" size={32} />
            <h1 className="text-2xl font-bold">
              Админ-панель Top Clean Service
            </h1>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/")}
            >
              <Icon name="Home" size={18} className="mr-2" />
              На сайт
            </Button>
            <Button variant="ghost" onClick={() => setIsAuthenticated(false)}>
              <Icon name="LogOut" size={18} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-3">
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Icon name="ClipboardList" size={18} />
              Заявки
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Icon name="Briefcase" size={18} />
              Услуги
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Icon name="Users" size={18} />
              Пользователи
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-6">
            <StatsCards
              total={stats.total}
              newCount={stats.new}
              assigned={stats.assigned}
              inProgress={stats.inProgress}
              completed={stats.completed}
            />

            <BookingsTable
              bookings={bookings}
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              onSearchChange={setSearchQuery}
              onStatusFilterChange={setStatusFilter}
              onViewBooking={setSelectedBooking}
            />
          </TabsContent>

          <TabsContent value="services">
            <ServicesManager />
          </TabsContent>

          <TabsContent value="users">
            <UsersManager currentUserRole={currentUserRole} />
          </TabsContent>
        </Tabs>
      </main>

      <BookingDetailDialog
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onStatusUpdate={updateBookingStatus}
        onAssigneeUpdate={updateBookingAssignee}
        onDeleteClick={() => setShowDeleteConfirm(true)}
        users={users}
        currentUserRole={currentUserRole}
      />

      <DeleteConfirmDialog
        open={showDeleteConfirm}
        bookingId={selectedBooking?.id}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={() => {
          if (selectedBooking) {
            deleteBooking(selectedBooking.id);
            setShowDeleteConfirm(false);
          }
        }}
      />
    </div>
  );
}
