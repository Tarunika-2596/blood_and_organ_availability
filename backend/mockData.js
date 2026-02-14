// Mock in-memory data store (no database)
let users = [];
let hospitals = [
  { _id: '1', name: 'City Hospital', address: '123 Main St', city: 'Chennai', contactNumber: '9876543210', isApproved: true, isActive: true },
  { _id: '2', name: 'Apollo Hospital', address: '456 Park Ave', city: 'Mumbai', contactNumber: '9876543211', isApproved: true, isActive: true }
];
let bloodStocks = [
  { _id: '1', hospitalId: '1', bloodGroup: 'A+', unitsAvailable: 50, lastUpdated: new Date() },
  { _id: '2', hospitalId: '2', bloodGroup: 'O+', unitsAvailable: 30, lastUpdated: new Date() }
];
let organAvailabilities = [
  { _id: '1', hospitalId: '1', organType: 'Kidney', status: 'Available', lastUpdated: new Date() },
  { _id: '2', hospitalId: '2', organType: 'Liver', status: 'Available', lastUpdated: new Date() }
];
let updateLogs = [];
let requests = [];
let idCounter = 3;

module.exports = {
  users,
  hospitals,
  bloodStocks,
  organAvailabilities,
  updateLogs,
  requests,
  getNextId: () => String(idCounter++)
};
