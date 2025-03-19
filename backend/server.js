const express = require('express');
const redis = require('redis');
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

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Connect to Redis
const client = redis.createClient({
  url: 'redis://@127.0.0.1:6379'  // Default Redis connection
});

client.connect()
  .then(() => console.log('Connected to Redis'))
  .catch(err => console.error('Redis connection error:', err));

// Default admin credentials
const defaultAdmin = {
  username: 'admin',
  password: 'admin123'
};

// Create default admin if not exists
async function createDefaultAdmin() {
  const existingAdmin = await client.hGetAll(`admin:${defaultAdmin.username}`);
  if (Object.keys(existingAdmin).length === 0) {
    const hashedPassword = await bcrypt.hash(defaultAdmin.password, 10);
    await client.hSet(`admin:${defaultAdmin.username}`, 'password', hashedPassword);
    console.log('Default admin created');
  }
}

client.on('connect', createDefaultAdmin);

// CRUD Operations

// Route to save resident data
app.post('/residents', async (req, res) => {
  const { id, firstName, lastName, middleName, birthDate, age, placeBirth, address, gender, voterStatus, civilStatus, email, phoneNumber, fatherLname, fatherFname, motherLname, motherFname } = req.body;

  // Validate input fields
  if (!id || !firstName || !lastName || !middleName || !birthDate || !age || !placeBirth || !address || !gender || !voterStatus || !civilStatus || !email || !phoneNumber || !fatherLname || !fatherFname || !motherLname || !motherFname) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Set resident data in Redis (using object syntax for Redis v4 and above)
    const residentData = { firstName, lastName, middleName, birthDate, age, placeBirth, address, gender, voterStatus, civilStatus, email, phoneNumber, fatherLname, fatherFname, motherLname, motherFname };

    // Save resident data in Redis hash
    await client.hSet(`resident:${id}`, 'firstName', residentData.firstName);
    await client.hSet(`resident:${id}`, 'lastName', residentData.lastName);
    await client.hSet(`resident:${id}`, 'middleName', residentData.middleName);
    await client.hSet(`resident:${id}`, 'birthDate', residentData.birthDate);
    await client.hSet(`resident:${id}`, 'age', residentData.age);
    await client.hSet(`resident:${id}`, 'placeBirth', residentData.placeBirth);
    await client.hSet(`resident:${id}`, 'address', residentData.address);
    await client.hSet(`resident:${id}`, 'gender', residentData.gender);
    await client.hSet(`resident:${id}`, 'voterStatus', residentData.voterStatus);
    await client.hSet(`resident:${id}`, 'civilStatus', residentData.civilStatus);
    await client.hSet(`resident:${id}`, 'email', residentData.email);
    await client.hSet(`resident:${id}`, 'phoneNumber', residentData.phoneNumber);
    await client.hSet(`resident:${id}`, 'fatherLname', residentData.fatherLname);
    await client.hSet(`resident:${id}`, 'fatherFname', residentData.fatherFname);
    await client.hSet(`resident:${id}`, 'motherLname', residentData.motherLname);
    await client.hSet(`resident:${id}`, 'motherFname', residentData.motherFname);
    
    // Respond with success message
    res.status(201).json({ message: 'resident saved successfully' });
  } catch (error) {
    console.error('Error saving resident:', error);
    res.status(500).json({ message: 'Failed to save resident' });
  }
});

// Read (R)
app.get('/residents/:id', async (req, res) => {
  const id = req.params.id;
  const resident = await client.hGetAll(`resident:${id}`);
  if (Object.keys(resident).length === 0) {
    return res.status(404).json({ message: 'resident not found' });
  }
  res.json(resident);
});

// Read all residents
app.get('/residents', async (req, res) => {
  const keys = await client.keys('resident:*');
  const residents = await Promise.all(keys.map(async (key) => {
    return { id: key.split(':')[1], ...(await client.hGetAll(key)) };
  }));
  res.json(residents);
});

// Update (U)
app.put('/residents/:id', async (req, res) => {
  const id = req.params.id;
  const { firstName, lastName, middleName, birthDate, age, placeBirth, address, gender, voterStatus, civilStatus, email, phoneNumber, fatherLname, fatherFname, motherLname, motherFname } = req.body;

  if ( !firstName && !lastName && !middleName && !birthDate && !age && !placeBirth && !address && !gender && !voterStatus && !civilStatus && !email && !phoneNumber && !fatherLname && !fatherFname && !motherLname && !motherFname) {
    return res.status(400).json({ message: 'At least one field is required to update' });
  }

  try {
    const existingresident = await client.hGetAll(`resident:${id}`);
    if (Object.keys(existingresident).length === 0) {
      return res.status(404).json({ message: 'resident not found' });
    }

    // Update resident data in Redis
    if (firstName) await client.hSet(`resident:${id}`, 'firstName', firstName);
    if (lastName) await client.hSet(`resident:${id}`, 'lastName', lastName);
    if (middleName) await client.hSet(`resident:${id}`, 'middleName', middleName);
    if (birthDate) await client.hSet(`resident:${id}`, 'birthDate', birthDate);
    if (age) await client.hSet(`resident:${id}`, 'age', age);
    if (placeBirth) await client.hSet(`resident:${id}`, 'placeBirth', placeBirth);
    if (address) await client.hSet(`resident:${id}`, 'address', address);
    if (gender) await client.hSet(`resident:${id}`, 'gender', gender);
    if (voterStatus) await client.hSet(`resident:${id}`, 'voterStatus', voterStatus);
    if (civilStatus) await client.hSet(`resident:${id}`, 'civilStatus', civilStatus);
    if (email) await client.hSet(`resident:${id}`, 'email', email);
    if (phoneNumber) await client.hSet(`resident:${id}`, 'phoneNumber', phoneNumber);
    if (fatherLname) await client.hSet(`resident:${id}`, 'fatherLname', fatherLname);
    if (fatherFname) await client.hSet(`resident:${id}`, 'fatherFname', fatherFname);
    if (motherLname) await client.hSet(`resident:${id}`, 'motherLname', motherLname);
    if (motherFname) await client.hSet(`resident:${id}`, 'motherFname', motherFname);
    
    res.status(200).json({ message: 'resident updated successfully' });
  } catch (error) {
    console.error('Error updating resident:', error);
    res.status(500).json({ message: 'Failed to update resident' });
  }
});

// Delete (D)
app.delete('/residents/:id', async (req, res) => {
  const id = req.params.id;
  await client.del(`resident:${id}`);
  res.status(200).json({ message: 'resident deleted successfully' });
});

// Delete all residents
app.delete('/residents', async (req, res) => {
  try {
    const keys = await client.keys('resident:*');
    if (keys.length === 0) {
      return res.status(404).json({ message: 'No residents found to delete' });
    }

    await Promise.all(keys.map(key => client.del(key)));
    res.status(200).json({ message: 'All residents deleted successfully' });
  } catch (error) {
    console.error('Error deleting all residents:', error);
    res.status(500).json({ message: 'Failed to delete all residents' });
  }
});

// Admin Sign-in
app.post('/admin/signin', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const admin = await client.hGetAll(`admin:${username}`);
    if (!admin.password) {
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
      const { houseName, residents } = req.body;
      const householdKey = `household:${houseName}`;
      await client.set(householdKey, JSON.stringify(residents));
      res.status(200).json({ message: 'Household stored successfully' });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Retrieve household data
app.get('/households/:houseName', async (req, res) => {
  try {
      const { houseName } = req.params;
      const householdKey = `household:${houseName}`;
      const data = await client.get(householdKey);
      if (data) {
          res.status(200).json({ houseName, residents: JSON.parse(data) });
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
      const keys = await client.keys('household:*');
      const households = await Promise.all(
          keys.map(async (key) => {
              const data = await client.get(key);
              return { houseName: key.replace('household:', ''), residents: JSON.parse(data) };
          })
      );
      res.status(200).json(households);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Delete a household
app.delete('/households/:houseName', async (req, res) => {
  try {
      const { houseName } = req.params;
      const householdKey = `household:${houseName}`;
      await client.del(householdKey);
      res.status(200).json({ message: 'Household deleted successfully' });
  } catch (error) {
      res.status(500).json({ error: error.message });
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
      const residentKey = `resident:${id}`;

      await client.hSet(residentKey, 'firstName', firstName);
      await client.hSet(residentKey, 'lastName', lastName);
      await client.hSet(residentKey, 'middleName', middleName);
      await client.hSet(residentKey, 'birthDate', birthDate);
      await client.hSet(residentKey, 'age', age);
      await client.hSet(residentKey, 'placeBirth', placeBirth);
      await client.hSet(residentKey, 'address', address);
      await client.hSet(residentKey, 'gender', gender);
      await client.hSet(residentKey, 'voterStatus', voterStatus);
      await client.hSet(residentKey, 'civilStatus', civilStatus);
      await client.hSet(residentKey, 'email', email);
      await client.hSet(residentKey, 'phoneNumber', phoneNumber);
      await client.hSet(residentKey, 'fatherLname', fatherLname );
      await client.hSet(residentKey, 'fatherFname', fatherFname);
      await client.hSet(residentKey, 'motherLname', motherLname);
      await client.hSet(residentKey, 'motherFname', motherFname);
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

  // businesses
 // Create a new business
app.post('/businesses', async (req, res) => {
  const { id, businessName, ownerName, businessAddress, dateRegistered, expiracyDate, businessStatus, contactNumber } = req.body;

  if (!id || !businessName || !ownerName || !businessAddress || !dateRegistered || !expiracyDate || !businessStatus || !contactNumber) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {

    const businessData = { businessName, ownerName, businessAddress, dateRegistered, expiracyDate, businessStatus, contactNumber};

    await client.hSet(`business:${id}`, 'businessName', businessData.businessName);
    await client.hSet(`business:${id}`, 'ownerName', businessData.ownerName);
    await client.hSet(`business:${id}`, 'businessAddress', businessData.businessAddress);
    await client.hSet(`business:${id}`, 'dateRegistered', businessData.dateRegistered);
    await client.hSet(`business:${id}`, 'expiracyDate', businessData.expiracyDate);
    await client.hSet(`business:${id}`, 'businessStatus', businessData.businessStatus);
    await client.hSet(`business:${id}`, 'contactNumber', businessData.contactNumber);

    res.status(201).json({ message: 'Business added successfully' });
  } catch (error) {
    console.error('Error adding business:', error);
    res.status(500).json({ message: 'Failed to add business' });
  }
});

// Read (R)
app.get('/businesses/:id', async (req, res) => {
  const id = req.params.id;
  const business = await client.hGetAll(`business:${id}`);
  if (Object.keys(business).length === 0) {
    return res.status(404).json({ message: 'business not found' });
  }
  res.json(business);
});

// Read all businesses
app.get('/businesses', async (req, res) => {
  try {
    const keys = await client.keys('business:*');
    const businesses = await Promise.all(
      keys.map(async (key) => ({ id: key.split(':')[1], ...(await client.hGetAll(key)) }))
    );
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

  if ( !businessName && !ownerName && !businessAddress && !dateRegistered && !expiracyDate && !businessStatus && !contactNumber) {
    return res.status(400).json({ message: 'All fields are required to update' });
  }

  try {
    const exists = await client.hGetAll(`business:${id}`);
    if (Object.keys(exists).length === 0) {
      return res.status(404).json({ message: 'business not found' });
    }

    if (businessName) await client.hSet(`business:${id}`,'businessName',businessName )
    if ( ownerName) await client.hSet(`business:${id}`,' ownerName',  ownerName)
    if (businessAddress) await client.hSet(`business:${id}`,'businessAddress',businessAddress )
    if (dateRegistered) await client.hSet(`business:${id}`,'dateRegistered',dateRegistered )
    if (expiracyDate) await client.hSet(`business:${id}`,'expiracyDate',expiracyDate)
    if (businessStatus) await client.hSet(`business:${id}`,'businessStatus',businessStatus)
    if (contactNumber) await client.hSet(`business:${id}`,' contactNumber', contactNumber )

    res.status(200).json( {message: 'business updates successfully'} )
  } catch (error) {
    console.error('Error updating business:', error);
    res.status(500).json({ message: 'Failed to update business' });
  }
});

// Delete a business
app.delete('/businesses/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await client.del(`business:${id}`);
    res.json({ message: 'Business deleted successfully' });
  } catch (error) {
    console.error('Error deleting business:', error);
    res.status(500).json({ message: 'Failed to delete business' });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


