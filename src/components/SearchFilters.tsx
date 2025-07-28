import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { Search, Filter, X } from "lucide-react";
import { useState } from "react";

interface SearchFiltersProps {
  onSearch: (query: string) => void;
  onFilter: (filters: any) => void;
}

export function SearchFilters({ onSearch, onFilter }: SearchFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState("");
  const [location, setLocation] = useState("");

  const popularSkills = [
    "JavaScript", "React", "Node.js", "Python", "PHP", "WordPress",
    "Design", "Marketing", "SEO", "Copywriting", "Translation", "Data Entry",
  ];

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  const handleSearch = () => {
    onSearch(searchQuery);
    onFilter({ skills: selectedSkills, priceRange, location });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedSkills([]);
    setPriceRange("");
    setLocation("");
    onSearch("");
    onFilter({});
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-md border border-muted">
      {/* Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по ключевым словам..."
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch} className="flex items-center gap-2">
          <Search className="w-4 h-4" />
          Найти
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Select value={priceRange} onValueChange={setPriceRange}>
          <SelectTrigger>
            <SelectValue placeholder="Бюджет" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0-500">$0 – $500</SelectItem>
            <SelectItem value="500-1000">$500 – $1,000</SelectItem>
            <SelectItem value="1000-5000">$1,000 – $5,000</SelectItem>
            <SelectItem value="5000+">$5,000+</SelectItem>
          </SelectContent>
        </Select>

        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger>
            <SelectValue placeholder="Местоположение" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="remote">Удалённо</SelectItem>
            <SelectItem value="moscow">Москва</SelectItem>
            <SelectItem value="spb">Санкт-Петербург</SelectItem>
            <SelectItem value="kiev">Киев</SelectItem>
            <SelectItem value="minsk">Минск</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={clearFilters} className="w-full">
          <X className="w-4 h-4 mr-2" />
          Сбросить
        </Button>
      </div>

      {/* Skills */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Популярные навыки:</h4>
        <div className="flex flex-wrap gap-2">
          {popularSkills.map((skill) => (
            <Badge
              key={skill}
              variant={selectedSkills.includes(skill) ? "default" : "outline"}
              className="cursor-pointer transition-colors hover:bg-primary hover:text-white"
              onClick={() => handleSkillToggle(skill)}
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      {/* Active Filters */}
      {(selectedSkills.length > 0 || priceRange || location) && (
        <div className="mt-6 border-t pt-4">
          <h5 className="text-sm font-medium text-gray-700 mb-2">Активные фильтры:</h5>
          <div className="flex flex-wrap gap-2">
            {selectedSkills.map((skill) => (
              <Badge key={skill} variant="secondary" className="flex items-center">
                {skill}
                <X
                  className="w-3 h-3 ml-1 cursor-pointer"
                  onClick={() => handleSkillToggle(skill)}
                />
              </Badge>
            ))}
            {priceRange && (
              <Badge variant="secondary" className="flex items-center">
                Бюджет: {priceRange}
                <X
                  className="w-3 h-3 ml-1 cursor-pointer"
                  onClick={() => setPriceRange("")}
                />
              </Badge>
            )}
            {location && (
              <Badge variant="secondary" className="flex items-center">
                {location}
                <X
                  className="w-3 h-3 ml-1 cursor-pointer"
                  onClick={() => setLocation("")}
                />
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
