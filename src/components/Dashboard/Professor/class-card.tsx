"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BookOpen, Calendar, MoreVertical, Users, FileText, Edit, Trash2 } from "lucide-react"

interface ClassCardProps {
  id: string
  name: string
  description: string
  language: string
  level: string
  studentsCount: number
  materialsCount: number
  startDate: string
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export function ClassCard({
  id,
  name,
  description,
  language,
  level,
  studentsCount,
  materialsCount,
  startDate,
  onEdit,
  onDelete,
}: ClassCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="space-y-1">
          <h3 className="font-semibold text-lg leading-none">{name}</h3>
          <div className="flex flex-wrap gap-1">
            <Badge variant="outline" className="bg-primary/10">
              {language}
            </Badge>
            <Badge variant="outline" className="bg-secondary/10">
              {level}
            </Badge>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit?.(id)}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit Class</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete?.(id)} className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete Class</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="py-2 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
      </CardContent>
      <CardFooter className="pt-2 flex flex-col items-start gap-2">
        <div className="w-full flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Users className="mr-1 h-4 w-4" />
            <span>{studentsCount} students</span>
          </div>
          <div className="flex items-center">
            <FileText className="mr-1 h-4 w-4" />
            <span>{materialsCount} materials</span>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-1 h-4 w-4" />
            <span>Started {startDate}</span>
          </div>
        </div>
        <Button variant="outline" className="w-full mt-2">
          <BookOpen className="mr-2 h-4 w-4" />
          View Class
        </Button>
      </CardFooter>
    </Card>
  )
}

