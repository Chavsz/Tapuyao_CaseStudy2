import React, { useEffect, useState } from 'react';
import './Pages.css';
import axios from 'axios';
import * as goIcons from "react-icons/go";
import * as ioIcons from "react-icons/io";
import * as mdIcons from "react-icons/md";
import * as faIcons from "react-icons/fa";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const API_URL = {
  residents: 'http://localhost:5001/residents',
  households: 'http://localhost:5001/households',
  recent: 'http://localhost:5001/recent-residents'
}

function Home() {
  const [residents, setResidents] = useState([]);
  const [households, setHouseholds] = useState([]);
  const [recentResidents, setRecentResidents] = useState([]);

  // Fetch all residents
  const fetchResidents = async () => {
    try {
      const response = await axios.get(API_URL.residents);
      setResidents(response.data);
    } catch (error) {
      console.error('Error fetching residents:', error);
    }
  };

  // Fetch all residents
  const fetchHouseholds = async () => {
    try {
      const response = await axios.get(API_URL.households);
      setHouseholds(response.data);
    } catch (error) {
      console.error('Error fetching households:', error);
    }
  };

  const fetchRecentResidents = async () => {
    try {
      const response = await axios.get(API_URL.recent);
      setRecentResidents(response.data);
    } catch (error) {
      console.error('Error fetching recent residents:', error);
    }
  };

  useEffect(() => {
      fetchResidents();
      fetchHouseholds();
      fetchRecentResidents();
    }, []);

  
  // Count residents by gender
  const genderCounts = residents.reduce((acc, resident) => {
    acc[resident.gender] = (acc[resident.gender] || 0) + 1;
    return acc;
    }, {});

  // Count residents by voterStatus
  const voterCounts = residents.reduce((acc, resident) => {
    acc[resident.voterStatus] = (acc[resident.voterStatus] || 0) + 1;
    return acc;
    }, {});
  
  // Count age
  const ageCounts = residents.reduce((acc, resident) => {
    acc[resident.age] = (acc[resident.age] || 0) + 1;
    return acc;
  }, {});

  // Count civilStatus
  const civilStatusCounts = residents.reduce((acc, resident) => {
    acc[resident.civilStatus] = (acc[resident.civilStatus] || 0) + 1;
    return acc;
    }, {});

  const civilStatusData = [
    { name: 'Single', count: civilStatusCounts['Single'] || 0 },
    { name: 'Married', count: civilStatusCounts['Married'] || 0 },
    { name: 'Separated', count: civilStatusCounts['Separated'] || 0 },
    { name: 'Divorced', count: civilStatusCounts['Divorced'] || 0 },
    { name: 'Widowed', count: civilStatusCounts['Widowed'] || 0 }
  ];

  const civilStatusChart = () => {
    return (
      <ResponsiveContainer width="100%" height={225}>
      <BarChart data={civilStatusData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" label={{ value: "Civil Status", position: "bottom" }} />
        <YAxis label={{ value: "Count", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Bar dataKey="count" fill="#fcba03" radius={[5, 5, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
    )

  }
  
  const getCountInRange = (start, end) => {
    return Array.from({ length: end - start + 1 }, (_, i) => ageCounts[start + i] || 0).reduce((sum, count) => sum + count, 0);
  };
  
  const ageData = [
    { ageRange: "1-5", count: getCountInRange(1, 5) },
    { ageRange: "6-10", count: getCountInRange(6, 10) },
    { ageRange: "11-15", count: getCountInRange(11, 15) },
    { ageRange: "16-20", count: getCountInRange(16, 20) },
    { ageRange: "21-25", count: getCountInRange(21, 25) },
    { ageRange: "26-30", count: getCountInRange(26, 30) },
    { ageRange: "31-35", count: getCountInRange(31, 35) },
    { ageRange: "36-40", count: getCountInRange(36, 40) },
    { ageRange: "41-45", count: getCountInRange(41, 45) },
    { ageRange: "46-50", count: getCountInRange(46, 50) },
    { ageRange: "51-55", count: getCountInRange(51, 55) },
    { ageRange: "56-60", count: getCountInRange(56, 60) },
    { ageRange: "61-65", count: getCountInRange(61, 65) },
    { ageRange: "66-70", count: getCountInRange(66, 70) },
    { ageRange: "71-75", count: getCountInRange(71, 75) },
    { ageRange: "76-80", count: getCountInRange(76, 80) },
    { ageRange: "81-85", count: getCountInRange(81, 85) },
    { ageRange: "86-90", count: getCountInRange(86, 90) },
  ];
  
  const AgeDistributionChart = () => {
    return (
      <ResponsiveContainer width="100%" height={290}>
        <BarChart data={ageData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="ageRange" label={{ value: "Age Range", position: "bottom" }} />
          <YAxis label={{ value: "Count", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Bar dataKey="count" fill="#fcba03" radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const growthRateData = [
    {name: '1990', growthRate: 0,},
    {name: '1995', growthRate: 18.84,},
    {name: '2000', growthRate: 0.04,},
    {name: '2005', growthRate: 0.70,},
    {name: '2010', growthRate: 2.05,},
    {name: '2015', growthRate: 13.02,},
    {name: '2020', growthRate: 2.15,}
  ];

  
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{ background: '#fff', padding: '5px', border: '1px solid #ccc' }}>
        <p>{`${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

const GrowthRateChart = () => {
  return (
    <ResponsiveContainer width="100%" height={225}>
      <LineChart data={growthRateData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" label={{ value: 'Censual Year', position: 'bottom' }} />
        <YAxis label={{ value: 'Growth Rate (%)', angle: -90, position: 'insideLeft' }} />
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey="growthRate" stroke="#fc4103" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

  const populationData = [
    {name: '1990', population: 1829,},
    {name: '1995', population: 4595,},
    {name: '2000', population: 4604,},
    {name: '2005', population: 4842,},
    {name: '2010', population: 5119,},
    {name: '2015', population: 9735,},
    {name: '2020', population: 10771,}
  ];

  const PopulationChart = () => {
    return (
      <ResponsiveContainer width="100%" height={225}>
        <LineChart data={populationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" label={{ value: "Censual Year", position: "bottom" }}  />
          <YAxis label={{ value: "Population", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Line type="monotone" dataKey="population" stroke="#02db18" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  return (
    <div className='home'>
      <div className='dashboard-header'> 
        <p>Santa Elena Profiling System</p>
      </div>
      <div className='dashboard-p'>
        <p>Dashboard</p>
      </div>
      <div className='cards-container'>
        <div className='cards'>
          <div className='card-content'>
            <p>Total Residents</p>
            <p className='card-data'>{residents.length}</p>
          </div>
          <div className='card-icon'>
            <div className='card-icon-resident'>
              <goIcons.GoPerson />
            </div>
          </div>
        </div>
        <div className='cards'>
          <div className='card-content'>
            <p>Males</p>
            <p className='card-data'>{genderCounts['Male'] || 0}</p>
          </div>
          <div className='card-icon'>
            <div className='card-icon-male'>
              <ioIcons.IoMdMale />
            </div>
          </div>
        </div>
        <div className='cards'>
          <div className='card-content'>
            <p>Females</p>
            <p className='card-data'>{genderCounts['Female'] || 0}</p>
          </div>
          <div className='card-icon'>
            <div className='card-icon-female'>
              <ioIcons.IoMdFemale/>
            </div>
          </div>
        </div>
        <div className='cards cards-voter'>
          <div className='card-content'>
            <p>Registered Voters</p>
            <p className='card-data'>{voterCounts['Registered'] || 0}</p>
          </div>
          <div className='card-icon'>
            <div className='card-icon-vote'>
              <mdIcons.MdHowToVote />
            </div>
          </div>
        </div>
        <div className='cards'>
          <div className='card-content'>
            <p>Households</p>
            <p className='card-data'>{households.length}</p>
          </div>
          <div className='card-icon'>
            <div className='card-icon-household'>
              <faIcons.FaHouseUser  />
            </div>
          </div>
        </div>
      </div>

      <div className='new-chart'>
        <div className='civil-status-chart'>
          <p>Civil Status</p>
          {civilStatusChart()}
        </div>
        <div className='recent-added-container'>
          <p>Recent Residents Added</p>
          <table className='recent-table'>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Age</th>
              </tr>
            </thead>
            <tbody>
              {recentResidents.length > 0 ? (
                recentResidents.map((resident) => (
                  <tr key={resident.id}>
                    <td>{resident.id}</td>
                    <td>{`${resident.firstName} ${resident.lastName}`}</td>
                    <td>{resident.age}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No recent residents</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className='his-text'>Historical Population</div>

      <div className='second-row-chart'>
        <div className='growth-rate-chart'>
          <p>Population (1990-2020)</p>
          {GrowthRateChart()}
        </div>
        <div className='population-chart'>
          <p>Growth Rate (1990-2020)</p>
          {PopulationChart()}
        </div>
      </div>

      <div className='age-distribution-chart'>
        <p>Age Distribution</p>
        {AgeDistributionChart()}
      </div>
      


    </div>
  )
}

export default Home;
