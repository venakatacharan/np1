const mongoose = require('mongoose');
const connectDB = require('../config/database'); 

// Mock the mongoose connect function
jest.mock('mongoose', () => ({
  connect: jest.fn(),
}));

describe('Database Connection', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should connect to the database successfully', async () => {
    // Mock successful connection
    mongoose.connect.mockResolvedValueOnce({});

    // Spy on console.log to check for success message
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await connectDB();

    expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGO_URI);
    expect(logSpy).toHaveBeenCalledWith('Database connected successfully');

    logSpy.mockRestore();
  });

  it('should handle database connection error', async () => {
    const errorMessage = 'Connection error';
    // Mock connection failure
    mongoose.connect.mockRejectedValueOnce(new Error(errorMessage));

    // Spy on console.log to check for error message
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await connectDB();

    expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGO_URI);
    expect(logSpy).toHaveBeenCalledWith('Error connecting to database', expect.any(Error));

    logSpy.mockRestore();
  });
});
