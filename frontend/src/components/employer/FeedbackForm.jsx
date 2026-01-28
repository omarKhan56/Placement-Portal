import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { MessageSquare, Star, Send } from 'lucide-react';

export default function FeedbackForm({ applicationId, studentName, onSuccess }) {
  const [formData, setFormData] = useState({
    rating: 5,
    technicalSkills: '',
    communicationSkills: '',
    overallPerformance: '',
    strengths: '',
    areasOfImprovement: '',
    recommendation: 'recommended',
    comments: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post('/feedback', {
        applicationId,
        ...formData,
        rating: parseInt(formData.rating),
      });
      
      toast.success('✅ Feedback submitted successfully!');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-blue-600" />
          Performance Feedback for {studentName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div className="space-y-2">
            <Label htmlFor="rating">Overall Rating *</Label>
            <div className="flex items-center gap-4">
              <Input
                id="rating"
                type="range"
                min="1"
                max="5"
                step="1"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="flex-1"
              />
              <div className="flex items-center gap-1 min-w-[120px]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${
                      i < formData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-2xl font-bold text-gray-700 min-w-[40px]">
                {formData.rating}/5
              </span>
            </div>
          </div>

          {/* Technical Skills */}
          <div className="space-y-2">
            <Label htmlFor="technicalSkills">Technical Skills Assessment *</Label>
            <Textarea
              id="technicalSkills"
              rows="3"
              placeholder="Evaluate technical competency, problem-solving ability, coding skills..."
              value={formData.technicalSkills}
              onChange={(e) => setFormData({ ...formData, technicalSkills: e.target.value })}
              required
            />
          </div>

          {/* Communication Skills */}
          <div className="space-y-2">
            <Label htmlFor="communicationSkills">Communication Skills *</Label>
            <Textarea
              id="communicationSkills"
              rows="3"
              placeholder="Assess verbal and written communication, presentation skills..."
              value={formData.communicationSkills}
              onChange={(e) => setFormData({ ...formData, communicationSkills: e.target.value })}
              required
            />
          </div>

          {/* Overall Performance */}
          <div className="space-y-2">
            <Label htmlFor="overallPerformance">Overall Performance *</Label>
            <Textarea
              id="overallPerformance"
              rows="3"
              placeholder="Summarize overall work quality, punctuality, teamwork..."
              value={formData.overallPerformance}
              onChange={(e) => setFormData({ ...formData, overallPerformance: e.target.value })}
              required
            />
          </div>

          {/* Strengths */}
          <div className="space-y-2">
            <Label htmlFor="strengths">Key Strengths</Label>
            <Textarea
              id="strengths"
              rows="2"
              placeholder="Highlight the intern's key strengths..."
              value={formData.strengths}
              onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
            />
          </div>

          {/* Areas of Improvement */}
          <div className="space-y-2">
            <Label htmlFor="areasOfImprovement">Areas of Improvement</Label>
            <Textarea
              id="areasOfImprovement"
              rows="2"
              placeholder="Suggest areas where the intern can improve..."
              value={formData.areasOfImprovement}
              onChange={(e) => setFormData({ ...formData, areasOfImprovement: e.target.value })}
            />
          </div>

          {/* Recommendation */}
          <div className="space-y-2">
            <Label htmlFor="recommendation">Recommendation *</Label>
            <select
              id="recommendation"
              className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm"
              value={formData.recommendation}
              onChange={(e) => setFormData({ ...formData, recommendation: e.target.value })}
              required
            >
              <option value="highly_recommended">Highly Recommended for Full-time</option>
              <option value="recommended">Recommended</option>
              <option value="not_recommended">Not Recommended</option>
            </select>
          </div>

          {/* Additional Comments */}
          <div className="space-y-2">
            <Label htmlFor="comments">Additional Comments</Label>
            <Textarea
              id="comments"
              rows="3"
              placeholder="Any additional feedback or observations..."
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 gap-2"
            disabled={submitting}
          >
            {submitting ? (
              <>Submitting Feedback...</>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Feedback
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}