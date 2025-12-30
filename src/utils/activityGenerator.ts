// Generate activities based on destination, days, and budget
export const generateActivitiesForBudget = (
  destination: string, 
  days: number, 
  budget: number
) => {
  // Calculate daily budget
  const dailyBudget = budget / days;
  
  // Define activity templates with relative costs
  const lowBudgetActivities = [
    { title: 'Free Walking Tour', description: `Explore ${destination} on foot with a local guide`, duration: 180, costRatio: 0 },
    { title: 'Local Park Visit', description: 'Relax and enjoy the green spaces', duration: 120, costRatio: 0 },
    { title: 'Street Food Experience', description: 'Try authentic street food', duration: 90, costRatio: 0.05 },
    { title: 'Public Beach Day', description: 'Enjoy the sun and sea', duration: 240, costRatio: 0 },
    { title: 'Local Market Exploration', description: 'Browse local vendors and crafts', duration: 120, costRatio: 0.03 },
    { title: 'Scenic Viewpoint', description: 'Catch amazing views of the city', duration: 60, costRatio: 0 },
  ];

  const mediumBudgetActivities = [
    { title: 'Museum Visit', description: 'Discover local history and art', duration: 150, costRatio: 0.08 },
    { title: 'Local Food Tour', description: `Taste the flavors of ${destination}`, duration: 180, costRatio: 0.12 },
    { title: 'Guided City Tour', description: 'Professional tour of main attractions', duration: 240, costRatio: 0.15 },
    { title: 'Cultural Show', description: 'Experience local performing arts', duration: 120, costRatio: 0.10 },
    { title: 'Cooking Class', description: 'Learn to make local dishes', duration: 180, costRatio: 0.15 },
    { title: 'Boat/Ferry Ride', description: 'See the city from the water', duration: 90, costRatio: 0.08 },
  ];

  const highBudgetActivities = [
    { title: 'Fine Dining Experience', description: 'Upscale culinary adventure', duration: 150, costRatio: 0.20 },
    { title: 'Private Guided Tour', description: 'Personalized exploration', duration: 300, costRatio: 0.25 },
    { title: 'Adventure Activity', description: 'Thrilling outdoor experience', duration: 240, costRatio: 0.18 },
    { title: 'Spa & Wellness', description: 'Relax and rejuvenate', duration: 180, costRatio: 0.15 },
    { title: 'VIP Attraction Access', description: 'Skip-the-line premium experience', duration: 180, costRatio: 0.20 },
    { title: 'Sunset Yacht Cruise', description: 'Luxury evening on the water', duration: 180, costRatio: 0.22 },
  ];

  // Select activity pool based on budget per day
  let activityPool: typeof lowBudgetActivities;
  if (dailyBudget < 100) {
    activityPool = [...lowBudgetActivities, ...mediumBudgetActivities.slice(0, 2)];
  } else if (dailyBudget < 300) {
    activityPool = [...lowBudgetActivities.slice(0, 3), ...mediumBudgetActivities];
  } else {
    activityPool = [...mediumBudgetActivities.slice(0, 3), ...highBudgetActivities];
  }

  const activities = [];
  
  for (let day = 1; day <= days; day++) {
    // 3 activities per day
    const shuffled = [...activityPool].sort(() => Math.random() - 0.5);
    const dayActivities = shuffled.slice(0, 3);
    
    dayActivities.forEach((activity, index) => {
      const cost = Math.round(dailyBudget * activity.costRatio);
      activities.push({
        day_number: day,
        title: activity.title,
        description: activity.description,
        start_time: `${9 + index * 3}:00`,
        duration_minutes: activity.duration,
        estimated_cost: cost,
        order_index: index,
      });
    });
  }

  return activities;
};
