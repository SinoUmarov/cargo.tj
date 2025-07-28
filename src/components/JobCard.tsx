import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Clock, MapPin, DollarSign, User } from "lucide-react";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    description: string;
    budget: string;
    location: string;
    timePosted: string;
    skills: string[];
    client: string;
    proposals: number;
    isUrgent?: boolean;
  };
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl border border-border hover:shadow-2xl transition-all duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
            {job.isUrgent && (
              <Badge variant="destructive" className="mt-2">
                Срочно
              </Badge>
            )}
          </div>
          <div className="text-right">
            <span className="inline-flex items-center text-primary font-bold text-lg">
              <DollarSign className="w-4 h-4 mr-1" />
              {job.budget}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{job.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {job.skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="text-xs px-2 py-1 rounded-md">
              {skill}
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap items-center text-xs text-muted-foreground gap-x-6 gap-y-2">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1 text-gray-400" />
            {job.location}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1 text-gray-400" />
            {job.timePosted}
          </div>
          <div className="flex items-center">
            <User className="w-4 h-4 mr-1 text-gray-400" />
            {job.proposals} откликов
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <div className="flex justify-between items-center w-full">
          <p className="text-sm text-gray-500 italic">Заказчик: {job.client}</p>
          <Button
            size="sm"
            className="rounded-full text-sm px-4 hover:scale-105 transition-transform"
          >
            Откликнуться
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
