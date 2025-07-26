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
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg mb-2">{job.title}</h3>
            {job.isUrgent && (
              <Badge variant="destructive" className="mb-2">
                Срочно
              </Badge>
            )}
          </div>
          <div className="text-right">
            <p className="font-semibold text-primary flex items-center">
              <DollarSign className="w-4 h-4 mr-1" />
              {job.budget}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-gray-600 mb-4 line-clamp-3">{job.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {job.skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>

        <div className="flex items-center text-sm text-gray-500 space-x-4">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {job.location}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {job.timePosted}
          </div>
          <div className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            {job.proposals} предложений
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <div className="flex justify-between items-center w-full">
          <p className="text-sm text-gray-600">Заказчик: {job.client}</p>
          <Button size="sm">
            Откликнуться
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}