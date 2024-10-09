import axios from 'axios';
import * as cheerio from 'cheerio';
import { Workout, WorkoutActivity } from '../types';

export async function scrapeWorkouts(url: string): Promise<Workout[]> {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const workouts: Workout[] = [];

    $('.workout-day').each((_, element) => {
      const name = $(element).find('h3').text().trim();
      const duration = $(element).find('.workout-duration').text().trim();
      const activities: WorkoutActivity[] = [];

      $(element).find('.workout-step-description').each((_, step) => {
        activities.push({
          description: $(step).text().trim(),
        });
      });

      workouts.push({ name, duration, activities });
    });

    return workouts;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error scraping workouts:', errorMessage);
    throw new Error(`Failed to scrape workouts: ${errorMessage}`);
  }
}