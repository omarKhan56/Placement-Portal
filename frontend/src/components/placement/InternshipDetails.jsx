//frontend/src/components/placement/InternshipDetails.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  TrendingUp,
  Calendar,
  Edit,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';

export default function InternshipDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchInternship();
  }, [id]);

  const fetchInternship = async () => {
    try {
      const res = await api.get(`/internship/${id}`);
      setInternship(res.data.data);
    } catch (error) {
      console.error('Error fetching internship:', error);
      toast.error('Failed to load internship details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this internship? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      await api.delete(`/internship/${id}`);
      toast.success('✅ Internship deleted successfully!');
      navigate('/placement/dashboard');
    } catch (error) {
      console.error('Error deleting internship:', error);
      toast.error(error.response?.data?.message || 'Failed to delete internship');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading internship details...</div>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Internship not found</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-5xl mx-auto py-8">
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-xl">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(-1)}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Badge variant="outline">{internship.mode}</Badge>
                  <Badge className="bg-green-100 text-green-700">
                    {internship.seatsRemaining}/{internship.totalSeats} seats available
                  </Badge>
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                  {internship.title}
                </CardTitle>
                <p className="text-xl text-gray-600 font-medium">{internship.company}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/placement/edit-internship/${id}`)}
                  className="gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  {deleting ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Key Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="font-medium">{internship.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="font-medium">{internship.duration} months</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <DollarSign className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-xs text-gray-500">Stipend</p>
                  <p className="font-medium">
                    ₹{internship.stipend?.min?.toLocaleString()} - ₹{internship.stipend?.max?.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Users className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-xs text-gray-500">Seats</p>
                  <p className="font-medium">{internship.seatsRemaining} available</p>
                </div>
              </div>
            </div>

            {/* Dates */}
            {(internship.startDate || internship.applicationDeadline) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                {internship.startDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-600">Start Date</p>
                      <p className="font-medium">{format(new Date(internship.startDate), 'dd MMM yyyy')}</p>
                    </div>
                  </div>
                )}
                {internship.applicationDeadline && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="text-xs text-gray-600">Application Deadline</p>
                      <p className="font-medium">{format(new Date(internship.applicationDeadline), 'dd MMM yyyy')}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Placement Conversion */}
            {internship.placementConversionProbability > 0 && (
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-900">
                    {internship.placementConversionProbability}% Placement Conversion Probability
                  </p>
                  <p className="text-xs text-green-700">High chance of full-time offer after internship</p>
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Description</h3>
              <p className="text-gray-700 whitespace-pre-line">{internship.description}</p>
            </div>

            {/* Required Skills */}
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {internship.requiredSkills?.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Eligible Departments */}
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Eligible Departments</h3>
              <div className="flex flex-wrap gap-2">
                {internship.eligibleDepartments?.map((dept, index) => (
                  <Badge key={index} variant="outline" className="px-3 py-1">
                    {dept}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Posted Date */}
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500">
                Posted on {format(new Date(internship.createdAt), 'dd MMMM yyyy')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}