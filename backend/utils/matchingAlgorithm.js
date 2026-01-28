/**
 * Smart matching algorithm to recommend internships to students
 * Based on skills, department, preferences, and employability score
 */

exports.calculateMatchScore = (student, internship) => {
  let score = 0;

  // 1. Skills match (40 points)
  const studentSkills = student.skills.map(s => s.toLowerCase());
  const requiredSkills = internship.requiredSkills.map(s => s.toLowerCase());
  
  const matchingSkills = studentSkills.filter(skill => 
    requiredSkills.some(req => req.includes(skill) || skill.includes(req))
  );
  
  const skillScore = (matchingSkills.length / requiredSkills.length) * 40;
  score += skillScore;

  // 2. Department eligibility (30 points)
  if (internship.eligibleDepartments.includes(student.department)) {
    score += 30;
  }

  // 3. Preference match (20 points)
  if (student.preferences) {
    // Domain preference
    const domainMatch = student.preferences.domains?.some(domain =>
      internship.title.toLowerCase().includes(domain.toLowerCase()) ||
      internship.description.toLowerCase().includes(domain.toLowerCase())
    );
    if (domainMatch) score += 10;

    // Location preference
    if (student.preferences.locations?.includes(internship.location)) {
      score += 5;
    }

    // Mode preference
    if (student.preferences.internshipType === internship.mode) {
      score += 5;
    }
  }

  // 4. Employability score bonus (10 points)
  score += (student.employabilityScore / 100) * 10;

  return Math.min(score, 100);
};

exports.getRecommendedInternships = (student, internships) => {
  const scoredInternships = internships.map(internship => ({
    internship,
    matchScore: this.calculateMatchScore(student, internship),
  }));

  // Sort by match score (descending) and filter those with score > 40
  return scoredInternships
    .filter(item => item.matchScore >= 40)
    .sort((a, b) => b.matchScore - a.matchScore)
    .map(item => ({
      ...item.internship.toObject(),
      matchScore: Math.round(item.matchScore),
    }));
};