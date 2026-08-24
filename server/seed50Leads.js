const { sequelize, Lead } = require('./models');

const FIRST_NAMES = [
  'Rahul', 'Sneha', 'Amit', 'Sachin', 'Pooja', 'Rohan', 'Priya', 'Vikram', 'Ananya', 'Rajesh',
  'Deepika', 'Manish', 'Neha', 'Suresh', 'Kavita', 'Aditya', 'Swati', 'Nikhil', 'Tanvi', 'Kunal',
  'Meera', 'Gaurav', 'Ritu', 'Prashant', 'Shweta', 'Siddharth', 'Pallavi', 'Varun', 'Aarti', 'Kiran',
  'Rohit', 'Isha', 'Alok', 'Divya', 'Sanjay', 'Sayali', 'Chetan', 'Preeti', 'Harsh', 'Shraddha',
  'Mahesh', 'Madhuri', 'Ashwin', 'Rasika', 'Omkar', 'Monika', 'Devendra', 'Komal', 'Pranav', 'Payal'
];

const LAST_NAMES = [
  'Deshmukh', 'Patil', 'Shinde', 'Kulkarni', 'Jadhav', 'Pawar', 'More', 'Chavan', 'Kadam', 'Sawant',
  'Bhosale', 'Gaikwad', 'Tambe', 'Wagh', 'Sonawane', 'Thakur', 'Borse', 'Khare', 'Darekar', 'Thorat',
  'Ghuge', 'Chaudhari', 'Mali', 'Salunkhe', 'Bhandari', 'Bapat', 'Pendharkar', 'Chitnis', 'Gite', 'Kale',
  'Rane', 'Shelar', 'Dhole', 'Gawali', 'Ghuge', 'Mahajan', 'Kute', 'Pingle', 'Shingane', 'Gholap',
  'Pardeshi', 'Bhadane', 'Ahire', 'Bagul', 'Gangurde', 'Khairnar', 'Suryawanshi', 'Nikam', 'Devre', 'Bhamre'
];

const COMPANIES = [
  'Apex Agro Solutions', 'Sahyadri Healthcare', 'Kalyani Industries', 'Nashik Precision Works',
  'Greenfield Organics', 'Bluechip Tech Innovations', 'Shree Logistics', 'Vanguard Automations',
  'Sai Krupa Enterprises', 'Delta Pharma Labs', 'Omega Construction Corp', 'Starline Textiles',
  'Royal Dine Hospitality', 'Godavari Winery Estate', 'Matrix IT Solutions', 'Samarth Engineering',
  'Sunrise Solar Systems', 'Pinnacle Capital Partners', 'Zenith EduTech', 'Maratha Trade Links'
];

const JOB_TITLES = [
  'Managing Director', 'CEO & Founder', 'Consulting Physician', 'Senior Project Manager',
  'Chief Technology Officer', 'General Manager', 'Civil Engineer', 'Chartered Accountant',
  'Operations Head', 'Business Development Director', 'Architect & Designer', 'Finance Director',
  'Proprietor', 'Commercial Broker', 'VP Operations'
];

const INDUSTRIES = [
  'Agriculture & Agrotech', 'Healthcare & Pharma', 'Information Technology', 'Manufacturing & Auto',
  'Construction & Infrastructure', 'Finance & Investment', 'Hospitality & Tourism', 'Renewable Energy',
  'Retail & Wholesale', 'Education'
];

const PROPERTY_TYPES = [
  '2 BHK Apartment', '3 BHK Luxury Apartment', '4 BHK Penthouse',
  'Row House', 'Commercial Shop', 'Commercial Office Space', 'Residential Villa Plot'
];

const BUDGET_RANGES = [
  '45 L - 65 L', '65 L - 85 L', '85 L - 1.25 Cr',
  '1.25 Cr - 1.8 Cr', '1.8 Cr - 2.5 Cr', '2.5 Cr - 4 Cr'
];

const AREAS = [
  'Gangapur Road', 'College Road', 'Pathardi Phata', 'Indira Nagar',
  'Govind Nagar', 'Nashik Road', 'Dwarka', 'Deolali Camp',
  'Panchavati', 'Mahatma Nagar', 'Trimbak Road', 'Serene Meadows'
];

const SOURCES = ['Google Ads', 'Meta Ads', 'Website Inbound', 'Referral', 'LinkedIn Campaign', 'Direct Walk-in', 'Property Expo'];
const STATUSES = ['New', 'Contacted', 'Follow Up', 'Site Visit Scheduled', 'Negotiation', 'Proposal Sent'];
const PRIORITIES = ['High', 'Medium', 'Low'];

const seed50Leads = async () => {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Connected to MySQL.');

    // Find the current highest LEAD ID
    const existingLeads = await Lead.findAll({ attributes: ['id'], order: [['id', 'DESC']] });
    let maxIdNum = 0;
    for (const l of existingLeads) {
      if (l.id && l.id.startsWith('LEAD-')) {
        const num = parseInt(l.id.replace('LEAD-', ''), 10);
        if (!isNaN(num) && num > maxIdNum) maxIdNum = num;
      }
    }

    const leadsToInsert = [];
    const today = new Date();

    for (let i = 1; i <= 50; i++) {
      const idNum = maxIdNum + i;
      const leadId = `LEAD-${String(idNum).padStart(4, '0')}`;
      const firstName = FIRST_NAMES[(i - 1) % FIRST_NAMES.length];
      const lastName = LAST_NAMES[(i - 1) % LAST_NAMES.length];
      const isFemale = ['Sneha', 'Pooja', 'Priya', 'Ananya', 'Deepika', 'Neha', 'Kavita', 'Swati', 'Tanvi', 'Meera', 'Ritu', 'Shweta', 'Pallavi', 'Aarti', 'Isha', 'Divya', 'Sayali', 'Preeti', 'Shraddha', 'Madhuri', 'Rasika', 'Monika', 'Komal', 'Payal'].includes(firstName);
      const salutation = isFemale ? 'Mrs' : 'Mr';
      const gender = isFemale ? 'Female' : 'Male';
      const company = COMPANIES[(i - 1) % COMPANIES.length];
      const jobTitle = JOB_TITLES[(i - 1) % JOB_TITLES.length];
      const industry = INDUSTRIES[(i - 1) % INDUSTRIES.length];
      const propertyType = PROPERTY_TYPES[(i - 1) % PROPERTY_TYPES.length];
      const budgetRange = BUDGET_RANGES[(i - 1) % BUDGET_RANGES.length];
      const preferredArea = AREAS[(i - 1) % AREAS.length];
      const leadSource = SOURCES[(i - 1) % SOURCES.length];
      const status = STATUSES[(i - 1) % STATUSES.length];
      const priority = PRIORITIES[(i - 1) % PRIORITIES.length];

      // Format date in last 30 days
      const daysAgo = Math.floor(Math.random() * 25);
      const createdDate = new Date(today.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      const createdOn = createdDate.toISOString().split('T')[0];

      // Follow-up date in next 1-14 days
      const daysAhead = Math.floor(Math.random() * 14) + 1;
      const followUpDate = new Date(today.getTime() + daysAhead * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const cleanFirst = firstName.toLowerCase().replace(/[^a-z]/g, '');
      const cleanLast = lastName.toLowerCase().replace(/[^a-z]/g, '');
      const domains = ['gmail.com', 'outlook.com', 'yahoo.com', 'rediffmail.com', 'enterprise.in'];
      const emailDomain = domains[(i - 1) % domains.length];
      const email = `${cleanFirst}.${cleanLast}${i > 10 ? i : ''}@${emailDomain}`;
      const mobileNo = `98${String(10000000 + i * 145672).slice(0, 8)}`;

      const annualRevenue = (Math.floor(Math.random() * 300) + 20) * 100000; // 20L to 3.2Cr

      const notes = `Lead originated via ${leadSource}. Looking for ${propertyType} in ${preferredArea} with budget ${budgetRange}. Stated priority is ${priority.toLowerCase()}.`;

      leadsToInsert.push({
        id: leadId,
        salutation,
        firstName,
        lastName,
        email,
        mobileNo,
        gender,
        organization: company,
        website: `www.${company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        noOfEmployees: ['1-10', '10-50', '50-100', '100+'][i % 4],
        territory: 'Nashik',
        annualRevenue,
        industry,
        status,
        leadOwner: 'Admin User',
        leadSource,
        jobTitle,
        propertyType,
        budgetRange,
        preferredArea,
        followUpDate,
        priority,
        notes,
        assignedTo: 'Admin User',
        createdOn,
      });
    }

    console.log(`Inserting ${leadsToInsert.length} leads...`);
    for (const lead of leadsToInsert) {
      await Lead.upsert(lead);
    }

    console.log('==============================================');
    console.log(`SUCCESS: Seeded 50 sample leads (IDs: LEAD-${String(maxIdNum + 1).padStart(4, '0')} to LEAD-${String(maxIdNum + 50).padStart(4, '0')})`);
    console.log('==============================================');
  } catch (error) {
    console.error('Error seeding leads:', error);
  } finally {
    await sequelize.close();
  }
};

seed50Leads();
