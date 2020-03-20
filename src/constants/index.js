// export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://198.23.255.20:5000/api';
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.picktur.com/api';

export const ACCESS_TOKEN = 'accessToken';

export const PHOTO_LIST_SIZE = 30;
export const MAX_CHOICES = 6;
export const PHOTO_QUESTION_MAX_LENGTH = 140;
export const PHOTO_CHOICE_MAX_LENGTH = 40;

export const NAME_MIN_LENGTH = 4;
export const NAME_MAX_LENGTH = 40;

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 15;

export const EMAIL_MAX_LENGTH = 40;

export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 20;

export const releaseOptions = [ 
    { key: 'all', value: 'all', text: 'All releases' },
    { key: 'model', value: 'SUBJECT', text: 'Model releases' },
    { key: 'property', value: 'PROPERTY', text: 'Property releases' },
  ];
export  const sortOptions = [
    { key: 'oldest', value: 'Oldest', text: 'Oldest' },
    { key: 'newest', value: 'Newest', text: 'Newest' },
    { key: 'az', value: 'az', text: 'A-Z' },
    { key: 'za', value: 'za', text: 'Z-A' },
  ];
export const ethnicity = [ 
    { key: 'af', value: 'African', text: 'African' },
    { key: 'afam', value: 'African American', text: 'African American' },
    { key: 'bl', value: 'Black', text: 'Black' },
    { key: 'br', value: 'Brazilian', text: 'Brazilian' },
    { key: 'ch', value: 'Chinese', text: 'Chinese' },
    { key: 'ca', value: 'Caucasian', text: 'Caucasian' },
    { key: 'es', value: 'East Asian', text: 'East Asian' },
    { key: 'hi', value: 'Hispanic(Latin)', text: 'Hispanic(Latin)' },
    { key: 'jp', value: 'Japanese', text: 'Japanese' },
    { key: 'me', value: 'Middle Eastern', text: 'Middle Eastern' },
    { key: 'na', value: 'Native American', text: 'Native American' },
    { key: 'pi', value: 'Pacific Islander', text: 'Pacific Islander' },
    { key: 'sa', value: 'South Asian', text: 'South Asian' },
    { key: 'sea', value: 'Southeast Asian', text: 'Southeast Asian' },
  ];
export  const age = [
    { key: 'in', value: 'Infant', text: 'Infant' },
    { key: 'child', value: 'Child', text: 'Child' },
    { key: 'ten', value: 'Teenager', text: 'Teenager' },
    { key: 'twenty', value: 'twenty', text: '20-29' },
    { key: 'thirty', value: 'thirty', text: '30-39' },
    { key: 'fourty', value: 'fourty', text: '40-49' },
    { key: 'fifty', value: 'fifty', text: '50-59' },
    { key: 'sixty', value: 'sixty', text: '60-69' },
    { key: 'seventyplus', value: 'seventyplus', text: '70+' },
  ];
export  const gender = [
    { key: 'male', value: 'male', text: 'Male' },
    { key: 'femaile', value: 'female', text: 'Female' },
  ];

export const DIAGRAM_DATA_TYPE = {
        labels: [],
        datasets: [
          {
            label: 'My First dataset',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: []
          }
        ]
      };