import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Briefcase, MapPin, Clock, TrendingUp, DollarSign } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../api/axios';

export default function RecommendedJobs() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommended();
  }, []);

  const fetchRecommended = async () => {
    try {
      const res = await api.get('/internship/recommended');
      setInternships(res.data.data || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (internshipId) => {
    try {
      await api.post('/application', { internshipId });
      toast.success('Application submitted successfully! 🎉');
      fetchRecommended(); // Refresh list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply');
    }
  };

  if (loading) {
    return (
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading recommendations...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-purple-600" />
          🎯 Recommended Internships
        </CardTitle>
      </CardHeader>
      <CardContent>
        {internships.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
              <Briefcase className="w-10 h-10 text-purple-600" />
            </div>
            <p className="text-gray-600 mb-4">
              No recommendations available yet. Complete your profile to get personalized matches!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {internships.map((job) => (
              <Card key={job._id} className="hover:shadow-lg transition-all border">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    {job.matchScore && (
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        {job.matchScore}% Match
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 font-medium mb-3">{job.company}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="gap-1">
                      <MapPin className="w-3 h-3" />
                      {job.location}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Clock className="w-3 h-3" />
                      {job.duration} months
                    </Badge>
                    {job.mode && (
                      <Badge variant="outline">
                        {job.mode}
                      </Badge>
                    )}
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
                    <strong>Skills:</strong> {job.requiredSkills?.slice(0, 3).join(', ')}
                    {job.requiredSkills?.length > 3 && ` +${job.requiredSkills.length - 3} more`}
                  </div>

                  <div className="text-sm text-gray-600 mb-4">
                    <strong>Seats:</strong> {job.seatsRemaining}/{job.totalSeats} available
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    onClick={() => handleApply(job._id)}
                    disabled={job.seatsRemaining === 0}
                  >
                    {job.seatsRemaining === 0 ? 'No Seats Available' : 'Apply Now'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}