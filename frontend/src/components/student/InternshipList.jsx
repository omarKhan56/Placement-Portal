//frontend/src/components/student/InternshipList.jsx

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Search, MapPin, Clock, Briefcase, DollarSign, TrendingUp, Filter } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../api/axios';

export default function InternshipList() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    mode: '',
  });

  useEffect(() => {
    fetchInternships();
  }, [filters]);

  const fetchInternships = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.department) params.append('department', filters.department);
      if (filters.mode) params.append('mode', filters.mode);

      const res = await api.get(`/internship?${params.toString()}`);
      setInternships(res.data.data || []);
    } catch (error) {
      console.error('Error fetching internships:', error);
      toast.error('Failed to fetch internships');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (internshipId) => {
    try {
      await api.post('/application', { internshipId });
      toast.success('Application submitted successfully! 🎉');
      fetchInternships(); // Refresh to update seat counts
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchInternships();
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-600" />
            All Internships
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by title or company..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10"
                />
              </div>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm"
                value={filters.mode}
                onChange={(e) => setFilters({ ...filters, mode: e.target.value })}
              >
                <option value="">All Modes</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="hybrid">Hybrid</option>
              </select>
              <Button type="submit" className="gap-2">
                <Filter className="w-4 h-4" />
                Apply Filters
              </Button>
            </div>
          </form>

          {/* Results */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading internships...</p>
            </div>
          ) : internships.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <Briefcase className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-600">No internships available at the moment.</p>
              <p className="text-sm text-gray-500 mt-2">Check back soon for new opportunities!</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Found {internships.length} internship{internships.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {internships.map((job) => (
                  <Card key={job._id} className="hover:shadow-lg transition-all border">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold text-lg mb-2">{job.title}</h3>
                      <p className="text-gray-600 font-medium mb-3">{job.company}</p>
                      
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline" className="gap-1">
                          <MapPin className="w-3 h-3" />
                          {job.location}
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                          <Clock className="w-3 h-3" />
                          {job.duration} months
                        </Badge>
                        <Badge variant="outline">
                          {job.mode}
                        </Badge>
                      </div>

                      {job.stipend?.min && (
                        <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                          <DollarSign className="w-4 h-4" />
                          ₹{job.stipend.min.toLocaleString()} - ₹{job.stipend.max.toLocaleString()}/month
                        </div>
                      )}

                      {job.placementConversionProbability && (
                        <div className="flex items-center gap-1 text-sm text-green-600 mb-3">
                          <TrendingUp className="w-4 h-4" />
                          {job.placementConversionProbability}% Placement Conversion
                        </div>
                      )}

                      <div className="text-sm text-gray-600 mb-4">
                        <strong>Required Skills:</strong> {job.requiredSkills?.slice(0, 3).join(', ')}
                        {job.requiredSkills?.length > 3 && ` +${job.requiredSkills.length - 3}`}
                      </div>

                      <div className="text-sm text-gray-600 mb-4">
                        <strong>Available Seats:</strong> {job.seatsRemaining}/{job.totalSeats}
                      </div>

                      <Button 
                        className="w-full"
                        onClick={() => handleApply(job._id)}
                        disabled={job.seatsRemaining === 0}
                      >
                        {job.seatsRemaining === 0 ? 'No Seats Available' : 'Apply Now'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}