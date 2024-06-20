import axios from 'axios';

const API_KEY = '111'; // Replace with your Handtracking.io API key
const API_ENDPOINT = 'https://api.handtracking.io/v1/yoha';

const headers = {
  Authorization: `Bearer ${API_KEY}`,
};

// Function to call Handtracking.io API
export const getHandTrackingData = async () => {
  try {
    const response = await axios.get(API_ENDPOINT, { headers });
    return response.data;
  } catch (error) {
    console.error('Error fetching hand tracking data:', error);
    throw error;
  }
};
