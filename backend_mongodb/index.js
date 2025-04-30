const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;
const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/barangayDB';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Schemas
const ResidentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  middleName: { type: String, required: true },
  birthDate: { type: String, required: true },
  age: { type: String, required: true },
  placeBirth: { type: String, required: true },
  address: { type: String, required: true },
  gender: { type: String, required: true },
  voterStatus: { type: String, required: true },
  civilStatus: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  fatherLname: { type: String, required: true },
  fatherFname: { type: String, required: true },
  motherLname: { type: String, required: true },
  motherFname: { type: String, required: true },
  timestamp: { type: Number, default: Date.now }
});

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const HouseholdSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  houseName: String,
  residents: Array
});

const BusinessSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  businessName: { type: String, required: true },
  ownerName: { type: String, required: true },
  businessAddress: { type: String, required: true },
  dateRegistered: { type: String, required: true },
  expiracyDate: { type: String, required: true },
  businessStatus: { type: String, required: true },
  contactNumber: { type: String, required: true }
});

const DisasterSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  date: { type: String, required: true },
  location: { type: String, required: true },
  severity: { type: String, required: true },
  households: { type: Number, required: true },
  residents: { type: Number, required: true }
});

// Create models
const Resident = mongoose.model('Resident', ResidentSchema);
const Admin = mongoose.model('Admin', AdminSchema);
const Household = mongoose.model('Household', HouseholdSchema);
const Business = mongoose.model('Business', BusinessSchema);
const Disaster = mongoose.model('Disaster', DisasterSchema);

// Default admin credentials
const defaultAdmin = {
  username: 'admin',
  password: 'admin123'
};

// Create default admin if not exists
async function createDefaultAdmin() {
  try {
    const existingAdmin = await Admin.findOne({ username: defaultAdmin.username });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(defaultAdmin.password, 10);
      await Admin.create({
        username: defaultAdmin.username,
        password: hashedPassword
      });
      console.log('Default admin created');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
}

createDefaultAdmin();

// CRUD Operations

// Route to save resident data
app.post('/residents', async (req, res) => {
  const { id, firstName, lastName, middleName, birthDate, age, placeBirth, address, gender, voterStatus, civilStatus, email, phoneNumber, fatherLname, fatherFname, motherLname, motherFname } = req.body;

  // Validate input fields
  if (!id || !firstName || !lastName || !middleName || !birthDate || !age || !placeBirth || !address || !gender || !voterStatus || !civilStatus || !email || !phoneNumber || !fatherLname || !fatherFname || !motherLname || !motherFname) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const timestamp = Date.now();
    // Create new resident
    const newResident = new Resident({
      id,
      firstName,
      lastName,
      middleName,
      birthDate,
      age,
      placeBirth,
      address,
      gender,
      voterStatus,
      civilStatus,
      email,
      phoneNumber,
      fatherLname,
      fatherFname,
      motherLname,
      motherFname,
      timestamp
    });

    await newResident.save();
    
    // Respond with success message
    res.status(201).json({ message: 'resident saved successfully' });
  } catch (error) {
    console.error('Error saving resident:', error);
    res.status(500).json({ message: 'Failed to save resident' });
  }
});

app.get('/recent-residents', async (req, res) => {
  try {
    const residents = await Resident.find()
      .sort({ timestamp: -1 })
      .limit(3);

    res.json(residents);
  } catch (error) {
    console.error('Error fetching recent residents:', error);
    res.status(500).json({ message: 'Failed to retrieve recent residents' });
  }
});

// Read (R)
app.get('/residents/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const resident = await Resident.findOne({ id });
    if (!resident) {
      return res.status(404).json({ message: 'resident not found' });
    }
    res.json(resident);
  } catch (error) {
    console.error('Error fetching resident:', error);
    res.status(500).json({ message: 'Failed to fetch resident' });
  }
});

// Read all residents
app.get('/residents', async (req, res) => {
  try {
    const residents = await Resident.find();
    res.json(residents);
  } catch (error) {
    console.error('Error fetching residents:', error);
    res.status(500).json({ message: 'Failed to fetch residents' });
  }
});

// Update (U)
app.put('/residents/:id', async (req, res) => {
  const id = req.params.id;
  const { firstName, lastName, middleName, birthDate, age, placeBirth, address, gender, voterStatus, civilStatus, email, phoneNumber, fatherLname, fatherFname, motherLname, motherFname } = req.body;

  if (!firstName && !lastName && !middleName && !birthDate && !age && !placeBirth && !address && !gender && !voterStatus && !civilStatus && !email && !phoneNumber && !fatherLname && !fatherFname && !motherLname && !motherFname) {
    return res.status(400).json({ message: 'At least one field is required to update' });
  }

  try {
    const resident = await Resident.findOne({ id });
    if (!resident) {
      return res.status(404).json({ message: 'resident not found' });
    }

    // Update resident fields
    if (firstName) resident.firstName = firstName;
    if (lastName) resident.lastName = lastName;
    if (middleName) resident.middleName = middleName;
    if (birthDate) resident.birthDate = birthDate;
    if (age) resident.age = age;
    if (placeBirth) resident.placeBirth = placeBirth;
    if (address) resident.address = address;
    if (gender) resident.gender = gender;
    if (voterStatus) resident.voterStatus = voterStatus;
    if (civilStatus) resident.civilStatus = civilStatus;
    if (email) resident.email = email;
    if (phoneNumber) resident.phoneNumber = phoneNumber;
    if (fatherLname) resident.fatherLname = fatherLname;
    if (fatherFname) resident.fatherFname = fatherFname;
    if (motherLname) resident.motherLname = motherLname;
    if (motherFname) resident.motherFname = motherFname;

    await resident.save();
    res.status(200).json({ message: 'resident updated successfully' });
  } catch (error) {
    console.error('Error updating resident:', error);
    res.status(500).json({ message: 'Failed to update resident' });
  }
});

// Delete (D)
app.delete('/residents/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await Resident.findOneAndDelete({ id });
    res.status(200).json({ message: 'resident deleted successfully' });
  } catch (error) {
    console.error('Error deleting resident:', error);
    res.status(500).json({ message: 'Failed to delete resident' });
  }
});

// Delete all residents
app.delete('/residents', async (req, res) => {
  try {
    const result = await Resident.deleteMany({});
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No residents found to delete' });
    }
    res.status(200).json({ message: 'All residents deleted successfully' });
  } catch (error) {
    console.error('Error deleting all residents:', error);
    res.status(500).json({ message: 'Failed to delete all residents' });
  }
});

// Admin Sign-in
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error signing in:', error);
    res.status(500).json({ message: 'Failed to sign in' });
  }
});

// Middleware to verify token
const authenticateAdmin = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'No token provided' });

  jwt.verify(token.split(' ')[1], SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Unauthorized' });
    req.admin = decoded;
    next();
  });
};

// Protected Route Example
app.get('/admin/protected', authenticateAdmin, (req, res) => {
  res.json({ message: 'This is a protected route', admin: req.admin });
});

// Store household data
app.post('/households', async (req, res) => {
  try {
    const { id, houseName, residents } = req.body;
    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }
    
    const newHousehold = new Household({
      id,
      houseName,
      residents
    });
    
    await newHousehold.save();
    res.status(200).json({ message: 'Household stored successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Retrieve household data by ID
app.get('/households/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const household = await Household.findOne({ id });
    
    if (household) {
      res.status(200).json(household);
    } else {
      res.status(404).json({ message: 'Household not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all households
app.get('/households', async (req, res) => {
  try {
    const households = await Household.find();
    res.status(200).json(households);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a household by ID
app.delete('/households/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Household.findOneAndDelete({ id });
    res.status(200).json({ message: 'Household deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete all households
app.delete('/households', async (req, res) => {
  try {
    const result = await Household.deleteMany({});
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No household found to delete' });
    }
    res.status(200).json({ message: 'All households deleted successfully' });
  } catch (error) {
    console.error('Error deleting all households:', error);
    res.status(500).json({ message: 'Failed to delete all households' });
  }
});

app.post('/upload-csv', upload.single('file'), async (req, res) => {
  const filePath = req.file.path;
  const residents = [];

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', async (data) => {
      const { id, firstName, lastName, middleName, birthDate, age, placeBirth, address, gender, voterStatus, civilStatus, email, phoneNumber, fatherLname, fatherFname, motherLname, motherFname } = data;
      
      if (id && firstName && lastName && middleName && birthDate && age && placeBirth && address && gender && voterStatus && civilStatus && email && phoneNumber && fatherLname && fatherFname && motherLname && motherFname) {
        try {
          // Check if resident already exists
          const existingResident = await Resident.findOne({ id });
          
          if (existingResident) {
            // Update existing resident
            Object.assign(existingResident, { firstName, lastName, middleName, birthDate, age, placeBirth, address, gender, voterStatus, civilStatus, email, phoneNumber, fatherLname, fatherFname, motherLname, motherFname });
            await existingResident.save();
          } else {
            // Create new resident
            const newResident = new Resident({
              id, firstName, lastName, middleName, birthDate, age, placeBirth, address, gender, voterStatus, civilStatus, email, phoneNumber, fatherLname, fatherFname, motherLname, motherFname
            });
            await newResident.save();
          }
        } catch (error) {
          console.error('Error processing CSV row:', error);
        }
      }
    })
    .on('end', async () => {
      fs.unlinkSync(req.file.path);
      res.status(201).json({ message: 'CSV uploaded successfully' });
    })
    .on('error', (err) => {
      console.error('CSV parsing error:', err);
      res.status(500).json({ message: 'Error processing CSV file' });
    });
});

// Create a new business
app.post('/businesses', async (req, res) => {
  const { id, businessName, ownerName, businessAddress, dateRegistered, expiracyDate, businessStatus, contactNumber } = req.body;

  if (!id || !businessName || !ownerName || !businessAddress || !dateRegistered || !expiracyDate || !businessStatus || !contactNumber) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newBusiness = new Business({
      id,
      businessName,
      ownerName,
      businessAddress,
      dateRegistered,
      expiracyDate,
      businessStatus,
      contactNumber
    });

    await newBusiness.save();
    res.status(201).json({ message: 'Business added successfully' });
  } catch (error) {
    console.error('Error adding business:', error);
    res.status(500).json({ message: 'Failed to add business' });
  }
});

// Read (R)
app.get('/businesses/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const business = await Business.findOne({ id });
    if (!business) {
      return res.status(404).json({ message: 'business not found' });
    }
    res.json(business);
  } catch (error) {
    console.error('Error fetching business:', error);
    res.status(500).json({ message: 'Failed to fetch business' });
  }
});

// Read all businesses
app.get('/businesses', async (req, res) => {
  try {
    const businesses = await Business.find();
    res.json(businesses);
  } catch (error) {
    console.error('Error fetching businesses:', error);
    res.status(500).json({ message: 'Failed to fetch businesses' });
  }
});

// Update a business
app.put('/businesses/:id', async (req, res) => {
  const id = req.params.id;
  const { businessName, ownerName, businessAddress, dateRegistered, expiracyDate, businessStatus, contactNumber } = req.body;

  if (!businessName && !ownerName && !businessAddress && !dateRegistered && !expiracyDate && !businessStatus && !contactNumber) {
    return res.status(400).json({ message: 'At least one field is required to update' });
  }

  try {
    const business = await Business.findOne({ id });
    if (!business) {
      return res.status(404).json({ message: 'business not found' });
    }

    // Update business fields
    if (businessName) business.businessName = businessName;
    if (ownerName) business.ownerName = ownerName;
    if (businessAddress) business.businessAddress = businessAddress;
    if (dateRegistered) business.dateRegistered = dateRegistered;
    if (expiracyDate) business.expiracyDate = expiracyDate;
    if (businessStatus) business.businessStatus = businessStatus;
    if (contactNumber) business.contactNumber = contactNumber;

    await business.save();
    res.status(200).json({ message: 'business updated successfully' });
  } catch (error) {
    console.error('Error updating business:', error);
    res.status(500).json({ message: 'Failed to update business' });
  }
});

// Delete a business
app.delete('/businesses/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Business.findOneAndDelete({ id });
    res.json({ message: 'Business deleted successfully' });
  } catch (error) {
    console.error('Error deleting business:', error);
    res.status(500).json({ message: 'Failed to delete business' });
  }
});

// Delete all businesses
app.delete('/businesses', async (req, res) => {
  try {
    const result = await Business.deleteMany({});
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No businesses found to delete' });
    }
    res.status(200).json({ message: 'All businesses deleted successfully' });
  } catch (error) {
    console.error('Error deleting all businesses:', error);
    res.status(500).json({ message: 'Failed to delete all businesses' });
  }
});

// QR Code scanning endpoint
app.post('/scan-qr', async (req, res) => {
  try {
    const { data } = req.body;
    const residentData = JSON.parse(data);
    
    if (!residentData.id) {
      return res.status(400).json({ message: 'Invalid QR code data' });
    }

    const resident = await Resident.findOne({ id: residentData.id });
    if (!resident) {
      return res.status(404).json({ message: 'Resident not found' });
    }

    res.json(resident);
  } catch (error) {
    console.error('Error processing QR code:', error);
    res.status(500).json({ message: 'Error processing QR code' });
  }
});

// Export residents to CSV
app.get('/export-residents', async (req, res) => {
  try {
    const residents = await Resident.find();
    const csvHeader = 'id,firstName,lastName,middleName,birthDate,age,placeBirth,address,gender,voterStatus,civilStatus,email,phoneNumber,fatherLname,fatherFname,motherLname,motherFname\n';
    let csvContent = csvHeader;
    
    residents.forEach(resident => {
      csvContent += `${resident.id},"${resident.firstName}","${resident.lastName}","${resident.middleName}","${resident.birthDate}","${resident.age}","${resident.placeBirth}","${resident.address}","${resident.gender}","${resident.voterStatus}","${resident.civilStatus}","${resident.email}","${resident.phoneNumber}","${resident.fatherLname}","${resident.fatherFname}","${resident.motherLname}","${resident.motherFname}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=residents_backup.csv');
    res.send(csvContent);
  } catch (error) {
    console.error('Error exporting residents:', error);
    res.status(500).json({ message: 'Failed to export residents' });
  }
});

//Disaster
// Create new disaster
app.post('/disasters', async (req, res) => {
  try {
    const { type, date, location, severity, households, residents } = req.body;
    const id = (await Disaster.countDocuments() + 1).toString().padStart(3, '0');
    
    const newDisaster = new Disaster({
      id,
      type,
      date,
      location,
      severity,
      households,
      residents
    });

    await newDisaster.save();
    res.status(201).json({ message: 'Disaster logged successfully', disaster: newDisaster });
  } catch (error) {
    res.status(500).json({ message: 'Error creating disaster log', error: error.message });
  }
});

// Get all disasters
app.get('/disasters', async (req, res) => {
  try {
    const disasters = await Disaster.find();
    res.json(disasters);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching disasters', error: error.message });
  }
});

// Delete disaster
app.delete('/disasters/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Disaster.findOneAndDelete({ id });
    res.json({ message: 'Disaster deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting disaster', error: error.message });
  }
});

// Update disaster
app.put('/disasters/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const disaster = await Disaster.findOneAndUpdate({ id }, update, { new: true });
    if (!disaster) {
      return res.status(404).json({ message: 'Disaster not found' });
    }
    res.json({ message: 'Disaster updated successfully', disaster });
  } catch (error) {
    res.status(500).json({ message: 'Error updating disaster', error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});