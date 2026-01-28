import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import api from '../../api/axios';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Users, 
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function MyInternships() {
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyInternships();
  }, []);

  const fetchMyInternships = async () => {
    try {
      const res = await api.get('/internship?postedBy=me'); // You'll need to add this filter
      setInternships(res.data.data || []);
    } catch (error) {
      console.error('Error fetching internships:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this internship?')) {
      return;
    }

    try {
      await api.delete(`/internship/${id}`);
      toast.success('Internship deleted successfully!');
      fetchMyInternships(); // Refresh list
    } catch (error) {
      toast.error('Failed to delete internship');
    }
  };

  if (loading) {
    return (
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading internships...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-purple-600" />
          My Posted Internships
        </CardTitle>
      </CardHeader>
      <CardContent>
        {internships.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No internships posted yet</p>
            <Button onClick={() => navigate('/placement/post-internship')}>
              Post Your First Internship
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {internships.map((internship) => (
              <div key={internship._id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{internship.title}</h3>
                    <p className="text-sm text-gray-600">{internship.company}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/placement/internship/${internship._id}`)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/placement/edit-internship/${internship._id}`)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(internship._id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline" className="gap-1">
                    <MapPin className="w-3 h-3" />
                    {internship.location}
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Clock className="w-3 h-3" />
                    {internship.duration} months
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Users className="w-3 h-3" />
                    {internship.seatsRemaining}/{internship.totalSeats} seats
                  </Badge>
                  <Badge variant="outline">{internship.mode}</Badge>
                </div>

                <div className="text-sm text-gray-600">
                  <strong>Applications:</strong> {internship.applications?.length || 0} students applied
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}