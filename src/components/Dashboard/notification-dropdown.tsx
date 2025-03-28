"use client"

import * as React from "react"
import { Bell } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

// Sample notification data
const notifications = [
  {
    id: 1,
    title: "New student joined your Spanish class",
    description: "Maria Garcia has joined Spanish for Beginners",
    date: new Date(2023, 2, 15, 10, 30),
    read: false,
    type: "student",
  },
  {
    id: 2,
    title: "Assignment submitted",
    description: "John Smith submitted the Spanish vocabulary assignment",
    date: new Date(2023, 2, 14, 15, 45),
    read: false,
    type: "assignment",
  },
  {
    id: 3,
    title: "New material available",
    description: "You've uploaded 'Spanish Conversation Guide' to your class",
    date: new Date(2023, 2, 13, 9, 15),
    read: true,
    type: "material",
  },
  {
    id: 4,
    title: "Class reminder",
    description: "Your French Intermediate class starts in 1 hour",
    date: new Date(2023, 2, 12, 13, 0),
    read: true,
    type: "reminder",
  },
  {
    id: 5,
    title: "System update",
    description: "EduLang platform has been updated with new features",
    date: new Date(2023, 2, 10, 8, 30),
    read: true,
    type: "system",
  },
]

export function NotificationDropdown() {
  const [open, setOpen] = React.useState(false)
  const [notificationState, setNotificationState] = React.useState(notifications)

  const unreadCount = notificationState.filter((n) => !n.read).length

  const markAsRead = (id: number) => {
    setNotificationState((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotificationState((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-4">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-blue-600 hover:text-blue-800"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <Separator />
        {notificationState.length > 0 ? (
          <ScrollArea className="h-[300px]">
            {notificationState.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start p-4 cursor-default ${!notification.read ? "bg-muted/50" : ""}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start justify-between w-full">
                  <span className="font-medium">{notification.title}</span>
                  {!notification.read && <span className="h-2 w-2 rounded-full bg-blue-600 mt-1.5"></span>}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                  <time dateTime={notification.date.toISOString()}>
                    {formatDistanceToNow(notification.date, { addSuffix: true })}
                  </time>
                </div>
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            <p>No notifications</p>
          </div>
        )}
        <Separator />
        <div className="p-2">
          <Button variant="outline" size="sm" className="w-full">
            View all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

